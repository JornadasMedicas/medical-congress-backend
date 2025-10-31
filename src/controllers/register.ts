import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { PropsSendRegistMailInterface } from "../interfaces/IRegister";
import path from 'path';
import { generateQr } from "../helpers/canvasQrGenerate";
import { createInsertionQuery, getEmailUsed, validateRecaptcha } from "../helpers/registerQueries";
import { infoEmails } from "../helpers/emailsData";
import moment from "moment";
import fs from 'fs';

export const sendRegistMail = async (req: any, res: any) => {
    try {
        const data: PropsSendRegistMailInterface = req.body;
        const emailNumber: number = await getEmailUsed();

        if (emailNumber === 0) {
            res.status(503).json({
                ok: false,
                msg: 'El limite de registros diarios se ha alcanzado. Intente de nuevo mañana.'
            });
        } else {
            const email = infoEmails.filter((item: any) => {
                return item.email === emailNumber;
            });

            const transporter = nodemailer.createTransport({
                name: "cae",
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: email[0].user,
                    pass: email[0].password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            //verficamos la conexion al servidor antes de hacer inserciones en la DB
            const smtpOk = await transporter.verify().catch((err) => {
                console.error("Error de conexión SMTP:", err);
                return false;
            });

            if (!smtpOk) {
                return res.status(503).json({
                    ok: false,
                    msg: 'No se pudo establecer conexión con el servidor de correo. Intente más tarde.'
                });
            }

            //verificamos el puntaje del captcha para evitar entradas por bots
            const isValidHuman = await validateRecaptcha(data.recaptchaToken);

            if (!isValidHuman) {
                res.status(403).json({
                    ok: false,
                    msg: 'Se ha detectado actividad inusual al enviar el formulario. Porfavor intente de nuevo.'
                });
            } else {
                //si la conexión con el servidor es exitosa y la solicitud es legítima podemos hacer inserciones en la DB
                const response: any = await createInsertionQuery(data, email);

                if (Object.keys(response).length === 0) { //if email is already registered
                    res.status(409).json({
                        ok: false,
                        msg: 'El correo ya ha sido registrado. Intente con uno nuevo. (409)'
                    });
                } else if (response === null) { //if there were no success transactions
                    res.status(400).json({
                        ok: false,
                        msg: 'No se ha podido procesar su solicitud. Intente mas tarde. (400)'
                    });
                } else { //if all transactions were successfully done
                    const rutaLogo: string = path.join(__dirname, `../../public/cae_logo.png`);
                    const rutaQr: string = await generateQr(data, rutaLogo); //generate and save qr code on public folder
                    let htmlTemplate: string = '';

                    if (!response.jrn_inscritos_modulos[0].jrn_edicion.gratuito) { // if congress isn't free
                        htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates', 'emailPreRegistro.html'), 'utf8');
                        const costo: string = data.categoria.includes('Estudiante') ? '200' : response.jrn_inscritos_modulos[0].jrn_modulo.costo;
                        htmlTemplate = htmlTemplate.replace(/{{costo}}/g, costo);
                    } else {
                        htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates', 'emailRegistroSinCosto.html'), 'utf8');
                    }

                    htmlTemplate = htmlTemplate.replace(/{{acronimo}}/g, data.acronimo.trim());
                    htmlTemplate = htmlTemplate.replace(/{{nombre}}/g, data.nombre.trim());
                    htmlTemplate = htmlTemplate.replace(/{{apellido}}/g, data.apellidos.trim());
                    htmlTemplate = htmlTemplate.replace(/{{aniversario}}/g, (parseInt(moment.utc().format('YYYY')) - 1989).toString());
                    htmlTemplate = htmlTemplate.replace(/{{modulo}}/g, response.jrn_inscritos_modulos[0].jrn_modulo.nombre);

                    const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
                        from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${email[0].user}>`, // sender address
                        to: `${data.correo.trim()}`, // main receiver
                        subject: `JORNADAS MÉDICAS ${moment.utc().format('YYYY')}`, // Subject line
                        html: htmlTemplate,
                        attachments: [
                            {
                                filename: `${data.correo}.png`,
                                path: rutaQr
                            }
                        ]
                    });

                    res.status(200).json({
                        ok: true,
                        msg: 'ok',
                        data: info.response
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ha habido un error. Intente de nuevo más tarde. (500)'
        });
    }
}