"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPdfVoucher = exports.updatePaymentStatus = exports.deleteCategory = exports.editCategory = exports.createCategory = exports.getCategories = exports.getEventEditions = exports.deleteWorkshop = exports.editWorkshop = exports.createWorkshop = exports.getWorkshops = exports.deleteModule = exports.editModule = exports.createModule = exports.getModules = exports.createEditon = exports.getCountCatalogs = void 0;
const adminQueries_1 = require("../helpers/adminQueries");
const assistantsQueries_1 = require("../helpers/assistantsQueries");
const playwright_1 = require("playwright");
const string_template_1 = __importDefault(require("string-template"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getCountCatalogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let countCatalogs = yield (0, adminQueries_1.getCountCatalogsQuery)();
        res.status(200).json(countCatalogs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getCountCatalogs = getCountCatalogs;
const createEditon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        let reg = yield (0, adminQueries_1.createEditionQuery)(params);
        res.status(200).json(reg);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `La edicion ${req.body.edicion} ya ha sido registrada`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
});
exports.createEditon = createEditon;
const getModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let modules = yield (0, adminQueries_1.getModulesQuery)();
        res.status(200).json(modules);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getModules = getModules;
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { nombre } = req.body;
        let reg = yield (0, adminQueries_1.createModuleQuery)(nombre);
        res.status(200).json(reg);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `El módulo ${req.body.nombre} ya ha sido registrado`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
});
exports.createModule = createModule;
const editModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        let reg = yield (0, adminQueries_1.editModuleQuery)(params);
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.editModule = editModule;
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let reg = yield (0, adminQueries_1.deleteModuleQuery)(parseInt(id));
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.deleteModule = deleteModule;
const getWorkshops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let workshops = yield (0, adminQueries_1.getWorkshopsQuery)();
        res.status(200).json(workshops);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getWorkshops = getWorkshops;
const createWorkshop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        let reg = yield (0, adminQueries_1.createWorkshopQuery)(params);
        res.status(200).json(reg);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `El taller ${req.body.nombre} ya ha sido registrado en esta edición`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
});
exports.createWorkshop = createWorkshop;
const editWorkshop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        let reg = yield (0, adminQueries_1.editWorkshopQuery)(params);
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.editWorkshop = editWorkshop;
const deleteWorkshop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let reg = yield (0, adminQueries_1.deleteWorkshopQuery)(parseInt(id));
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.deleteWorkshop = deleteWorkshop;
const getEventEditions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let eventEditions = yield (0, adminQueries_1.getEventEditionsQuery)();
        res.status(200).json(eventEditions);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getEventEditions = getEventEditions;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categories = yield (0, adminQueries_1.getCategoriesQuery)();
        res.status(200).json(categories);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getCategories = getCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { nombre } = req.body;
        let reg = yield (0, adminQueries_1.createCategoryQuery)(nombre);
        res.status(200).json(reg);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({
                ok: false,
                msg: `La categoria ${req.body.nombre} ya ha sido registrado`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
});
exports.createCategory = createCategory;
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        let reg = yield (0, adminQueries_1.editCategoryQuery)(params);
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.editCategory = editCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let reg = yield (0, adminQueries_1.deleteCategoryQuery)(parseInt(id));
        res.status(200).json(reg);
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.deleteCategory = deleteCategory;
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isPayed, id_persona } = req.body;
        const paymentStatus = yield (0, assistantsQueries_1.updatePaymentStatusQuery)(isPayed, id_persona);
        if (paymentStatus) {
            res.status(200).json(paymentStatus);
        }
        else {
            res.status(500).json({
                ok: false,
                msg: 'Server error contact the administrator'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
const printPdfVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get params from front-end
        const params = req.query;
        const templatePath = path_1.default.join(__dirname, "../templates/voucherPagoEfectivo.html");
        const html = fs_1.default.readFileSync(templatePath, "utf8");
        const template = (0, string_template_1.default)(html, params);
        const browser = yield playwright_1.chromium.launch();
        const page = yield browser.newPage();
        yield page.setContent(template);
        const pdfBuffer = yield page.pdf({
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
        yield browser.close();
        res.contentType("application/pdf");
        res.send(pdfBuffer);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
});
exports.printPdfVoucher = printPdfVoucher;
