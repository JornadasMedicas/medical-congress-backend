import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { PropsSendRegistMailInterface, PropsTalleresInterface } from '../interfaces/IRegister';

export const generateQr = async (data: PropsSendRegistMailInterface, rutaLogo: string) => {
    //canvas
    const qrCanvas = createCanvas(250, 250); // Qr code size
    const ctx = qrCanvas.getContext('2d');

    //generate Qr code content
    const talleres: string = data.talleres.map(taller => taller.id_taller).join(',');

    const content: string = `${data.correo}|${data.modulo === null || data.modulo === 0 ? '' : data.modulo}|${data.talleres.length !== 0 ? talleres : ''}|`;

    // Generate Qr code as image
    const qrImage = await QRCode.toBuffer(content, {
        width: 250,
        margin: 1,
        errorCorrectionLevel: 'H'
    });
    const qrImg = await loadImage(qrImage);

    // Draw qr code in canvas
    ctx.drawImage(qrImg, 0, 0, 250, 250);

    // load logo
    const logo = await loadImage(rutaLogo);
    const logoSize: number = 55;
    const logoX: number = (qrCanvas.width - logoSize) / 2;
    const logoY: number = (qrCanvas.height - logoSize) / 2;

    ctx.save();
    ctx.fillStyle = "white"; // circle color

    // Draw circle
    ctx.beginPath();
    ctx.arc(125, 125, 32, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    // Draw logo at middle of qr code
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // Save final qr code as image
    const rutaQr = path.join(__dirname, `../../public/${data.correo}.png`);
    const buffer = qrCanvas.toBuffer('image/png');
    fs.writeFileSync(rutaQr, buffer);

    return rutaQr
}