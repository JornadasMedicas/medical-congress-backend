import { Response } from "express";
import { getAssistantInfoQuery, getAssistantsAutocompleteQuery, getAssistantsQuery, getCountAssistantsQuery, updateAttendancesQuery, updateAttendancesWorkshopsQuery } from "../helpers/assistantsQueries";
import { PropsGetAssistantsQueries, PropsGetTotalAssistantsQueries } from "../interfaces/IAssistants";

export const getAssistants = async (req: any, res: Response) => {
    try {
        const params: PropsGetAssistantsQueries = req.query;
        let queryAssistants = await getAssistantsQuery(params);
        res.status(200).json({
            ok: true,
            msg: 'Ok',
            data: queryAssistants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const getAssistantInfo = async (req: any, res: Response) => {
    try {
        const email: { email: string } = req.query;
        let assistant = await getAssistantInfoQuery(email.email);
        res.status(200).json({
            ok: true,
            msg: 'Ok',
            data: assistant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const getAssistantsAutocomplete = async (req: any, res: Response) => {
    try {
        const params: { filter: string, edicion: string } = req.query;
        let queryAssistants = await getAssistantsAutocompleteQuery(params);
        res.status(200).json({
            ok: true,
            msg: 'Ok',
            data: queryAssistants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const getTotalAssistants = async (req: any, res: Response) => {
    try {
        const params: PropsGetTotalAssistantsQueries = req.query;
        let queryTotalAssistants = await getCountAssistantsQuery({ ...params });

        res.status(200).json({
            ok: true,
            msg: 'ok',
            data: queryTotalAssistants
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const updateAttendances = async (req: any, res: Response) => {
    try {
        const { assistant }: { assistant: string } = req.body;
        const query: any = await updateAttendancesQuery(assistant);

        if (query.typeError === 1) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado.'
            });
        } else if (query.typeError === 2) {
            res.status(400).json({
                ok: false,
                msg: 'Aún no es posible registrar asistencias. Espere al día del evento.'
            });
        } else if (query.typeError === 3) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado en algún módulo.'
            });
        } else {
            res.status(200).json({
                ok: true,
                msg: 'ok',
                data: query
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido procesar la solicitud.'
        });
    }
}

export const updateAttendancesWorkshops = async (req: any, res: Response) => {
    try {
        const { assistant }: { assistant: string } = req.body;
        const query: any = await updateAttendancesWorkshopsQuery(assistant);

        if (query.typeError === 1) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado'
            });
        } else if (query.typeError === 2) {
            res.status(400).json({
                ok: false,
                msg: 'Aún no es posible registrar asistencias. Espere al día y hora del taller.'
            });
        } else if (query.typeError === 3) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado en algún taller.'
            });
        } else {
            res.status(200).json({
                ok: true,
                msg: 'ok',
                data: query
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido procesar la solicitud.'
        });
    }
}