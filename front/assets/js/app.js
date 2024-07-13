import { pokemon } from './pokemon.js'; // Importation du module Pokemon
import { teams } from './teams.js'; // Importation du module Teams
import { vote } from './vote.js'; // Importation du module Vote

// Module principal de l'application
export const app = {
    // Initialisation de l'application
    init: function () {
        pokemon.init(); // Initialiser le module Pokemon
        teams.init(); // Initialiser le module Teams
        app.initModals(); // Initialiser les modals
        app.toggleActiveModal(); // Activer la gestion des modals
        vote.init(); // Initialiser le module Vote
    },

    // Initialisation des modals
    initModals: () => {
        const closeElems = document.querySelectorAll("button.close, .modal-background"); // Sélectionner les éléments pour fermer les modals
        closeElems.forEach(elem => elem.addEventListener("click", app.closeActiveModal)); // Ajouter un événement de clic pour fermer les modals
    },

    // Fermeture de la modal active
    closeActiveModal: () => {
        const activeModalElem = document.querySelector(".modal.is-active"); // Sélectionner la modal active
        activeModalElem.classList.remove("is-active"); // Retirer la classe pour masquer la modal
    },

    // Basculer la visibilité de la barre latérale des équipes sur mobile
    toggleActiveModal: () => {
        const toggleTeamsButtonMobile = document.getElementById('toggleTeamsButtonMobile'); // Bouton pour afficher/masquer les équipes sur mobile
        const teamsSidebar = document.querySelector('.sidebar'); // Sélectionner la barre latérale des équipes
  
        toggleTeamsButtonMobile.addEventListener('click', function() {
            teamsSidebar.classList.toggle('is-hidden-mobile'); // Basculer la classe pour afficher/masquer la barre latérale sur mobile
            
            if (teamsSidebar.classList.contains('is-hidden-mobile')) {
                toggleTeamsButtonMobile.textContent = 'Afficher les équipes'; // Mettre à jour le texte du bouton
            } else {
                toggleTeamsButtonMobile.textContent = 'Masquer les équipes'; // Mettre à jour le texte du bouton
            }
        });
    },
};

// Exécuter la fonction init de l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', app.init);



