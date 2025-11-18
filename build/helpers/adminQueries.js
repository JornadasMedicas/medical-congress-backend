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
exports.deleteCategoryQuery = exports.editCategoryQuery = exports.createCategoryQuery = exports.getCategoriesQuery = exports.deleteWorkshopQuery = exports.editWorkshopQuery = exports.createWorkshopQuery = exports.getWorkshopsQuery = exports.deleteModuleQuery = exports.updateModuleCounter = exports.editModuleQuery = exports.createModuleQuery = exports.getModulesQuery = exports.createEditionQuery = exports.getEventEditionsQuery = exports.getCountCatalogsQuery = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../utils/db");
const getCountCatalogsQuery = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let countEditions = yield db_1.db.jrn_edicion.count({
                where: {
                    deleted_at: null
                }
            });
            let countModules = yield db_1.db.jrn_modulos.count({
                where: {
                    deleted_at: null
                }
            });
            let countWorkshops = yield db_1.db.jrn_talleres.count({
                where: {
                    deleted_at: null
                }
            });
            let countCategories = yield db_1.db.jrn_categorias.count({
                where: {
                    deleted_at: null
                }
            });
            resolve({
                ediciones: countEditions,
                modulos: countModules,
                talleres: countWorkshops,
                categorias: countCategories
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
};
exports.getCountCatalogsQuery = getCountCatalogsQuery;
const getEventEditionsQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let editions = yield db_1.db.jrn_edicion.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                edicion: true,
                gratuito: true
            },
            orderBy: { id: 'desc' }
        });
        return editions;
    }
    catch (error) {
        console.log('Error fetching event editions', error);
        throw error;
    }
});
exports.getEventEditionsQuery = getEventEditionsQuery;
const createEditionQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_edicion.create({
                data: {
                    edicion: props.edicion,
                    gratuito: props.isFree,
                    fec_dia_1: moment_1.default.utc(props.fec_inicial).toISOString(),
                    fec_dia_2: moment_1.default.utc(props.fec_inicial).add(1, 'day').toISOString(),
                    fec_dia_3: moment_1.default.utc(props.fec_final).toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.createEditionQuery = createEditionQuery;
const getModulesQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let modules = yield db_1.db.jrn_modulos.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                nombre: true,
                cupos: true,
                costo: true,
                created_at: true,
                updated_at: true
            },
            orderBy: { id: 'asc' }
        });
        return modules;
    }
    catch (error) {
        console.log('Error fetching modules', error);
        throw error;
    }
});
exports.getModulesQuery = getModulesQuery;
const createModuleQuery = (nombre) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = {};
            let duplicated = yield db_1.db.jrn_modulos.findUnique({
                where: {
                    nombre,
                    deleted_at: { not: null }
                }
            });
            if (duplicated) {
                res = yield db_1.db.jrn_modulos.update({
                    where: {
                        id: duplicated.id
                    },
                    data: {
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        deleted_at: null
                    }
                });
            }
            else {
                res = yield db_1.db.jrn_modulos.create({
                    data: {
                        nombre,
                        created_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                    }
                });
            }
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.createModuleQuery = createModuleQuery;
const editModuleQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_modulos.update({
                where: {
                    id: props.id
                },
                data: {
                    nombre: props.nombre,
                    cupos: props.cupos,
                    costo: props.costo,
                    updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.editModuleQuery = editModuleQuery;
const updateModuleCounter = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_modulos.update({
                where: {
                    id: props.id
                },
                data: {
                    cupos: props.cupos,
                    updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.updateModuleCounter = updateModuleCounter;
const deleteModuleQuery = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_modulos.update({
                where: {
                    id
                },
                data: {
                    deleted_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.deleteModuleQuery = deleteModuleQuery;
const getWorkshopsQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let workshops = yield db_1.db.jrn_talleres.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                nombre: true,
                fecha: true,
                cupos: true,
                hora_inicio: true,
                hora_fin: true,
                created_at: true,
                updated_at: true,
                jrn_modulo: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                jrn_edicion: {
                    select: {
                        id: true,
                        edicion: true
                    }
                },
            },
            orderBy: { id: 'asc' }
        });
        return workshops;
    }
    catch (error) {
        console.log('Error fetching workshops', error);
        throw error;
    }
});
exports.getWorkshopsQuery = getWorkshopsQuery;
const createWorkshopQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = {};
            let duplicated = yield db_1.db.jrn_talleres.findFirst({
                where: {
                    nombre: props.nombre,
                    jrn_edicion: { id: props.edicion },
                }
            });
            if (duplicated) {
                if (duplicated.deleted_at === null) {
                    throw {
                        code: 'P2002',
                        message: 'Unique constraint failed on the fields: (`nombre`)',
                        name: 'PrismaClientKnownRequestError'
                    };
                }
                else {
                    res = yield db_1.db.jrn_talleres.update({
                        where: {
                            id: duplicated.id
                        },
                        data: {
                            updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                            deleted_at: null
                        }
                    });
                }
            }
            else {
                const date = (0, moment_1.default)().format('YYYY-MM-DD');
                const iso_ini = new Date(`${date}T${props.hora_inicio}Z`).toISOString();
                const iso_fin = new Date(`${date}T${props.hora_fin}Z`).toISOString();
                res = yield db_1.db.jrn_talleres.create({
                    data: {
                        nombre: props.nombre.toUpperCase(),
                        fecha: (0, moment_1.default)(props.fecha).toISOString(),
                        hora_inicio: iso_ini,
                        hora_fin: iso_fin,
                        cupos: props.cupos,
                        id_modulo: props.modulo,
                        id_edicion: props.edicion,
                        created_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                    }
                });
            }
            resolve(res);
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
};
exports.createWorkshopQuery = createWorkshopQuery;
const editWorkshopQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_talleres.update({
                where: {
                    id: props.id
                },
                data: {
                    nombre: props.nombre,
                    cupos: props.cupos,
                    fecha: moment_1.default.utc(props.fecha).toISOString(),
                    hora_inicio: new Date(`${(0, moment_1.default)().format('YYYY-MM-DD')}T${props.hora_inicio}Z`).toISOString(),
                    hora_fin: new Date(`${(0, moment_1.default)().format('YYYY-MM-DD')}T${props.hora_fin}Z`).toISOString(),
                    updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.editWorkshopQuery = editWorkshopQuery;
const deleteWorkshopQuery = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_talleres.update({
                where: {
                    id
                },
                data: {
                    deleted_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.deleteWorkshopQuery = deleteWorkshopQuery;
const getCategoriesQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categories = yield db_1.db.jrn_categorias.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                nombre: true,
                created_at: true,
                updated_at: true
            },
            orderBy: { id: 'asc' }
        });
        return categories;
    }
    catch (error) {
        console.log('Error fetching modules', error);
        throw error;
    }
});
exports.getCategoriesQuery = getCategoriesQuery;
const createCategoryQuery = (nombre) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = {};
            let duplicated = yield db_1.db.jrn_categorias.findFirst({
                where: {
                    nombre,
                    deleted_at: { not: null }
                }
            });
            if (duplicated) {
                res = yield db_1.db.jrn_categorias.update({
                    where: {
                        id: duplicated.id
                    },
                    data: {
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        deleted_at: null
                    }
                });
            }
            else {
                res = yield db_1.db.jrn_categorias.create({
                    data: {
                        nombre,
                        created_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString(),
                    }
                });
            }
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.createCategoryQuery = createCategoryQuery;
const editCategoryQuery = (_a) => {
    var props = __rest(_a, []);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_categorias.update({
                where: {
                    id: props.id
                },
                data: {
                    nombre: props.nombre,
                    updated_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.editCategoryQuery = editCategoryQuery;
const deleteCategoryQuery = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield db_1.db.jrn_categorias.update({
                where: {
                    id
                },
                data: {
                    deleted_at: moment_1.default.utc().subtract(6, 'hour').toISOString()
                }
            });
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.deleteCategoryQuery = deleteCategoryQuery;
