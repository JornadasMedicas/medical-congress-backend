import { Response } from "express";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { PropsSendRegistMailInterface } from "../interfaces/IRegister";
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const sendRegistMail = async (req: any, res: any) => {
    try {
        const data: PropsSendRegistMailInterface = req.body;
        const rutaQr: string = path.join(__dirname, `../../public/${data.correo}.png`);
        const rutaLogo: string = path.join(__dirname, `../../public/cae_logo.png`);

        //canvas
        const qrCanvas = createCanvas(300, 300); // Tamaño del código QR
        const ctx = qrCanvas.getContext('2d');

        // Generar el código QR como imagen
        const qrImage = await QRCode.toBuffer('mensaje de prueba', { width: 300, margin: 1 });
        const qrImg = await loadImage(qrImage);

        // Dibujar el código QR en el canvas
        ctx.drawImage(qrImg, 0, 0, 300, 300);

        // Cargar el logo
        const logo = await loadImage(rutaLogo);
        const logoSize = 100; // Tamaño del logo
        const logoX = (qrCanvas.width - logoSize) / 2;
        const logoY = (qrCanvas.height - logoSize) / 2;

        // Crear un recorte circular para el logo
        /* ctx.save();
        ctx.fillRect(0, 0, 300, 300);
        ctx.restore(); */

        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(100, 100, 100, 100);
        ctx.restore();

        /* ctx.beginPath();
        ctx.arc(150, 150, logoSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill(); */

        // Dibujar el logo en el centro del código QR
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        ctx.restore(); // Restaurar el contexto para seguir dibujando

        // Guardar el código QR final como imagen
        const rutaArchivo = path.join(__dirname, `../../public/${data.correo}.png`);
        const buffer = qrCanvas.toBuffer('image/png');
        fs.writeFileSync(rutaArchivo, buffer);

        /* QRCode.toFile(rutaQr, 'mensaje de prueba') */

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

        console.log(__dirname);

        /* const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: `"Centro de Alta Especialidad Dr. Rafael Lucio" <${process.env.EMAIL_CONTACTO}>`, // sender address
            to: `${data.correo}`, // main receiver
            subject: 'PASE DE ENTRADA', // Subject line
            text: `Estimado ${data.acronimo + ' ' + data.nombre + ' ' + data.apellidos}, el Centro de Alta Especialidad Dr. Rafael Lucio agradece su participación en las Jornadas Médicas 2024.\n A continuación se muestra adjunto su código QR el cuál deberá descargar y presentar antes de ingresar al evento para registrar su asistencia.
            `,
            attachments: [
                {
                    filename: `${data.correo}QR.png`,
                    path: rutaQr
                }
            ]
        }); */

        res.status(200).json({
            ok: true,
            msg: 'Message Sent',
            data: 'sss'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}