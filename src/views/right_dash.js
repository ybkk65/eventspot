export default (heure, titre) => (`
<div class="container_dashbord">
    <div class="dashbord_container_page_content">
        <div class='message'>
            <h2>Dashbord</h2>
            <p>${titre}</p>
        </div> 
        <div class="heure">
            <p id="heure">${heure}</p>
        </div>
    </div>
    <div class="dashbord_container_page">
        <div class="dashbord_container_page_my_event"> 
        </div>
    </div>
</div>`);
