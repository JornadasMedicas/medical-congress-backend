import moment from "moment";
import { db } from "../utils/db";
import { PropsGetAssistantsQueries, PropsGetTotalAssistantsQueries } from "../interfaces/IAssistants";

export const getAssistantsQuery = ({ ...props }: PropsGetAssistantsQueries) => {
    return new Promise(async (resolve, reject) => {
        try {
            const rowsPerPage = parseInt(props.limit);
            const min = ((parseInt(props.page) + 1) * rowsPerPage) - rowsPerPage;
            const currentYear = moment.utc().subtract(6, 'hour').format('YYYY');

            let listAssistants = await db.jrn_persona.findMany({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    jrn_evento: {
                        some: {
                            modulo: props.module ? { contains: props.module } : {},
                            isRegisteredT1: props.workshop === '1' ? true : {},
                            isRegisteredT2: props.workshop === '2' ? true : {},
                            isRegisteredT3: props.workshop === '3' ? true : {},
                            isRegisteredT4: props.workshop === '4' ? true : {},
                            jrn_edicion: {
                                edicion: currentYear
                            }
                        }
                    }
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
        } catch (error) {
            reject(error);
        }
    })
}

export const getAssistantsAutocompleteQuery = (params: { filter: string }) => {
    return new Promise(async (resolve, reject) => {
        try {

            let listAssistants = await db.jrn_persona.findMany({
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
                }
            });

            resolve(listAssistants);
        } catch (error) {
            reject(error);
        }
    })
}

export const getCountAssistantsQuery = ({ ...props }: PropsGetTotalAssistantsQueries) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentYear = moment.utc().subtract(6, 'hour').format('YYYY');

            let countListVacation = await db.jrn_persona.count({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    jrn_evento: {
                        some: {
                            modulo: props.module ? { contains: props.module } : {},
                            isRegisteredT1: props.workshop === '1' ? true : {},
                            isRegisteredT2: props.workshop === '2' ? true : {},
                            isRegisteredT3: props.workshop === '3' ? true : {},
                            isRegisteredT4: props.workshop === '4' ? true : {},
                            jrn_edicion: {
                                edicion: currentYear
                            }
                        }
                    }
                },
            });

            countListVacation ? (

                resolve(countListVacation)

            ) : resolve(0);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}