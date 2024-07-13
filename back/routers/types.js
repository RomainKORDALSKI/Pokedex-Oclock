import { Router } from 'express';
import { controllerWrapper } from "../controllers/controllerWrapper.js"; 
import * as typesController from '../controllers/typesController.js';

const router = Router();

router.get('/', controllerWrapper(typesController.getTypes));
router.get('/:id', controllerWrapper(typesController.getTypeById));

export { router };
