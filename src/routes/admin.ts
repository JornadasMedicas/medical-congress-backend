import { Router } from "express";
import { getCountCatalogs } from "../controllers/admin";

const router: Router = Router();

router.get('/countCatalogs', getCountCatalogs);

export default router;