import moment from "moment";
import { db } from "../utils/db";
import { PropsSendRegistMailInterface } from "../interfaces/IRegister";

export const createInsertionQuery = ({ ...props }: PropsSendRegistMailInterface) => {
    return new Promise(async (resolve, reject) => {
        try {
            const repeated: any = await db.jrn_persona.findFirst({
                where: {
                    correo: props.correo
                }
            });

            if (repeated) {
                resolve({}); //duplicated entry
            } else {
                let record = await db.jrn_persona.create({
                    data: {
                        acronimo: props.acronimo.trim(),
                        nombre: props.nombre.trim() + ' ' + props.apellidos.trim(),
                        categoria: props.categoria,
                        correo: props.correo.trim(),
                        rfc: props.rfc === '' ? null : props.rfc,
                        tel: props.tel.trim(),
                        ciudad: props.ciudad.trim(),
                        dependencia: props.dependencia === '' ? null : props.dependencia,
                        created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                        updated_at: moment.utc().subtract(6, 'hour').toISOString(),
                        jrn_evento: {
                            create: {
                                modulo: props.modulo === '' ? null : props.modulo!.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
                                isRegisteredT1: props.t1.checked ? true : false,
                                isRegisteredT2: props.t2.checked ? true : false,
                                isRegisteredT3: props.t3.checked ? true : false,
                                isRegisteredT4: props.t4.checked ? true : false,
                                id_edicion: 1, //!IMPORTANT Change depends on edition
                                created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                updated_at: moment.utc().subtract(6, 'hour').toISOString()
                            }
                        }
                    }
                });

                if (record) { //if person was registered successfully
                    let event = await db.jrn_evento.findFirst({
                        where: { id_persona: record.id }
                    });

                    if (event) {
                        if (props.modulo !== '') {
                            await db.jrn_constancias.create({
                                data: {
                                    nombre: 'CONGRESO',
                                    id_evento: event.id,
                                    created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                                }
                            });
                        }

                        if (props.t1.checked) {
                            await db.jrn_constancias.create({
                                data: {
                                    nombre: props.t1.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
                                    id_evento: event.id,
                                    created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                                }
                            });
                        }

                        if (props.t2.checked) {
                            await db.jrn_constancias.create({
                                data: {
                                    nombre: props.t2.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
                                    id_evento: event!.id,
                                    created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                                }
                            });
                        }

                        if (props.t3.checked) {
                            await db.jrn_constancias.create({
                                data: {
                                    nombre: props.t3.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
                                    id_evento: event.id,
                                    created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                                }
                            });
                        }

                        if (props.t4.checked) {
                            await db.jrn_constancias.create({
                                data: {
                                    nombre: props.t4.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
                                    id_evento: event.id,
                                    created_at: moment.utc().subtract(6, 'hour').toISOString(), //gmt -6
                                    updated_at: moment.utc().subtract(6, 'hour').toISOString()
                                }
                            });
                        }
                    }

                    resolve(record);
                } else {
                    resolve(null);
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}