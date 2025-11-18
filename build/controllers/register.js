"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegistMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const canvasQrGenerate_1 = require("../helpers/canvasQrGenerate");
const registerQueries_1 = require("../helpers/registerQueries");
const emailsData_1 = require("../helpers/emailsData");
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const sendRegistMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const emailNumber = yield (0, registerQueries_1.getEmailUsed)();
        if (emailNumber === 0) {
            res.status(503).json({
                ok: false,
                msg: 'El limite de registros diarios se ha alcanzado. Intente de nuevo mañana.'
            });
        }
        else {
            const email = emailsData_1.infoEmails.filter((item) => {
                return item.email === emailNumber;
            });
            const transporter = nodemailer_1.default.createTransport({
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
            const smtpOk = yield transporter.verify().catch((err) => {
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
            const isValidHuman = yield (0, registerQueries_1.validateRecaptcha)(data.recaptchaToken);
            if (!isValidHuman) {
                res.status(403).json({
                    ok: false,
                    msg: 'Se ha detectado actividad inusual al enviar el formulario. Porfavor intente de nuevo.'
                });
            }
            else {
                //si la conexión con el servidor es exitosa y la solicitud es legítima podemos hacer inserciones en la DB
                const response = yield (0, registerQueries_1.createInsertionQuery)(data, email);
                if (Object.keys(response).length === 0) { //if email is already registered
                    res.status(409).json({
                        ok: false,
                        msg: 'El correo ya ha sido registrado. Intente con uno nuevo. (409)'
                    });
                }
                else if (response === null) { //if there were no success transactions
                    res.status(400).json({
                        ok: false,
                        msg: 'No se ha podido procesar su solicitud. Intente mas tarde. (400)'
                    });
                }
                else { //if all transactions were successfully done
                    const rutaLogo = path_1.default.join(__dirname, `../../public/cae_logo.png`);
                    const rutaQr = yield (0, canvasQrGenerate_1.generateQr)(data, rutaLogo); //generate and save qr code on public folder
                    let htmlTemplate = '';
                    if (!response.jrn_inscritos_modulos[0].jrn_edicion.gratuito) { // if congress isn't free
                        htmlTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, '../templates', 'emailPreRegistro.html'), 'utf8');
                        const costo = data.categoria.includes('Estudiante') ? '200' : response.jrn_inscritos_modulos[0].jrn_modulo.costo;
                        htmlTemplate = htmlTemplate.replace(/{{costo}}/g, costo);
                    }
                    else {
                        htmlTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, '../templates', 'emailRegistroSinCosto.html'), 'utf8');
                    }
                    htmlTemplate = htmlTemplate.replace(/{{acronimo}}/g, data.acronimo.trim());
                    htmlTemplate = htmlTemplate.replace(/{{nombre}}/g, data.nombre.trim());
                    htmlTemplate = htmlTemplate.replace(/{{apellido}}/g, data.apellidos.trim());
                    htmlTemplate = htmlTemplate.replace(/{{aniversario}}/g, (parseInt(moment_1.default.utc().format('YYYY')) - 1989).toString());
                    htmlTemplate = htmlTemplate.replace(/{{modulo}}/g, response.jrn_inscritos_modulos[0].jrn_modulo.nombre);
                    const info = yield transporter.sendMail({
                        from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${email[0].user}>`, // sender address
                        to: `${data.correo.trim()}`, // main receiver
                        subject: `JORNADAS MÉDICAS ${moment_1.default.utc().format('YYYY')}`, // Subject line
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ha habido un error. Intente de nuevo más tarde. (500)'
        });
    }
});
exports.sendRegistMail = sendRegistMail;
