import { Router } from "express";
import { createCategory, createEditon, createModule, createWorkshop, deleteCategory, deleteModule, editCategory, editModule, getCategories, getCountCatalogs, getEventEditions, getModules, getWorkshops } from "../controllers/admin";

const router: Router = Router();

router.get('/countCatalogs', getCountCatalogs);
router.get('/editions', getEventEditions);
router.get('/modules', getModules);
router.get('/workshops', getWorkshops);
router.get('/categories', getCategories);

router.post('/createEdition', createEditon);
router.post('/createModule', createModule);
router.post('/createWorkshop', createWorkshop);
router.post('/createCategory', createCategory);

router.put('/editModule', editModule);
router.put('/editCategory', editCategory);
router.put('/deleteModule/:id', deleteModule);
router.put('/deleteCategory/:id', deleteCategory);

export default router;