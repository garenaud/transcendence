import { changeView } from './stateManager.js';

export function renderLogin() {
    const loginHTML = `
	<div class="centered-content row d-flex justify-content-center align-items-center div-login">
	<div class="col-12 col-md-6 col-lg-6 col-xl-3 col-login">
	  <div class="login text-white" style="border-radius: 1rem;">
		<div class="card-body-login p-5 text-center">

		  <div class="mb-md-3 mt-md-2 pb-3">

			<h2 class="fw-bold mb-2 text-uppercase">Login</h2>
			<p class="text-white-50 mb-3">Please enter your login and password!</p>

			<div class="form-outline form-white mb-2">
			  <input type="email" id="typeEmailX" class="form-control form-control-lg" />
			  <label class="form-label" for="typeEmailX">Email</label>
			</div>

			<div class="form-outline form-white mb-2">
			  <input type="password" id="typePasswordX" class="form-control form-control-lg" />
			  <label class="form-label" for="typePasswordX">Password</label>
			</div>

			<p class="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

			<button id='loginBtn' class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

			<div class="d-flex justify-content-center text-center mt-2 pt-1">
			  <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
			  <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
			  <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
			</div>

		  </div>

		  <div>
			<p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a>
			</p>
		  </div>

		</div>
	  </div>
	</div>
  </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loginHTML);
    setupButtonListener();
}

function    setupButtonListener() {
    document.getElementById('loginBtn').addEventListener('click', function() {
        const email = document.getElementById('typeEmailX').value;
		const password = document.getElementById('typePasswordX').value;

		fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
    })
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		if (data.success) {
			changeView('hero');
		} else {
			changeView('hero');
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
});
}