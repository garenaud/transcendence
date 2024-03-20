use std::io::Write;
use pwhash::sha256_crypt;

pub fn login() -> bool {
	print!("Login: ");
	let _ = std::io::stdout().flush();

	let mut login: String = String::new();
	std::io::stdin()
		.read_line(&mut login)
		.expect("Erreur lors de la lecture de l'utilisateur");
	login = (*login.trim()).to_string();
	
	println!("Password: ");

	let hashed_pw: String;
	let password = sha256_crypt::hash(rpassword::read_password().unwrap());
	match password {
		Ok(str) => hashed_pw = String::from(str),
		Err(_) => {
			println!("ERREUR LORS DU HASHAGE DU MOT DE PASSE");
			return false;
		}
	};
	return connection(login, hashed_pw);
}

fn connection(login: String, password: String) -> bool {
	true
}