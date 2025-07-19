import { Request, Response } from "express";
import { createEditionQuery, createModuleQuery, createWorkshopQuery, deleteModuleQuery, editModuleQuery, getCountCatalogsQuery } from "../helpers/adminQueries";

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
                msg: `La edicion ${req.body.edicion} ya ha sido registrada`
            });
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
}

export const createModule = async (req: any, res: Response) => {
    try {
        let { nombre } = req.body;
        let reg = await createModuleQuery(nombre);

        res.status(200).json(reg);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `El módulo ${req.body.nombre} ya ha sido registrado`
            });
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
}

export const editModule = async (req: any, res: Response) => {
    try {
        let params = req.body;
        let reg = await editModuleQuery(params);

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const deleteModule = async (req: any, res: Response) => {
    try {        
        let { id } = req.params;
        let reg = await deleteModuleQuery(parseInt(id));

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const createWorkshop = async (req: any, res: Response) => {
    try {
        let params = req.body;
        let reg = await createWorkshopQuery(params);

        res.status(200).json(reg);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `El taller ${req.body.nombre} ya ha sido registrado en esta edición`
            });
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
}