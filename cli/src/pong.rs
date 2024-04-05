use ncurses::*;
use colored::Colorize;
use reqwest::blocking::*;
use tungstenite::{connect, Message, WebSocket};
use url::Url;
use term_cursor::*;
use std::io::{stdout, Write};

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
		Ok((socket, res)) => {
			socket
		},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return Err(Box::new(err));
		}
	};

	socket.write_message(Message::Text(r#"{"message":"update"}"#.to_string()))?;
	game(user, socket);
	Ok(())
}

pub fn game(user: User, mut socket: tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>) {
	// Read from command line and send messages
	initscr();
	raw();
	keypad(stdscr(), true);
	noecho();
	timeout(0);
	loop { // game loop
		let ch = getch();
		match ch {
			27 => {
				endwin();
				break;
			},
			_ => {
				let ch = match char::from_u32(ch as u32) {
					Some(ch) => {
						ch
					},
					None => ' '
				};
				if ch != ' ' {
					socket.write_message(Message::Text(r#"{"message":"{ch}"}"#.to_string().replace("{ch}", &ch.to_string())));
				}
			}
		}
		let msg = socket.read_message().unwrap();
		match msg {
			Message::Text(msg) => {
				let msg = msg.as_str();
				let json = json::parse(msg).unwrap();
				if json["type"] == "update" {
					render(json["message"].clone());
				}
			},
			_ => {}
		}
	}
}


struct Console {
	width: usize,
	height: usize
}

fn render(json: json::JsonValue) {
	let _ = clearscreen::clear();
	let term: Console;

	if let Some((w, h)) = term_size::dimensions() {
		term =  Console {
			width: w,
			height: h
		};
		term_cursor::set_pos(3, 3);
		write!(stdout(), "{}", json["ball"]).unwrap();
		stdout().flush().unwrap();
		println!("{}\t{}", term.width, term.height);
	} else {
		println!("Error\n");
		return ;
	}
}