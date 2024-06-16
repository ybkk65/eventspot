import axios from 'axios';
import Cookies from 'js-cookie';
import login from '../views/login';

class Login {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.errors = [];
    this.run();
  }

  getFormData() {
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;
    const data = {
      email,
      password
    };
    return data;
  }

  async sendLoginRequest(userData) {
    try {
      const response = await axios.post('http://localhost/login', userData);
      if (response.status >= 200 && response.status < 300) {
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
          this.errors.push(`Error parsing response data: ${error.message}`);
          return;
        }
        const { session_id: sessionId, user } = parsedData;
        if (sessionId) {
          Cookies.set('session_id', sessionId);
          Cookies.set('user', JSON.stringify(user));
          window.location.href = '/dashbord?page=accueil';
        } else {
          // Afficher le message d'erreur ici
          const errorLoginElement = document.querySelector('.errorLogin');
          if (errorLoginElement) {
            errorLoginElement.style.display = 'block';
          }
          this.errors.push('Erreur: Aucun identifiant de session trouvé dans la réponse.');
        }
      } else {
        // Afficher le message d'erreur ici si nécessaire
        const errorLoginElement = document.querySelector('.errorLogin');
        if (errorLoginElement) {
          errorLoginElement.style.display = 'block';
        }
        this.errors.push(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // Afficher le message d'erreur ici si nécessaire
      const errorLoginElement = document.querySelector('.errorLogin');
      if (errorLoginElement) {
        errorLoginElement.style.display = 'block';
      }
      this.errors.push(`Error: ${error.message}`);
    }
  }

  async checkSession() {
    const sessionId = Cookies.get('session_id');
    if (!sessionId) {
      this.errors.push('No session ID found');
      window.location.href = '/';
      return;
    }
    try {
      const response = await axios.get('http://localhost/authentification', {
        headers: {
          Authorization: `Bearer ${sessionId}`
        }
      });
      if (response.status === 200) {
        window.location.href = '/';
      } else {
        this.errors.push('Invalid session');
        window.location.href = '/login';
      }
    } catch (error) {
      this.errors.push(`Error checking session: ${error.message}`);
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
