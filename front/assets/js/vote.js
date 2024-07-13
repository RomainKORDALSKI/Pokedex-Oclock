import { api } from './api.js'; // Importation du module API pour gérer les appels de l'API

// Module pour gérer les votes de Pokémon
export const vote = {
    // Initialisation du module de vote
    init: function () {
        this.openModalVote(); // Initialisation du modal de vote
    },

    // Fonction pour ouvrir le modal de vote
    openModalVote: function () {
        const openModalButton = document.getElementById('openVotesModalButton'); // Bouton pour ouvrir le modal des votes
        const votesModal = document.getElementById('votesModal'); // Modal des votes
        const votesList = document.getElementById('votesList'); // Liste des votes

        // Ajout d'un événement de clic sur le bouton pour ouvrir le modal des votes
        openModalButton.addEventListener('click', async () => {
            try {
                const leaderboard = await api.getLeaderboard(); // Récupérer le leaderboard des votes
                
                // Vérification si le leaderboard est valide et non vide
                if (leaderboard && leaderboard.length > 0) {
                    this.renderVotes(leaderboard, votesList); // Rendu des votes dans le DOM
                    votesModal.classList.add('is-active'); // Affichage du modal
                } else {
                    console.error('Leaderboard vide ou invalide.'); // Affichage d'un message d'erreur si le leaderboard est vide ou invalide
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du leaderboard des votes :', error); // Affichage d'un message d'erreur en cas de problème lors de la récupération des votes
            }
        });

        // Ajout d'un événement de clic pour fermer le modal des votes
        votesModal.querySelector('.modal-close').addEventListener('click', () => {
            votesModal.classList.remove('is-active'); // Fermeture du modal
        });

        // Fermeture du modal lorsqu'on clique à l'extérieur du contenu du modal
        votesModal.addEventListener('click', (event) => {
            if (event.target === votesModal) {
                votesModal.classList.remove('is-active'); // Fermeture du modal
            }
        });
    },

    // Fonction pour rendre les votes dans le DOM
    renderVotes: function (leaderboard, votesList) {
        votesList.innerHTML = ''; // Réinitialiser le contenu de la liste des votes
        
        const podium = document.getElementById('podium'); // Élément du podium
        podium.innerHTML = ''; // Réinitialiser le contenu du podium
        
        // Affichage des trois premiers Pokémon sur le podium
        const topThree = leaderboard.slice(0, 3);
        topThree.forEach((pokemon, index) => {
            const podiumItem = document.createElement('div');
            podiumItem.classList.add('podium-item', `position-${index + 1}`);
            podiumItem.innerHTML = `
                <div class="pokemon-info">
                    <img src="./assets/img/${pokemon.pokemonId}.webp" alt="${pokemon.name}">
                    <p class="pokemon-name">${pokemon.name}</p>
                    <p class="pokemon-votes">${pokemon.voteCount} votes</p>
                </div>
            `;
            podium.appendChild(podiumItem); // Ajouter l'élément au podium
        });
    
        // Affichage des autres Pokémon
        const otherPokemons = leaderboard.slice(3);
        otherPokemons.forEach(pokemon => {
            const voteItem = document.createElement('div');
            voteItem.classList.add('vote-item');
            voteItem.innerHTML = `
                <div class="pokemon-info">
                    <img src="./assets/img/${pokemon.pokemonId}.webp" alt="${pokemon.name}">
                    <p class="pokemon-name">${pokemon.name}</p>
                </div>
                <p class="pokemon-votes">${pokemon.voteCount} votes</p>
            `;
            votesList.appendChild(voteItem); // Ajouter l'élément à la liste des votes
        });
    }
};

