import login from '../views/login';
import axios from 'axios';

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
    let email = userData['email'];
    let password = userData['password'];

    let datafinal = {
      email: email,
      password: password
    };

    axios.post('http://localhost/login', datafinal)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          console.log('connexion reussite');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        console.log("Une erreur s'est produite lors de la demande de connexion.");
      });
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
