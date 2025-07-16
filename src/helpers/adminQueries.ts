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