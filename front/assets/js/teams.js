import { api } from './api.js'; // Importation du module API pour gérer les appels de l'API
import { app } from './app.js'; // Importation du module app pour gérer les interactions de l'application

// Module pour gérer les équipes de Pokémon
export const teams = {
    // Initialisation du module des équipes
    init: function () {
        this.fetchAndAddTeamsToDom(); // Récupérer et ajouter les équipes au DOM
        this.openAddTeamModal(); // Ouvrir le modal pour ajouter une équipe
    },

    // Récupération de la liste des équipes et ajout au DOM
    fetchAndAddTeamsToDom: function () {
        api.fetchTeamsList()
            .then(data => {
                this.addTeamToDom(data); // Appel de la fonction pour ajouter les équipes au DOM
            });
    },

    // Ajouter les équipes au DOM
    addTeamToDom: function (data) {
        const teamsListContainer = document.getElementById('teams');
        const template = document.getElementById('team-template');
    
        teamsListContainer.innerHTML = ''; // Réinitialiser le conteneur des équipes
        data.forEach(teamData => {
            const clone = document.importNode(template.content, true);
            clone.querySelector('.team-name').textContent = teamData.name;
            teamData.Pokemons.forEach(pokemon => {
                const pokemonElement = document.createElement('div');
                pokemonElement.classList.add('pokemon-item-team');
    
                const pokemonImg = document.createElement('img');
                pokemonImg.src = `./assets/img/${pokemon.id}.webp`;
                pokemonImg.alt = pokemon.name;
                pokemonImg.classList.add('pokemon-icon');
    
                const pokemonName = document.createElement('span');
                pokemonName.textContent = pokemon.name;
    
                pokemonElement.appendChild(pokemonImg);
                pokemonElement.appendChild(pokemonName);
                clone.querySelector('.team-pokemon-list').appendChild(pokemonElement);
            });
            clone.querySelector('.team-card').addEventListener('click', () => {
                this.showTeamDetail(teamData); // Afficher les détails de l'équipe
            });
            teamsListContainer.appendChild(clone);
        });
    },

    // Afficher les détails d'une équipe
    showTeamDetail: function (teamData) {
        const modal = document.getElementById('teamDetailModal');
        const teamNameElement = document.getElementById('teamModalTitle');
        const teamDescriptionElement = document.getElementById('teamDescription');
        const deleteTeamButton = document.getElementById('deleteTeamButton');
        const editTeamBtn = document.getElementById('editTeamButton');
    
        teamNameElement.textContent = `${teamData.name}`;
        teamDescriptionElement.textContent = `${teamData.description}`;
    
        const teamPokemonList = document.getElementById('teamPokemonList');
        teamPokemonList.innerHTML = ''; // Réinitialiser la liste des Pokémon de l'équipe
    
        teamData.Pokemons.forEach(pokemon => {
            this.addPokemonToTeamList(teamData, teamPokemonList, pokemon); // Ajouter les Pokémon de l'équipe à la liste
        });
    
        deleteTeamButton.dataset.teamId = teamData.id;
        deleteTeamButton.addEventListener('click', () => {
            this.openConfirmDeleteModal(teamData.id); // Ouvrir le modal de confirmation de suppression
            modal.classList.remove('is-active');
        });
        modal.classList.add('is-active');
        editTeamBtn.dataset.teamId = teamData.id;
        editTeamBtn.addEventListener('click', () => {
            this.openEditTeamModal(teamData.id); // Ouvrir le modal pour éditer l'équipe
            modal.classList.remove('is-active');
        });
    },
    
    // Ajouter un Pokémon à la liste de l'équipe
    addPokemonToTeamList: function (teamData, teamPokemonList, pokemon) {
        const pokemonTemplate = document.getElementById('pokemonTemplate');
        const pokemonClone = document.importNode(pokemonTemplate.content, true);
        pokemonClone.querySelector('.pokemon-name').textContent = pokemon.name;
        pokemonClone.querySelector('.pokemon-image-team').src = `./assets/img/${pokemon.id}.webp`;
        pokemonClone.querySelector('.remove-pokemon-button').addEventListener('click', async () => {
            await api.deletePokemonTeam(teamData.id, pokemon.id); // Supprimer le Pokémon de l'équipe
            this.showTeamDetail(await api.getTeamById(teamData.id)); // Afficher les détails mis à jour de l'équipe
            this.fetchAndAddTeamsToDom(); // Réactualiser la liste des équipes
            bulmaToast.toast({
                message: `Le Pokémon ${pokemon.name} a été supprimé de l'équipe.`,
                type: 'is-danger',
                duration: 2000,
                position: 'top-right',
                animate: { in: 'fadeIn', out: 'fadeOut' }
            });
        });
        teamPokemonList.appendChild(pokemonClone);
    },

    // Ouvrir le modal de confirmation de suppression d'une équipe
    openConfirmDeleteModal: function () {
        const confirmModal = document.getElementById('confirmDeleteModal');
        confirmModal.classList.add('is-active');

        const confirmButton = document.getElementById('confirmDelete');
        const cancelButton = document.getElementById('cancelDelete');
        const deleteTeamButton = document.getElementById('deleteTeamButton');
        confirmButton.onclick = async () => {
            await api.deleteTeam(deleteTeamButton.dataset.teamId); // Supprimer l'équipe
            bulmaToast.toast({
                message: `La team a été supprimée.`,
                type: 'is-danger',
                duration: 2000,
                position: 'top-right',
                animate: { in: 'fadeIn', out: 'fadeOut' }
            });
            app.closeActiveModal(); // Fermer le modal actif
            this.fetchAndAddTeamsToDom(); // Réactualiser la liste des équipes
        };

        cancelButton.addEventListener('click', () => {
            app.closeActiveModal(); // Fermer le modal actif
        });
    },
    
    // Ouvrir le modal pour ajouter un Pokémon à une équipe
    openAddToTeamModal: function (pokemonId) {
        const modal = document.getElementById('addToTeamModal');
        const body = modal.querySelector('.modal-card-body');
        const addBtn = modal.querySelector('.button.is-success.add');
        document.getElementById('pokemonDetailModal').classList.remove('is-active');
        api.fetchTeamsList()
            .then(teams => {
                const selectOptions = teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
                body.innerHTML = `
                    <p>Sélectionnez une équipe à laquelle ajouter ce Pokémon...</p>
                    <div class="select">
                        <select id="teamSelect">
                            ${selectOptions}
                        </select>
                    </div>
                `;
                const handleAddButtonClick = async () => {
                    const selectedTeamId = document.getElementById('teamSelect').value;
                    const pokemonData = await api.fetchPokemonById(pokemonId);
                    const pokemonName = pokemonData.name;
                    const selectedTeamName = teamSelect.options[teamSelect.selectedIndex].text;
                    await api.addPokemonToTeam(selectedTeamId, pokemonId); // Ajouter le Pokémon à l'équipe sélectionnée
                    modal.classList.remove('is-active');
                    this.fetchAndAddTeamsToDom(); // Réactualiser la liste des équipes
                    bulmaToast.toast({
                        message: `Le Pokémon ${pokemonName} a été ajouté à l'équipe ${selectedTeamName}.`,
                        type: 'is-success',
                        duration: 2000,
                        position: 'top-right',
                        animate: { in: 'fadeIn', out: 'fadeOut' }
                    });
                    addBtn.removeEventListener('click', handleAddButtonClick); // Supprimer l'événement de clic après l'ajout
                };
                addBtn.addEventListener('click', handleAddButtonClick);
                modal.classList.add('is-active');
            });
    },

    // Ouvrir le modal pour ajouter une nouvelle équipe
    openAddTeamModal: function () {
        const addTeamBtn = document.getElementById('add-team');
        const modal = document.getElementById('addTeamModal');
        const formElement = document.getElementById('addTeamForm');
        
        addTeamBtn.addEventListener('click', () => modal.classList.add('is-active'));

        const addTeamButton = document.getElementById('addTeamButton');
        addTeamButton.addEventListener('click', async () => {
            const formData = new FormData(formElement);
            const teamData = Object.fromEntries(formData);

            await api.addTeam(teamData); // Ajouter une nouvelle équipe
            app.closeActiveModal(); // Fermer le modal actif
            formElement.reset();
            bulmaToast.toast({
                message: `La team ${teamData.name} a été ajoutée.`,
                type: 'is-success',
                duration: 2000,
                position: 'top-right',
                animate: { in: 'fadeIn', out: 'fadeOut' }
            });
            this.fetchAndAddTeamsToDom(); // Réactualiser la liste des équipes
        });
    },

    // Ouvrir le modal pour éditer une équipe existante
    openEditTeamModal: async function (teamId) {
        const modal = document.getElementById('editTeamModal');
        const formElement = document.getElementById('editTeamForm');
        const teamData = await api.getTeamById(teamId);
        const teamNameInput = document.getElementById('editTeamName');
        const teamDescriptionInput = document.getElementById('editTeamDescription');

        teamNameInput.value = teamData.name;
        teamDescriptionInput.value = teamData.description;
        modal.classList.add('is-active');
        const editTeamButton = document.querySelector('.save-team-button');
        editTeamButton.onclick = async () => {
            const formData = new FormData(formElement);
            const updatedTeamData = Object.fromEntries(formData);
            updatedTeamData.name = teamNameInput.value;
            updatedTeamData.description = teamDescriptionInput.value;
            updatedTeamData.id = teamId;
            await api.updateTeam(updatedTeamData); // Mettre à jour l'équipe
            app.closeActiveModal(); // Fermer le modal actif
            formElement.reset();
            this.fetchAndAddTeamsToDom(); // Réactualiser la liste des équipes
        };
    },
};

