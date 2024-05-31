import $ from 'jquery';
import 'select2';
import axios from 'axios';
import leftPart from '../views/left_dash';
import rightPart from '../views/right_dash';
import card_like from '../views/card_like';
import form from '../views/form_creat_1';
import event_banniere from '../views/event_banniere';
import event_banniere_info from '../views/event_banniere_info';

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
    if (rightContainer) {
      rightContainer.innerHTML = '';
    }
  
    switch (this.params) {
      case 'accueil':
        rightContainer.innerHTML = '<p>Contenu de la page Accueil</p>';
        break;
      case 'compte':
        rightContainer.innerHTML = '<p>Contenu de la page Mon compte</p>';
        break;
      case 'evenements':
        rightContainer.innerHTML = '<p>Contenu de la page Événements</p>';
        break;
      case 'favoris':
        await this.renderAllEvent();
        break;
      case 'nouvel_evenement':
        rightContainer.innerHTML = `${form()}`;
        this.collectAndSendDataForm();
        this.showflag();
        break;
      case 'modifier_evenement':
        rightContainer.innerHTML = '<p>Contenu de la page Modifier un événement</p>';
        break;
      case 'supprimer_evenement':
        rightContainer.innerHTML = '<p>Contenu de la page Supprimer un événement</p>';
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

  async getEventClicked() {
    document.addEventListener('DOMContentLoaded', () => {
      const eventContainer = document.querySelector('.dashbord_container_page_my_event');
      if (eventContainer) {
        eventContainer.addEventListener('click', async (event) => {
          const card = event.target.closest('.event_card');
          if (card) {
            const eventId = card.getAttribute('data-id');
            if (eventId) {
              const eventData = await this.getOneEventFromDb(eventId);
              if (eventData && eventData.success) {
                const event = eventData.data;
                const imageBase64 = `data:image/jpeg;base64,${event.image_base64}`;
                this.renderCardEvent(
                  event.date,
                  event.titre,
                  event.description,
                  event.description_plus,
                  event.ville,
                  event.num_tel,
                  event.email,
                  event.prix,
                  event.categorie,
                  event.nbr_pers,
                  event.country_name,
                  event.country_icone,
                  event.pays,
                  event.acces,
                  event.majorite,
                  imageBase64,
                  event.heure
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
        console.error("Aucun événement trouvé dans la base de données");
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
    const eventElement = card_like(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
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

  render() {
    const html = `
      <div class="dash_container">
        ${leftPart()}
        ${rightPart(this.getDateEtHeureActuelles(), this.params)}
        <pre id="formResult" style="background: #f0f0f0; padding: 10px; margin-top: 20px;"></pre>
      </div>
    `;
    this.el.innerHTML = html;
    this.startAutoUpdate();
  }

  run() {
    this.render();
    this.getPageDashbord();
    this.showflag();
    this.getEventClicked();
  }
}

export default Dashbord;
