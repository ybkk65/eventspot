import logo from '../assets/image/1.png';
import axios from 'axios';
import Cookies from 'js-cookie';

class Logout {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.logo = logo;
    this.run();
  }

  async sendLogoutRequest() {
    try {
      const response = await axios.post('http://localhost/logout');

      if (response.status === 200) {
        Cookies.remove('session_id');
        Cookies.remove('user');
        console.log('Logout successful, cookies removed');
        this.confirmLogout();
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      console.log("An error occurred while logging out.");
    }
  }

  confirmLogout() {
    document.getElementById('logout-prompt').classList.add('hidden');
    document.getElementById('loader-overlay').classList.add('show');

    setTimeout(() => {
      document.getElementById('loader-overlay').classList.remove('show');
      document.getElementById('confirmation-message').classList.remove('hidden');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }, 2000);
  }

  render() {
    const html = `
      <section class="logout-section">
          <div class="loader-overlay" id="loader-overlay">
              <div class="loader"></div>
          </div>
          <a href="index.html" class="return-link"><i class="fas fa-arrow-left return-icon"></i> Return</a>
          <div class="logout-container">
              <div id="logout-prompt">
                  <img src="${this.logo}" alt="Logo" class="logout-logo">
                  <div class="logout-message">Are you sure you want to log out?</div>
                  <div class="logout-actions">
                      <button id="confirm-logout-button">Confirm</button>
                      <button onclick="window.location.href='index.html'">Cancel</button>
                  </div>
              </div>
              <div class="logout-container hidden" id="confirmation-message">
                  <img src="${this.logo}" alt="Logo" class="logout-logo">
                  <div class="logout-message">You have been successfully logged out.</div>
                  <svg class="confirmation-icon" xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.2 17.6l-5.4-5.4 1.4-1.4 4 4 8-8 1.4 1.4-9.4 9.4z"/>
                  </svg>
                  <div class="logout-actions">
                      <button onclick="window.location.href='/'">Return Home</button>
                  </div>
              </div>
          </div>
          <div class="logout-copyright">
              &copy; 2024 Youness Benakkaf
          </div>
      </section>
    `;

    this.el.innerHTML = html;
  }

  run() {
    this.render();
    document.getElementById('confirm-logout-button').addEventListener('click', () => this.sendLogoutRequest());
  }
}

export default Logout;
