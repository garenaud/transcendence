use std::io::Write;
// use pwhash::sha256_crypt;
// use websocket::sync::Client;	
use std::time::Duration;

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
	let password = rpassword::read_password().unwrap();
	// let password = sha256_crypt::hash(rpassword::read_password().unwrap());
	// match password {
	// 	Ok(str) => hashed_pw = String::from(str),
	// 	Err(_) => {
	// 		eprintln!("ERREUR LORS DU HASHAGE DU MOT DE PASSE");
	// 		return false;
	// 	}
	// };
	return connection(login, password);
}

fn connection(login: String, password: String) -> bool {
	// todo!("connection to the server");
	let client = reqwest::blocking::Client::builder()
		.danger_accept_invalid_certs(true)
		.build();

	let client = match client {
		Ok(client) => client,
		Err(err) => {
			eprintln!("{}", err);
			return false;
		}
	};

	let req = client
		.post("https://localhost/auth/test")
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.body("email={email}&password={password}".replace("{email}", &login).replace("{password}", &password))
		.timeout(Duration::from_secs(3));

	// let req = match res.build
	let res = client.execute(req.build().expect("ERROR WHILE BUILDING THE REQUEST"));

	match res {
		Ok(res) => {
			println!("Repond is: {:?}", res);
		},
		Err(err) => {
			eprintln!("Error in respond: {:?}", err);
			return false;
		}
	}
	// println!("Respond = {:?}", res);
	// res = match res.request {
	// 	Ok(str) => str,
	// 	Err(_) => 
	// };
	// println!("{:?}", res);


	/*
	use std::net::TcpStream;
	use http::{Request, Response};

	if let Ok(stream) = TcpStream::connect("localhost:443") {
		println!("Connected to the server!");

		let req = Request::builder()
			.method("POST")
			.uri(url)
			.header("User-Agent", "cli_rust")
			.body("email={email}&password={password}".replace("{email}", &login).replace("{password}", &password))
			.unwrap();
		println!("{:?}", req);
		

		// stream.write(req.as_bytes()).unwrap();
		// req.into().write(stream);
		
		// stream.write(req.as_bytes()).unwrap();
		// stream.flush().unwrap();


	} else {
		println!("Couldn't connect to server...");
	}
*/
	// let request = Request::get(url)
	// 	.body("email={email}&password={password}".replace("{email}", &login).replace("{password}", &password))
	// 	.expect("Failed to create request");
	true
}