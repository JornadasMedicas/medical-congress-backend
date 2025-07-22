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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailUsed = exports.createInsertionQuery = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../utils/db");
const createInsertionQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repeated = yield db_1.db.jrn_persona.findFirst({
                where: {
                    correo: props.correo
                }
            });
            if (repeated) {
                resolve({}); //duplicated entry
            }
            else {
                let record = yield db_1.db.jrn_persona.create({
                    data: {
                        acronimo: props.acronimo.trim(),
                        nombre: props.nombre.trim() + ' ' + props.apellidos.trim(),
                        categoria: props.categoria,
                        correo: props.correo.trim(),
                        rfc: props.rfc === '' ? null : props.rfc,
                        tel: props.tel.trim(),
                        ciudad: props.ciudad.trim(),
                        dependencia: props.dependencia === '' ? null : props.dependencia,
                        created_at: moment_1.default.utc().subtract(6, 'hour').toISOString(), //gmt -6
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        jrn_inscritos_modulos: {
                            create: {
                                asistioDia1: false,
                                asistioDia2: false,
                                asistioDia3: false,
                                constancia_enviada: false,
                                id_edicion: props.id_edicion,
                                id_modulo: props.id_modulo
                            }
                        },
                        jrn_inscritos_talleres: {
                            createMany: {
                                data: props.talleres
                            }
                        }
                    }
                });
                if (record) { //if person was registered successfully
                    resolve(record);
                }
                else {
                    resolve(null);
                }
            }
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.createInsertionQuery = createInsertionQuery;
const getEmailUsed = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dnow = (0, moment_1.default)(`${(0, moment_1.default)().format('YYYY')}-${(0, moment_1.default)().format('MM')}-${(0, moment_1.default)().format('DD')}`);
            let email = 1;
            let email1 = yield db_1.db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });
            let email2 = yield db_1.db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO2}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });
            let email3 = yield db_1.db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO3}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });
            if ((email1 + email2 + email3) >= 300) {
                resolve(0);
            }
            else {
                if ((email1 + email2 + email3) === 0) {
                    email = 1;
                    resolve(1);
                }
                else {
                    if (email1 < 100) {
                        email = 1;
                    }
                    else if (email2 < 100) {
                        email = 2;
                    }
                    else if (email3 < 100) {
                        email = 3;
                    }
                    resolve(email);
                }
            }
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.getEmailUsed = getEmailUsed;
