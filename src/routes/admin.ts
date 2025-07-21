import { Router } from "express";
import { createEditon, createModule, createWorkshop, deleteModule, editModule, getCountCatalogs, getEventEditions, getModules, getWorkshops } from "../controllers/admin";

const router: Router = Router();

router.get('/countCatalogs', getCountCatalogs);
router.get('/editions', getEventEditions);
router.get('/modules', getModules);
router.get('/workshops', getWorkshops);
router.post('/createEdition', createEditon);
router.post('/createModule', createModule);
router.post('/createWorkshop', createWorkshop);
router.put('/editModule', editModule);
router.put('/deleteModule/:id', deleteModule);

export default router;