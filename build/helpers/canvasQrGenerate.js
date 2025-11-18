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
exports.generateQr = void 0;
const canvas_1 = require("canvas");
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generateQr = (data, rutaLogo) => __awaiter(void 0, void 0, void 0, function* () {
    //canvas
    const qrCanvas = (0, canvas_1.createCanvas)(250, 250); // Qr code size
    const ctx = qrCanvas.getContext('2d');
    //generate Qr code content
    const talleres = data.talleres.map(taller => taller.id_taller).join(',');
    const content = `${data.correo}|${data.modulo === null || data.modulo === 0 ? '' : data.modulo}|${data.talleres.length !== 0 ? talleres : ''}|`;
    // Generate Qr code as image
    const qrImage = yield qrcode_1.default.toBuffer(content, {
        width: 250,
        margin: 1,
        errorCorrectionLevel: 'H'
    });
    const qrImg = yield (0, canvas_1.loadImage)(qrImage);
    // Draw qr code in canvas
    ctx.drawImage(qrImg, 0, 0, 250, 250);
    // load logo
    const logo = yield (0, canvas_1.loadImage)(rutaLogo);
    const logoSize = 55;
    const logoX = (qrCanvas.width - logoSize) / 2;
    const logoY = (qrCanvas.height - logoSize) / 2;
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
    const rutaQr = path_1.default.join(__dirname, `../../public/${data.correo}.png`);
    const buffer = qrCanvas.toBuffer('image/png');
    fs_1.default.writeFileSync(rutaQr, buffer);
    return rutaQr;
});
exports.generateQr = generateQr;
