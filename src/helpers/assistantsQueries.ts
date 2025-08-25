import moment from "moment-timezone";
import { db } from "../utils/db";
import { PropsGetAssistantsQueries, PropsGetTotalAssistantsQueries } from "../interfaces/IAssistants";
import { log } from "console";

moment.tz.setDefault('America/Mexico_City');

export const getAssistantsQuery = ({ ...props }: PropsGetAssistantsQueries) => {
    return new Promise(async (resolve, reject) => {
        try {
            const rowsPerPage = parseInt(props.limit);
            const min = ((parseInt(props.page) + 1) * rowsPerPage) - rowsPerPage;

            let listAssistants = await db.jrn_persona.findMany({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    created_at: {
                        gte: moment.utc(props.year).toISOString(),
                        lt: moment.utc(props.year).add(1, 'year').toISOString()
                    },
                    ...((props.module !== '' || props.workshop !== '') && {
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
                    }),
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
            const currentYear = moment().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();

            let assistant = await db.jrn_persona.findFirst({
                where: {
                    correo: email ? { contains: email } : {},
                    created_at: {
                        gte: moment.utc(currentYear).toISOString(),
                        lt: moment.utc(nextYear).toISOString()
                    }
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
        } catch (error) {
            reject(error);
        }
    })
}

export const getAssistantsAutocompleteQuery = (params: { filter: string, edicion: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listAssistants = await db.jrn_persona.findMany({
                where: {
                    created_at: {
                        gte: moment.utc(params.edicion).toISOString(),
                        lt: moment.utc(params.edicion).add(1, 'year').toISOString()
                    },
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
        } catch (error) {
            reject(error);
        }
    })
}

export const getCountAssistantsQuery = ({ ...props }: PropsGetTotalAssistantsQueries) => {
    return new Promise(async (resolve, reject) => {
        try {
            let countListAssistants = await db.jrn_persona.count({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    created_at: {
                        gte: moment.utc(props.year).toISOString(),
                        lt: moment.utc(props.year).add(1, 'year').toISOString()
                    },
                    ...((props.module !== '' || props.workshop !== '') && {
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
                    }),
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
        } catch (error) {
            reject(error);
        }
    })
}

//!IMPORTANT UPDATE EVERY YEAR
export const updateAttendancesWorkshopsQuery = (assistant: { assistant: string }) => {
    return new Promise(async (resolve, reject) => {
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

            resolve(true)
        } catch (error) {
            reject(error);
        }
    })
}