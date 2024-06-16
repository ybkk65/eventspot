export default (titre, description, description_plus, categorie) => (`
    <a href="/dashbord?page=modifier_evenement"><i class="fa-solid fa-arrow-left"></i>retour</a>

    <section class="form_create_section">
        <div class="text_ti">
            <h2>Modifier événement</h2>
        </div>
        <form enctype="multipart/form-data">

            <div class="form_title">
                <label for="titre">Titre</label>
                <input type="text" id="titre" name="titre" class="form-control" value="${titre}">
            </div>
            <div class="form_description">
                <div class="form-group-desc">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="8" class="form-control">${description}</textarea>
                </div>
                <div class="form-group_d">
                    <label for="plus-info">Plus d'informations</label>
                    <textarea id="plus-info" name="plus-info" rows="4" class="form-control">${description_plus}</textarea>
                </div>
            </div>
            <div class="form-categorie">
                <div class="form-cat_opt">
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" name="categorie" class="form-control">
                        <option value="">-- Choisissez une catégorie --</option>
                        <option value="Musique" ${categorie === 'Musique' ? 'selected' : ''}>Musique</option>
                        <option value="Sport" ${categorie === 'Sport' ? 'selected' : ''}>Sport</option>
                        <option value="Théâtre" ${categorie === 'Théâtre' ? 'selected' : ''}>Théâtre</option>
                        <option value="Art" ${categorie === 'Art' ? 'selected' : ''}>Art</option>
                        <option value="Conférence" ${categorie === 'Conférence' ? 'selected' : ''}>Conférence</option>
                        <option value="Cinéma" ${categorie === 'Cinéma' ? 'selected' : ''}>Cinéma</option>
                        <option value="Danse" ${categorie === 'Danse' ? 'selected' : ''}>Danse</option>
                        <option value="Exposition" ${categorie === 'Exposition' ? 'selected' : ''}>Exposition</option>
                        <option value="Festival" ${categorie === 'Festival' ? 'selected' : ''}>Festival</option>
                        <option value="Gastronomie" ${categorie === 'Gastronomie' ? 'selected' : ''}>Gastronomie</option>
                        <option value="Littérature" ${categorie === 'Littérature' ? 'selected' : ''}>Littérature</option>
                        <option value="Mode" ${categorie === 'Mode' ? 'selected' : ''}>Mode</option>
                        <option value="Rencontre" ${categorie === 'Rencontre' ? 'selected' : ''}>Rencontre</option>
                        <option value="Technologie" ${categorie === 'Technologie' ? 'selected' : ''}>Technologie</option>
                        <option value="Voyage" ${categorie === 'Voyage' ? 'selected' : ''}>Voyage</option>
                        <option value="Mariage" ${categorie === 'Mariage' ? 'selected' : ''}>Mariage</option>
                        <option value="Visioconférence" ${categorie === 'Visioconférence' ? 'selected' : ''}>Visioconférence</option>
                        <option value="Séminaire" ${categorie === 'Séminaire' ? 'selected' : ''}>Séminaire</option>
                    </select>
                </div>
            </div>
            <div class="form_sub">
                <input type="submit" value="Soumettre" class="submit-button">
            </div>
        </form>
    </section>
`);
