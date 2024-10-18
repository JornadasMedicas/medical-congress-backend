import { Router } from "express";
import { getAssistants, getTotalAssistants } from "../controllers/assistants";

const router: Router = Router();

router.get('/total', getAssistants);
router.get('/total/count', getTotalAssistants);

export default router;