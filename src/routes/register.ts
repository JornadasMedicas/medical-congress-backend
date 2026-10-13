import { Router } from "express";
import { completePreRegistMail, sendPreRegistMail, sendRegistMail } from "../controllers/register";

const router: Router = Router();

router.post('/mail', sendRegistMail);
router.post('/pre', sendPreRegistMail);
router.post('/pre/complete', completePreRegistMail);

export default router;