import { Router } from 'express';
import * as teamsController from '../controllers/teamsController.js';
import { controllerWrapper } from "../controllers/controllerWrapper.js"; 

const router = Router();

router.get('/', controllerWrapper(teamsController.getTeams));
router.get('/:id', controllerWrapper(teamsController.getTeamById));
router.post('/', controllerWrapper(teamsController.createTeam));
router.patch('/:id', controllerWrapper(teamsController.updateTeam));
router.delete('/:id', controllerWrapper(teamsController.deleteTeam));
router.put('/:id/pokemons/:pokemonId', controllerWrapper(teamsController.addPokemonToTeam));
router.delete('/:id/pokemons/:pokemonId', controllerWrapper(teamsController.removePokemonFromTeam));

export { router };
