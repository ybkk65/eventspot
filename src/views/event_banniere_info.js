import getCategoryEmoji from './emojieCategorie';
import getmajorite from './majorite';
import getacces from './acces';

export default (date, description_plus, num_tel, email, prix, categorie, nbr_pers, ville, country_icone, pays, acces, majorite, heure) => (`
  <section class="event_banniere_info">
    <div class="itemhastag_container">
      <div class="itemhastag"><p>💶  ${prix}€</p></div>
      <div class="itemhastag"><p>${getCategoryEmoji(categorie)}  ${categorie}</p></div>
      <div class="itemhastag"><p>🧑‍🤝‍🧑 ${nbr_pers}</p></div>
      <div class="itemhastag "><p><span class="${country_icone}"></span> ${pays}</p></div>
      <div class="itemhastag"><p>${getacces(acces)} ${acces}</p></div>
      <div class="itemhastag"><p>${getmajorite(majorite)} ${majorite}</p></div>
    </div>
    <div class="event_banniere_info_desc">
      <h4>Description</h4>
      <p>${description_plus}</p>
    </div>
    <div class="event_banniere_info_hour">
      <h4>Date</h4>
      <p>
        Date :${date}
        <br><br>
        Heure : ${heure}
        <br><br>
        Lieu : ${ville}, ${pays}
      </p>
    </div>
    <div class="event_banniere_info_cont">
      <h4>Contact</h4>
      <p>
        Pour toute question ou demande de renseignements supplémentaires concernant l'événement, n'hésitez pas à nous contacter par e-mail à : ${email} ou par téléphone au ${num_tel}. Nous sommes impatients de répondre à toutes vos interrogations et de vous aider à préparer une soirée inoubliable à Barcelone !
      </p>
    </div>
  </section>
`);
