export default () => (`
<section class="form_create_section">
<div class="text_ti">
    <h2>Nouvel événement</h2>
 
</div>
<form enctype="multipart/form-data">
    <div class="form_title">
        <label for="titre">Titre</label>
        <input type="text" id="titre" name="titre" class="form-control">
    </div>
    <div class="form_description">
    <div class="form-group-desc">
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="8" class="form-control"></textarea>
    </div>
    <div class="form-group_d">
        <label for="plus-info">Plus d'informations</label>
        <textarea id="plus-info" name="plus-info" rows="4" class="form-control"></textarea>
    </div>
    </div>
    <div class="form-categorie">
    <div class="form-cat_opt">
    <label for="categorie">Catégorie</label>
    <select id="categorie" name="categorie" class="form-control">
        <option value="">-- Choisissez une catégorie --</option>
        <option value="Musique">Musique</option>
        <option value="Sport">Sport</option>
        <option value="Théâtre">Théâtre</option>
        <option value="Art">Art</option>
        <option value="Conférence">Conférence</option>
        <option value="Cinéma">Cinéma</option>
        <option value="Danse">Danse</option>
        <option value="Exposition">Exposition</option>
        <option value="Festival">Festival</option>
        <option value="Gastronomie">Gastronomie</option>
        <option value="Littérature">Littérature</option>
        <option value="Mode">Mode</option>
        <option value="Rencontre">Rencontre</option>
        <option value="Technologie">Technologie</option>
        <option value="Voyage">Voyage</option>
        <option value="Mariage">Mariage</option>
        <option value="Visioconférence">Visioconférence</option>
        <option value="Séminaire">Séminaire</option>
    </select>
</div>

        <div class="form-image_input">
            <label for="imageInput">Image</label>
            <input type="file" id="imageInput" name="image" accept="image/*" class="form-control-file">

        </div>
    </div>

<div class="nombre_section">
<div class="prsn">
  <label class="nombre-pers" for="nombre-personne">Nombre de personnes:</label>
  <div class="number-buttons">
    <button type="button" id="btn-minus"><i class="fa-solid fa-minus"></i></button>
    <input type="number" id="nombre-personne" name="nombre-personne" class="input-field">
    <button type="button" id="btn-plus"><i class="fa-solid fa-plus"></i></button>
  </div>
</div>
<div class="prix">
  <label for="payant">Prix:</label>
  <div class="number-buttons">
    <button type="button" id="btn-minus"><i class="fa-solid fa-minus"></i></button>
    <input type="text" id="prix_value" name="prix_value" class="input-field">
    <button type="button" id="btn-plus"><i class="fa-solid fa-plus"></i></button>
  </div>
</div>

</div>

<div class="date_section">
<div class="form_item">
  <label for="date">Date de l'événement:</label>
  <input type="date" id="date" name="date" class="input-field">
</div>
<div class="form_item">
  <label for="heure">Heure de l'événement:</label>
  <input type="time" id="heure" name="heure" class="input-field" style="height: 40px;">
</div>
</div>

<div class="ville_section">
<div class="form_item">
  <label for="ville">Ville:</label>
  <input type="text" id="ville" name="ville" class="input-field">
</div>
<div class="form_item">
  <label for="pays">Pays:</label>
  <select id="select2">
    <option value="">-- Choisissez un pays --</option>
    <option value="af" data-icon="fi fi-af">Afghanistan</option>
    <option value="al" data-icon="fi fi-al">Albanie</option>
    <option value="dz" data-icon="fi fi-dz">Algérie</option>
    <option value="ad" data-icon="fi fi-ad">Andorre</option>
    <option value="ao" data-icon="fi fi-ao">Angola</option>
    <option value="ag" data-icon="fi fi-ag">Antigua-et-Barbuda</option>
    <option value="ar" data-icon="fi fi-ar">Argentine</option>
    <option value="am" data-icon="fi fi-am">Arménie</option>
    <option value="au" data-icon="fi fi-au">Australie</option>
    <option value="at" data-icon="fi fi-at">Autriche</option>
    <option value="az" data-icon="fi fi-az">Azerbaïdjan</option>
    <option value="bs" data-icon="fi fi-bs">Bahamas</option>
    <option value="bh" data-icon="fi fi-bh">Bahreïn</option>
    <option value="bd" data-icon="fi fi-bd">Bangladesh</option>
    <option value="bb" data-icon="fi fi-bb">Barbade</option>
    <option value="by" data-icon="fi fi-by">Biélorussie</option>
    <option value="be" data-icon="fi fi-be">Belgique</option>
    <option value="bz" data-icon="fi fi-bz">Belize</option>
    <option value="bj" data-icon="fi fi-bj">Bénin</option>
    <option value="bt" data-icon="fi fi-bt">Bhoutan</option>
    <option value="bo" data-icon="fi fi-bo">Bolivie</option>
    <option value="ba" data-icon="fi fi-ba">Bosnie-Herzégovine</option>
    <option value="bw" data-icon="fi fi-bw">Botswana</option>
    <option value="br" data-icon="fi fi-br">Brésil</option>
    <option value="bn" data-icon="fi fi-bn">Brunei</option>
    <option value="bg" data-icon="fi fi-bg">Bulgarie</option>
    <option value="bf" data-icon="fi fi-bf">Burkina Faso</option>
    <option value="bi" data-icon="fi fi-bi">Burundi</option>
    <option value="kh" data-icon="fi fi-kh">Cambodge</option>
    <option value="cm" data-icon="fi fi-cm">Cameroun</option>
    <option value="ca" data-icon="fi fi-ca">Canada</option>
    <option value="cv" data-icon="fi fi-cv">Cap-Vert</option>
    <option value="cf" data-icon="fi fi-cf">République centrafricaine</option>
    <option value="td" data-icon="fi fi-td">Tchad</option>
    <option value="cl" data-icon="fi fi-cl">Chili</option>
    <option value="cn" data-icon="fi fi-cn">Chine</option>
    <option value="co" data-icon="fi fi-co">Colombie</option>
    <option value="km" data-icon="fi fi-km">Comores</option>
    <option value="cg" data-icon="fi fi-cg">Congo</option>
    <option value="cr" data-icon="fi fi-cr">Costa Rica</option>
    <option value="ci" data-icon="fi fi-ci">Côte d'Ivoire</option>
    <option value="hr" data-icon="fi fi-hr">Croatie</option>
    <option value="cu" data-icon="fi fi-cu">Cuba</option>
    <option value="cy" data-icon="fi fi-cy">Chypre</option>
    <option value="cz" data-icon="fi fi-cz">République Tchèque</option>
    <option value="dk" data-icon="fi fi-dk">Danemark</option>
    <option value="dj" data-icon="fi fi-dj">Djibouti</option>
    <option value="dm" data-icon="fi fi-dm">Dominique</option>
    <option value="do" data-icon="fi fi-do">République Dominicaine</option>
    <option value="ec" data-icon="fi fi-ec">Équateur</option>
    <option value="eg" data-icon="fi fi-eg">Égypte</option>
    <option value="sv" data-icon="fi fi-sv">El Salvador</option>
    <option value="gq" data-icon="fi fi-gq">Guinée Équatoriale</option>
    <option value="er" data-icon="fi fi-er">Érythrée</option>
    <option value="ee" data-icon="fi fi-ee">Estonie</option>
    <option value="et" data-icon="fi fi-et">Éthiopie</option>
    <option value="fj" data-icon="fi fi-fj">Fidji</option>
    <option value="fi" data-icon="fi fi-fi">Finlande</option>
    <option value="fr" data-icon="fi fi-fr">France</option>
    <option value="ga" data-icon="fi fi-ga">Gabon</option>
    <option value="gm" data-icon="fi fi-gm">Gambie</option>
    <option value="ge" data-icon="fi fi-ge">Géorgie</option>
    <option value="de" data-icon="fi fi-de">Allemagne</option>
    <option value="gh" data-icon="fi fi-gh">Ghana</option>
    <option value="gr" data-icon="fi fi-gr">Grèce</option>
    <option value="gd" data-icon="fi fi-gd">Grenade</option>
    <option value="gt" data-icon="fi fi-gt">Guatemala</option>
    <option value="gn" data-icon="fi fi-gn">Guinée</option>
    <option value="gw" data-icon="fi fi-gw">Guinée-Bissau</option>
    <option value="gy" data-icon="fi fi-gy">Guyana</option>
    <option value="ht" data-icon="fi fi-ht">Haïti</option>
    <option value="hn" data-icon="fi fi-hn">Honduras</option>
  <option value="hu" data-icon="fi fi-hu">Hongrie</option>
  <option value="is" data-icon="fi fi-is">Islande</option>
  <option value="in" data-icon="fi fi-in">Inde</option>
  <option value="id" data-icon="fi fi-id">Indonésie</option>
  <option value="ir" data-icon="fi fi-ir">Iran</option>
  <option value="iq" data-icon="fi fi-iq">Irak</option>
  <option value="ie" data-icon="fi fi-ie">Irlande</option>
  <option value="il" data-icon="fi fi-il">Israël</option>
  <option value="it" data-icon="fi fi-it">Italie</option>
  <option value="jm" data-icon="fi fi-jm">Jamaïque</option>
  <option value="jp" data-icon="fi fi-jp">Japon</option>
  <option value="jo" data-icon="fi fi-jo">Jordanie</option>
  <option value="kz" data-icon="fi fi-kz">Kazakhstan</option>
  <option value="ke" data-icon="fi fi-ke">Kenya</option>
  <option value="ki" data-icon="fi fi-ki">Kiribati</option>
  <option value="kw" data-icon="fi fi-kw">Koweït</option>
  <option value="kg" data-icon="fi fi-kg">Kirghizistan</option>
  <option value="la" data-icon="fi fi-la">Laos</option>
  <option value="lv" data-icon="fi fi-lv">Lettonie</option>
  <option value="lb" data-icon="fi fi-lb">Liban</option>
  <option value="ls" data-icon="fi fi-ls">Lesotho</option>
  <option value="lr" data-icon="fi fi-lr">Liberia</option>
  <option value="ly" data-icon="fi fi-ly">Libye</option>
  <option value="li" data-icon="fi fi-li">Liechtenstein</option>
  <option value="lt" data-icon="fi fi-lt">Lituanie</option>
  <option value="lu" data-icon="fi fi-lu">Luxembourg</option>
  <option value="mk" data-icon="fi fi-mk">Macédoine</option>
  <option value="mg" data-icon="fi fi-mg">Madagascar</option>
  <option value="mw" data-icon="fi fi-mw">Malawi</option>
  <option value="my" data-icon="fi fi-my">Malaisie</option>
  <option value="mv" data-icon="fi fi-mv">Maldives</option>
  <option value="ml" data-icon="fi fi-ml">Mali</option>
  <option value="mt" data-icon="fi fi-mt">Malte</option>
  <option value="mh" data-icon="fi fi-mh">Îles Marshall</option>
  <option value="mr" data-icon="fi fi-mr">Mauritanie</option>
  <option value="mu" data-icon="fi fi-mu">Maurice</option>
  <option value="mx" data-icon="fi fi-mx">Mexique</option>
  <option value="fm" data-icon="fi fi-fm">Micronésie</option>
  <option value="md" data-icon="fi fi-md">Moldavie</option>
  <option value="mc" data-icon="fi fi-mc">Monaco</option>
  <option value="mn" data-icon="fi fi-mn">Mongolie</option>
  <option value="me" data-icon="fi fi-me">Monténégro</option>
  <option value="ma" data-icon="fi fi-ma">Maroc</option>
  <option value="mz" data-icon="fi fi-mz">Mozambique</option>
  <option value="mm" data-icon="fi fi-mm">Myanmar</option>
  <option value="na" data-icon="fi fi-na">Namibie</option>
  <option value="nr" data-icon="fi fi-nr">Nauru</option>
  <option value="np" data-icon="fi fi-np">Népal</option>
  <option value="nl" data-icon="fi fi-nl">Pays-Bas</option>
  <option value="nz" data-icon="fi fi-nz">Nouvelle-Zélande</option>
  <option value="ni" data-icon="fi fi-ni">Nicaragua</option>
  <option value="ne" data-icon="fi fi-ne">Niger</option>
  <option value="ng" data-icon="fi fi-ng">Nigéria</option>
  <option value="kp" data-icon="fi fi-kp">Corée du Nord</option>
  <option value="no" data-icon="fi fi-no">Norvège</option>
  <option value="om" data-icon="fi fi-om">Oman</option>
  <option value="pk" data-icon="fi fi-pk">Pakistan</option>
  <option value="pw" data-icon="fi fi-pw">Palaos</option>
  <option value="pa" data-icon="fi fi-pa">Panama</option>
  <option value="pg" data-icon="fi fi-pg">Papouasie-Nouvelle-Guinée</option>
  <option value="py" data-icon="fi fi-py">Paraguay</option>
  <option value="pe" data-icon="fi fi-pe">Pérou</option>
  <option value="ph" data-icon="fi fi-ph">Philippines</option>
  <option value="pl" data-icon="fi fi-pl">Pologne</option>
  <option value="pt" data-icon="fi fi-pt">Portugal</option>
  <option value="qa" data-icon="fi fi-qa">Qatar</option>
  <option value="ro" data-icon="fi fi-ro">Roumanie</option>
  <option value="ru" data-icon="fi fi-ru">Russie</option>
  <option value="rw" data-icon="fi fi-rw">Rwanda</option>
  <option value="kn" data-icon="fi fi-kn">Saint-Christophe-et-Niévès</option>
  <option value="lc" data-icon="fi fi-lc">Sainte-Lucie</option>
  <option value="vc" data-icon="fi fi-vc">Saint-Vincent-et-les Grenadines</option>
  <option value="ws" data-icon="fi fi-ws">Samoa</option>
  <option value="sm" data-icon="fi fi-sm">Saint-Marin</option>
  <option value="st" data-icon="fi fi-st">Sao Tomé-et-Principe</option>
  <option value="sa" data-icon="fi fi-sa">Arabie Saoudite</option>
  <option value="sn" data-icon="fi fi-sn">Sénégal</option>
  <option value="rs" data-icon="fi fi-rs">Serbie</option>
  <option value="sc" data-icon="fi fi-sc">Seychelles</option>
  <option value="sl" data-icon="fi fi-sl">Sierra Leone</option>
  <option value="sg" data-icon="fi fi-sg">Singapour</option>
  
  <option value="sk" data-icon="fi fi-sk">Slovaquie</option>
  <option value="si" data-icon="fi fi-si">Slovénie</option>
  <option value="sb" data-icon="fi fi-sb">Îles Salomon</option>
  <option value="so" data-icon="fi fi-so">Somalie</option>
  <option value="za" data-icon="fi fi-za">Afrique du Sud</option>
  <option value="kr" data-icon="fi fi-kr">Corée du Sud</option>
  <option value="es" data-icon="fi fi-es">Espagne</option>
  <option value="lk" data-icon="fi fi-lk">Sri Lanka</option>
  <option value="sd" data-icon="fi fi-sd">Soudan</option>
  <option value="sr" data-icon="fi fi-sr">Suriname</option>
  <option value="sz" data-icon="fi fi-sz">Swaziland</option>
  <option value="se" data-icon="fi fi-se">Suède</option>
  <option value="ch" data-icon="fi fi-ch">Suisse</option>
  <option value="sy" data-icon="fi fi-sy">Syrie</option>
  <option value="tw" data-icon="fi fi-tw">Taïwan</option>
  <option value="tj" data-icon="fi fi-tj">Tadjikistan</option>
  <option value="tz" data-icon="fi fi-tz">Tanzanie</option>
  <option value="th" data-icon="fi fi-th">Thaïlande</option>
  <option value="tl" data-icon="fi fi-tl">Timor-Leste</option>
  <option value="tg" data-icon="fi fi-tg">Togo</option>
  <option value="to" data-icon="fi fi-to">Tonga</option>
  <option value="tt" data-icon="fi fi-tt">Trinité-et-Tobago</option>
  <option value="tn" data-icon="fi fi-tn">Tunisie</option>
  <option value="tr" data-icon="fi fi-tr">Turquie</option>
  <option value="tm" data-icon="fi fi-tm">Turkménistan</option>
  <option value="tv" data-icon="fi fi-tv">Tuvalu</option>
  <option value="ug" data-icon="fi fi-ug">Ouganda</option>
  <option value="ua" data-icon="fi fi-ua">Ukraine</option>
  <option value="ae" data-icon="fi fi-ae">Émirats Arabes Unis</option>
  <option value="gb" data-icon="fi fi-gb">Royaume-Uni</option>
  <option value="us" data-icon="fi fi-us">États-Unis</option>
  <option value="uy" data-icon="fi fi-uy">Uruguay</option>
  <option value="uz" data-icon="fi fi-uz">Ouzbékistan</option>
  <option value="vu" data-icon="fi fi-vu">Vanuatu</option>
  <option value="va" data-icon="fi fi-va">Vatican</option>
  <option value="ve" data-icon="fi fi-ve">Venezuela</option>
  <option value="vn" data-icon="fi fi-vn">Vietnam</option>
  <option value="ye" data-icon="fi fi-ye">Yémen</option>
  <option value="zm" data-icon="fi fi-zm">Zambie</option>
  <option value="zw" data-icon="fi fi-zw">Zimbabwe</option>
  
  
  </select><br>
</div> 
</div>



<div class="contact_info_f">
<div class="form_item_tel">
<label for="numero-telephone">Numéro de téléphone:</label>
<input type="tel" id="phone" name="phone">
</div>

<div class="email_item">
<label for="email">Email:</label>
<input type="email" id="email" name="email" class="input-field">
</div>
</div>

<div class="form-inline">
<!-- Section pour choisir entre Privé et Public -->
<div class="option-item">
    <input type="radio" id="prive" name="visibilite" value="prive">
    <label for="prive">Privé</label>
    <input type="radio" id="public" name="visibilite" value="public">
    <label for="public">Public</label>
</div>

<!-- Section pour choisir l'âge -->
<div class="option-item">
    <input type="radio" id="mineur" name="age" value="mineur">
    <label for="mineur">Mineur</label>
    <input type="radio" id="majeur" name="age" value="majeur">
    <label for="majeur">Majeur</label>
    <input type="radio" id="toutages" name="age" value="tout âges">
    <label for="toutages">Tous âges</label>
</div>
</div>
<section class="inviter_une_personne">
    <div class="title_person_container">
        <h4>Inviter une personne</h4>
        <input class="check_invie" type="checkbox">
    </div>
<div class="select_person_container">

    <div class="inter_per">
   
    <input type="text" id="search" placeholder=" Rechercher..." class="form-control">
   <div id="personList"></div>
</div>
</div>
</section>
<div class="form_sub">
<input type="submit" value="Soumettre" class="submit-button">
</div>
</form>
</section>
`);
