// URL de base de l'API
const APIBaseURL = "http://localhost:3000";

// Fonction utilitaire pour effectuer des appels API
async function fetchAPI(path, options) {
    try {
        // Construire l'URL complète
        const url = `${APIBaseURL}${path}`;
        const response = await fetch(url, options);

        // Vérifier si la réponse n'est pas OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            showErrorModal(errorData ? errorData.error : 'Unexpected error', response.status);
            return null;
        }

        // Gérer le statut 204 No Content
        if (response.status === 204) {
            return true; // Indiquer le succès
        }

        // Gérer le statut 500 Internal Server Error
        if (response.status === 500) {
            return true;
        }

        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return null; // Gérer les cas où la réponse n'est pas JSON
        }
    } catch (error) {
        showErrorModal(error.message);
        return null;
    }
}

// Fonction pour afficher une modal d'erreur
function showErrorModal(message, status) {
    const modalElem = document.querySelector("#error-modal");
    const messageElem = modalElem.querySelector("#error-message");
    messageElem.textContent = `${status} - ${message}`;
    modalElem.classList.add('is-active');
}

// Exportation de l'objet api avec des méthodes pour interagir avec l'API
export const api = {
    // Récupérer la liste des Pokémon
    fetchPokemonList: async () => {
        const data = await fetchAPI('/pokemons');
        return data;
    },

    // Récupérer la liste des équipes
    fetchTeamsList: async () => {
        const data = await fetchAPI('/teams');
        return data;
    },

    // Ajouter un Pokémon à une équipe
    addPokemonToTeam: async (id, pokemon_id) => {
        const data = await fetchAPI(`/teams/${id}/pokemons/${pokemon_id}`, {
            method: 'PUT',
            body: JSON.stringify({ id, pokemon_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    },

    // Récupérer les détails d'un Pokémon par son ID
    fetchPokemonById: async (id) => {
        const data = await fetchAPI(`/pokemons/${id}`);
        return data;
    },

    // Voter pour un Pokémon
    voteForPokemon: async (id) => {
        const data = await fetchAPI(`/pokemons/${id}/votes`, { 
            method: 'POST',
        });
    },

    // Récupérer le tableau de bord des votes
    getLeaderboard: async () => {
        const data = await fetchAPI('/pokemons/leaderboard/votes');
        return data;
    },

    // Ajouter une équipe
    addTeam: async (teamData) => {
        const data = await fetchAPI('/teams', {
            method: 'POST',
            body: JSON.stringify(teamData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    },

    // Supprimer une équipe
    deleteTeam: async (id) => {
        const data = await fetchAPI(`/teams/${id}`, {
            method: 'DELETE',
        });
        return data;
    },

    // Récupérer les détails d'une équipe par son ID
    getTeamById: async (id) => {
        const data = await fetchAPI(`/teams/${id}`);
        return data;
    },

    // Mettre à jour une équipe
    updateTeam: async (team) => {
        const data = await fetchAPI(`/teams/${team.id}`, {
            method: 'PATCH',
            body: JSON.stringify(team),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    },

    // Supprimer un Pokémon d'une équipe
    deletePokemonTeam: async (id, pokemon_id) => {
        const data = await fetchAPI(`/teams/${id}/pokemons/${pokemon_id}`, {
            method: 'DELETE',
        });
        return data;
    },
};



