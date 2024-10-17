import { Router } from "express";
import { getAssistants } from "../controllers/assistants";

const router: Router = Router();

router.get('/total', getAssistants);

export default router;