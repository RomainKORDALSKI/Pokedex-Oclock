import { api } from './api.js'; // Importation du module API pour gérer les appels de l'API

// Module pour gérer la comparaison des Pokémon
export const comparison = {
    selectedPokemonForComparison: [], // Liste des Pokémon sélectionnés pour la comparaison

    // Gestionnaire d'événement pour le clic sur le bouton de comparaison
    handleCompareClick: function(event) {
        const pokemonId = event.target.dataset.pokemonId; // Récupération de l'ID du Pokémon
        const card = event.target.closest('.pokemon-card'); // Récupération de la carte du Pokémon

        // Appel à l'API pour récupérer les données du Pokémon par ID
        api.fetchPokemonById(pokemonId).then(pokemonData => {
            const index = this.selectedPokemonForComparison.findIndex(p => p.id === pokemonData.id); // Recherche si le Pokémon est déjà sélectionné

            if (index >= 0) {
                // Si le Pokémon est déjà sélectionné, le retirer de la liste
                this.selectedPokemonForComparison.splice(index, 1);
                card.classList.remove('selected-for-comparison'); // Retirer la classe CSS indiquant la sélection
            } else if (this.selectedPokemonForComparison.length < 2) {
                // Si moins de 2 Pokémon sont sélectionnés, ajouter le Pokémon à la liste
                this.selectedPokemonForComparison.push(pokemonData);
                card.classList.add('selected-for-comparison'); // Ajouter la classe CSS indiquant la sélection
            }

            this.updateComparisonPanel(); // Mettre à jour le panneau de comparaison
        });
    },

    // Mise à jour du panneau de comparaison
    updateComparisonPanel: function() {
        const comparisonPanel = document.getElementById('comparisonPanel'); // Panneau de comparaison
        const selectedPokemonContainer = comparisonPanel.querySelector('.selected-pokemon-container'); // Conteneur des Pokémon sélectionnés
        const compareButton = comparisonPanel.querySelector('.button'); // Bouton de comparaison

        selectedPokemonContainer.innerHTML = ''; // Réinitialiser le contenu du conteneur

        // Ajouter chaque Pokémon sélectionné au conteneur
        this.selectedPokemonForComparison.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'selected-pokemon';
            pokemonElement.innerHTML = `
                <img class='pokemon-image' src="./assets/img/${pokemon.id}.webp" alt="${pokemon.name}" title="${pokemon.name}">
            `;
            selectedPokemonContainer.appendChild(pokemonElement);
        });

        // Activer ou désactiver le bouton de comparaison en fonction du nombre de Pokémon sélectionnés
        compareButton.disabled = this.selectedPokemonForComparison.length !== 2;
        compareButton.addEventListener('click',  this.showComparison.bind(this)); // Ajouter l'événement pour afficher la comparaison
    },

    // Affichage de la comparaison des Pokémon sélectionnés
    showComparison: function() {
        document.querySelector('.comparison-panel').classList.remove('is-active'); // Masquer le panneau de comparaison
        if (this.selectedPokemonForComparison.length === 2) {
            const [pokemon1, pokemon2] = this.selectedPokemonForComparison; // Récupérer les deux Pokémon sélectionnés
            const comparisonModal = document.getElementById('comparisonModal'); // Modal de comparaison

            // Mettre à jour les informations du premier Pokémon dans le modal
            comparisonModal.querySelector('.pokemon1 .pokemon-name').textContent = pokemon1.name;
            comparisonModal.querySelector('.pokemon1 .pokemon-image').src = `./assets/img/${pokemon1.id}.webp`;
            comparisonModal.querySelector('.pokemon1 .pokemon-stats').innerHTML = this.getStatsHtml(pokemon1);

            // Mettre à jour les informations du second Pokémon dans le modal
            comparisonModal.querySelector('.pokemon2 .pokemon-name').textContent = pokemon2.name;
            comparisonModal.querySelector('.pokemon2 .pokemon-image').src = `./assets/img/${pokemon2.id}.webp`;
            comparisonModal.querySelector('.pokemon2 .pokemon-stats').innerHTML = this.getStatsHtml(pokemon2);

            comparisonModal.classList.add('is-active'); // Afficher le modal de comparaison

            // Réinitialiser la sélection des cartes
            const selectedCards = document.querySelectorAll('.selected-for-comparison');
            selectedCards.forEach(card => card.classList.remove('selected-for-comparison'));
            this.selectedPokemonForComparison = []; // Vider la liste des Pokémon sélectionnés
            this.updateComparisonPanel(); // Mettre à jour le panneau de comparaison
        }
    },

    // Génération du HTML pour les statistiques du Pokémon
    getStatsHtml: function(pokemon) {
        return `
            <p>HP: ${pokemon.hp}</p>
            <p>Attack: ${pokemon.atk}</p>
            <p>Defense: ${pokemon.def}</p>
            <p>Special Attack: ${pokemon.atk_spe}</p>
            <p>Special Defense: ${pokemon.def_spe}</p>
            <p>Speed: ${pokemon.speed}</p>
        `;
    }
};
