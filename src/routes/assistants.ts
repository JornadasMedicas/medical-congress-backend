import { Router } from "express";
import { getAssistantInfo, getAssistants, getAssistantsAutocomplete, getTotalAssistants, updateAttendances, updateAttendancesWorkshops } from "../controllers/assistants";
import { updatePaymentStatus } from "../controllers/admin";

const router: Router = Router();

router.get('/assistantInfo', getAssistantInfo);
router.get('/total', getAssistants);
router.get('/filter', getAssistantsAutocomplete);
router.get('/total/count', getTotalAssistants);

router.put('/attendance', updateAttendances);
router.put('/attendanceWorkshops', updateAttendancesWorkshops);
router.put('/updatePaymentStatus', updatePaymentStatus);

export default router;