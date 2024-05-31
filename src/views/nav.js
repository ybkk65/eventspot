import logo from '../assets/image/1.png';

export default () => (`
  <nav class="nav_home">
    <div class="nav_left">
      <img src="${logo}" alt="">
      <div class="nav_page">
        <ul>
          <li>home</li>
          <li>contact</li>
          <li>about</li>
        </ul>
      </div>
    </div>
    <div class="nav_right">
      <div class="nav_button">
        <a href="/login">login</a>
        <a href="/register">signup</a>
      </div>
    </div>
  </nav>
`);
