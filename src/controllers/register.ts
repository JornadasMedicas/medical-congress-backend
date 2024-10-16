import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { PropsSendRegistMailInterface } from "../interfaces/IRegister";
import path from 'path';
import { generateQr } from "../helpers/canvasQrGenerate";
import { createInsertionQuery } from "../helpers/registerQueries";

export const sendRegistMail = async (req: any, res: any) => {
    try {
        const data: PropsSendRegistMailInterface = req.body;
        const response: any = await createInsertionQuery(data);

        if (Object.keys(response).length === 0) { //if email is already registered
            res.status(409).json({
                ok: false,
                msg: 'El correo ya ha sido registrado. Intente con uno nuevo'
            });
        } else if (response === null) { //if there were no success transactions
            res.status(400).json({
                ok: false,
                msg: 'No se ha podido procesar su solicitud. Intente mas tarde'
            });
        } else { //if all transactions were successfully done
            const rutaLogo: string = path.join(__dirname, `../../public/cae_logo.png`);
            const rutaQr: string = await generateQr(data, rutaLogo); //generate and save qr code on public folder

            const transporter = nodemailer.createTransport({
                name: "cae",
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: `${process.env.EMAIL_REGISTRO}`,
                    pass: `${process.env.EMAIL_REGISTRO_PASSWORD}`
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
                from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${process.env.EMAIL_REGISTRO}>`, // sender address
                to: `${data.correo.trim()}`, // main receiver
                subject: 'JORNADAS MÉDICAS 2024', // Subject line
                text: `Estimado ${data.acronimo + ' ' + data.nombre + ' ' + data.apellidos}, el Centro de Alta Especialidad Dr. Rafael Lucio agradece su participación en las Jornadas Médicas 2024.\nA continuación se muestra adjunto su código QR el cuál deberá descargar y presentar antes de ingresar al evento para registrar su asistencia.
                `,
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

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}