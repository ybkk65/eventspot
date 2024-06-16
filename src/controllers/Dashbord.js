import Cookies from 'js-cookie';
import axios from 'axios';
import $ from 'jquery';
import 'select2';
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
import editForm from '../views/editForm';
import card_modif from '../views/card_modif';
import UpdateUserDataForm from '../views/UpdateUserDataForm';

class Dashbord {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params.page || 'accueil';
    this.errors = [];
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
      case 'compte':
        rightContainer.innerHTML = `${UpdateUserDataForm(this.renderActualDataUserInForm())}`;
        this.toggleFormVisibility();
        this.detectSendFormModifUser();
        break;
      case 'evenements':
        this.renderAllMyEvent();
        this.getEventClicked();
        break;
      case 'gerer_inscription':
        await this.RenderAllEventInscriptionStatus();
        this.bindEventListeners();
        break;
      case 'inscription':
        this.renderAllMyInscription();
        break;
      case 'favoris':
        await this.renderAllEvent();
        break;
      case 'nouvel_evenement':
        rightContainer.innerHTML = `${form()}`;
        this.showflag();
        this.collectAndSendDataForm();
        this.invitePerson();
        this.modifyValuePrice();
        this.modifyValue();
        break;
      case 'modifier_evenement':
        await this.renderAllEventEdit();
        this.checkIfClickModif();
        break;
      case 'supprimer_evenement':
        await this.renderSupMyEvent();
        this.checkIfClickSup();
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
      axios.post('http://localhost/event', formData, {})
        .then((response) => {
          this.errors.push('Réponse du serveur:', response.data);
        })
        .catch((error) => {
          this.errors.push('Erreur lors de l\'envoi des données:', error);
        });
    });
    this.showflag();
    this.modifyValuePrice();
    this.modifyValue();
  }

  modifyValue() {
    const inputField = document.getElementById('nombre-personne');
    const btnPlus = document.getElementById('btn-plus_p');
    const btnMinus = document.getElementById('btn-minus_p');
    btnPlus.addEventListener('click', () => {
      const currentValue = parseInt(inputField.value, 10);
      if (!Number.isNaN(currentValue)) {
        inputField.value = currentValue + 1;
      } else {
        inputField.value = 1;
      }
    });
    btnMinus.addEventListener('click', () => {
      const currentValue = parseInt(inputField.value, 10);
      if (!Number.isNaN(currentValue) && currentValue > 0) {
        inputField.value = currentValue - 1;
      } else {
        inputField.value = 0;
      }
    });
  }

  modifyValuePrice() {
    const inputField = document.getElementById('prix_value');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    btnPlus.addEventListener('click', () => {
      const currentValue = parseInt(inputField.value, 10);
      if (!Number.isNaN(currentValue)) {
        inputField.value = currentValue + 1;
      } else {
        inputField.value = 1;
      }
    });
    btnMinus.addEventListener('click', () => {
      const currentValue = parseInt(inputField.value, 10);
      if (!Number.isNaN(currentValue) && currentValue > 0) {
        inputField.value = currentValue - 1;
      } else {
        inputField.value = 0;
      }
    });
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
        this.errors.push(error);
        return null;
      }
    } else {
      this.errors.push('ID non fourni');
      return null;
    }
  }

  async getMyEventFromDb() {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
    if (!Number.isNaN(userId)) {
      try {
        const response = await axios.get(`http://localhost/My_Event/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        this.errors.push(error);
        return null;
      }
    } else {
      this.errors.push('ID non valide ou non fourni');
      return null;
    }
  }

  async renderAllMyEvent() {
    const eventData = await this.getMyEventFromDb();
    if (eventData && eventData.success && eventData.data) {
      eventData.data.forEach((event) => {
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
      this.errors.push('Erreur lors de la récupération des événements depuis la base de données');
    }
  }

  async renderAllEventEdit() {
    const eventData = await this.getMyEventFromDb();
    if (eventData && eventData.success && eventData.data) {
      eventData.data.forEach((event) => {
        const mois = this.getMonthAbbreviation(event.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${event.image_base64}`;
        this.renderEventModif(
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
    } else {
      this.errors.push('Erreur lors de la récupération des événements depuis la base de données');
    }
  }

  async renderSupMyEvent() {
    const eventData = await this.getMyEventFromDb();
    if (eventData && eventData.success && eventData.data) {
      eventData.data.forEach((event) => {
        const mois = this.getMonthAbbreviation(event.date.split('-')[1]);
        const imageBase64 = `data:image/jpeg;base64,${event.image_base64}`;
        this.renderEventSup(
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
    } else {
      this.errors.push('Erreur lors de la récupération des événements depuis la base de données');
    }
  }

  async checkIfClickSup() {
    const deleteButtons = document.querySelectorAll('.event_icons .deleteEvent');
    if (deleteButtons.length > 0) {
      deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const eventCard = event.target.closest('.event_card');
          if (eventCard) {
            const dataId = eventCard.getAttribute('data-id');
            await this.deleteEvent(dataId);
          } else {
            this.errors.push('Élément parent non trouvé.');
          }
        });
      });
    } else {
      this.errors.push('No elements found with the specified classes.');
    }
  }

  async checkIfClickModif() {
    const modifyButtons = document.querySelectorAll('.event_icons .modifEvent');

    if (modifyButtons.length > 0) {
      modifyButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const eventCard = event.target.closest('.event_card');

          if (eventCard) {
            const dataId = eventCard.getAttribute('data-id');
            const rightContainer = document.querySelector('.dashbord_container_page_my_event');
            rightContainer.innerHTML = '';

            const eventData = await this.getOneEventFromDb(dataId);

            if (eventData && eventData.success) {
              const eventDetails = eventData.data;
              rightContainer.innerHTML = editForm(
                eventDetails.titre,
                eventDetails.description,
                eventDetails.description_plus,
                eventDetails.categorie
              );
              this.newModifForm(dataId);
            } else {
              this.errors.push('Failed to fetch event data or success flag is false.');
            }
          } else {
            this.errors.push('Élément parent non trouvé.');
          }
        });
      });
    } else {
      this.errors.push('No elements found with the specified classes.');
    }
  }

  async newModifForm(dataId) {
    document.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      try {
        const response = await axios.post(`http://localhost/EditEvent/${dataId}`, formDataObject);
        this.errors.push('Réponse du serveur:', response.data);
      } catch (error) {
        this.errors.push('Erreur lors de l\'envoi des données:', error);
      }
    });
  }

  async deleteEvent(eventId) {
    try {
      const response = await axios.delete(`http://localhost/Supprimer/${eventId}`);
      this.errors.push('Événement supprimé:', response.data);
      const eventCard = document.querySelector(`.event_card[data-id="${eventId}"]`);
      if (eventCard) {
        eventCard.remove();
      }
    } catch (error) {
      this.errors.push('Erreur lors de la suppression de l\'événement:', error);
    }
  }

  async getEventClicked() {
    document.addEventListener('click', async (clickEvent) => {
      const clickedCard = clickEvent.target.closest('.event_card'); // Rename 'card' to 'clickedCard'
      if (clickedCard) {
        const eventId = clickedCard.getAttribute('data-id');
        this.errors.push('ID de la carte cliquée :', eventId);
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
            this.errors.push('Données de l\'événement non trouvées');
          }
        } else {
          this.errors.push('ID de la carte non trouvé');
        }
      }
    });
  }

  renderCardEvent(
    date,
    titre,
    description,
    description_plus,
    ville,
    num_tel,
    email,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image,
    heure
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventInfo = `
      ${event_banniere(titre, description, ville, pays, image)}
      ${event_banniere_info(
    date,
    description_plus,
    num_tel,
    email,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    heure
  )}
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
        this.errors.push('Aucun événement trouvé dans la base de données');
      }
    });
  }

  async getEventFromDb() {
    try {
      const response = await axios.get('http://localhost/event');
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      this.errors.push(error);
      return null;
    }
  }

  renderEvent(
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card(
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventLiked(
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_like(
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventSup(
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_delete(
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventModif(
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_modif(
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  renderEventInscription(
    statut,
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_inscription(
      statut,
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    } else {
      this.errors.push('Le conteneur de la page de l\'événement n\'a pas été trouvé.');
    }
  }

  renderEventInscription_status(
    statut,
    id,
    mois,
    jour,
    titre,
    description,
    prix,
    categorie,
    nbr_pers,
    country_name,
    country_icone,
    pays,
    acces,
    majorite,
    image,
    nom,
    prenom,
    premiere_lettre,
    id_inscription
  ) {
    const rightContainer = document.querySelector('.dashbord_container_page_my_event');
    const eventElement = card_inscrition_edit(
      statut,
      id,
      mois,
      jour,
      titre,
      description,
      prix,
      categorie,
      nbr_pers,
      country_name,
      country_icone,
      pays,
      acces,
      majorite,
      image,
      nom,
      prenom,
      premiere_lettre,
      id_inscription
    );
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    } else {
      this.errors.push('Le conteneur de la page de l\'événement n\'a pas été trouvé.');
    }
  }

  async getEventInscription() {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
    if (!Number.isNaN(userId)) {
      try {
        const response = await axios.get(`http://localhost/MyInscription/${userId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        this.errors.push(error);
        return null;
      }
    } else {
      this.errors.push('ID non valide ou non fourni');
      return null;
    }
  }

  async renderAllMyInscription() {
    const incriptionData = await this.getEventInscription();
    if (incriptionData && incriptionData.success) {
      if (incriptionData.data && incriptionData.data.length > 0) {
        incriptionData.data.forEach((inscription) => {
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
        this.errors.push('Aucun événement trouvé dans la base de données');
      }
    } else {
      this.errors.push('Erreur lors de la récupération des événements');
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
      eventData.data.forEach((event) => {
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
      this.errors.push('Erreur lors de la récupération des événements depuis la base de données');
    }
  }

  async invitePerson() {
    await this.renderUserChoice();
    const searchInput = document.getElementById('search');
    const personList = document.getElementById('personList');
    const persons = personList.getElementsByClassName('select_person');
    const noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = 'Aucun résultat trouvé';
    noResultsMessage.classList.add('no-results-message');
    searchInput.addEventListener('input', () => {
      const filter = searchInput.value.toLowerCase();
      let hasResults = false;
      Array.from(persons).forEach((personElement) => {
        const name = personElement.querySelector('h3').textContent.toLowerCase();
        if (name.startsWith(filter)) {
          personElement.classList.remove('hidden');
          hasResults = true;
        } else {
          personElement.classList.add('hidden');
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
    checkbox.addEventListener('change', () => {
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
      this.errors.push('No session ID found');
      return false;
    }
    try {
      const response = await axios.get('http://localhost/authentification', {
        headers: {
          Authorization: `Bearer ${sessionId}`
        }
      });
      if (response.status === 200) {
        this.errors.push('Session is valid');
        return true;
      }
      this.errors.push('Invalid session');
      return false;
    } catch (error) {
      this.errors.push('Error checking session:', error);
      return false;
    }
  }

  async UserDataRender() {
    const sessionValid = await this.checkSession();
    let userInfo = {};
    if (sessionValid) {
      const user = Cookies.get('user');
      if (user) {
        try {
          userInfo = JSON.parse(user);
        } catch (error) {
          this.errors.push('Error parsing user info from cookies:', error);
        }
      } else {
        this.errors.push('No user data found in cookies.');
      }
    } else {
      this.errors.push('Session invalid or expired.');
    }
    return userInfo;
  }

  async getUsersData() {
    try {
      const response = await axios.get('http://localhost/users');
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      this.errors.push(error);
      return null;
    }
  }

  async renderUserChoice() {
    const users = await this.getUsersData();
    if (users) {
      users.forEach((user) => {
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

  async showMessageEditInscription() {
    document.addEventListener('click', async (clickEvent) => {
      const clickedCard = clickEvent.target.closest('.event_card');
      if (clickedCard) {
        if (clickEvent.target.classList.contains('fa-ellipsis-vertical')) {
          const additionalOptions = clickedCard.querySelector('.additional_options');
          if (additionalOptions) {
            additionalOptions.style.display = additionalOptions.style.display === 'block' ? 'none' : 'block';
          }
        } else if (clickEvent.target.textContent === 'Se désinscrire') {
          const eventId = clickedCard.getAttribute('data-id');
          if (eventId) {
            await this.handleUnsubscribeEvent(eventId);
          } else {
            this.errors.push('ID de la carte non trouvé');
          }
        } else if (clickEvent.target.textContent === 'Voir les détails') {
          const eventId = clickedCard.getAttribute('data-id');
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
              this.errors.push('Données de l\'événement non trouvées');
            }
          } else {
            this.errors.push('ID de la carte non trouvé');
          }
        }
      }
    });
  }

  async handleUnsubscribeEvent(eventId) {
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('User cookie not found');
      }
      const userId = parseInt(JSON.parse(userCookie).id, 10);
      const response = await axios.delete(`http://localhost/DeleteInscription/${eventId}`, {
        data: { userId }
      });
      this.errors.push('Désinscription réussie', response.data);
      const rightContainer = document.querySelector('.dashbord_container_page_my_event');
      rightContainer.innerHTML = '';
      this.renderAllMyInscription();
    } catch (error) {
      if (error.response) {
        this.errors.push('Erreur lors de la désinscription :', error.response.data.message);
      } else {
        this.errors.push('Erreur lors de la désinscription :', error.message);
      }
    }
  }

  async getEventAndStatusData() {
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('Cookie utilisateur non trouvé');
      }
      const userId = parseInt(JSON.parse(userCookie).id, 10);
      if (Number.isNaN(userId)) {
        throw new Error('ID non valide ou non fourni');
      }
      const response = await axios.get(`http://localhost/Inscription_status/${userId}`);
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      this.errors.push('Erreur lors de la récupération des données:', error.message);
      return null;
    }
  }

  async RenderAllEventInscriptionStatus() {
    const incriptionStatusData = await this.getEventAndStatusData();
    if (incriptionStatusData && incriptionStatusData.success) {
      if (incriptionStatusData.data && incriptionStatusData.data.length > 0) {
        incriptionStatusData.data.forEach((StatusData) => {
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
            StatusData.participant_lastname,
            StatusData.participant_firstname,
            StatusData.participant_firstname.charAt(0),
            StatusData.id_inscription
          );
        });
      } else {
        this.errors.push('Aucun événement trouvé dans la base de données');
      }
    } else {
      this.errors.push('Erreur lors de la récupération des événements');
    }
  }

  async updateInscriptionStatus(statut, idInscription) {
    try {
      const data = { statut, idInscription };
      const response = await axios.post('http://localhost/UpdateStatu', data);
      this.errors.push('Réponse du serveur :', response.data);
      return response.data;
    } catch (error) {
      this.errors.push('Erreur lors de la mise à jour du statut :', error);
      throw error;
    }
  }

  async updateAndRefreshInscriptionStatus(statut, idInscription) {
    try {
      const rightContainer = document.querySelector('.dashbord_container_page_my_event');
      rightContainer.textContent = '';
      await this.updateInscriptionStatus(statut, idInscription);
      await this.RenderAllEventInscriptionStatus();
    } catch (error) {
      this.errors.push('Une erreur est survenue :', error);
      throw error;
    }
  }

  bindEventListeners() {
    this.el.addEventListener('click', async (event) => {
      if (event.target.classList.contains('submitStatut')) {
        event.preventDefault();
        const idInscription = event.target.dataset.inscriptionid;
        const selectElement = document.getElementById(`etat_${idInscription}`);
        if (!selectElement) {
          this.errors.push('Élément select non trouvé pour l\'inscription ID :', idInscription);
          return;
        }
        const statutChoisi = selectElement.value;
        try {
          await this.updateAndRefreshInscriptionStatus(statutChoisi, idInscription);
          const statutActuelElement = document.querySelector(`.statutActuel_${idInscription}`);
          if (statutActuelElement) {
            statutActuelElement.textContent = statutChoisi;
            statutActuelElement.className = `statutActuel_${idInscription} ${statutChoisi}`;
          }
        } catch (error) {
          this.errors.push('Une erreur est survenue :', error);
          this.errors.push('Erreur lors de la mise à jour du statut.');
        }
      }
    });
  }

  toggleFormVisibility() {
    document.querySelectorAll('.header-wrapper').forEach((headerWrapper) => {
      const formu = headerWrapper.nextElementSibling;
      const chevronIcon = headerWrapper.querySelector('i');
      headerWrapper.addEventListener('click', () => {
        const isHidden = formu.style.display === 'none';
        formu.style.display = isHidden ? 'block' : 'none';
        chevronIcon.classList.toggle('fa-chevron-down', !isHidden);
        chevronIcon.classList.toggle('fa-chevron-up', isHidden);
      });
    });
  }

  renderActualDataUserInForm() {
    const user = Cookies.get('user');
    const userInfo = user ? JSON.parse(user) : {};
    return userInfo;
  }

  detectSendFormModifUser() {
    const forms = document.querySelectorAll('form');
    const errorContainer = document.querySelector('#errordatauser');
    forms.forEach((formElement) => {
      formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        const errors = this.validateFormData(formDataObject, formElement.id);
        this.errors.push(formDataObject);
        if (errors.length === 0) {
          try {
            await this.sendFormData(formElement.id, formDataObject);
          } catch (error) {
            this.errors.push('Erreur lors de l\'envoi des données:', error);
          }
        } else {
          errorContainer.innerHTML = errors.map((error) => `<p>${error}</p>`).join('');
        }
      });
    });
  }

  validateFormData(data, formId) {
    const errors = [];
    let emailPattern;
    switch (formId) {
      case 'nameForm':
        if (!data.firstName || data.firstName.trim() === '') {
          errors.push('Le prénom est requis.');
        }
        if (!data.lastName || data.lastName.trim() === '') {
          errors.push('Le nom est requis.');
        }
        break;
      case 'emailForm':
        emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailPattern.test(data.email)) {
          errors.push('Un email valide est requis.');
        }
        break;
      case 'passwordForm':
        if (!data.password || data.password.length < 8) {
          errors.push('Le mot de passe doit comporter au moins 8 caractères.');
        } else {
          const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
          if (!passwordPattern.test(data.password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre majuscule et un caractère spécial.');
          }
        }
        if (data.password !== data.confirmPassword) {
          errors.push('Les mots de passe ne correspondent pas.');
        }
        break;
      default:
        errors.push('Formulaire non reconnu.');
    }
    return errors;
  }

  async sendFormData(formId, data) {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
    let url = '';
    if (formId === 'nameForm') {
      url = `http://localhost/EditUserName/${userId}`;
    } else if (formId === 'emailForm') {
      url = `http://localhost/EditUserEmail/${userId}`;
    } else if (formId === 'passwordForm') {
      url = `http://localhost/EditUserPassword/${userId}`;
    } else {
      throw new Error('Formulaire non reconnu');
    }
    try {
      const response = await axios.post(url, data);
      this.errors.push('Réponse du serveur:', response.data);
      this.ModifCookies();
    } catch (error) {
      this.errors.push('Erreur lors de l\'envoi des données:', error);
    }
  }

  async getOneUser() {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
    try {
      const response = await axios.get(`http://localhost/OneUser/${userId}`);
      if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des données de l\'API');
      }
      return response.data;
    } catch (error) {
      this.errors.push(error);
      return null;
    }
  }

  async ModifCookies() {
    try {
      const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
      const userData = await this.getOneUser(userId);
      if (userData) {
        const user = {
          id: userData.id,
          nom: userData.lastname,
          prenom: userData.firstname,
          email: userData.email
        };
        Cookies.remove('user');
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        const rightContainer = document.querySelector('.dashbord_container_page_my_event');
        rightContainer.innerHTML = '';
        rightContainer.innerHTML = `${UpdateUserDataForm(user)}`;
      } else {
        throw new Error('Impossible de récupérer les données utilisateur après la mise à jour');
      }
    } catch (error) {
      this.errors.push(error);
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
    this.showflag();
  }

  async run() {
    const sessionValid = await this.checkSession();
    if (sessionValid) {
      await this.render();
      this.getPageDashbord();
      this.showflag();
      this.getFirstEventClicked();
      this.showMessageEditInscription();
      this.bindEventListeners();
    } else {
      window.location.href = '/';
    }
  }
}

export default Dashbord;
