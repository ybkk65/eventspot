import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Register from './controllers/Register';
import CardInfo from './controllers/CardInfo';
import Dashbord from './controllers/Dashbord';
import Logout from './controllers/Logout';

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
  },
  {
    url: '/card-info',
    controller: CardInfo
  },
  {
    url: '/dashbord',
    controller: Dashbord
  },
  {
    url: '/logout',
    controller: Logout
  }
];

new Router(routes);
