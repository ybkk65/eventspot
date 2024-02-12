import axios from 'axios';

import './index.scss';

const CatSite = class {
  constructor(countUser) {
    this.el = document.querySelector('#root');
    this.data = [];
    this.countUser = countUser;
  }

  renderNav() {
    return `
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">Disabled</a>
              </li>
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    `;
  }

  renderUser(user) {
    const { name: { first, last }, email, picture: { large } } = user.user;

    return `
      <div class="col-3">
        <div class="card">
          <img src="${large}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${first} ${last}</h5>
            <p class="card-text">${email}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return `
      <div class="container">
        <div class="row">
          <div class="col-12">${this.renderNav()}</div>
        </div>
        <div class="row">
          <div class="col-12"></div>
        </div>
        <div class="row">
          ${this.data.map((user) => this.renderUser(user)).join('')}
        </div>
      </div>
    `;
  }

  run() {
    axios.get(`https://randomuser.me/api/0.8/?results=${this.countUser}`).then((res) => {
      const { data } = res;
      this.data = data.results;

      this.el.innerHTML = this.render();
    });
  }
};

const catSite = new CatSite(30);

catSite.run();
