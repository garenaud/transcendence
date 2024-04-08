use ncurses::*;
use colored::Colorize;
use reqwest::blocking::*;
use tungstenite::{connect, Message, WebSocket};
use url::Url;
use term_cursor::*;
use std::io::{stdout, Write};
use std::thread::sleep;
use std::time::Duration;
use crate::user::User;


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
	let _ = clearscreen::clear();

	initscr();
	raw();
	keypad(stdscr(), true);
	noecho();
	timeout(0);
	'game: loop { // game loop
		match getch() {
			27 => {
				endwin();
				let _ = clearscreen::clear();
				break 'game;
			},
			ch => {
				let ch = match char::from_u32(ch as u32) {
					Some(ch) => {
						ch
					},
					None => ' '
				};
				if ch != ' ' {
					_ = socket.write_message(Message::Text(r#"{"message":"{ch}"}"#.to_string().replace("{ch}", &ch.to_string())));
				}
			}
		}
		loop {
			match socket.read_message() {
				Ok(msg) => match msg {
					Message::Text(msg) => {
						let msg = msg.as_str();
						let json = json::parse(msg).unwrap();
						if json["action"] == "game" {
							term_cursor::clear();
							render(json);
						}
					},
					_ => {}
				},
				Err(err) => match err {
					tungstenite::error::Error::Io(err) if err.kind() == std::io::ErrorKind::Interrupted => continue,
					_ => {
						endwin();
						eprintln!("{}", format!("{}", err).red());
						break 'game;
					}
				}
			}
			break;
		}
	}
}

struct Console {
	width: f64,
	height: f64
}

/*
** TAILLE ELEMENTS:

** Wall left/right = 19
** Wall top/bottom = 36
** Ball = 0.5 (circle)
** Paddle = 5.5	
*/
const PADDLE_HEIGHT: f64 = 5.5;
const BALL_SIZE: f64 = 0.5;
fn render(json: json::JsonValue) {
	let term: Console;
	
	if let Some((w, h)) = term_size::dimensions() {
		term =  Console {
			width: w as f64,
			height: h as f64
		};
		// Print the score
		_ = term_cursor::set_pos(((term.width / 2.0 - 3.0) as i32).try_into().unwrap(), 1);
		println!("{} - {}", json["score1"], json["score2"]);
		_ = term_cursor::set_pos(0, 2);
		for _ in 0..term.width as i32 {
			print!("-");
		}

		let paddle_offset: f64 = term.width / 12.0;

		print_paddle(paddle_offset, (json["plz"].as_f64().unwrap() + 8.5) / 19.0 * (term.height - 2.0) - (PADDLE_HEIGHT / 2.0));
		print_paddle(term.width - paddle_offset, (json["prz"].as_f64().unwrap() + 8.5) / 19.0 * (term.height - 2.0) - (PADDLE_HEIGHT / 2.0));
		print_ball(json["bx"].as_f64().unwrap() / 19.0 * term.width, json["bz"].as_f64().unwrap() / 36.0 * term.height);
	
		sleep(Duration::from_millis(100));

	} else {
		println!("Error\n");
		return ;
	}
}

fn print_paddle(posx: f64, posy: f64) {
	let posx = posx as i32;
	let posy = posy as i32;
	for i in 0..PADDLE_HEIGHT as i32 {
		_ = term_cursor::set_pos(posx, posy + i);
		print!("|");
	}
}

fn print_ball(x: f64, y: f64) {
	let x = x as i32;
	let y = y as i32;
	_ = term_cursor::set_pos(x, y);
	print!("o");
}