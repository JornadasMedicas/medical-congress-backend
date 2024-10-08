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
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const sendRegistMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const rutaQr = path_1.default.join(__dirname, `../../public/${data.correo}.png`);
        qrcode_1.default.toFile(rutaQr, 'hola');
        const transporter = nodemailer_1.default.createTransport({
            name: "cae",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: `${process.env.EMAIL_CONTACTO}`,
                pass: `${process.env.EMAIL_CONTACTO_PASSWORD}`
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        console.log(__dirname);
        /* const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${process.env.EMAIL_CONTACTO}>`, // sender address
            to: `${process.env.EMAIL_CONTACTO}`, // main receiver
            subject: 'PASE DE ENTRADA', // Subject line
            text: `
            Estimado ${data.acronimo + data.nombres + ' ' + data.apellidos}, el Centro de Alta Especialidad Dr. Rafael Lucio agradece su participación en las Jornadas Médicas 2024.\n A continuación se muestra adjunto su código QR el cuál deberá descargar y presentar antes de ingresar al evento para registrar su asistencia.
            `
        }); */
        res.status(200).json({
            ok: true,
            msg: 'Message Sent',
            data: 'ok'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.sendRegistMail = sendRegistMail;
