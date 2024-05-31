import card from '../views/card';
import nav from '../views/nav';
import footer from '../views/footer';
import cardInfo from '../views/event_banniere_info';
import cardInfotop from '../views/event_banniere';

class CardInfo {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  render() {
    const html = `
      <div class="container_index">
        <header>
          ${nav()}
        </header>
        
        ${cardInfotop()}
        
        ${cardInfo()}
        <div class="add_fav">
        <button class="add_fav_btn"><i class="fa-regular fa-bookmark"></i>Ajouter au favoris</button>
      </div>
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
  }

  cardInfo() {
    const eventCards = document.querySelectorAll('.event_card');

    eventCards.forEach((cardElement) => {
      cardElement.addEventListener('click', () => {
        window.location.href = '/card-info';
      });
    });
  }

  run() {
    this.render();
    this.cardInfo();
  }
}

export default CardInfo;
