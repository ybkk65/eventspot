import viewUser from './user';

export default (data) => (`
  <div class="row">
    ${data.map((user) => viewUser(user)).join('')}
  </div>
`);
