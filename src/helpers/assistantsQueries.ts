import moment from "moment";
import { db } from "../utils/db";
import { PropsGetAssistantsQueries } from "../interfaces/IAssistants";

export const getAssistantsQuery = ({ ...props }: PropsGetAssistantsQueries) => {
    return new Promise(async (resolve, reject) => {
        try {
            const rowsPerPage = parseInt(props.limit);
            const min = ((parseInt(props.page) + 1) * rowsPerPage) - rowsPerPage;

            let listAssistants = await db.jrn_persona.findMany({
                where: {
                    correo: props.email ? { contains: props.email } : {},
                    jrn_evento: {
                        every: {
                            OR: [
                                { modulo: props.module ? { contains: props.module } : {} },
                                { isRegisteredT1: props.workshop === 'Cirugía Maxilofacial' ? true : {} }, //????????
                                { isRegisteredT2: props.workshop === 'Paladar Hendido' ? true : {} },
                                { isRegisteredT3: props.workshop === 'Cuidados Paliativos' ? true : {} },
                                { isRegisteredT4: props.workshop === 'Restauración Interproximales' ? true : {} }
                            ]
                        }
                    }
                },
                select: {
                    id: true,

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