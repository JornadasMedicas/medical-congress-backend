import { Response } from "express";
import nodemailer from "nodemailer";
import { PropsSendMailInterface } from "../interfaces/Contact";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendContactMail = async (req: any, res: Response) => {
    try {
        const data: PropsSendMailInterface = req.body;        

        const transporter = nodemailer.createTransport({
            name: "cae",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: `${process.env.EMAIL_CONTACTO}`,
                pass: `${process.env.EMAIL_CONTACTO_PASSWORD}`
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${process.env.EMAIL_CONTACTO}>`, // sender address
            to: `${process.env.EMAIL_CONTACTO}`, // main receiver
            subject: 'SOLICITUD: ' + data.asunto, // Subject line
            text: `
            Solicitante: ${data.nombre}\n
            Teléfono: ${data.telefono}\n
            Correo: ${data.correo}\n\n
            ${data.descripcion}
            `
        });

        res.status(200).json({
            ok: true,
            msg: 'Message Sent',
            data: info.response
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}