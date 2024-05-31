export default ( ) => (` 
<nav class="nav_home">
<div class="nav_left">
    <img src="1.png" alt="">
    <div class="nav_page"> 
        <ul>
            <li>home</li>
            <li>contact</li>
            <li>about</li>
            <li ><button class="dashb">Dashbord</button></li>
        </ul>
    </div>
</div>
<div>
    <div class="nav_right_connected">
        <div class="name_info_log" id="nameInfoLog"> 
            <img src="Design sans titre-86.png" alt="">
            <p>Alice</p>
            <i class="fa-solid fa-chevron-down " id="chevronIcon"></i>
        </div>
        
      <a href="logout.html">  <i class="fa-solid fa-right-from-bracket se_deco"></i></a>
    </div>
    <div class="imgpg" id="imgPg">
        <div class="name_imgpg">
            <p class="name_g">Alice Green </p>
            <p class="email_g">alice@gmail.com</p>
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