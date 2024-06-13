import login from '../views/login';
import axios from 'axios';
import Cookies from 'js-cookie';

class Login {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  getFormData() {
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;
    let data = {
      email: email,
      password: password
    };
    return data;
  }

  async sendLoginRequest(userData) {
    try {
      const response = await axios.post('http://localhost/login', userData);
      console.log('Response from API:', response);
      if (response.status >= 200 && response.status < 300) {
        console.log('Connexion réussie');

        let responseData = response.data;

        if (typeof responseData === 'string') {
          const nullIndex = responseData.indexOf('null');
          if (nullIndex !== -1) {
            responseData = responseData.substring(0, nullIndex).trim();
          }
        }

        let parsedData;
        try {
          parsedData = JSON.parse(responseData);
        } catch (error) {
          console.error('Error parsing response data:', error);
          return;
        }

        const sessionId = parsedData.session_id;
        const user = parsedData.user;

        if (sessionId) {
          Cookies.set('session_id', sessionId);
          Cookies.set('user', JSON.stringify(user));
          console.log('Session ID stored in cookies:', sessionId);
          window.location.href = '/dashbord?page=accueil';
        } else {
          console.error('Erreur: Aucun identifiant de session trouvé dans la réponse.');
        }
        
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      console.log("Une erreur s'est produite lors de la demande de connexion.");
    }
  }

  async checkSession() {
    const sessionId = Cookies.get('session_id');

    if (!sessionId) {
      console.log('No session ID found');
      window.location.href = '/';
      return;
    }

    try {
      const response = await axios.get('http://localhost/authentification', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });

      if (response.status === 200) {
        console.log('Session is valid');
        window.location.href = '/';
      } else {
        console.error('Invalid session');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error checking session:', error);
      window.location.href = '/login';
    }
  }

  detectClick() {
    const signInButton = document.querySelector('.button-submit');
    signInButton.addEventListener('click', (event) => {
      event.preventDefault();
      const userData = this.getFormData();
      this.sendLoginRequest(userData);
    });
  }

  render() {
    const html = `
      ${login()}
    `;
    this.el.innerHTML = html;
  }

  run() {
    this.render();
    this.detectClick();
    
  }
}

export default Login;
