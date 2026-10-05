import { Router } from "express";
import { sendPreRegistMail, sendRegistMail } from "../controllers/register";

const router: Router = Router();

router.post('/mail', sendRegistMail);
router.post('/pre', sendPreRegistMail);

export default router;