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
				pong::create_game(user.clone());
			},
			"2" => {
				pong::join_game(user.clone());
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