import { Pokemon, Type } from '../models/index.js';
import { HTTPError } from '../errors/httpError.js';

// Récupère tous les Pokémons
export const getPokemons = async (req, res) => {
  const pokemons = await Pokemon.findAll({
    include: {
      model: Type,
      through: 'PokemonType', 
      attributes: ['id', 'name', 'color'] 
    }
  });
  res.json(pokemons);
};

// Récupère un Pokémon par son ID
export const getPokemonById = async (req, res) => {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (!pokemon) {
      throw new HTTPError(404, 'Pokemon not found. Please verify the provided ID.');
    }
    res.json(pokemon);
};
