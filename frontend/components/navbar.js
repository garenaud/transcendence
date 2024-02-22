export function renderNavbar() {
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand navbar-logo" href="#"><img src="Design/LogoTranscendance3.png" alt=""></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon fas fa-bars"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-glowing-btn">
                <button class='glowing-btn'><span class='glowing-txt'>C<span class='faulty-letter'>L</span>ASSEMENT</span></button>
            </li>
          <li class="nav-glowing-btn">
            <button class='glowing-btn'><span class='glowing-txt'>O<span class='faulty-letter'>P</span>TIONS</span></button>
          </li>
          <li class="nav-glowing-btn">
            <button class='glowing-btn'><span class='glowing-txt'>J<span class='faulty-letter'>O</span>UER</span></button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}