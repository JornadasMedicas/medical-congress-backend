import moment from "moment";
import { db } from "../utils/db";
import { PayloadWorkshops } from "../interfaces/IAdmin";

export const getCountCatalogsQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let countEditions = await db.jrn_edicion.count({
                where: {
                    deleted_at: null
                }
            });

            let countModules = await db.jrn_modulos.count({
                where: {
                    deleted_at: null
                }
            });

            let countWorkshops = await db.jrn_talleres.count({
                where: {
                    deleted_at: null
                }
            });

            let countCategories = await db.jrn_categorias.count({
                where: {
                    deleted_at: null
                }
            });

            resolve({
                ediciones: countEditions,
                modulos: countModules,
                talleres: countWorkshops,
                categorias: countCategories
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

export const createEditionQuery = ({ ...props }: { edicion: string, fec_inicial: string, fec_final: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_edicion.create({
                data: {
                    edicion: props.edicion,
                    fec_dia_1: moment(props.fec_inicial).toISOString(),
                    fec_dia_2: moment(props.fec_inicial).add(1, 'day').toISOString(),
                    fec_dia_3: moment(props.fec_final).toISOString()
                }
            });

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const createModuleQuery = (nombre: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res: any = {};
            let duplicated = await db.jrn_modulos.findUnique({
                where: {
                    nombre,
                    deleted_at: { not: null }
                }
            });

            if (duplicated) {
                res = await db.jrn_modulos.update({
                    where: {
                        id: duplicated.id
                    },
                    data: {
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
                        deleted_at: null
                    }
                });
            } else {
                res = await db.jrn_modulos.create({
                    data: {
                        nombre
                    }
                });
            }

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const editModuleQuery = ({ ...props }: { id: number, nombre: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_modulos.update({
                where: {
                    id: props.id
                },
                data: {
                    nombre: props.nombre,
                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                }
            });

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const deleteModuleQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_modulos.update({
                where: {
                    id
                },
                data: {
                    deleted_at: moment.utc().subtract(6, 'hour').toISOString()
                }
            });

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const createWorkshopQuery = ({ ...props }: PayloadWorkshops) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res: any = {};
            let duplicated = await db.jrn_talleres.findFirst({
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
                } else {
                    res = await db.jrn_talleres.update({
                        where: {
                            id: duplicated.id
                        },
                        data: {
                            updated_at: moment.utc().subtract(6, 'hour').toISOString(),
                            deleted_at: null
                        }
                    });
                }
            } else {
                const date = moment().format('YYYY-MM-DD');
                const iso_ini = new Date(`${date}T${props.hora_inicio}Z`).toISOString();
                const iso_fin = new Date(`${date}T${props.hora_fin}Z`).toISOString();

                res = await db.jrn_talleres.create({
                    data: {
                        nombre: props.nombre.toUpperCase(),
                        fecha: moment(props.fecha).toISOString(),
                        hora_inicio: iso_ini,
                        hora_fin: iso_fin,
                        id_modulo: props.modulo,
                        id_edicion: props.edicion
                    }
                });
            }

            resolve(res);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}