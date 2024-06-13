import $ from 'jquery';
import 'select2';
import axios from 'axios';
import Cookies from 'js-cookie';
import leftPart from '../views/left_dash';
import rightPart from '../views/right_dash';
import card_like from '../views/card_like';
import form from '../views/form_creat_1';
import event_banniere from '../views/event_banniere';
import event_banniere_info from '../views/event_banniere_info';
import card_delete from '../views/card_sup';
import card from '../views/card';
import card_inscription from '../views/card_inscription';
import card_inscrition_edit from '../views/card_inscrition_edit';


class Dashbord {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params.page || 'accueil';
    this.run();
  }

  getDateEtHeureActuelles() {
    const date = new Date();
    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const moisAnnee = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const jourSemaine = joursSemaine[date.getDay()];
    const jour = date.getDate();
    const mois = moisAnnee[date.getMonth()];
    let heure = date.getHours();
    let minute = date.getMinutes();

    if (minute < 10) minute = `0${minute}`;
    if (heure < 10) heure = `0${heure}`;

    return `${jourSemaine} ${jour} ${mois} ${heure}h${minute}`;
  }

  startAutoUpdate() {
    setInterval(() => {
      const heureElement = document.getElementById('heure');
      if (heureElement) {
        heureElement.textContent = this.getDateEtHeureActuelles();
      }
    }, 1000);
  }

  async getPageDashbord() {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    if (!rightContainer) return;

    const sessionValid = await this.checkSession();
    if (!sessionValid) {
      window.location.href = '/';
      return;
    }

    switch (this.params) {
      case 'accueil':
        rightContainer.innerHTML = '<p>Contenu de la page Accueil</p>';
        break;
      case 'compte':
        rightContainer.innerHTML = '<p>Contenu de la page Mon compte</p>';
        break;
      case 'evenements':
        this.renderAllMyEvent();
        this.getEventClicked();
        break;
      case 'gerer_inscription':
       await this.RenderAllEventInscriptionStatus();
       this.verifierStatut();
      break;
      case 'inscription':
        this.renderAllMyInscription();
        break;
      case 'favoris':
        await this.renderAllEvent();
        break;
      case 'nouvel_evenement':
        rightContainer.innerHTML =  `${form()}`;
        this.collectAndSendDataForm();
        this.showflag();
          this.invitePerson();
        break;
      case 'modifier_evenement':
        rightContainer.innerHTML = '<p>Contenu de la page Modifier un événement</p>';
        break;
      case 'supprimer_evenement':
        rightContainer.innerHTML = `${card_delete()}`;
        break;
      default:
        rightContainer.innerHTML = '<p>Page non trouvée</p>';
    }
  }

  showflag() {
    $('.select2').select2({
      templateResult: (state) => {
        if (!state.id) {
          return state.text;
        }
        const $state = $(`<span><i class="${$(state.element).data('icon')}"></i> ${state.text}</span>`);
        return $state;
      },
      templateSelection: (state) => {
        if (!state.id) {
          return state.text;
        }
        const selected = $(`<span><i class="${$(state.element).data('icon')}"></i> ${state.text}</span>`);
        return selected;
      }
    });

    const input = document.querySelector('#phone');
    if (input) {
      window.intlTelInput(input, {
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js'
      });
    }
  }

  collectAndSendDataForm() {
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const countrySelect = document.querySelector('#select2');
        if (countrySelect) {
            const selectedOption = countrySelect.options[countrySelect.selectedIndex];
            formData.append('country', selectedOption.value);
            formData.append('countryIcon', selectedOption.getAttribute('data-icon'));
            formData.append('countryName', selectedOption.textContent);
        }

        const imageFileInput = document.getElementById('inputImage');
        if (imageFileInput) {
            const imageFile = imageFileInput.files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }
        }

        const userId = Cookies.get('user') ? JSON.parse(Cookies.get('user')).id : null;
        formData.append('userId', userId);

        // Récupérer les emails des personnes sélectionnées
        const emailPersonCheckboxes = document.querySelectorAll('.email_person_checkbox');
        const selectedPersons = [];
        emailPersonCheckboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const email = checkbox.closest('.select_person').querySelector('.email').textContent.trim().slice(1, -1);
                selectedPersons.push(`email${index + 1}: ${email}`);
            }
        });

        const selectedPersonsString = `{${selectedPersons.join(',')}}`;

        formData.append('selectedPersons', selectedPersonsString);

        const resultContainer = document.getElementById('formResult');
        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });
        resultContainer.textContent = JSON.stringify(jsonObject, null, 2);

        console.log(formData);
        axios.post('http://localhost/event', formData, {})
            .then((response) => {
                console.log('Réponse du serveur:', response.data);
            })
            .catch((error) => {
                console.error('Erreur lors de l\'envoi des données:', error);
            });
    });
    this.showflag();
}


  async getOneEventFromDb(id) {
    if (id) {
      try {
        const response = await axios.get(`http://localhost/event_solo/${id}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      console.error('ID non fourni');
      return null;
    }
  }

  async getMyEventFromDb() {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id);
    if (!isNaN(userId)) { 
      try {
        const response = await axios.get(`http://localhost/My_Event/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      console.error('ID non valide ou non fourni');
      return null;
    }
  }
  
  async renderAllMyEvent() {
    const eventData = await this.getMyEventFromDb();

    if (eventData && eventData.success && eventData.data) {
      eventData.data.forEach(event => {
        const mois = this.getMonthAbbreviation(event.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${event.image_base64}`;
        

        this.renderEvent(
          event.id,
          mois,
          event.date.split('-')[2],
          event.titre,
          event.description,
          event.prix,
          event.categorie,
          event.nbr_pers,
          event.country_name,
          event.country_icone,
          event.pays,
          event.acces,
          event.majorite,
          imageBase64
        );
      });
      this.getEventClicked();
    } else {
      console.error("Erreur lors de la récupération des événements depuis la base de données");
    }
  }

  deleteEvent(){

    
  }

  async getEventClicked() {
    document.addEventListener('click', async (clickEvent) => { 
      const card = clickEvent.target.closest('.event_card'); 
      if (card) {
        const eventId = card.getAttribute('data-id');
        console.log('ID de la carte cliquée :', eventId);
        if (eventId) {
          const eventData = await this.getOneEventFromDb(eventId);
          if (eventData && eventData.success) {
            const eventDetails = eventData.data;
            const imageBase64 = `data:image/jpeg;base64,${eventDetails.image_base64}`;
            this.renderCardEvent(
              eventDetails.date,
              eventDetails.titre,
              eventDetails.description,
              eventDetails.description_plus,
              eventDetails.ville,
              eventDetails.num_tel,
              eventDetails.email,
              eventDetails.prix,
              eventDetails.categorie,
              eventDetails.nbr_pers,
              eventDetails.country_name,
              eventDetails.country_icone,
              eventDetails.pays,
              eventDetails.acces,
              eventDetails.majorite,
              imageBase64,
              eventDetails.heure
            );
          } else {
            console.error('Données de l\'événement non trouvées');
          }
        } else {
          console.error('ID de la carte non trouvé');
        }
      }
    });
  }
  


  renderCardEvent(date, titre, description, description_plus, ville, num_tel, email, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image, heure) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventInfo = `
      ${event_banniere(titre, description, ville, pays, image)} 
      ${event_banniere_info(date, description_plus, num_tel, email, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, heure)} 
    `;
    if (rightContainer) {
      rightContainer.innerHTML = '';
      rightContainer.insertAdjacentHTML('beforeend', eventInfo);
      this.showflag();
    }
  }


  async getFirstEventClicked() {
    document.addEventListener('DOMContentLoaded', async () => {
      const eventData = await this.getOneEventFromDb();

      if (eventData && eventData.success && eventData.data && eventData.data.length > 0) {
        const firstEvent = eventData.data[0];
        const imageBase64 = `data:image/jpeg;base64,${firstEvent.image_base64}`;

        this.renderCardEvent(
          firstEvent.date,
          firstEvent.titre,
          firstEvent.description,
          firstEvent.description_plus,
          firstEvent.ville,
          firstEvent.num_tel,
          firstEvent.email,
          firstEvent.prix,
          firstEvent.categorie,
          firstEvent.nbr_pers,
          firstEvent.country_name,
          firstEvent.country_icone,
          firstEvent.pays,
          firstEvent.acces,
          firstEvent.majorite,
          imageBase64,
          firstEvent.heure
        );
  
        this.getEventClicked();
      } else {
        console.error('Aucun événement trouvé dans la base de données');
      }
    });
  }

  async getEventFromDb() {
    try {
      const response = await axios.get(`http://localhost/event`);
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  renderEvent(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventLiked(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_like(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventSup(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_delete(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }
  
  renderEventInscription(statut, id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    
    const eventElement = card_inscription(statut, id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
  
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    } else {
      console.error('Le conteneur de la page de l\'événement n\'a pas été trouvé.');
    }
  }

  renderEventInscription_status(statut, id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image, nom , prenom, premiere_lettre,id_inscription) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement =  card_inscrition_edit(statut, id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image, nom , prenom, premiere_lettre,id_inscription);
  
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    } else {
      console.error('Le conteneur de la page de l\'événement n\'a pas été trouvé.');
    }
  }

  
  async getEventInscription(){
    const userId = parseInt(JSON.parse(Cookies.get('user')).id);
    if (!isNaN(userId)) { 
      try {
        const response = await axios.get(`http://localhost/MyInscription/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      console.error('ID non valide ou non fourni');
      return null;
    }

  }

  async getEventInscription() {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id);
    if (!isNaN(userId)) { 
      try {
        const response = await axios.get(`http://localhost/MyInscription/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
      }
    } else {
      console.error('ID non valide ou non fourni');
      return null;
    }
  }
  
  async renderAllMyInscription() {
    const incriptionData = await this.getEventInscription();
  
    if (incriptionData && incriptionData.success && incriptionData.data && incriptionData.data.length > 0) {
      incriptionData.data.forEach(inscription => {
        const mois = this.getMonthAbbreviation(inscription.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${inscription.image_base64}`;
  
        this.renderEventInscription(
          inscription.statut,
          inscription.id,
          mois,
          inscription.date.split('-')[2],
          inscription.titre,
          inscription.description,
          inscription.prix,
          inscription.categorie,
          inscription.nbr_pers,
          inscription.country_name,
          inscription.country_icone,
          inscription.pays,
          inscription.acces,
          inscription.majorite,
          imageBase64
        );
      });
  
  
    } else {
      console.error('Aucun événement trouvé dans la base de données');
    }
  }
  
  getMonthAbbreviation(monthNumber) {
    switch (monthNumber) {
      case '01':
        return 'jan.';
      case '02':
        return 'févr.';
      case '03':
        return 'mars';
      case '04':
        return 'avr.';
      case '05':
        return 'mai';
      case '06':
        return 'juin';
      case '07':
        return 'juil.';
      case '08':
        return 'août';
      case '09':
        return 'sept.';
      case '10':
        return 'oct.';
      case '11':
        return 'nov.';
      case '12':
        return 'déc.';
      default:
        return '';
    }
  }

  async renderAllEvent() {
    const eventData = await this.getEventFromDb();

    if (eventData && eventData.success && eventData.data) {
      eventData.data.forEach(event => {
        const mois = this.getMonthAbbreviation(event.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${event.image_base64}`;
        

        this.renderEventLiked(
          event.id,
          mois,
          event.date.split('-')[2],
          event.titre,
          event.description,
          event.prix,
          event.categorie,
          event.nbr_pers,
          event.country_name,
          event.country_icone,
          event.pays,
          event.acces,
          event.majorite,
          imageBase64
        );
      });
      this.getEventClicked();
    } else {
      console.error("Erreur lors de la récupération des événements depuis la base de données");
    }
  }

  async deleteEvent(){
  }

  async invitePerson() {
    await this.renderUserChoice();
  
    const searchInput = document.getElementById('search');
    const personList = document.getElementById('personList');
    const persons = personList.getElementsByClassName('select_person');
    const noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = 'Aucun résultat trouvé';
    noResultsMessage.classList.add('no-results-message');
    
    searchInput.addEventListener('input', function() {
      const filter = searchInput.value.toLowerCase();
      let hasResults = false;
      Array.from(persons).forEach(function(person) {
        const name = person.querySelector('h3').textContent.toLowerCase();
        if (name.startsWith(filter)) {
          person.style.display = ''; // Show the person if it matches the search
          hasResults = true;
        } else {
          person.style.display = 'none'; // Hide the person if it doesn't match the search
        }
      });
  
      if (!hasResults) {
        if (!document.querySelector('.no-results-message')) {
          personList.appendChild(noResultsMessage);
        }
      } else {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
          personList.removeChild(existingMessage);
        }
      }
    });
  
    const checkbox = document.querySelector('.check_invie');
    const div = document.querySelector('.inter_per');
  
    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    });
  }
  

  async checkSession() {
    const sessionId = Cookies.get('session_id');
  
    if (!sessionId) {
      console.log('No session ID found');
      return false;
    }
  
    try {
      const response = await axios.get('http://localhost/authentification', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
  
      if (response.status === 200) {
        console.log('Session is valid');
        return true;
      } else {
        console.error('Invalid session');
        return false;
      }
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  }

  async UserDataRender() {
    const sessionValid = await this.checkSession(); // Vérification de la session
  
    let userInfo = {}; // Define userInfo object outside the try-catch block
  
    if (sessionValid) {
      // Récupérer les informations utilisateur des cookies
      const user = Cookies.get('user');
  
      if (user) {
        try {
          userInfo = JSON.parse(user);
        } catch (error) {
          console.error('Error parsing user info from cookies:', error);
        }
      } else {
        console.error('No user data found in cookies.');
      }
    } else {
      console.error('Session invalid or expired.');
    }
  
    return userInfo; // Return userInfo, even if it's empty due to errors
  }
  
  async  getUsersData() {
    try {
      const response = await axios.get('http://localhost/users');
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async renderUserChoice() {
    const users = await this.getUsersData();
    if (users) {
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('select_person');
  
        userDiv.innerHTML = `
          <label class="cl-checkbox">
            <input  type="checkbox" class="email_person_checkbox" value="${user.id}">
            <span></span>
          </label>
          <h3>${user.firstname}</h3>
          <p  class="email">(${user.email})</p>
        `;
  
        document.getElementById('personList').appendChild(userDiv);
      });
    }
  }

  async showMessageEditInscription(){
    document.addEventListener('click', async (clickEvent) => {
      const card = clickEvent.target.closest('.event_card');
      if (card) {
        if (clickEvent.target.classList.contains('fa-ellipsis-vertical')) {
          // Si les trois petits points sont cliqués, afficher/cacher les options supplémentaires
          const additionalOptions = card.querySelector('.additional_options');
          if (additionalOptions) {
            additionalOptions.style.display = additionalOptions.style.display === 'block' ? 'none' : 'block';
          }
        } else if (clickEvent.target.textContent === 'Se désinscrire') {
          // Si "Se désinscrire" est cliqué, exécuter une fonction dédiée
          await this.handleUnsubscribeEvent(card);
        } else if (clickEvent.target.textContent === 'Voir les détails') {
          // Si "Voir les détails" est cliqué, récupérer et afficher les détails de l'événement
          const eventId = card.getAttribute('data-id');
          if (eventId) {
            const eventData = await this.getOneEventFromDb(eventId);
            if (eventData && eventData.success) {
              const eventDetails = eventData.data;
              const imageBase64 = `data:image/jpeg;base64,${eventDetails.image_base64}`;
              this.renderCardEvent(
                eventDetails.date,
                eventDetails.titre,
                eventDetails.description,
                eventDetails.description_plus,
                eventDetails.ville,
                eventDetails.num_tel,
                eventDetails.email,
                eventDetails.prix,
                eventDetails.categorie,
                eventDetails.nbr_pers,
                eventDetails.country_name,
                eventDetails.country_icone,
                eventDetails.pays,
                eventDetails.acces,
                eventDetails.majorite,
                imageBase64,
                eventDetails.heure
              );
            } else {
              console.error('Données de l\'événement non trouvées');
            }
          } else {
            console.error('ID de la carte non trouvé');
          }
        }
      }
    });
    


  }

 async getEventAndStatusData(){
    const userId = parseInt(JSON.parse(Cookies.get('user')).id);
    if (!isNaN(userId)) { 
      try {
        const response = await axios.get(`http://localhost/Inscription_status/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
      }
    } else {
      console.error('ID non valide ou non fourni');
      return null;
    }
  }
 
 async RenderAllEventInscriptionStatus(){
  const incriptionStatusData = await this.getEventAndStatusData();
  
    if (incriptionStatusData && incriptionStatusData.success && incriptionStatusData.data && incriptionStatusData.data.length > 0) {
      incriptionStatusData.data.forEach(StatusData => {
        const mois = this.getMonthAbbreviation(StatusData.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${StatusData.image_base64}`;
  
        this.renderEventInscription_status(
          StatusData.statut,
          StatusData.id,
          mois,
          StatusData.date.split('-')[2],
          StatusData.titre,
          StatusData.description,
          StatusData.prix,
          StatusData.categorie,
          StatusData.nbr_pers,
          StatusData.country_name,
          StatusData.country_icone,
          StatusData.pays,
          StatusData.acces,
          StatusData.majorite,
          imageBase64,
          StatusData.participant_lastname , 
          StatusData.participant_firstname,
          StatusData.participant_firstname.charAt(0),
          StatusData.id_inscription
        );
      });
  
  
    } else {
      console.error('Aucun événement trouvé dans la base de données');
    }

  }


// Fonction générique pour mettre à jour le statut d'une inscription
async updateInscriptionStatus(statut, idInscription) {
  try {
      const data = { statut, idInscription };
      const response = await axios.post('http://localhost/UpdateStatu', data);
      console.log('Réponse du serveur :', response.data);
      return response.data; // Si vous avez besoin de manipuler la réponse dans votre application
  } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      throw error; // Gérer l'erreur ou la transmettre à un gestionnaire global
  }
}

// Fonction pour mettre à jour le statut depuis l'interface
async UpdateStatutEvent(idInscription) {
  const statutActuel = document.getElementById("statutActuel").textContent.trim();
  const selectElement = document.getElementById("etat");
  const statutChoisi = selectElement.options[selectElement.selectedIndex].value;

  if (statutChoisi === statutActuel) {
      alert("Veuillez choisir un statut différent pour modifier.");
      return;
  }

  try {
      await this.updateAndRefreshInscriptionStatus(statutChoisi, idInscription);
      document.getElementById("statutActuel").textContent = statutChoisi;
  } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Erreur lors de la mise à jour du statut. Veuillez réessayer.");
  }
}

// Fonction pour vérifier le statut et lancer la mise à jour
verifierStatut() {
  const submitButton = document.querySelector('.submitStatut');
  submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      const idInscription = submitButton.closest('.card_inscription_edit').dataset.inscriptionid;
      
      if (!idInscription) {
          console.error("ID d'inscription non trouvé");
          return;
      }
      
      const selectElement = document.getElementById("etat");
      const statutChoisi = selectElement.options[selectElement.selectedIndex].value;

      try {
          await this.updateAndRefreshInscriptionStatus(statutChoisi, idInscription);
      } catch (error) {
          console.error('Une erreur est survenue :', error);
          alert('Erreur lors de la mise à jour du statut.');
      }
  });
}

// Fonction pour mettre à jour et rafraîchir le statut d'une inscription
async updateAndRefreshInscriptionStatus(statut, idInscription) {
  try {
      await this.updateInscriptionStatus(statut, idInscription);
      await this.RenderAllEventInscriptionStatus(); // Réafficher la liste mise à jour
      alert('Statut mis à jour avec succès!');
  } catch (error) {
      console.error('Une erreur est survenue :', error);
      throw error; // Propagez l'erreur pour la gérer plus haut
  }
}



 async render() {
  const userInfo = await this.UserDataRender();
    const html = `
      <div class="dash_container">
        ${leftPart(userInfo)}
        ${rightPart(this.getDateEtHeureActuelles(), this.params)}
        <pre id="formResult" style="background: #f0f0f0; padding: 10px; margin-top: 20px;"></pre>
      </div>
    `;
    this.el.innerHTML = html;
    this.startAutoUpdate();
  }

 async run() {
    const sessionValid = await this.checkSession();
    if (sessionValid) {
        await this.render();
        this.getPageDashbord();
        this.showflag();
        this.getFirstEventClicked();
        this.invitePerson();
        this. showMessageEditInscription();

       
    } else {
        window.location.href = '/';
    }
  }
}

export default Dashbord;
