export default (userInfo) => (`
<section class="mon_compt_section">
<div class="mon_compte_info_all">
<div class="compte_titre">
<p class="prem">${userInfo.prenom.charAt(0)}</p>
<h2>Bonjour Admin !</h2>
</div>
<h3 class="voici_info">Voici vos informations</h3>
<div class="mon_compte_info">
    <p class="deus"><span>Prénom:</span>${userInfo.prenom}</p>
    <p class="deus"><span>Nom:</span>${userInfo.nom}</p>
</div>
<p class="comp_em" ><span>Nom:</span>${userInfo.email}</p>
</div>
<h3 class="voici_info">Modifier vos informations</h3>

  <div id="comptmodif" class="form-content-wrapper">
    <div id="updateName">
      <div class="header-wrapper">
        <h2>Modifier le nom et prénom</h2>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
      <form id="nameForm" style="display: none;">
        <div class="flex-row-wrapper">
          <div class="input-field-wrapper">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" value="${userInfo.prenom}">
          </div>
          <div class="input-field-wrapper">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" value="${userInfo.nom}">
          </div>
        </div>
        <div class="form_sub">
          <input type="submit" value="Modifier" class="submit-button">
        </div>
      </form>
    </div>
    
    <div id="updateEmail">
      <div class="header-wrapper">
        <h2>Modifier l'email</h2>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
      <form id="emailForm" style="display: none;">
        <div class="input-field-wrapper">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" value="${userInfo.email}" required>
        </div>
        <div class="form_sub">
          <input type="submit" value="Modifier" class="submit-button">
        </div>
      </form>
    </div>
    
    <div id="updatePassword">
      <div class="header-wrapper">
        <h2>Modifier le mot de passe</h2>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
      <form id="passwordForm" style="display: none;">
        <div class="input-field-wrapper">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="input-field-wrapper">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>
        </div>
        <div class="form_sub">
          <input type="submit" value="Modifier" class="submit-button">
        </div>
      </form>
    </div>
    
    <div id="errordatauser" class="error-container"></div>
  </div>
  </section>
`);
