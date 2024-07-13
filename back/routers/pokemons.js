import { Router } from 'express';
import * as pokemonsController from '../controllers/pokemonsController.js';
import { controllerWrapper } from "../controllers/controllerWrapper.js"; 

const router = Router();

router.get('/', controllerWrapper(pokemonsController.getPokemons));
router.get('/:id', controllerWrapper(pokemonsController.getPokemonById));

export { router };