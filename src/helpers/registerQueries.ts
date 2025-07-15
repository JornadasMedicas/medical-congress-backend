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
                        jrn_inscritos_modulos: {
                            create: {
                                asistioDia1: false,
                                asistioDia2: false,
                                asistioDia3: false,
                                constancia_enviada: false,
                                id_edicion: props.id_edicion,
                                id_modulo: props.id_modulo
                            }
                        },
                        jrn_inscritos_talleres: {
                            createMany: {
                                data: props.talleres
                            }
                        }
                    }
                });

                if (record) { //if person was registered successfully
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

export const getEmailUsed = (): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dnow = moment(`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`);
            let email: number = 1;

            let email1 = await db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });

            let email2 = await db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO2}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });

            let email3 = await db.jrn_persona.count({
                where: {
                    email_registro: `${process.env.EMAIL_REGISTRO3}`,
                    created_at: {
                        gte: dnow.toISOString(),
                        lt: dnow.add(1, 'day').toISOString()
                    }
                }
            });

            if ((email1 + email2 + email3) >= 300) {
                resolve(0);
            } else {
                if ((email1 + email2 + email3) === 0) {
                    email = 1;
                    resolve(1);
                } else {
                    if (email1 < 100) {
                        email = 1
                    } else if (email2 < 100) {
                        email = 2
                    } else if (email3 < 100) {
                        email = 3
                    }
                    resolve(email);
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}