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
exports.updateAttendancesWorkshopsQuery = exports.updateAttendancesQuery = exports.getCountAssistantsQuery = exports.getAssistantsAutocompleteQuery = exports.getAssistantInfoQuery = exports.getAssistantsQuery = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = require("../utils/db");
moment_timezone_1.default.tz.setDefault('America/Mexico_City');
const getAssistantsQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rowsPerPage = parseInt(props.limit);
            const min = ((parseInt(props.page) + 1) * rowsPerPage) - rowsPerPage;
            let listAssistants = yield db_1.db.jrn_persona.findMany({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    OR: [
                        {
                            jrn_inscritos_modulos: {
                                some: {
                                    jrn_modulo: {
                                        nombre: props.module === '' && props.workshop === '' ? {} : props.module,
                                    },
                                    jrn_edicion: {
                                        edicion: props.year
                                    }
                                }
                            },
                        },
                        {
                            jrn_inscritos_talleres: {
                                some: {
                                    jrn_taller: {
                                        id: props.workshop ? parseInt(props.workshop) : 0,
                                        jrn_edicion: {
                                            edicion: props.year
                                        }
                                    },
                                }
                            },
                        }
                    ]
                },
                select: {
                    id: true,
                    acronimo: true,
                    nombre: true,
                    correo: true,
                    tel: true,
                    created_at: true
                },
                orderBy: {
                    id: "desc"
                },
                skip: min,
                take: rowsPerPage
            });
            resolve(listAssistants);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.getAssistantsQuery = getAssistantsQuery;
const getAssistantInfoQuery = (email) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let assistant = yield db_1.db.jrn_persona.findFirst({
                where: {
                    correo: email ? { contains: email } : {}
                },
                select: {
                    id: true,
                    acronimo: true,
                    nombre: true,
                    correo: true,
                    tel: true,
                    categoria: true,
                    ciudad: true,
                    jrn_inscritos_modulos: {
                        select: {
                            jrn_modulo: {
                                select: { nombre: true }
                            },
                            asistioDia1: true,
                            asistioDia2: true,
                            asistioDia3: true
                        }
                    },
                    jrn_inscritos_talleres: {
                        select: {
                            asistio: true,
                            jrn_taller: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            });
            resolve(assistant);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.getAssistantInfoQuery = getAssistantInfoQuery;
const getAssistantsAutocompleteQuery = (params) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let listAssistants = yield db_1.db.jrn_persona.findMany({
                where: {
                    OR: [
                        { nombre: params.filter ? { contains: params.filter } : {} },
                        { correo: params.filter ? { contains: params.filter } : {} }
                    ]
                },
                select: {
                    id: true,
                    nombre: true,
                    correo: true,
                },
                orderBy: {
                    id: "desc"
                },
                take: 10
            });
            resolve(listAssistants);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.getAssistantsAutocompleteQuery = getAssistantsAutocompleteQuery;
const getCountAssistantsQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let countListAssistants = yield db_1.db.jrn_persona.count({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    OR: [
                        {
                            jrn_inscritos_modulos: {
                                some: {
                                    jrn_modulo: {
                                        nombre: props.module === '' && props.workshop === '' ? {} : props.module,
                                    },
                                    jrn_edicion: {
                                        edicion: props.year
                                    }
                                }
                            },
                        },
                        {
                            jrn_inscritos_talleres: {
                                some: {
                                    jrn_taller: {
                                        id: props.workshop ? parseInt(props.workshop) : 0,
                                        jrn_edicion: {
                                            edicion: props.year
                                        }
                                    },
                                }
                            },
                        }
                    ]
                },
            });
            countListAssistants ? (resolve(countListAssistants)) : resolve(0);
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
};
exports.getCountAssistantsQuery = getCountAssistantsQuery;
const updateAttendancesQuery = (assistant) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /* const dnow = moment(`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`);
            const registerDay1 = moment(`${moment().format('YYYY')}-11-20`);
            const registerDay2 = moment(`${moment().format('YYYY')}-11-21`);
            const registerDay3 = moment(`${moment().format('YYYY')}-11-22`);

            console.log('ACTUAL: ', dnow.isBefore(registerDay1), dnow, registerDay1);
            console.log('OTRO: ', dnow < registerDay1, dnow, registerDay1);

            const splittedData: string[] = assistant.assistant.split('|');

            const isOnCongress = await db.jrn_inscritos_modulos.findFirst({
                where: {
                    jrn_persona: { correo: splittedData[0] }
                }
            });

            const isOnWorkshop = await db.jrn_inscritos_talleres.findFirst({
                where: {
                    jrn_persona: { correo: splittedData[0] }
                }
            });

            if (isOnCongress) {
                if (dnow < registerDay1) {// if assistance is checked before event begins
                    return resolve({ ok: false, typeError: 2 });
                }

                if (event.modulo !== null) {//if assistant selected a module
                    if (dnow.isSame(registerDay1)) {
                        await db.jrn_evento.update({
                            where: {
                                id: event.id
                            },
                            data: {
                                isAssistDay1: true,
                                updated_at: moment.utc().subtract(6, 'hour').toISOString()
                            }
                        });
                    } else if (dnow.isSame(registerDay2)) {
                        await db.jrn_evento.update({
                            where: {
                                id: event.id
                            },
                            data: {
                                isAssistDay2: true,
                                updated_at: moment.utc().subtract(6, 'hour').toISOString()
                            }
                        });
                    } else if (dnow.isSame(registerDay3)) {
                        await db.jrn_evento.update({
                            where: {
                                id: event.id
                            },
                            data: {
                                isAssistDay3: true,
                                updated_at: moment.utc().subtract(6, 'hour').toISOString()
                            }
                        });
                    }
                } else {
                    resolve({ ok: false, typeError: 3 });
                }

                resolve(true);
            } else {
                resolve({ ok: false, typeError: 1 });
            } */
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updateAttendancesQuery = updateAttendancesQuery;
//!IMPORTANT UPDATE EVERY YEAR
const updateAttendancesWorkshopsQuery = (assistant) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /* const dateT1 = moment(`${moment().format('YYYY')}-11-22 08:00:00`);
            const dateT2 = moment(`${moment().format('YYYY')}-11-22 15:30:00`);
            const dateT3 = moment(`${moment().format('YYYY')}-12-20`);
            const dateT4 = moment(`${moment().format('YYYY')}-12-20`);
            const dnowWorkshops = moment();

            if (dnowWorkshops.isBefore(dateT1)) {// if assistance is checked before event begins
                return resolve({ ok: false, typeError: 2 });
            }

            const splittedData: string[] = assistant.assistant.split('|');

            const event = await db.jrn_evento.findFirst({
                where: {
                    jrn_persona: { correo: splittedData[0] },
                    OR: [
                        { isRegisteredT1: true },
                        { isRegisteredT2: true }
                    ]
                }
            });

            if (event) {
                if (event.isRegisteredT1 && (dnowWorkshops.isSameOrAfter(dateT1) && dnowWorkshops.isSameOrBefore(dateT2))) {
                    await db.jrn_evento.update({
                        where: {
                            id: event.id
                        },
                        data: {
                            isAssistT1: true,
                            updated_at: moment.utc().subtract(6, 'hour').toISOString()
                        }
                    });
                }

                if (event.isRegisteredT2 && dnowWorkshops.isSameOrAfter(dateT2)) {
                    await db.jrn_evento.update({
                        where: {
                            id: event.id
                        },
                        data: {
                            isAssistT2: true,
                            updated_at: moment.utc().subtract(6, 'hour').toISOString()
                        }
                    });
                }

                resolve(event);
            } else {
                resolve({ ok: false, typeError: 1 });
            } */
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updateAttendancesWorkshopsQuery = updateAttendancesWorkshopsQuery;
