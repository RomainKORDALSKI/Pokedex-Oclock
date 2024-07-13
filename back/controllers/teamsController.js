import { Team, TeamPokemon, Pokemon } from '../models/index.js';
import { HTTPError } from '../errors/httpError.js';

// Récupère toutes les équipes
export const getTeams = async (_, res) => {
    const teams = await Team.findAll({
      include: {
        model: Pokemon,
        through: {
          model: TeamPokemon,
          attributes: [],
        },
        attributes: ['id', 'name'],
      },
    });
    res.json(teams);
};

// Récupère une équipe par son ID
export const getTeamById = async (req, res) => {
    const team = await Team.findByPk(req.params.id, {
      include: {
        model: Pokemon,
        through: {
          model: TeamPokemon,
          attributes: [],
        },
        attributes: ['id', 'name'],
      },
    });
    if (!team) {
      throw new HTTPError(404, 'Team not found. Please verify the provided ID.');
    }
    res.json(team);
};

// Crée une nouvelle équipe
export const createTeam = async (req, res) => {
    const team = await Team.create(req.body);
    res.status(201).json(team);
};

// Met à jour une équipe existante
export const updateTeam = async (req, res) => {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      throw new HTTPError(404, 'Team not found. Please verify the provided ID.');
    }
    await team.update(req.body);
    res.json(team);
};

// Supprime une équipe
export const deleteTeam = async (req, res) => {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      throw new HTTPError(404, 'Team not found. Please verify the provided ID.');
    }
    await team.destroy();
    res.status(204).end();
};

// Ajoute un Pokémon à une équipe
export const addPokemonToTeam = async (req, res) => {
   const team = await Team.findByPk(req.params.id);
    if (!team) {
      throw new HTTPError(404, 'Team not found. Please verify the provided Team ID.');
    }

    // Vérifie si le Pokémon existe déjà dans l'équipe
    const existingTeamPokemon = await TeamPokemon.findOne({
      where: {
        team_id: req.params.id,
        pokemon_id: req.params.pokemonId,
      },
    });

    if (existingTeamPokemon) {
      throw new HTTPError(400, 'This Pokémon is already in the team.');
    }

    // Vérifie le nombre maximum de Pokémons dans une équipe (6)
    const teamPokemonCount = await TeamPokemon.count({
      where: { team_id: req.params.id },
    });

    if (teamPokemonCount >= 6) {
      throw new HTTPError(400, 'A team can have at most 6 Pokémons.');
    }

    // Ajoute le Pokémon à l'équipe
    await TeamPokemon.create({
      team_id: req.params.id,
      pokemon_id: req.params.pokemonId,
    });
    res.status(201).end();
};

// Retire un Pokémon d'une équipe
export const removePokemonFromTeam = async (req, res) => {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      throw new HTTPError(404, 'Team not found. Please verify the provided Team ID.');
    }

    // Vérifie si le Pokémon existe dans l'équipe
    const teamPokemon = await TeamPokemon.findOne({
      where: {
        team_id: req.params.id,
        pokemon_id: req.params.pokemonId,
      },
    });

    if (!teamPokemon) {
      throw new HTTPError(404, 'This Pokémon is not in the team.');
    }

    // Supprime le Pokémon de l'équipe
    await teamPokemon.destroy();

    res.status(204).end();
};
