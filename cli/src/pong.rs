// Use to handle the user's input in an other thread
use std::thread;
use ncurses::*;

use tokio_native_tls::TlsConnector;
// Use to handle the websocket
// use url::Url;
use tokio_tungstenite::tungstenite::{connect, Message};
use websocket::*;

/*
** TAILLE ELEMENTS:

** Wall left/right = 19
** Wall top/bottom = 36
** Ball = 0.5 (circle)
** Paddle = 5.5
*/
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


	/* SERVER NOT OK WITH THAT (Request seems to be crypted) */
	let connector = native_tls::TlsConnector::new().unwrap();
	let websocket = match ClientBuilder::new("ws://localhost/ws/game/").unwrap().connect_secure(Some(connector)) {
		Ok(s) => s,
		Err(e) => {
			eprintln!("{}", e);
			return ;
		}
	};
	// let (mut receiver, mut sender) = websocket.split().unwrap();




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
