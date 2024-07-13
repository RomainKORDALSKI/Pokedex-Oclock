import { api } from './api.js';
import { teams } from './teams.js';
import { comparison } from './comparison.js';

export const pokemon = {
    currentPage: 1,  // La page actuelle pour la pagination
    pokemonPerPage: 20,  // Nombre de Pokémon affichés par page
    pokemonData: [],  // Tableau pour stocker les données de tous les Pokémon
    filteredPokemonData: [],  // Tableau pour stocker les données de Pokémon filtrés

    // Initialisation de l'application Pokémon
    init: function () {
        api.fetchPokemonList()
            .then(data => {
                this.pokemonData = data;
                this.filteredPokemonData = data;
                this.renderPagination();
                this.renderPokemonList();
                
                this.setupSearch();
                this.setupTypeFilter();
            });
    },

    // Configuration du filtre par type
    setupTypeFilter: function() {
        const typeIcons = document.querySelectorAll('.type-icon');
        typeIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const selectedType = icon.dataset.type;
                this.filterPokemonByType(selectedType);
            });
        });
    },

    // Filtrage des Pokémon par type
    filterPokemonByType: function(type) {
        if (type === 'All') {
            this.filteredPokemonData = this.pokemonData;
        } else {
            this.filteredPokemonData = this.pokemonData.filter(pokemon => 
                pokemon.Types.some(pokemonType => pokemonType.name === type)
            );
        }
        this.currentPage = 1;
        this.renderPokemonList();
        this.renderPagination();
    },

    // Configuration de la barre de recherche
    setupSearch: function() {
        const searchBar = document.getElementById('searchBar');
        searchBar.addEventListener('keyup', (event) => {
            const query = event.target.value.toLowerCase();
            this.filteredPokemonData = this.pokemonData.filter(pokemon => 
                pokemon.name.toLowerCase().includes(query) ||
                pokemon.Types.some(type => type.name.toLowerCase().includes(query))
            );
            this.currentPage = 1;
            this.renderPokemonList();
            this.renderPagination();
        });
    },

    // Gestion de l'ajout d'un Pokémon à une équipe
    handleAddToTeamClick: async function(event) {
        const pokemonId = event.target.dataset.pokemonId;
        teams.openAddToTeamModal(pokemonId);
    },

    // Rendu de la pagination
    renderPagination: function() {
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = '';
    
        const totalPages = Math.ceil(this.filteredPokemonData.length / this.pokemonPerPage);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-link');
            if (i === this.currentPage) {
                pageButton.classList.add('is-current');
            }
            ((pageNumber) => {
                pageButton.addEventListener('click', () => {
                    this.currentPage = pageNumber;
                    this.renderPokemonList();
                    this.renderPagination(); 
                });
            })(i);
    
            paginationContainer.appendChild(pageButton);
        }
    },

    // Rendu de la liste des Pokémon pour la page actuelle
    renderPokemonList: function() {
        const startIndex = (this.currentPage - 1) * this.pokemonPerPage;
        const endIndex = startIndex + this.pokemonPerPage;
        const currentPageData = this.filteredPokemonData.slice(startIndex, endIndex);
    
        const pokemonListContainer = document.getElementById('pokemonList');
        pokemonListContainer.innerHTML = '';
    
        currentPageData.forEach(pokemonData => {
            const pokemonCard = this.createPokemonCard(pokemonData);
            pokemonListContainer.appendChild(pokemonCard);
        });
    },

    // Création d'une carte Pokémon
    createPokemonCard: function(pokemonData) {
        const template = document.getElementById('pokemon-card-template');
        const clone = document.importNode(template.content, true);
    
        let pokemonIdStr = String(pokemonData.id).padStart(3, '0');
        clone.querySelector('.pokemon-name').textContent = pokemonData.name;
        clone.querySelector('.pokemon-number').textContent = `#${pokemonIdStr}`;
    
        const typeContainer = clone.querySelector('.pokemon-types');
        pokemonData.Types.forEach(type => {
            const typeIcon = document.createElement('img');
            typeIcon.src = `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${type.name.toLowerCase()}.png`;
            typeIcon.classList.add('type-icon');
            typeIcon.alt = type.name;
            typeContainer.appendChild(typeIcon);
        });

        clone.querySelector('.pokemon-image').src = `./assets/img/${pokemonData.id}.webp`;
        const typeColors = pokemonData.Types.map(type => type.color);
        clone.querySelector('.box').style.background = `#${typeColors[0]}`;
        
        const addToTeamButton = clone.querySelector('.add-to-team-button');
        addToTeamButton.dataset.pokemonId = pokemonData.id;
        addToTeamButton.addEventListener('click', this.handleAddToTeamClick.bind(this));
        
        const voteButton = clone.querySelector('.vote-button');
    
        voteButton.addEventListener('click', async () => {
            await api.voteForPokemon(pokemonData.id);
            voteButton.classList.toggle('voted');
    
            const heartAnimation = document.createElement('i');
            heartAnimation.classList.add('fas', 'fa-heart', 'heart-animation');
            voteButton.appendChild(heartAnimation);
    
            heartAnimation.addEventListener('animationend', () => {
                heartAnimation.remove();
            });
    
            bulmaToast.toast({
                message: `Votre vote pour ${pokemonData.name} a été comptabilisé`,
                type: 'is-success',
                duration: 2000,
                position: 'top-right',
                animate: { in: 'fadeIn', out: 'fadeOut' } 
            });
        });
    

        const compareButton = clone.querySelector('.compare-button');
        compareButton.dataset.pokemonId = pokemonData.id;
        compareButton.addEventListener('click', () => { 
            comparison.handleCompareClick(event);
            document.querySelector('.comparison-panel').classList.add('is-active');
        });
    
        clone.querySelector('.pokemon-header').onclick = () => this.showPokemonDetail(pokemonData);
        
        return clone;
    },

    // Affichage des détails d'un Pokémon dans une modal
    showPokemonDetail: function(pokemonData) {
        let pokemonIdStr = String(pokemonData.id).padStart(3, '0');
        document.getElementById('pokemonTitleCards').textContent = `# ${pokemonIdStr} ${pokemonData.name}`;
    
        const idElement = document.getElementById('pokemonId');
        const nameElement = document.getElementById('pokemonName');
        const typesElement = document.getElementById('pokemonTypes');
        const pokemonImg = document.getElementById('pokemonImg');
        const typeImg = document.getElementById('typeImg');
        const typeImg2 = document.getElementById('typeImg2');
        idElement.textContent = `# ${pokemonIdStr}`;
        nameElement.textContent = `Nom: ${pokemonData.name}`;
        typesElement.textContent = `Types: ${pokemonData.Types.map(type => type.name).join(', ')}`;
        pokemonImg.src = `./assets/img/${pokemonData.id}.webp`;
        typeImg.src = `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${pokemonData.Types[0].name.toLowerCase()}.png`;
        if (pokemonData.Types[1]?.name.toLowerCase()) {
        typeImg2.classList.add('is-active');
        typeImg2.src = `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${pokemonData.Types[1]?.name.toLowerCase()}.png`;
        }
    
        const stats = [
            { label: 'HP', value: pokemonData.hp },
            { label: 'Attack', value: pokemonData.atk },
            { label: 'Defense', value: pokemonData.def },
            { label: 'Special Attack', value: pokemonData.atk_spe },
            { label: 'Special Defense', value: pokemonData.def_spe },
            { label: 'Speed', value: pokemonData.speed },
        ];
    
        stats.forEach(stat => {
            const statElement = document.getElementById(`stat${stat.label.replace(/\s/g, '')}`);
            const statValueElement = document.getElementById(`stat${stat.label.replace(/\s/g, '')}Value`);
            statElement.value = stat.value;
            statValueElement.textContent = stat.value;
        });
        
        document.getElementById('pokemonDetailModal').classList.add('is-active');
        const modal2 = document.getElementById('pokemonDetailModal');
        const addBtn2 = modal2.querySelector('.button.is-success.add');
        addBtn2.dataset.pokemonId = pokemonData.id;
        addBtn2.addEventListener('click', this.handleAddToTeamClick.bind(this));
    },
};









