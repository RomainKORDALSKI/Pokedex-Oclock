import { Router } from "express";
import { router as pokemonsRouter } from "./pokemons.js";
import { router as typesRouter } from "./types.js";
import { router as teamsRouter } from "./teams.js";
import { router as votesRouter } from "./votes.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { notFound } from "../middlewares/notFound.js";

export const router = Router();


router.use("/pokemons", pokemonsRouter);
router.use("/types", typesRouter);
router.use("/teams", teamsRouter);
router.use("/pokemons", votesRouter);



router.use(notFound);


router.use(errorHandler);