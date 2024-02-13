import axios from 'axios';

import viewNav from '../views/nav';
import viewListUsers from '../views/list-users';

const Search = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.data = [];

    this.run();
  }

  onKeyUp() {
    const elInputSearch = document.querySelector('.input-search');
    const elListUsers = document.querySelector('.list-users');

    elInputSearch.addEventListener('keyup', () => {
      const keyWord = elInputSearch.value;
      const data = this.filters(
        'name',
        this.data,
        ({ user }) => user.name.first.includes(keyWord)
      );

      elListUsers.innerHTML = viewListUsers(data);
    });
  }

  render() {
    return `
      <div class="container">
        <div class="row">
          <div class="col-12">${viewNav()}</div>
        </div>
        <div class="row list-users">
          ${viewListUsers(this.data)}
        </div>
      </div>
    `;
  }

  filters(param, data, filter) {
    let updateData = data;

    if (param) {
      updateData = updateData.filter(filter);
    }

    return updateData;
  }

  run() {
    const { results } = this.params;

    axios
      .get(`https://randomuser.me/api/0.8/?results=${results}`)
      .then((res) => {
        const { data } = res;
        const { age } = this.params;

        this.data = this.filters(
          parseInt(age, 10),
          data.results,
          ({ user }) => (
            new Date(
              new Date().getTime() - new Date(user.dob * 1000).getTime()
            ).getFullYear() - 1970 > age
          )
        );

        this.el.innerHTML = this.render();
        this.onKeyUp();
      });
  }
};

export default Search;
