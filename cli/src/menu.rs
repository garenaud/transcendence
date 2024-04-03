use crate::pong;
use std::io;
use std::io::Write;
use std::error::Error;
use reqwest::blocking::Client;
use colored::Colorize;

pub fn menu(client: Client, csrf: String, srv: String) {
	'menu: loop {
		let mut choice = String::new();
		println!("1. Create a game");
		println!("2. Join a game");
		println!("3. Quit");

		print!("Choice: ");
		let _ = io::stdout().flush();
		io::stdin()
			.read_line(&mut choice)
			.expect("Error while reading user input");
		choice = (*choice.trim()).to_string();
		
		match choice.as_str() {
			"1" => {
				pong::create_game(client.clone(), csrf.clone(), srv.clone());
			},
			"2" => {
				pong::join_game(client.clone(), csrf.clone(), srv.clone());
			},
			"3" => {
				break 'menu;
			},
			_ => {
				println!("Invalid choice");
			}
		}
	}










	// pong::game();
}