import { Vote, Pokemon } from '../models/index.js';
import { sequelize } from "../models/sequelize.js";

export const voteForPokemon = async (req, res) => {
    const { pokemonId } = req.params;

    try {
        let vote = await Vote.findOne({ where: { pokemonId } });

        if (!vote) {
            vote = await Vote.create({ pokemonId, voteCount: 0 });
        }

        vote.voteCount++;
        await vote.save();

        res.status(201).json({ votes: vote.voteCount });
    } catch (error) {
        console.error('Erreur lors du vote pour le Pokémon :', error);
        res.status(500).json({ error: 'Erreur serveur lors du vote pour le Pokémon' });
    }
};


export const getLeaderboard = async (_, res) => {
    try {
        const leaderboard = await Vote.findAll({
            attributes: ['pokemon_id', [sequelize.col('vote_count'), 'vote_count']],
            order: [[sequelize.col('vote_count'), 'DESC']],
            limit: 10,
            raw: true
        });
  
        const leaderboardWithPokemonDetails = await Promise.all(leaderboard.map(async (entry) => {
            const pokemonId = entry.pokemon_id;
            const pokemonDetails = await Pokemon.findOne({
                where: { id: pokemonId },
                attributes: ['name']
            });
  
            return {
                pokemonId: pokemonId,
                voteCount: entry.vote_count,
                name: pokemonDetails.name,
            };
        }));
  
        res.status(200).json(leaderboardWithPokemonDetails);
    } catch (error) {
        console.error('Erreur lors de la récupération du leaderboard des votes :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des votes' });
    }
  };

