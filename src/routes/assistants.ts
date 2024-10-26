import { Router } from "express";
import { getAssistants, getAssistantsAutocomplete, getTotalAssistants, updateAttendances, updateAttendancesWorkshops } from "../controllers/assistants";

const router: Router = Router();

router.get('/total', getAssistants);
router.get('/filter', getAssistantsAutocomplete);
router.get('/total/count', getTotalAssistants);

router.put('/attendance', updateAttendances);
router.put('/attendanceWorkshops', updateAttendancesWorkshops);

export default router;