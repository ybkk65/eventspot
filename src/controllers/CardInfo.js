import card from '../views/card';
import nav from '../views/nav';
import nav_connected from '../views/nav_connected';
import footer from '../views/footer';
import event_banniere_info from '../views/event_banniere_info';
import event_banniere from '../views/event_banniere';
import $ from 'jquery';
import 'select2';
import axios from 'axios';
import Cookies from 'js-cookie';

class CardInfo {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params.eventCards;
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

  cardInfo() {
    document.addEventListener('click', (clickEvent) => {
      const card = clickEvent.target.closest('.event_card');
      if (card) {
        const eventId = card.getAttribute('data-id');
        window.location.href = `/card-info?eventCards=${eventId}`;
      }
    });
  }

  async getOneEventFromDb(eventId) {
    if (eventId) {
      try {
        const response = await axios.get(`http://localhost/event_solo/${eventId}`);
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

  renderCardEvent(date, titre, description, description_plus, ville, num_tel, email, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image, heure) {
    return `
      ${event_banniere(titre, description, ville, pays, image)} 
      ${event_banniere_info(date, description_plus, num_tel, email, prix, categorie, nbr_pers, ville, country_icone, pays, acces, majorite, heure)} 
    `;
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

  async getFirstEventClicked() {
    document.addEventListener('DOMContentLoaded', async () => {
      const eventData = await this.getOneEventFromDb(this.params);

      if (eventData && eventData.success && eventData.data) {
        const firstEvent = eventData.data;
        const imageBase64 = `data:image/jpeg;base64,${firstEvent.image_base64}`;

        return this.renderCardEvent(
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
      } else {
        console.error('Aucun événement trouvé dans la base de données');
      }
    });
  }

  async checkInscriptionStatut(event_id, userId) {
    let success = false;
    try {
      const response = await axios.get('http://localhost/inscription', {
        params: {
          event_id: event_id,
          userId: userId
        }
      });
      
      if (response.data && response.data.success) {
        success = true;
      } else {
        success = false;
      }
    } catch (error) {
      success = false;
      console.error('Erreur lors de la vérification de l\'inscription:', error);
    }
    
    return success;
  }
  

  verifyButtonInscription() {
    const addFavBtn = document.querySelector('.add_fav');
    addFavBtn.addEventListener('click', async () => {
      if (addFavBtn) {
        const userId = Cookies.get('user') ? JSON.parse(Cookies.get('user')).id : null;
        const acces = await this.checkInscriptionStatut(this.params, userId);
  
        if (acces) {
          console.log('Bouton cliqué');
          const event_id = this.params;
          const user = Cookies.get('user');
          const userId = user ? JSON.parse(user).id : null;
          const result = await this.sendInscriptionToApi(event_id, userId);
          if (result.success) {
            alert(result.success.message);
          } else if (result.error) {
            alert(result.error.message);
          }
        } 
      } 
    });
  }

  renderCorrectButton(choix){
    if (choix == true){
      return ` <div class="add_fav">
        <button class="add_fav_btn"><i class="fa-regular fa-square-plus"></i> S'inscrire</button>
      </div> `;
    }else {
      return ` <div class="add_fav">
        <button class="add_fav_btn"><i class="fa-solid fa-check"></i> Déjà inscrit</button>
      </div> `;
    }
  }

  async sendInscriptionToApi(event_id, userId) {
    if (!event_id || !userId) {
      console.error('ID non fourni');
      return null;
    }

    try {
      const response = await axios.post(`http://localhost/inscription`, {
        event_id,
        userId
      });
      if (response.status !== 200) {
        throw new Error('Erreur lors de l\'inscription');
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
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
          console.error('Error parsing user info from cookies:', error);
        }
      }
     
      navContent = nav_connected(userInfo);
    } else {
      navContent = nav();
    }
    
    const eventData = await this.getOneEventFromDb(this.params);
  
    if (eventData && eventData.success && eventData.data) {
      const firstEvent = eventData.data;
      const imageBase64 = `data:image/jpeg;base64,${firstEvent.image_base64}`;
  
      const eventHtml = this.renderCardEvent(
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
  
      const userId = Cookies.get('user') ? JSON.parse(Cookies.get('user')).id : null;
      const acces = await this.checkInscriptionStatut(this.params, userId);
  
      const button = this.renderCorrectButton(acces);
  
      const html = `
        <div class="container_index">
          <header>
            ${navContent}
          </header>
          <div class="dashbord_container_page_my_event">
            ${eventHtml}
          </div>
          ${button}
        </div>
        <section class="event_may_like">
          <div class="container_index">
            <div class="t_filter">
              <div class="event_Title">
                <h2>You May Like</h2>
              </div>
            </div>
            <div class="event_container_may_like">
              ${card()}
              ${card()}
              ${card()}
            </div>
          </div>
          <div class="espace"></div>
        </section>
        ${footer()}
      `;
  
      this.el.innerHTML = html;
    } else {
      console.error('Aucun événement trouvé dans la base de données');
    }
  }

  async run() {
    await this.render();
    this.cardInfo();
    this.verifyButtonInscription();
  }
}

export default CardInfo;
