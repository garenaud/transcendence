use ncurses::*;
use colored::Colorize;
use reqwest::blocking::*;
use tungstenite::{connect, Message};
use url::Url;

use crate::user::User;


// use tokio_native_tls::TlsConnector;	
// use tokio_tungstenite::tungstenite::{connect, Message};

/*
** TAILLE ELEMENTS:

** Wall left/right = 19
** Wall top/bottom = 36
** Ball = 0.5 (circle)
** Paddle = 5.5
*/
struct coord {
	x: f32,
	y: f32,
}

struct game {
	ball: coord,
	paddle1: coord,
	paddle2: coord,
}

pub fn create_game(user: User) {
	println!("Create a game !!!!!!!!!!!");
}

pub fn join_game(user: User) -> Result<(), Box<dyn std::error::Error>> {
	println!("Join a game !!!!!!!!!!!");
	// game();

	let mut socket = match connect(("ws://{server}/ws/game/1/").replace("{server}", user.get_server().as_str())) {
		Ok((mut socket, res)) => {
			println!("{:#?}", res);
			socket
		},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return Err(Box::new(err));
		}
	};

	socket.write_message(Message::Text(r#"{"message":"update"}"#.to_string()))?;
	let msg = socket.read_message()?;
	
	Ok(())
}

pub fn game() {
	/* WEBSOCKET HANDSHAKE REFECTED */
	// let (mut socket, response) = connect(
	// 	Url::parse("wss://localhost/ws/game").unwrap()
	// ).expect("Can't connect");

	// loop {
	// 	let msg = match socket.read_message() {
	// 		Ok(msg) => msg,
	// 		Err(e) => {
	// 			eprintln!("Error: {}", e);
	// 			break;
	// 		}
	// 	};
	// 	if msg.is_text() {
	// 		println!("Received: {}", msg.into_text().unwrap());
	// 	}
	// }

	// Read from command line and send messages
	initscr();
	raw();
	keypad(stdscr(), true);
	noecho();
	timeout(0);
	loop { // game loop
		let ch = getch();
		if ch == 27 { // 27 == ascii code for ESC
			endwin();
			break;
		}
		render();
		println!("Received: {}", ch);
	}
}


struct Console {
	width: usize,
	height: usize
}

fn render() {
	let _ = clearscreen::clear();
	let term: Console;

	if let Some((w, h)) = term_size::dimensions() {
		term =  Console {
			width: w,
			height: h
		};
	} else {
		println!("Error\n");
		return ;
	}
	println!("hauteur={}\tlargeur={}", term.width, term.height);
}
