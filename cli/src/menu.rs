use std::io;
use std::io::Write;

use crate::user::User;
use crate::pong;
use crate::tournament;
use colored::Colorize;

/**
 * Display the menu and handle the user's choice
 * 
 * Args:
 * 		user: User - The user that is currently logged in
 */
pub fn menu(user: User) {
	loop {
		let mut choice = String::new();
		println!("1. Game");
		println!("2. Tournament");
		println!("q. Quit");

		print!("Choice: ");
		let _ = io::stdout().flush();
		io::stdin()
			.read_line(&mut choice)
			.expect("Error while reading user input");
		choice = (*choice.trim()).to_string();
		
		match choice.as_str() {
			"1" => {
				menu_game(user.clone());
			},
			"2" => {
				menu_tournament(user.clone());
			}
			"q" => {
				break ;
			},
			_ => {
				println!("{}", format!("Invalid choice").red());
			}
		}
	}
}

fn menu_game(user: User) {
	loop {
		let mut choice = String::new();
		println!("1. Matchmaking");
		println!("2. Create a private game");
		println!("3. Join a private game");
		println!("q. Quit");

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
			"4" | "q" => {
				break ;
			},
			_ => {
				println!("{}", format!("Invalid choice").red());
			}
		}
	}
}


fn menu_tournament(user: User) {
	loop {
		let mut choice = String::new();
		println!("1. Create a tournament");
		println!("2. Join a tournament");
		println!("q. Quit");

		print!("Choice: ");
		let _ = io::stdout().flush();
		io::stdin()
			.read_line(&mut choice)
			.expect("Error while reading user input");
		choice = (*choice.trim()).to_string();

		match choice.as_str() {
			"1" => {
				let _ = tournament::create_tournament(user.clone());
			},
			"2" => {
				let _ = tournament::join_tournament(user.clone());
			},
			"q" => {
				break ;
			},
			_ => {
				eprintln!("{}", format!("Invalid choice").red());
			}
		}
	}
}