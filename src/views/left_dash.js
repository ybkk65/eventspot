import logo from '../assets/image/logoeventgbwhite.png';
import photo from '../assets/image/profil.png';

export default () => (`
<div class="nav_dashbord">
  <div class="nav_dashbord_logo">
    <img src="${logo}" alt="">
  </div>
  
  <div class="dash_container_menu">
  <a href="/dashbord?page=accueil">
    <div id="menu_accueil" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-solid fa-house"></i>
        <p>Accueil</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=compte">
    <div id="menu_compte" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-regular fa-user"></i>
        <p>Mon compte</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=evenements">
    <div id="menu_evenements" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-regular fa-calendar-check"></i>
        <p>Mes événements</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=favoris">
    <div id="menu_favoris" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-regular fa-bookmark"></i>
        <p>Mes favoris</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=nouvel_evenement">
    <div id="menu_nouvel_evenement" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-solid fa-plus"></i>
        <p>Nouvel événement</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=modifier_evenement">
    <div id="menu_modifier_evenement" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-solid fa-pen"></i>
        <p>Modifier un événement</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
    <a href="/dashbord?page=supprimer_evenement">
    <div id="menu_supprimer_evenement" class="dash_container_item">
      <div class="dash_container_item_part">
        <i class="fa-solid fa-trash-can"></i>
        <p>Supprimer un événement</p>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
    </a>
  </div>
  <div class="bottom_nav">
    <div class="bottom_nav_user">
      <img src="${photo}" alt="">
      <p>Salut Alice!</p>
    </div>
    <a href="/logout">
      <i class="fa-solid fa-right-from-bracket"></i>
    </a>
  </div>
</div>
`);
