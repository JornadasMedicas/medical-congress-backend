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

export const getEventEditionsQuery = async (): Promise<{ id: number, edicion: string }[]> => {
    try {
        let editions = await db.jrn_edicion.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                edicion: true
            },
            orderBy: { id: 'desc' }
        });

        return editions;
    } catch (error) {
        console.log('Error fetching event editions', error);
        throw error;
    }
}

export const createEditionQuery = ({ ...props }: { edicion: string, fec_inicial: string, fec_final: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_edicion.create({
                data: {
                    edicion: props.edicion,
                    fec_dia_1: moment.utc(props.fec_inicial).toISOString(),
                    fec_dia_2: moment.utc(props.fec_inicial).add(1, 'day').toISOString(),
                    fec_dia_3: moment.utc(props.fec_final).toISOString()
                }
            });

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const getModulesQuery = async (): Promise<{ id: number, nombre: string }[]> => {
    try {
        let modules = await db.jrn_modulos.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                nombre: true,
                cupos: true,
                created_at: true,
                updated_at: true
            },
            orderBy: { id: 'asc' }
        });

        return modules;
    } catch (error) {
        console.log('Error fetching modules', error);
        throw error;
    }
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
                        nombre,
                        created_at: moment.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
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

export const getWorkshopsQuery = async (): Promise<{ id: number, nombre: string }[]> => {
    try {
        let workshops = await db.jrn_talleres.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                nombre: true,
                fecha: true,
                cupos: true,
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
    } catch (error) {
        console.log('Error fetching workshops', error);
        throw error;
    }
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
                        cupos: props.cupos,
                        id_modulo: props.modulo,
                        id_edicion: props.edicion,
                        created_at: moment.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
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

export const editWorkshopQuery = ({ ...props }: { id: number, nombre: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_talleres.update({
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

export const deleteWorkshopQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_talleres.update({
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

export const getCategoriesQuery = async (): Promise<{ id: number, nombre: string }[]> => {
    try {
        let categories = await db.jrn_categorias.findMany({
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
    } catch (error) {
        console.log('Error fetching modules', error);
        throw error;
    }
}

export const createCategoryQuery = (nombre: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res: any = {};
            let duplicated = await db.jrn_categorias.findFirst({
                where: {
                    nombre,
                    deleted_at: { not: null }
                }
            });

            if (duplicated) {
                res = await db.jrn_categorias.update({
                    where: {
                        id: duplicated.id
                    },
                    data: {
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
                        deleted_at: null
                    }
                });
            } else {
                res = await db.jrn_categorias.create({
                    data: {
                        nombre,
                        created_at: moment.utc().subtract(6, 'hour').toISOString(),
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
                    }
                });
            }

            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}

export const editCategoryQuery = ({ ...props }: { id: number, nombre: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_categorias.update({
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

export const deleteCategoryQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.jrn_categorias.update({
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