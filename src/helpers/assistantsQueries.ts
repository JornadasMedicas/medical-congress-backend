import moment from "moment";
import { db } from "../utils/db";
import { PropsGetAssistantsQueries, PropsGetTotalAssistantsQueries } from "../interfaces/IAssistants";
import { dateT1, dateT2, dateT3, dateT4, dnow, dnowWorkshops, registerDay1, registerDay2, registerDay3 } from './globalData';

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

export const getAssistantInfoQuery = (email: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let assistant = await db.jrn_persona.findFirst({
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
                    jrn_evento: {
                        select: {
                            modulo: true,
                            isAssistDay1: true,
                            isAssistDay2: true,
                            isAssistDay3: true,
                            isRegisteredT1: true,
                            isRegisteredT2: true,
                            isRegisteredT3: true,
                            isRegisteredT4: true,
                            isAssistT1: true,
                            isAssistT2: true,
                            isAssistT3: true,
                            isAssistT4: true,
                        }
                    }
                }
            });

            resolve(assistant);
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

            let countListAssistants = await db.jrn_persona.count({
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

            countListAssistants ? (

                resolve(countListAssistants)

            ) : resolve(0);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

export const updateAttendancesQuery = (assistant: { assistant: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('ACTUAL: ',dnow.isBefore(registerDay1), dnow, registerDay1);
            console.log('OTRO: ',dnow < registerDay1, dnow, registerDay1);

            const splittedData: string[] = assistant.assistant.split('|');

            const event = await db.jrn_evento.findFirst({
                where: {
                    jrn_persona: { correo: splittedData[0] }
                }
            });

            if (event) {

                if (dnow.isBefore(registerDay1)) {// if assistance is checked before event begins
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

                resolve(event);
            } else {
                resolve({ ok: false, typeError: 1 });
            }
        } catch (error) {
            reject(error);
        }
    })
}

//!IMPORTANT UPDATE EVERY YEAR
export const updateAttendancesWorkshopsQuery = (assistant: { assistant: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            }
        } catch (error) {
            reject(error);
        }
    })
}