import getCategoryEmoji from './emojieCategorie';
import getmajorite from './majorite';
import getacces from './acces';

export default (
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
) => `
    <div class="card_inscription_edit" data-id="${id}" data-inscriptionId="${id_inscription}">
      
      <div class="prf">
        <div class="lettreNom">${premiere_lettre}</div>
        <p>${prenom}<br>${nom}</p>
      </div>

      <div class="img_evnt_ban">
        <img src="${image}" alt="" srcset="">
      </div>

      <div class="prf_card_inf">
        <div class="prf_card_inf_information">
          <div>
            <p class="leM">${mois}</p>
            <p class="leJ">${jour}</p>
          </div>
          <div>
            <p class="leP">${titre}</p>
            <p class="leD">${description}</p>
          </div>
        </div>
        <div class="prf_card_inf_item_container">
          <div class="option_container_item">
            <p>💶 ${prix}</p>
          </div>
          <div class="option_container_item">
            <p>${getCategoryEmoji(categorie)} ${categorie}</p>
          </div>
          <div class="option_container_item">
            <p>🧑‍🤝‍🧑 ${nbr_pers}</p>
          </div>
          <div class="option_container_item">
            <p><span id='drap' class="${country_icone}"></span> ${pays}</p>
          </div>
          <div class="option_container_item">
            <p>${getacces(acces)} ${acces}</p>
          </div>
          <div class="option_container_item">
            <p>${getmajorite(majorite)} ${majorite}</p>
          </div>
        </div>
      </div>

      <div class="container_statut">
        <div class="Statut_etat_container">
          <p class="statut_actuel">Statut:</p>
          <p class="${statut}" id="statutActuel">${statut}</p>
        </div>

        <div>
          <p class="statut_actuel">Modifier:</p>
          <select id="etat_${id_inscription}">
            <option value="accepter">Accepter</option>
            <option value="refuser">Refuser</option>
            <option value="en_attente">En attente</option>
          </select>
          <button class="submitStatut" data-inscriptionId="${id_inscription}" type="submit">Confirmer</button>
        </div>
      </div>

    </div>
  `;
