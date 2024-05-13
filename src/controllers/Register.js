class Register {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  render() {
    const html = `
      <div>
        <h2>Register</h2>
      </div>`;

    this.el.innerHTML = html;
  }

  run() {
    this.render();
  }
}

export default Register;
