import logo from '../assets/image/1.png';

export default (userInfo ) => (` 
<nav class="nav_home">
<div class="nav_left">
<a href="/">
    <img src="${logo}" alt="">
</a>

    <div class="nav_page"> 
        <ul>
            <li>home</li>
            <li>contact</li>
            <li>about</li>
            <li ><a href="/dashbord"><button class="dashb">Dashbord</button></a></li>
        </ul>
    </div>
</div>
<div>
    <div class="nav_right_connected">
        <div class="name_info_log" id="nameInfoLog"> 
            <img src="https://img.freepik.com/photos-gratuite/plan-profil-fille-aristocratique-chemisier-volants-dame-fleurs-dans-ses-cheveux-posant-fierement-contre-mur-bleu_197531-14304.jpg?w=740&t=st=1717510061~exp=1717510661~hmac=34fab4468d323804f86ba9aec17ed44413e5ecb8d8499edd9f507e3c8c044818" alt="">
            <p>${userInfo.prenom}</p>
            <i class="fa-solid fa-chevron-down " id="chevronIcon"></i>
        </div>
        
      <a href="/logout">  <i class="fa-solid fa-right-from-bracket se_deco"></i></a>
    </div>
    <div class="imgpg" id="imgPg">
        <div class="name_imgpg">
            <p class="name_g">${userInfo.prenom} ${userInfo.nom}</p>
            <p class="email_g">${userInfo.email}</p>
        </div>
        <div class="choix">
            <p>mon compte</p>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="choix">
            <p>mes favoris</p>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="choix">
            <p>mes evenemnts</p>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    </div>
</div>
</nav>
` );