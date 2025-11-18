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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendancesWorkshops = exports.updateAttendances = exports.getTotalAssistants = exports.getAssistantsAutocomplete = exports.getAssistantInfo = exports.getAssistants = void 0;
const assistantsQueries_1 = require("../helpers/assistantsQueries");
const getAssistants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        let queryAssistants = yield (0, assistantsQueries_1.getAssistantsQuery)(params);
        res.status(200).json({
            ok: true,
            msg: 'Ok',
            data: queryAssistants
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getAssistants = getAssistants;
const getAssistantInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query;
        let assistant = yield (0, assistantsQueries_1.getAssistantInfoQuery)(email.email);
        if (!assistant) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado en la edición actual.'
            });
        }
        else {
            res.status(200).json({
                ok: true,
                msg: 'Ok',
                data: assistant
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
exports.getAssistantInfo = getAssistantInfo;
const getAssistantsAutocomplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        let queryAssistants = yield (0, assistantsQueries_1.getAssistantsAutocompleteQuery)(params);
        res.status(200).json({
            ok: true,
            msg: 'Ok',
            data: queryAssistants
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getAssistantsAutocomplete = getAssistantsAutocomplete;
const getTotalAssistants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        let queryTotalAssistants = yield (0, assistantsQueries_1.getCountAssistantsQuery)(Object.assign({}, params));
        res.status(200).json({
            ok: true,
            msg: 'ok',
            data: queryTotalAssistants
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Server error contact the administrator'
        });
    }
});
exports.getTotalAssistants = getTotalAssistants;
const updateAttendances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assistant } = req.body;
        const query = yield (0, assistantsQueries_1.updateAttendancesQuery)(assistant);
        if (query.typeError === 1) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado.'
            });
        }
        else if (query.typeError === 2) {
            res.status(400).json({
                ok: false,
                msg: 'Aún no es posible registrar asistencias. Espere al día del evento.'
            });
        }
        else if (query.typeError === 3) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado en algún módulo.'
            });
        }
        else if (query.typeError === 4) {
            res.status(402).json({
                ok: false,
                msg: 'El asistente no ha completado el pago de su inscripción.'
            });
        }
        else {
            res.status(200).json({
                ok: true,
                msg: 'ok',
                data: query
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido procesar la solicitud.'
        });
    }
});
exports.updateAttendances = updateAttendances;
const updateAttendancesWorkshops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assistant } = req.body;
        const query = yield (0, assistantsQueries_1.updateAttendancesWorkshopsQuery)(assistant);
        if (query.typeError === 1) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado'
            });
        }
        else if (query.typeError === 2) {
            res.status(400).json({
                ok: false,
                msg: 'Aún no es posible registrar asistencias. Espere al día y hora del taller.'
            });
        }
        else if (query.typeError === 3) {
            res.status(404).json({
                ok: false,
                msg: 'El asistente no se encuentra registrado en algún taller.'
            });
        }
        else {
            res.status(200).json({
                ok: true,
                msg: 'ok',
                data: query
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido procesar la solicitud.'
        });
    }
});
exports.updateAttendancesWorkshops = updateAttendancesWorkshops;
