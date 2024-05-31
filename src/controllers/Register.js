import bcrypt from 'bcryptjs';
import register from '../views/register';

class Register {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  collectDataRegister() {
    const formData = {
      nom: document.querySelector('#nomInput').value,
      prenom: document.querySelector('#prenomInput').value,
      email: document.querySelector('#emailInput').value,
      password: document.querySelector('#passwordInput').value,
      confirmPassword: document.querySelector('#confirmPasswordInput').value,
    };
    return formData;
  }

  verifyDataRegister(formData) {
    const { nom, prenom, email, password, confirmPassword } = formData;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z]+$/;

    let errors = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!nameRegex.test(prenom)) {
      errors.prenom = 'Le prénom ne peut contenir que des lettres.';
    }

    if (!nameRegex.test(nom)) {
      errors.nom = 'Le nom ne peut contenir que des lettres.';
    }

    if (!emailRegex.test(email)) {
      errors.email = 'Veuillez entrer une adresse e-mail valide.';
    }

    if (!passwordRegex.test(password)) {
      errors.password = 'Au minimum 10 caractères, une majuscule et un caractère spécial.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne sont pas identiques.';
    }

    return errors;
  }

  async sendDataToApi(formData) {
    try {

      const response = await fetch('http://localhost/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 201) {
        const registerForm = document.querySelector('#registerForm');
        registerForm.reset();
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
          successMessage.textContent = 'Inscription réussie! Veuillez vous connecter';
        }
      } else {
        const responseData = await response.json();
        return { success: false, message: responseData.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  attachEventListeners() {
    const formInputs = document.querySelectorAll('.input');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.verifyForm(false);
      });
    });

    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await this.verifyForm(true);
      });
    }
  }

  async verifyForm(isSubmission) {
    const formData = this.collectDataRegister();
    const errors = this.verifyDataRegister(formData);

    // Clear all previous error messages
    document.querySelectorAll('.error-message').forEach(el => {
      if (el) {
        el.textContent = '';
      }
    });

    let hasErrors = false;

    // Display error messages
    for (const [key, message] of Object.entries(errors)) {
      if (message) {
        hasErrors = true;
        const errorElement = document.querySelector(`#${key}Error`);
        if (errorElement) {
          errorElement.textContent = message;
        }
      }
    }

    if (!hasErrors && isSubmission) {
      await this.sendDataToApi(formData);
    }
  }

  render() {
    const html = `
      ${register()}
    `;
    this.el.innerHTML = html;
  }

  run() {
    this.render();
    this.attachEventListeners();
  }
}

export default Register;
