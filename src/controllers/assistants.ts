import { Response } from "express";
import { getAssistantsQuery, getCountAssistantsQuery } from "../helpers/assistantsQueries";
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