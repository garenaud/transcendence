use std::io::Write;
// use pwhash::sha256_crypt;
// use websocket::sync::Client;	
use std::time::Duration;

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

fn connection(srv: String, login: String, password: String) -> bool {
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
	let crsf = client.get("https://{server}/api/userlist".replace("{server}", &srv))
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.header("csrftoken", "Fetch")
		.timeout(Duration::from_secs(3));

	let crsf = crsf.build();
	println!("Request = {:?}", crsf);

	let res_csrf = client.execute(crsf.expect("ERROR WHILE BUILDING THE REQUEST"));
	let csrf = match res_csrf {
		Ok(res) => {
			if res.status().is_success() {
				
				println!("Repond is: {:#?}", res);
				// println!("Headers: {:#?}", res.headers());
				// println!("Cookies: {:#?}", res.cookies());
				println!("Body: {:#?}", res.text());

				// if res.headers().get("X-CSRF-Token").is_none() {
				// 	eprintln!("No CSRF-Token in the header");
				// 	return false;
				// }
				// let csrf = res.headers().get("X-CSRF-Token").unwrap();
				// csrf.to_str().unwrap().to_string()
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
	println!("CSRF = {:?}", csrf);


	let req = client
		.post(("https://{server}/auth/test/").replace("{server}", &srv))
		// .get(("https://{server}/api/userlist").replace("{server}", &srv))
		.header("User-Agent", "cli_rust")
		.header("Accept", "application/json")
		.body(("email={email}&password={password}").replace("{email}", &login).replace("{password}", &password))
		.timeout(Duration::from_secs(3));

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