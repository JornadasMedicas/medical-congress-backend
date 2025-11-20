import { Router } from "express";
import { getAssistantInfo, getAssistants, getAssistantsAutocomplete, getReason, getTotalAssistants, updateAttendances, updateAttendancesWorkshops, updateReason } from "../controllers/assistants";
import { updatePaymentStatus } from "../controllers/admin";

const router: Router = Router();

router.get('/assistantInfo', getAssistantInfo);
router.get('/total', getAssistants);
router.get('/filter', getAssistantsAutocomplete);
router.get('/total/count', getTotalAssistants);
router.get('/reason/:id', getReason);

router.put('/attendance', updateAttendances);
router.put('/attendanceWorkshops', updateAttendancesWorkshops);
router.put('/updatePaymentStatus', updatePaymentStatus);
router.put('/updateReason', updateReason);

export default router;