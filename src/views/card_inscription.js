import { getCategoryEmoji } from './emojieCategorie';
import { getmajorite } from './majorite';
import { getacces } from './acces';

export default (statut, id, mois, jour, titre, description, prix, categorie, nbr_pers, country_name, country_icone, pays, acces, majorite, image) => {
  return (`
    <div class="event_card" data-id="${id}">
      <div class="event_icons">
        <div class="icon delete"><i class="fa-regular fa-heart" style="color: #e32400;"></i></div>
        <div class="status"><p>${statut}</p></div>
        <div class="trois-point"><i class="fa-solid fa-ellipsis-vertical"></i></div>
      </div>

      <!-- Options supplémentaires -->
      <div class="additional_options">
        <p class='p2'>Se désinscrire</p>
        <p class='p22' >Voir les détails</p>
      </div>

      <div class="event_img">
        <img src="https://www.visit.alsace/wp-content/uploads/2018/11/festival-decibulles-2017-laurent-khram-longvixay-1-1600x900.jpg" alt="image_event">
      </div>
      
      <div class="event_info">
        <div class="event_date">
          <div class="mois">${mois}</div>
          <div class="jour">${jour}</div>
        </div>
        <div class="event_description">
          <div class="titre">${titre}</div>
          <div class="description"><${description}></div>
        </div>
      </div>

      <div class="card_option_container">
        <div class="card_option_container_item">
          <p>💶${prix}</p>
        </div>
        <div class="card_option_container_item">
          <p>${getCategoryEmoji(categorie)}${categorie}</p>
        </div>
        <div class="card_option_container_item">
          <p>🧑‍🤝‍🧑${nbr_pers}</p>
        </div>
        <div class="card_option_container_item">
          <p><span id='drap' class="${country_icone}"></span>${pays}</p>
        </div>
        <div class="card_option_container_item">
          <p>${getacces(acces)} ${acces}</p>
        </div>
        <div class="card_option_container_item">
          <p>${getmajorite(majorite)} ${majorite}</p>
        </div>
      </div>
    </div>
  `);
};
