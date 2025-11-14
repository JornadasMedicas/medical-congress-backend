import { Request, Response } from "express";
import { createCategoryQuery, createEditionQuery, createModuleQuery, createWorkshopQuery, deleteCategoryQuery, deleteModuleQuery, deleteWorkshopQuery, editCategoryQuery, editModuleQuery, editWorkshopQuery, getCategoriesQuery, getCountCatalogsQuery, getEventEditionsQuery, getModulesQuery, getWorkshopsQuery } from "../helpers/adminQueries";
import { updatePaymentStatusQuery } from "../helpers/assistantsQueries";
import { chromium } from 'playwright';
import format from 'string-template';
import fs from 'fs';
import path from "path";

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

export const getModules = async (req: any, res: Response) => {
    try {
        let modules = await getModulesQuery();

        res.status(200).json(modules)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
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

export const getWorkshops = async (req: any, res: Response) => {
    try {
        let workshops = await getWorkshopsQuery();

        res.status(200).json(workshops)
    } catch (error) {
        console.log(error);
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

export const editWorkshop = async (req: any, res: Response) => {
    try {
        let params = req.body;
        let reg = await editWorkshopQuery(params);

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const deleteWorkshop = async (req: any, res: Response) => {
    try {
        let { id } = req.params;
        let reg = await deleteWorkshopQuery(parseInt(id));

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const getEventEditions = async (req: any, res: Response) => {
    try {
        let eventEditions = await getEventEditionsQuery();

        res.status(200).json(eventEditions)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const getCategories = async (req: any, res: Response) => {
    try {
        let categories = await getCategoriesQuery();

        res.status(200).json(categories)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const createCategory = async (req: any, res: Response) => {
    try {
        let { nombre } = req.body;
        let reg = await createCategoryQuery(nombre);

        res.status(200).json(reg);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `La categoria ${req.body.nombre} ya ha sido registrado`
            });
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
}

export const editCategory = async (req: any, res: Response) => {
    try {
        let params = req.body;
        let reg = await editCategoryQuery(params);

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const deleteCategory = async (req: any, res: Response) => {
    try {
        let { id } = req.params;
        let reg = await deleteCategoryQuery(parseInt(id));

        res.status(200).json(reg);
    } catch (error: any) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const updatePaymentStatus = async (req: any, res: Response) => {
    try {
        const { isPayed, id_persona } = req.body;
        const paymentStatus = await updatePaymentStatusQuery(isPayed, id_persona);

        if (paymentStatus) {
            res.status(200).json(paymentStatus);
        } else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
}

export const printPdfVoucher = async (req: any, res: Response) => { //func para generar voucher de pago
    try {
        //get params from front-end
        const params: any = req.query;

        const templatePath = path.join(__dirname, "../templates/voucherPagoEfectivo.html");
        const html = fs.readFileSync(templatePath, "utf8");
        const template = format(html, params);

        const browser = await chromium.launch();

        const page = await browser.newPage();

        await page.setContent(template);
        const pdfBuffer = await page.pdf({ 
            format: 'Letter',
            margin: {
                top: 22,
                right: 22,
                bottom: 22,
                left: 22
            },
            scale: 0.95,
            printBackground: true
        });

        await browser.close();

        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
}