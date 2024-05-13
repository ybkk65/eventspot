class Home {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  render() {
    const html = `
      <div>
        <h2 class='home' >home</h2>
      </div>`;

    this.el.innerHTML = html;
  }

  run() {
    this.render();
  }
}

export default Home;
