mod pong;
mod login;
use std::io;
use std::io::Write;
use std::error::Error;
// use tokio;

fn main() {
	println!("Welcome to T_BOOL TRANSCENDENCE !");
	
	let srv = loop {
		let mut srv: String = String::new();
		print!("Server: ");
		let _ = std::io::stdout().flush();

		std::io::stdin()
			.read_line(&mut srv)
			.expect("Erreur lors de la lecture de l'utilisateur");
		srv = (*srv.trim()).to_string();

		if srv.len() <= 0 {
			eprintln!("Server name is empty, please try again");
			continue;
		}
			
		let client = reqwest::blocking::Client::builder()
			.danger_accept_invalid_certs(true)
			.build();

		let client = match client {
			Ok(client) => client,
			Err(err) => {
				eprintln!("{}", err);
				continue;
			}
		};

		let ping_req = client
			.get(("https://{server}/").replace("{server}", &srv))
			.header("User-Agent", "cli_rust")
			.header("Accept", "application/json")
			.timeout(std::time::Duration::from_secs(1));

		let res = client.execute(ping_req.build().expect("ERROR WHILE BUILDING THE REQUEST"));
		match res {
			Ok(res) => {
				if res.status().is_success() {
					println!("Server is up !");
					break srv;
				} else {
					eprintln!("Server is down, please try again");
				}
			},
			Err(err) => {
				let err = err.source().unwrap().source().unwrap();
				let err = err.to_string();
				eprintln!("Error: {}", err);
			}
		}
	};

	if login::login(srv) {
		println!("user's login successfuly saved");
		// pong::game();
	} else {
		eprintln!("user's login failed, exiting...");
	}
}
