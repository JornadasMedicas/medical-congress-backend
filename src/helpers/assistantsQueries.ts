import moment from "moment-timezone";
import { db } from "../utils/db";
import { PropsGetAssistantsQueries, PropsGetTotalAssistantsQueries } from "../interfaces/IAssistants";

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

export const updateAttendancesQuery = (assistant: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentYear = moment().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();

            const isRegistered = await db.jrn_persona.findFirst({
                where: {
                    correo: assistant,
                    created_at: {
                        gte: moment.utc(currentYear).toISOString(),
                        lt: moment.utc(nextYear).toISOString()
                    }
                },
                select: {
                    id: true
                }
            });

            if (!isRegistered) {//if isn't registered
                return resolve({ ok: false, typeError: 1 });
            }

            const edition = await db.jrn_edicion.findFirst({
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

            const dnow = moment();

            if (dnow.isBefore(edition?.fec_dia_1)) {// if assistance is checked before event begins
                return resolve({ ok: false, typeError: 2 });
            }

            const isOnCongress = await db.jrn_inscritos_modulos.findFirst({
                where: {
                    jrn_persona: { correo: assistant }
                },
                select: {
                    pagado: true
                }
            });

            if (!isOnCongress) {//if isn't registered on congress
                return resolve({ ok: false, typeError: 3 });
            }

            if (!edition?.gratuito) {//if edition isn't free, attendance payment tracking
                if (!isOnCongress?.pagado) {//if hasn't paid yet
                    return resolve({ ok: false, typeError: 4 });
                }
            }

            await db.jrn_inscritos_modulos.updateMany({
                where: {
                    id_persona: isRegistered.id
                },
                data: {
                    ...(dnow.isSameOrAfter(edition?.fec_dia_1) && dnow.isBefore(edition?.fec_dia_2)) && {
                        asistioDia1: true
                    },
                    ...(dnow.isSameOrAfter(edition?.fec_dia_2) && dnow.isBefore(edition?.fec_dia_3)) && {
                        asistioDia2: true
                    },
                    ...(dnow.isSameOrAfter(edition?.fec_dia_3)) && {
                        asistioDia3: true
                    },
                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                }
            });

            resolve({ ok: true, typeError: 0 });
        } catch (error) {
            reject(error);
        }
    })
}

export const updateAttendancesWorkshopsQuery = (assistant: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentYear = moment().format('YYYY');
            const nextYear = (parseInt(currentYear) + 1).toString();

            const isRegistered = await db.jrn_persona.findFirst({
                where: {
                    correo: assistant,
                    created_at: {
                        gte: moment.utc(currentYear).toISOString(),
                        lt: moment.utc(nextYear).toISOString()
                    }
                },
                select: {
                    id: true
                }
            });

            if (!isRegistered) {//if isn't registered
                return resolve({ ok: false, typeError: 1 });
            }

            const edition = await db.jrn_edicion.findFirst({
                where: {
                    edicion: currentYear
                },
                select: {
                    fec_dia_1: true,
                    fec_dia_2: true,
                    fec_dia_3: true
                }
            });

            const dnow = moment();

            if (dnow.isBefore(edition?.fec_dia_1)) {// if assistance is checked before event begins
                return resolve({ ok: false, typeError: 2 });
            }

            const isOnWorkshops = await db.jrn_inscritos_talleres.findMany({
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

            if (isOnWorkshops.length === 0) {//if isn't registered on workshops
                return resolve({ ok: false, typeError: 3 });
            }

            let assistance: { count: number }[] = [];

            //validate this part
            for (const workshop of isOnWorkshops) {
                const dnow2 = moment();
                const workshopDate = moment.utc(workshop.jrn_taller.fecha).format('YYYY-MM-DD').split('-');

                if (dnow2.utc().subtract(6, 'hour').isSameOrAfter(
                    moment.utc(workshop.jrn_taller.hora_inicio).subtract(1, 'hour').set({
                        year: parseInt(workshopDate[0]),
                        month: parseInt(workshopDate[1]) - 1,
                        date: parseInt(workshopDate[2]),
                    })
                ) && dnow2.utc().subtract(6, 'hour').isSameOrBefore(
                    moment.utc(workshop.jrn_taller.hora_fin).add(1, 'hour').set({
                        year: parseInt(workshopDate[0]),
                        month: parseInt(workshopDate[1]) - 1,
                        date: parseInt(workshopDate[2]),
                    })
                )) {
                    const res = await db.jrn_inscritos_talleres.updateMany({
                        where: {
                            id_persona: isRegistered.id,
                            id_taller: workshop.jrn_taller.id
                        },
                        data: {
                            asistio: true,
                            updated_at: moment.utc().subtract(6, 'hour').toISOString()
                        }
                    });

                    assistance.push(res);
                }
            }

            if (assistance.length === 0) {
                return resolve({ ok: false, typeError: 2 });
            } else {
                return resolve(true);
            }
        } catch (error) {
            reject(error);
        }
    })
}

export const updatePaymentStatusQuery = (isPayed: boolean, id_persona: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentStatus = await db.jrn_inscritos_modulos.updateMany({
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
            } else {
                resolve(true);
            }

        } catch (error) {
            reject(error);
        }
    })
}