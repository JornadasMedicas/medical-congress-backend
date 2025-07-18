import moment from "moment";
import { db } from "../utils/db";

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
            let res = await db.jrn_modulos.create({
                data: {
                    nombre
                }
            });

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