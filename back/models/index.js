import { Type } from "./type.js";
import { Team } from "./team.js";
import { Pokemon } from "./pokemon.js";
import { PokemonType } from "./pokemonType.js";
import { TeamPokemon } from "./teamPokemon.js";
import { Vote } from "./vote.js";
import { sequelize } from "./sequelize.js";



Pokemon.belongsToMany(Type, { through: PokemonType, foreignKey: 'pokemon_id' });
Type.belongsToMany(Pokemon, { through: PokemonType, foreignKey: 'type_id' });

Team.belongsToMany(Pokemon, { through: TeamPokemon, foreignKey: 'team_id' });
Pokemon.belongsToMany(Team, { through: TeamPokemon, foreignKey: 'pokemon_id' });

export { Pokemon, Team, TeamPokemon, Type, PokemonType, Vote, sequelize};