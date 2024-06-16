import getCategoryEmoji from './emojieCategorie';
import getmajorite from './majorite';
import getacces from './acces';

export default (
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
) => `
    <div class="event_card" data-id="${id}">
        <div class="event_icons">
            <div class="icon delete">
                <i class="fa-regular fa-heart" style="color: #e32400;"></i>
            </div>
        </div>
        <div class="event_img">
            <img src="${image}" alt="image_event">
        </div>
        <div class="event_info">
            <div class="event_date">
                <div class="mois">${mois}</div>
                <div class="jour">${jour}</div>
            </div>
            <div class="event_description">
                <div class="titre">${titre}</div>
                <div class="description">${description}</div>
            </div>
        </div>
        <div class="card_option_container">
            <div class="card_option_container_item">
                <p>💶 ${prix}</p>
            </div>
            <div class="card_option_container_item">
                <p>${getCategoryEmoji(categorie)} ${categorie}</p>
            </div>
            <div class="card_option_container_item">
                <p>🧑‍🤝‍🧑 ${nbr_pers}</p>
            </div>
            <div class="card_option_container_item">
                <p><span id='drap' class="${country_icone}"></span> ${pays}</p>
            </div>
            <div class="card_option_container_item">
                <p>${getacces(acces)} ${acces}</p>
            </div>
            <div class="card_option_container_item">
                <p>${getmajorite(majorite)} ${majorite}</p>
            </div>
        </div>
    </div>
  `;
