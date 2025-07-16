import { Response } from "express";
import { getCountCatalogsQuery } from "../helpers/adminQueries";

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