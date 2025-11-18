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
exports.updatePaymentStatusQuery = exports.updateAttendancesWorkshopsQuery = exports.updateAttendancesQuery = exports.getCountAssistantsQuery = exports.getAssistantsAutocompleteQuery = exports.getAssistantInfoQuery = exports.getAssistantsQuery = void 0;
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
                where: Object.assign(Object.assign({ correo: props.email ? { contains: props.email } : {}, created_at: {
                        gte: moment_timezone_1.default.utc(props.year).toISOString(),
                        lt: moment_timezone_1.default.utc(props.year).add(1, 'year').toISOString()
                    } }, ((props.module !== '' || props.workshop !== '') && {
                    OR: [
                        {
                            jrn_inscritos_modulos: {
                                some: {
                                    jrn_modulo: {
                                        nombre: props.module,
                                    }
                                }
                            },
                        },
                        {
                            jrn_inscritos_talleres: {
                                some: {
                                    jrn_taller: {
                                        id: props.workshop ? parseInt(props.workshop) : 0
                                    },
                                }
                            },
                        }
                    ]
                })), { deleted_at: null }),
                select: {
                    id: true,
                    acronimo: true,
                    categoria: true,
                    nombre: true,
                    correo: true,
                    tel: true,
                    created_at: true,
                    jrn_inscritos_modulos: {
                        select: {
                            pagado: true,
                            jrn_modulo: {
                                select: { nombre: true, costo: true }
                            },
                            jrn_edicion: {
                                select: { gratuito: true }
                            }
                        }
                    }
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
            const currentYear = (0, moment_timezone_1.default)().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();
            let assistant = yield db_1.db.jrn_persona.findFirst({
                where: {
                    correo: email ? { contains: email } : {},
                    created_at: {
                        gte: moment_timezone_1.default.utc(currentYear).toISOString(),
                        lt: moment_timezone_1.default.utc(nextYear).toISOString()
                    },
                    deleted_at: null
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
                    created_at: {
                        gte: moment_timezone_1.default.utc(params.edicion).toISOString(),
                        lt: moment_timezone_1.default.utc(params.edicion).add(1, 'year').toISOString()
                    },
                    OR: [
                        { nombre: params.filter ? { contains: params.filter } : {} },
                        { correo: params.filter ? { contains: params.filter } : {} }
                    ],
                    deleted_at: null
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
                where: Object.assign(Object.assign({ correo: props.email ? { contains: props.email } : {}, created_at: {
                        gte: moment_timezone_1.default.utc(props.year).toISOString(),
                        lt: moment_timezone_1.default.utc(props.year).add(1, 'year').toISOString()
                    } }, ((props.module !== '' || props.workshop !== '') && {
                    OR: [
                        {
                            jrn_inscritos_modulos: {
                                some: {
                                    jrn_modulo: {
                                        nombre: props.module,
                                    }
                                }
                            },
                        },
                        {
                            jrn_inscritos_talleres: {
                                some: {
                                    jrn_taller: {
                                        id: props.workshop ? parseInt(props.workshop) : 0
                                    },
                                }
                            },
                        }
                    ]
                })), { deleted_at: null }),
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
            const currentYear = (0, moment_timezone_1.default)().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();
            const isRegistered = yield db_1.db.jrn_persona.findFirst({
                where: {
                    correo: assistant,
                    created_at: {
                        gte: moment_timezone_1.default.utc(currentYear).toISOString(),
                        lt: moment_timezone_1.default.utc(nextYear).toISOString()
                    }
                },
                select: {
                    id: true
                }
            });
            if (!isRegistered) { //if isn't registered
                return resolve({ ok: false, typeError: 1 });
            }
            const edition = yield db_1.db.jrn_edicion.findFirst({
                where: {
                    edicion: currentYear
                },
                select: {
                    fec_dia_1: true,
                    fec_dia_2: true,
                    fec_dia_3: true,
                    gratuito: true
                }
            });
            const dnow = (0, moment_timezone_1.default)();
            if (dnow.isBefore(edition === null || edition === void 0 ? void 0 : edition.fec_dia_1)) { // if assistance is checked before event begins
                return resolve({ ok: false, typeError: 2 });
            }
            const isOnCongress = yield db_1.db.jrn_inscritos_modulos.findFirst({
                where: {
                    jrn_persona: { correo: assistant }
                },
                select: {
                    pagado: true
                }
            });
            if (!isOnCongress) { //if isn't registered on congress
                return resolve({ ok: false, typeError: 3 });
            }
            if (!(edition === null || edition === void 0 ? void 0 : edition.gratuito)) { //if edition isn't free, attendance payment tracking
                if ((isOnCongress === null || isOnCongress === void 0 ? void 0 : isOnCongress.pagado) === 0) { //if hasn't paid yet or has scholarship
                    return resolve({ ok: false, typeError: 4 });
                }
            }
            yield db_1.db.jrn_inscritos_modulos.updateMany({
                where: {
                    id_persona: isRegistered.id
                },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (dnow.isSameOrAfter(edition === null || edition === void 0 ? void 0 : edition.fec_dia_1) && dnow.isBefore(edition === null || edition === void 0 ? void 0 : edition.fec_dia_2)) && {
                    asistioDia1: true
                }), (dnow.isSameOrAfter(edition === null || edition === void 0 ? void 0 : edition.fec_dia_2) && dnow.isBefore(edition === null || edition === void 0 ? void 0 : edition.fec_dia_3)) && {
                    asistioDia2: true
                }), (dnow.isSameOrAfter(edition === null || edition === void 0 ? void 0 : edition.fec_dia_3)) && {
                    asistioDia3: true
                }), { updated_at: moment_timezone_1.default.utc().subtract(6, 'hour').toISOString() })
            });
            resolve({ ok: true, typeError: 0 });
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updateAttendancesQuery = updateAttendancesQuery;
const updateAttendancesWorkshopsQuery = (assistant) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentYear = (0, moment_timezone_1.default)().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();
            const isRegistered = yield db_1.db.jrn_persona.findFirst({
                where: {
                    correo: assistant,
                    created_at: {
                        gte: moment_timezone_1.default.utc(currentYear).toISOString(),
                        lt: moment_timezone_1.default.utc(nextYear).toISOString()
                    }
                },
                select: {
                    id: true
                }
            });
            if (!isRegistered) { //if isn't registered
                return resolve({ ok: false, typeError: 1 });
            }
            const edition = yield db_1.db.jrn_edicion.findFirst({
                where: {
                    edicion: currentYear
                },
                select: {
                    fec_dia_1: true,
                    fec_dia_2: true,
                    fec_dia_3: true
                }
            });
            const dnow = (0, moment_timezone_1.default)();
            if (dnow.isBefore(edition === null || edition === void 0 ? void 0 : edition.fec_dia_1)) { // if assistance is checked before event begins
                return resolve({ ok: false, typeError: 2 });
            }
            const isOnWorkshops = yield db_1.db.jrn_inscritos_talleres.findMany({
                where: {
                    id_persona: isRegistered.id
                },
                select: {
                    jrn_taller: {
                        select: {
                            id: true,
                            nombre: true,
                            fecha: true,
                            hora_inicio: true,
                            hora_fin: true
                        }
                    }
                }
            });
            if (isOnWorkshops.length === 0) { //if isn't registered on workshops
                return resolve({ ok: false, typeError: 3 });
            }
            let assistance = [];
            //validate this part
            for (const workshop of isOnWorkshops) {
                const dnow2 = (0, moment_timezone_1.default)();
                const workshopDate = moment_timezone_1.default.utc(workshop.jrn_taller.fecha).format('YYYY-MM-DD').split('-');
                if (dnow2.utc().subtract(6, 'hour').isSameOrAfter(moment_timezone_1.default.utc(workshop.jrn_taller.hora_inicio).subtract(1, 'hour').set({
                    year: parseInt(workshopDate[0]),
                    month: parseInt(workshopDate[1]) - 1,
                    date: parseInt(workshopDate[2]),
                })) && dnow2.utc().subtract(6, 'hour').isSameOrBefore(moment_timezone_1.default.utc(workshop.jrn_taller.hora_fin).add(1, 'hour').set({
                    year: parseInt(workshopDate[0]),
                    month: parseInt(workshopDate[1]) - 1,
                    date: parseInt(workshopDate[2]),
                }))) {
                    const res = yield db_1.db.jrn_inscritos_talleres.updateMany({
                        where: {
                            id_persona: isRegistered.id,
                            id_taller: workshop.jrn_taller.id
                        },
                        data: {
                            asistio: true,
                            updated_at: moment_timezone_1.default.utc().subtract(6, 'hour').toISOString()
                        }
                    });
                    assistance.push(res);
                }
            }
            if (assistance.length === 0) {
                return resolve({ ok: false, typeError: 2 });
            }
            else {
                return resolve(true);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updateAttendancesWorkshopsQuery = updateAttendancesWorkshopsQuery;
const updatePaymentStatusQuery = (isPayed, id_persona) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const paymentStatus = yield db_1.db.jrn_inscritos_modulos.updateMany({
                where: {
                    jrn_persona: {
                        id: id_persona
                    }
                },
                data: {
                    pagado: isPayed
                }
            });
            if (paymentStatus.count === 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updatePaymentStatusQuery = updatePaymentStatusQuery;
