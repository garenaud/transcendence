use std::io::Write;
use pwhash::sha256_crypt;
use std::time::Duration;
use reqwest::blocking::Client;

// Ask the user for login and password, and then return the connection status
pub fn login(srv: String) -> bool {
	print!("Login: ");
	let _ = std::io::stdout().flush();

	let mut login: String = String::new();
	std::io::stdin()
		.read_line(&mut login)
		.expect("Erreur lors de la lecture de l'utilisateur");
	login = (*login.trim()).to_string();
	
	println!("Password: ");

	let hashed_pw: String;
	let password = rpassword::read_password().unwrap();
	// let password = sha256_crypt::hash(rpassword::read_password().unwrap());
	// match password {
	// 	Ok(str) => hashed_pw = String::from(str),
	// 	Err(_) => {
	// 		eprintln!("ERREUR LORS DU HASHAGE DU MOT DE PASSE");
	// 		return false;
	// 	}
	// };
	return connection(srv, login, password);
}

// Use the provide login and password to connect to the server
fn connection(srv: String, login: String, password: String) -> bool {
	let client = reqwest::blocking::Client::builder()
		.danger_accept_invalid_certs(true)
		// .cookie_store(true)
		.build();
	let client = match client {
		Ok(client) => client,
		Err(err) => {
			eprintln!("{}", err);
			return false;
		}
	};

	let crsf = client.get("https://{server}/auth/".replace("{server}", &srv))
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.timeout(Duration::from_secs(3));
	let crsf = crsf.build();
	let res_csrf = client.execute(crsf.expect("ERROR WHILE BUILDING THE REQUEST"));
	let csrf = match res_csrf {
		Ok(res) => {
			if res.status().is_success() {
				if res.headers().get("set-cookie").is_none() {
					eprintln!("No CSRF-Token in the header");
					return false;
				}
				let csrf = res.headers().get("set-cookie").unwrap();
				csrf.to_str().unwrap().to_string()
			} else {
				eprintln!("Respond status code: {:#?}", res.status());
				return false;
			}
		},
		Err(err) => {
			eprintln!("Error in respond: {:#?}", err);
			return false;
		}
	};
	let csrf: Vec<&str> = csrf.split(';').collect();
	let csrf_token = csrf[0].split('=').nth(1).unwrap().to_string();

	let req = client
		.post(("https://{server}/auth/test/").replace("{server}", &srv))
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.header("csrf", csrf_token)
		.body(("email={email}&password={password}").replace("{email}", &login).replace("{password}", &password))
		.timeout(Duration::from_secs(3));

	println!("Request was: {:#?}", req);
	let req = req.build().expect("ERROR WHILE BUILDING THE REQUEST");
	let res = client.execute(req);

	match res {
		Ok(res) => {
			println!("Repond is: {:#?}", res);
			if !res.status().is_success() {
				eprintln!("Respond status code: {:#?}", res.status());
				return false;
			}
		},
		Err(err) => {
			eprintln!("Error in respond: {:#?}", err);
			return false;
		}
	}
	true
}