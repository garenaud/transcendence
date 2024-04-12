mod login;
mod menu;
mod user;
mod pong;

use std::io;
use std::io::Write;
use std::error::Error;
use reqwest::blocking::Client;
use colored::*;

fn main() {

	println!("{}", format!("Welcome to T_BOOL TRANSCENDENCE !").blue());
	
	let log_client: Client;
	let log_csrf: String;
	let mut max_try = 3;

	let srv = loop {
		let mut srv: String = String::new();
		print!("Server: ");
		let _ = std::io::stdout().flush();

		std::io::stdin()
			.read_line(&mut srv)
			.expect(&format!("Erreur lors de la lecture de l'utilisateur").red());
		srv = (*srv.trim()).to_string();

		if srv.len() <= 0 {
			eprintln!("{}", format!("Server name is empty, please try again").red());
			continue;
		}
			
		let client = reqwest::blocking::Client::builder()
			.danger_accept_invalid_certs(true)
			.build();

		let client = match client {
			Ok(client) => client,
			Err(err) => {
				eprintln!("{}", format!("{}", err).red());
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
					println!("{}", format!("Server is up !").green());
					break srv;
				} else {
					eprintln!("{}", format!("Server is down, please try again").red());
					continue;
				}
			},
			Err(err) => {
				let err = err.source().unwrap().source().unwrap();
				let err = err.to_string();
				eprintln!("Error: {}", err);
			}
		}
	};

	let user: user::User;
	loop {
		match login::login(srv.clone()) {
			Some(user_logged) => {
				user = user_logged;
				println!("{}", format!("Login successful !").green().bold());
				break;
			},
			None => {
				max_try -= 1;
				if max_try <= 0 {
					eprintln!("{}", format!("Failed to login, exiting...").red().bold());
					return;
				}
				eprintln!("{}", format!("Failed to login ({} tries left)", max_try).red().bold());
				continue;
			}
		};
	}
	menu::menu(user);
}
