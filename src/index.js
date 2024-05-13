import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Register from './controllers/Register';

import './index.scss';

const routes = [
  {
    url: '/',
    controller: Home
  },
  {
    url: '/register',
    controller: Register
  },
  {
    url: '/login',
    controller: Login
  }
];

new Router(routes);
