import { Router } from "express";
import { getAssistantInfo, getAssistants, getAssistantsAutocomplete, getEventEditions, getTotalAssistants, updateAttendances, updateAttendancesWorkshops } from "../controllers/assistants";

const router: Router = Router();

router.get('/assistantInfo', getAssistantInfo);
router.get('/total', getAssistants);
router.get('/filter', getAssistantsAutocomplete);
router.get('/total/count', getTotalAssistants);
router.get('/editions', getEventEditions)

router.put('/attendance', updateAttendances);
router.put('/attendanceWorkshops', updateAttendancesWorkshops);

export default router;