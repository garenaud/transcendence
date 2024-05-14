use std::io::Write;
use std::time::Duration;
use std::sync::Arc;
use reqwest::cookie::Jar;
use colored::Colorize;

use pwhash::sha256_crypt;

use crate::user::User;

// Ask the user for login and password, and then return the connection status
pub fn login(srv: String) -> Option<User> {
	print!("Login: ");
	let _ = std::io::stdout().flush();

	let mut login: String = String::new();
	std::io::stdin()
		.read_line(&mut login)
		.expect("Erreur lors de la lecture de l'utilisateur");
	login = (*login.trim()).to_string();
	
	println!("Password: ");

	let password = match rpassword::read_password() {
		Ok(str) => str,
		Err(_) => {
			eprintln!("{}", format!("ERREUR LORS DE LA LECTURE DU MOT DE PASSE").red());
			return None;
		}
	
	};
	// let password = match sha256_crypt::hash(rpassword::read_password().unwrap()) {
	// 	Ok(str) => String::from(str),
	// 	Err(_) => {
	// 		eprintln!("ERREUR LORS DU HASHAGE DU MOT DE PASSE");
	// 		return None;
	// 	}
	// };
	return connection(srv, login, password);
}

// Use the provide login and password to connect to the server
fn connection(srv: String, login: String, password: String) -> Option<User> {
	let jar = Arc::new(Jar::default());
	
	let client = reqwest::blocking::Client::builder()
		.danger_accept_invalid_certs(true)
		.cookie_provider(Arc::clone(&jar))
		.build();
	let client = match client {
		Ok(client) => client,
		Err(err) => {
			eprintln!("{}", err);
			return None;
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

			// eprintln!("{:#?}", res);
			// eprintln!("{}", res.text().unwrap());

			if res.headers().get("set-cookie").is_none() {
				eprintln!("{}", format!("No CSRF-Token in the header").red());
				return None;
			}
			let csrf = res.headers().get("set-cookie").unwrap();
			csrf.to_str().unwrap().to_string()
		},
		Err(err) => {
			eprintln!("{}", format!("Error in respond: {:#?}", err).red());
			return None;
		}
	};
	let csrf_token = csrf.split(';').nth(0).unwrap().split('=').nth(1).unwrap().to_string();
	let csrf_token = csrf_token.as_str();

	let req = client
		.post(("https://{server}/auth/login/").replace("{server}", &srv))
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.header("X-CSRFToken", csrf_token)
		.body((r#"{"username":"{email}","password":"{password}"}"#).replace("{email}", &login).replace("{password}", &password))
		.timeout(Duration::from_secs(3));

	let req = req.build().expect("ERROR WHILE BUILDING THE REQUEST");
	let res = client.execute(req);

	let mut user = User::new();
	match res {
		Ok(res) => {
			if !res.status().is_success() {
				// eprintln!("{:#?}", res);
				return None;
			}
			let res = res.text().ok();
			let res = match res {
				Some(res) => res,
				None => {
					eprintln!("{}", format!("Error in respond: {:#?}", res).red());
					return None;
				}
			};
			match json::parse(&res) {
				Ok(res) => {
					if res["message"] == -1 {
						return None;
					}
					user.fill(res["id"].to_string(), login, res["session_id"].to_string(), client, srv, csrf_token.to_string());
				},
				Err(err) => {
					eprintln!("Error in respond: {:#?}", err);
					return None;
				}
			}
		},
		Err(err) => {
			eprintln!("Error in respond: {:#?}", err);
			return None;
		}
	}
	return Some(user);
}