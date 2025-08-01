"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assistants_1 = require("../controllers/assistants");
const router = (0, express_1.Router)();
router.get('/assistantInfo', assistants_1.getAssistantInfo);
router.get('/total', assistants_1.getAssistants);
router.get('/filter', assistants_1.getAssistantsAutocomplete);
router.get('/total/count', assistants_1.getTotalAssistants);
router.put('/attendance', assistants_1.updateAttendances);
router.put('/attendanceWorkshops', assistants_1.updateAttendancesWorkshops);
exports.default = router;
