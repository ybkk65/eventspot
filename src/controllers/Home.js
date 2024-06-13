import $ from 'jquery';
import 'select2';
import footer from '../views/footer';
import searchBarHome from '../views/searchBarHome';
import nav from '../views/nav';
import nav_connected from '../views/nav_connected';
import banniere from '../assets/image/banniere_home.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import card from '../views/card';

class Home {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
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


  setupEventListeners() {
    const nameInfoLog = document.getElementById('nameInfoLog');
    const imgPg = document.getElementById('imgPg');
    const chevronIcon = document.getElementById('chevronIcon');

    // Ajout d'un écouteur d'événements sur le clic pour nameInfoLog
    if (nameInfoLog) {
      nameInfoLog.addEventListener('click', () => {
        imgPg.classList.toggle('show');
        chevronIcon.classList.toggle('fa-chevron-down');
        chevronIcon.classList.toggle('fa-chevron-up');
      });
    }
  }

  cardInfo() {
    document.addEventListener('click', async (clickEvent) => {
      const card = clickEvent.target.closest('.event_card');
      if (card) {
        const eventId = card.getAttribute('data-id');
        window.location.href = `/card-info?eventCards=${eventId}`;
      }
    });
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
  
  async getEventFromDb() {
 
    const userId = parseInt(JSON.parse(Cookies.get('user')).id);
    if (!isNaN(userId)) { 
      try {
        const response = await axios.get(`http://localhost/Recent_event/${userId}`);
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

  async renderAllRecentEvent() {
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

  renderEvent(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) {
    const rightContainer = document.querySelector('.event_container');
    const eventElement = card(id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image);
    if (rightContainer) {
      rightContainer.insertAdjacentHTML('beforeend', eventElement);
      this.showflag();
    }
  }

  async render() {
    let navContent = ''; // Initialisation de navContent

    const sessionValid = await this.checkSession(); // Vérification de la session

    if (sessionValid) {
      // Récupérer les informations utilisateur des cookies
      const user = Cookies.get('user');
      let userInfo = {};

      if (user) {
        try {
          userInfo = JSON.parse(user);
        } catch (error) {
          console.error('Error parsing user info from cookies:', error);
        }
      }

      // Passer les informations utilisateur à nav_connected
      navContent = nav_connected(userInfo);
    } else {
      navContent = nav();
    }

    const html = `
      <div class="container_index">
        <header>
          ${navContent}
          <div class="fond">
            <img src="${banniere}" alt="">
            <h2>Discover, plan, and experience <br>unforgettable moments with EventSpot!</h2>
          </div>
        </header>
        ${searchBarHome()}
        <section class="event">
          <div class="t_filter">
            <div class="event_Title">
              <h2>Événements à venir</h2>
            </div>
          </div>
          <div class="event_container">
          </div>
          <div class="more_button">
            <button>Load More Event</button>
          </div>
        </section>
      </div>
      ${footer()}
    `;
    this.el.innerHTML = html;

    this.setupEventListeners(); // Appel de la méthode pour configurer les écouteurs d'événements
  }
  async run() {
    await this.render();
    await this.renderAllRecentEvent();
    this.cardInfo();
   
  }
}

export default Home;
