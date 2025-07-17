import { Request, Response } from "express";
import { createEditionQuery, getCountCatalogsQuery } from "../helpers/adminQueries";

export const getCountCatalogs = async (req: any, res: Response) => {
    try {
        let countCatalogs = await getCountCatalogsQuery();

        res.status(200).json(countCatalogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const createEditon = async (req: any, res: Response) => {
    try {
        let params = req.body;
        let reg = await createEditionQuery(params);

        res.status(200).json(reg);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `La edicion ${req.body.edicion} ya ha sido registrada.`
            });
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
}