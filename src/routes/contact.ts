import { Router } from "express";
import { sendContactMail } from "../controllers/contact";

const router: Router = Router();

router.post('/mail', sendContactMail);

export default router;