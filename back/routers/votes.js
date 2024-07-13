import { Router } from 'express';
import * as votesController from '../controllers/votesController.js';
import { controllerWrapper } from "../controllers/controllerWrapper.js"; 

const router = Router();

router.post('/:pokemonId/votes', controllerWrapper(votesController.voteForPokemon));
router.get('/leaderboard/votes', controllerWrapper(votesController.getLeaderboard));

export { router };
