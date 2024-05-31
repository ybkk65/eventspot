import card_image from '../assets/image/card_image.png';

export default () => (`
  <div class="event_card">
    <div class="event_img">
      <img src="${card_image}" alt="">
    </div>
    <div class="event_info">
      <div class="event_date">
        <div class="mois">AUG</div>
        <div class="jour">17</div>
      </div>
      <div class="event_description">
        <div class="titre">WorldWild Concert Barcelona</div>
        <div class="description">
          Plongez dans une nuit électrique de musique mondiale à Barcelone, où les sons envoûtants et les rythmes palpitants vous transporteront vers une expérience inoubliable.
        </div>
      </div>
    </div>
    <div class="card_option_container">
      <div class="card_option_container_item">
        <p>💵 20$</p>
      </div>
      <div class="card_option_container_item">
        <p>🎂 anniv</p>
      </div>
      <div class="card_option_container_item">
        <p>🕺 22</p>
      </div>
      <div class="card_option_container_item">
        <p>🇫🇷 France</p>
      </div>
    </div>
  </div>
`);
