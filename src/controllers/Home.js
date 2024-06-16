import $ from 'jquery';
import Cookies from 'js-cookie';
import axios from 'axios';
import 'select2';
import footer from '../views/footer';
import searchBarHome from '../views/searchBarHome';
import nav from '../views/nav';
import nav_connected from '../views/nav_connected';
import banniere from '../assets/image/banniere_home.png';
import card from '../views/card';

class Home {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.errors = [];
    this.lastEventId = null;
    this.run();
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
      this.errors.pusherror('Invalid session');
      return false;
    } catch (error) {
      this.errors.pusherror('Error checking session:', error);
      return false;
    }
  }

  setupEventListeners() {
    const nameInfoLog = document.getElementById('nameInfoLog');
    const imgPg = document.getElementById('imgPg');
    const chevronIcon = document.getElementById('chevronIcon');
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
      const cardclick = clickEvent.target.closest('.event_card');
      if (cardclick) {
        const eventId = cardclick.getAttribute('data-id');
        window.location.href = `/card-info?eventCards=${eventId}`;
      }
    });
  }

  async getEventClicked() {
    document.addEventListener('click', async (clickEvent) => {
      const clickedCard = clickEvent.target.closest('.event_card'); // Renommer 'card' en 'clickedCard'
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
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      try {
        const response = await axios.get('http://localhost/event');
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        this.errors.push('Erreur lors de la récupération des données:', error);
        return null;
      }
    } else {
      try {
        const userInfo = JSON.parse(userCookie);
        const userId = parseInt(userInfo.id, 10);
        if (!Number.isNaN(userId)) {
          try {
            const response = await axios.get(`http://localhost/Recent_event/${userId}`);
            if (response.status !== 200) {
              throw new Error('Erreur lors de la récupération des données de l\'API');
            }
            return response.data;
          } catch (error) {
            this.errors.push('Erreur lors de la récupération des données:', error);
            return null;
          }
        } else {
          this.errors.push('ID non valide ou non fourni');
          return null;
        }
      } catch (error) {
        this.errors.push('Error parsing user info from cookies:', error);
        return null;
      }
    }
  }

  async renderAllRecentEvent() {
    const eventData = await this.getEventFromDb();
    if (eventData && eventData.success && eventData.data && eventData.data.length > 0) {
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
      this.lastEventId = eventData.data[eventData.data.length - 1].id;
      this.getEventClicked();
    } else {
      const noEventsMessage = this.el.querySelector('.no_events_message');
      if (noEventsMessage) {
        noEventsMessage.style.display = 'block';
      }
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
    const rightContainer = document.querySelector('.event_container');
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

  async render() {
    let navContent = '';
    const sessionValid = await this.checkSession();
    if (sessionValid) {
      const user = Cookies.get('user');
      let userInfo = {};
      if (user) {
        try {
          userInfo = JSON.parse(user);
        } catch (error) {
          this.errors.pusherror('Error parsing user info from cookies:', error);
        }
      }

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
          <div class="no_events_message" style="display: none;">
        Aucun événement supplémentaire disponible pour le moment.
      </div>
        </section>
      </div>
      ${footer()}
    `;
    this.el.innerHTML = html;
    this.setupEventListeners();
  }

  async getRecentEventsAfterId(lastEventId) {
    const userId = parseInt(JSON.parse(Cookies.get('user')).id, 10);
    if (!Number.isNaN(userId)) {
      try {
        const response = await axios.get(`http://localhost/Recent_event_after/${userId}/${lastEventId}`);
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.data;
      } catch (error) {
        this.errors.push('Erreur lors de la récupération des données:', error);
        return null;
      }
    } else {
      this.errors.push('ID non valide ou non fourni');
      return null;
    }
  }

  async renderMoreRecentEvents() {
    const eventData = await this.getRecentEventsAfterId(this.lastEventId);
    if (eventData && eventData.success && eventData.data && eventData.data.length > 0) {
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
      this.lastEventId = eventData.data[eventData.data.length - 1].id;
      this.getEventClicked();
    } else {
      const noEventsMessage = this.el.querySelector('.no_events_message');
      if (noEventsMessage) {
        noEventsMessage.style.display = 'block';
      }
    }
  }

  async listenerMoreEvent() {
    const moreButton = this.el.querySelector('.more_button button');
    moreButton.addEventListener('click', async () => {
      await this.renderMoreRecentEvents();
    });
  }

  async run() {
    await this.render();
    await this.renderAllRecentEvent();
    this.cardInfo();
    this.listenerMoreEvent();
  }
}

export default Home;
