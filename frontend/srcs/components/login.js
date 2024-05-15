import { changeView, appState } from './stateManager.js';
import { loadUser } from './userManager.js';

export function renderLogin() {
    const loginHTML = `
	<div class="login-form">
	<form>
	<div class="login-form centered-content row d-flex justify-content-center align-items-center div-login">
	<div class="col-12 col-md-6 col-lg-6 col-xl-3 col-login">
	  <div class="login text-white" style="border-radius: 1rem;">
		<div class="card-body-login p-5 text-center">
		  <div class="mb-md-3 mt-md-2 pb-3">
		  		<h2 class="fw-bold mb-2 text-uppercase" data-lang-key='login'>Login</h2>
		  		<p class="text-white-50 mb-3" data-lang-key='loginTxt'>Please enter your login and password!</p>

		  		<div class="form-outline form-white mb-2">
		  			<input type="text" id="typeUsername" class="form-control form-control-lg" />
		  			<label class="form-label">Username</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="password" id="typePasswordX" class="form-control form-control-lg" />
		  			<label class="form-label" for="typePasswordX"  data-lang-key='password'>Password</label>
		  		</div>

			<button id='loginBtn' class="btn btn-outline-light btn-lg px-5" type="submit" data-lang-key='login'>Login</button>

		  </div>

		  <div>
		  <p class="mb-0"><span data-lang-key='noAccount'>Don't have an account?</span> <a href="#login" id="signup-btn-form" class="text-white-50 fw-bold">Sign Up</a></p>
			</p>
		  </div>

		</div>
	  </div>
	</div>
  </div>
  </form>
  </div>
  <div class="signup">
  <form>
	<div class="signup centered-content row d-flex justify-content-center align-items-center div-login">
	<div class="col-12 col-md-6 col-lg-6 col-xl-3 col-login">
	  <div class="login text-white" style="border-radius: 1rem;">
		<div class="card-body-login p-5 text-center">
		  <div class="mb-md-3 mt-md-2 pb-3">
		  		<h2 class="fw-bold mb-2 text-uppercase">Signup</h2>
				  <p class="mb-0" data-lang-key='alreadyAccount'>Already have an account? <a href="#!" id="login-btn-form" class="text-white-50 fw-bold">Log in</a>


		  		<div class="form-outline form-white mb-2">
		  			<input type="username" id="signupUsername" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupUsername" data-lang-key='username'>Username</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="username" id="signupFirstName" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupFirstName" data-lang-key='firstName'>First name</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="username" id="signupLastName" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupLastName" data-lang-key='lastName'>Last name</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="email" id="signupEmail" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupEmail">Email</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="password" id="signupPassword1" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupPassword1" data-lang-key='password'>Password</label>
		  		</div>
		  		<div class="form-outline form-white mb-2">
		  			<input type="password" id="signupPassword2" class="form-control form-control-lg" />
		  			<label class="form-label" for="signupPassword2" data-lang-key='passConfirm'>Password confirmation</label>
		  		</div>
				<div id="error-message" class="alert alert-danger" role="alert"></div>
				<div id="success-message" class="alert alert-success" role="alert"></div>
			<button id='signupBtn' class="btn btn-outline-light btn-lg px-5" type="submit" data-lang-key='signup'>signup</button>

		  </div>

		</div>
	  </div>
	</div>
  </div>
  </form>
  </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loginHTML);
    setupButtonListener();
}

function    setupButtonListener() {
	document.getElementById('loginBtn').addEventListener('click', function(event) {
		event.preventDefault();
		const username = document.getElementById('typeUsername').value;
		const password = document.getElementById('typePasswordX').value;
		let csrf = getCookie("csrftoken");
		fetch('/auth/login/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf,
			},
			body: JSON.stringify({ username, password }),
			credentials: 'same-origin' 
		})
		.then(response => {
			console.log('response:', response);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('Success:', data);
			if (data['message'] == "OK") {
				let userId = data['id'];
                sessionStorage.setItem('userId', userId);
                loadUser().then(() => {
					changeView('hero');
				});
                //changeView('hero');
			} else if (data['message'] == "KO"){
				console.log('bad credentials');
			}
		})
		.catch((error) => {
			console.log('error dans le catch:', error);
			console.error('Error:', error);
		});
	});

	document.getElementById('signup-btn-form').addEventListener('click', function() {
		const loginElement = document.querySelector('.login-form');
		const signupElement = document.querySelector('.signup');
		
		loginElement.style.display = 'none';
		signupElement.style.display = 'block';
	});
	document.getElementById('login-btn-form').addEventListener('click', function() {
		const loginElement = document.querySelector('.login-form');
		const signupElement = document.querySelector('.signup');
		
		loginElement.style.display = 'block';
		signupElement.style.display = 'none';
	});

	document.getElementById('signupBtn').addEventListener('click', function() {
		const username = document.getElementById('signupUsername').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password1 = document.getElementById('signupPassword1').value;
    const password2 = document.getElementById('signupPassword2').value;

    let formData = new FormData();
    formData.append('username', username);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password1', password1);
    formData.append('password2', password2);
    formData.append('csrfmiddlewaretoken', getCookie("csrftoken"));
	console.log('csrf signup:', getCookie("csrftoken"));
    fetch('auth/register/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie("csrftoken"),
        },
        body: formData,
        credentials: 'same-origin' 
    })
		.then(response => {
			const contentType = response.headers.get("content-type");
			if (!response.ok) {
			return response.json().then(data => {
				console.log('Error data:', data);
				let errorMessages = [];
				if (data.errors) {
					for (let key in data.errors) {
						console.log(`Erreur dans ${key}: ${data.errors[key]}`);
						let errortmp = `${data.errors[key]}`
						errorMessages.push(errortmp);
					}
				}
/* 				for (let key in data) {
					if (data.hasOwnProperty(key)) {
						console.log(`Erreur avec dans la boucle ${key}: ${data[key]}`);
						let errortmp = `${data.errors[key]}`
						errorMessages.push(errortmp);  // Ajoutez chaque message d'erreur au tableau
					}
				} */
				let errorMessage = errorMessages.join(', ');
				console.log("errormessage = ", errorMessage);  // Créez une seule chaîne à partir du tableau
				throw new Error(`${errorMessage}`);
			});
			}
			else if (!contentType || !contentType.includes('application/json')) {
				throw new TypeError("Oops, we haven't got JSON!");
			}
			return response.json();
		})
		.then(data => {
			//console.log('Signup Success:', data);
			if (data.message === "Error") {
				console.log('Signup Error:', data.errors);
				document.getElementById('error-message').textContent = data.errors.join(', ');
				document.getElementById('error-message').style.display = 'block';
			} 
			else if (data.message === "OK") 
			{
				console.log('Signup Success:', data);
				document.getElementById('success-message').textContent = "Your account has been created successfully";
				document.getElementById('error-message').style.display = 'none';
				document.getElementById('success-message').style.display = 'block';
				setTimeout(function() {
					const loginElement = document.querySelector('.login-form');
					const signupElement = document.querySelector('.signup');
					loginElement.style.display = 'block';
					signupElement.style.display = 'none';
				}, 2000);
			}
		})
		.catch((error) => {
			console.log('error dans le catch de signup:', error);
			console.log('error message:', error.message);
			console.error('Error:', error);
			document.getElementById('error-message').textContent = error.message;
			document.getElementById('error-message').style.display = 'block';
		});
	});
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

document.body.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement; // L'élément qui a le focus
        const loginForm = document.querySelector('.login-form');
        const signupForm = document.querySelector('.signup');

        // Vérifie si l'élément actif est dans le formulaire de connexion
        if (loginForm.contains(activeElement)) {
            //event.preventDefault(); // Empêche le comportement par défaut
            document.getElementById('loginBtn').click(); // Simule un clic sur le bouton de connexion
        }
        // Vérifie si l'élément actif est dans le formulaire d'inscription
        else if (signupForm.contains(activeElement)) {
            //event.preventDefault(); // Empêche le comportement par défaut
            document.getElementById('signupBtn').click(); // Simule un clic sur le bouton d'inscription
        }
    }
});

/* document.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('loginBtn').click();
        }
    });

    const signupForm = document.querySelector('.signup');
    signupForm.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('signupBtn').click();
        }
    });
}); */