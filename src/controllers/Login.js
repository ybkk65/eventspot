class Login {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  render() {
    const html = `
    <div>
    <h2>Login</h2>
    <form id="loginForm">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
        </div>
        <button type="submit">Login</button>
    </form>
</div>`;

    this.el.innerHTML = html;
  }

  run() {
    this.render();
  }
}

export default Login;
