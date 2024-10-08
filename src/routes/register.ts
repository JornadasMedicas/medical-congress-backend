import { Router } from "express";
import { sendRegistMail } from "../controllers/register";

const router: Router = Router();

router.post('/mail', sendRegistMail);

export default router;

sendRegistMail