import { Router } from "express";
import { createEditon, getCountCatalogs } from "../controllers/admin";

const router: Router = Router();

router.get('/countCatalogs', getCountCatalogs);
router.post('/createEdition', createEditon);

export default router;