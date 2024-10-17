import { Response } from "express";
import { getAssistantsQuery } from "../helpers/assistantsQueries";
import { PropsGetAssistantsQueries } from "../interfaces/IAssistants";

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