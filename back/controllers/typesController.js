import { Type, Pokemon } from '../models/index.js';
import { HTTPError } from '../errors/httpError.js';

// Récupère tous les types
export const getTypes = async (req, res) => {
    const types = await Type.findAll({
      include: {
        model: Pokemon,
        through: 'PokemonType',
        attributes: ['id', 'name'],
      },
    });
    res.json(types);
};

// Récupère un type par son ID
export const getTypeById = async (req, res) => {
    const type = await Type.findByPk(req.params.id, {
      include: {
        model: Pokemon,
        through: 'PokemonType',
        attributes: ['id', 'name'],
      },
    });
    if (!type) {
      throw new HTTPError(404, 'Type not found. Please verify the provided ID.');
    }
    res.json(type);
};
