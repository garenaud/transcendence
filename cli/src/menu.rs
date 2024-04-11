use std::io;
use std::io::Write;
use std::error::Error;
use reqwest::blocking::Client;
use colored::Colorize;

use crate::user::User;
use crate::pong;	

pub fn menu(user: User) {
	'menu: loop {
		let mut choice = String::new();
		println!("1. Matchmaking");
		println!("2. Create a private game");
		println!("3. Join a private game");
		println!("4. Quit");

		print!("Choice: ");
		let _ = io::stdout().flush();
		io::stdin()
			.read_line(&mut choice)
			.expect("Error while reading user input");
		choice = (*choice.trim()).to_string();
		
		match choice.as_str() {
			"1" => {
				let _ = pong::matchmaking(user.clone());
			},
			"2" => {
				let _ = pong::create_game(user.clone());
			},
			"3" => {
				let _ = pong::join_game(user.clone());
			},
			"4" => {
				break 'menu;
			},
			_ => {
				println!("Invalid choice");
			}
		}
	}










	// pong::game();
}