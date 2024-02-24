export function renderNavbar() {
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon fas fa-bars"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="nav-div-btn navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-glowing-btn">
          <button class='glowing-btn'><span class='glowing-txt'>C<span class='faulty-letter'>L</span>ASSEMENT</span></button>
        </li>
        <li class="nav-glowing-btn">
          <button class='glowing-btn'><span class='glowing-txt'>O<span class='faulty-letter'>P</span>TIONS</span></button>
        </li>
      </ul>
    </div>
    <a class="navbar-brand navbar-logo" href="#"><img src="Design/LogoTranscendance3.png" alt=""></a>
      <div class="nav-user">
        <div class="nav-user-info">
          <h4>Grenaud-</h4>
          <h6>1000pts</h6>
        </div>
        <div class="nav-user-img">
								<div class="img_cont_nav">
									<img src="Design/User/Max-R_Headshot (1).jpg">
								</div>
        </div>
      </div>
    </div>
  </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}