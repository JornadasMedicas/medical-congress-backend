"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoEmails = void 0;
require('dotenv').config();
exports.infoEmails = [
    { email: 1, user: `${process.env.EMAIL_REGISTRO}`, password: `${process.env.EMAIL_REGISTRO_PASSWORD}` },
    { email: 2, user: `${process.env.EMAIL_REGISTRO2}`, password: `${process.env.EMAIL_REGISTRO_PASSWORD2}` },
    { email: 3, user: `${process.env.EMAIL_REGISTRO3}`, password: `${process.env.EMAIL_REGISTRO_PASSWORD3}` }
];
