use ncurses::*;
use colored::Colorize;
use reqwest::blocking::*;
use tungstenite::{connect, Message};
use url::Url;

// use tokio_native_tls::TlsConnector;	
// use tokio_tungstenite::tungstenite::{connect, Message};

/*
** TAILLE ELEMENTS:

** Wall left/right = 19
** Wall top/bottom = 36
** Ball = 0.5 (circle)
** Paddle = 5.5
*/

pub fn create_game(client: Client, csrf: String, srv: String) {
	println!("Create a game !!!!!!!!!!!");
}

pub fn join_game(client: Client, csrf: String, srv: String) -> Result<(), Box<dyn std::error::Error>> {
	println!("Join a game !!!!!!!!!!!");
	// game();

	let req = match connect(("ws://{server}/ws/game/").replace("{server}", &srv)) {
		Ok(req) => {
			println!("{:#?}", req);
			req
		},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return Err(Box::new(err));
		}
	};

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
