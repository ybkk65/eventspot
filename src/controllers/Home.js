import footer from '../views/footer';
import cardView from '../views/card';
import searchBarHome from '../views/searchBarHome';
import nav from '../views/nav';
import banniere from '../assets/image/banniere_home.png';

class Home {
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
            ${cardView()}
            ${cardView()}
            ${cardView()}
            ${cardView()}
            ${cardView()}
            ${cardView()}
          </div>
          <div class="more_button">
            <button>Load More Event</button>
          </div>
        </section>
      </div>
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

export default Home;
