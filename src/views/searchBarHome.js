export default () => (`
  <section class="search_section">
    <div class="search">
      <div class="search_container">
        <div class="inputContainer">
          <input required="" class="customInput" type="text">
          <label class="inputLabel">Looking for</label>
          <div class="inputUnderline"></div>
        </div>
        <div class="inputContainer">
          <input required="" class="customInput" type="text">
          <label class="inputLabel">Place</label>
          <div class="inputUnderline"></div>
        </div>
        <div class="inputContainer">
          <input required="" class="customInput" type="date">
          <label class="inputLabel">When</label>
          <div class="inputUnderline"></div>
        </div>
        <div>
          <button class='rech' type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
`);
