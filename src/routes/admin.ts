import { Router } from "express";
import { createEditon, createModule, deleteModule, editModule, getCountCatalogs } from "../controllers/admin";

const router: Router = Router();

router.get('/countCatalogs', getCountCatalogs);
router.post('/createEdition', createEditon);
router.post('/createModule', createModule);
router.put('/editModule', editModule);
router.put('/deleteModule/:id', deleteModule);

export default router;