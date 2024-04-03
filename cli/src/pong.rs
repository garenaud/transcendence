use ncurses::*;
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

pub fn create_game(client: Client, csrf: String) {
	println!("Create a game !!!!!!!!!!!");
}

pub fn join_game(client: Client, csrf: String) -> Result<(), Box<dyn std::error::Error>> {
	println!("Join a game !!!!!!!!!!!");
	game();
	// let (mut socket, response) = connect(Url::parse("ws://localhost/game/").unwrap()).expect("Can't connect");
	
	// println!("Connected to the server");
	// println!("Response HTTP code: {}", response.status());
	// println!("Response contains the following headers:");
	// for (ref header, _value) in response.headers() {
	// 	println!("* {}", header);
	// }

	// socket.send(Message::Text("Hello WebSocket".into())).unwrap();
	// loop {
	// 	let msg = socket.read().expect("Error reading message");
	// 	println!("Received: {}", msg);
	// }
	
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

	/* SERVER NOT OK WITH THAT (Request seems to be crypted) */
	let connector = native_tls::TlsConnector::new().unwrap();
	let ws_client = match ClientBuilder::new()
		.danger_accept_invalid_certs(true)
		.build() {
		Ok(s) => s,
		Err(e) => {
			eprintln!("{}", e);
			return ;
		}
	};

	let (mut receiver, mut sender) = ws_client.get("ws://localhost/game/").split().unwrap();


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
