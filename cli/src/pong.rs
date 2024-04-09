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

	let mut socket = match connect(("ws://{server}/ws/game/1/").replace("{server}", user.get_server().as_str())) {
		Ok((socket, res)) => {
			socket
		},
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return Err(Box::new(err));
		}
	};

	socket.write_message(Message::Text(r#"{"message":"update"}"#.to_string()))?;
	game(user, socket);
	Ok(())
}

struct Paddle {
	x: f64,
	y: f64,
}

struct Ball {
	x: f64,
	y: f64,
}

struct Score {
	score1: i32,
	score2: i32,
}

pub fn game(user: User, mut socket: tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>) {
	// Read from command line and send messages
	let _ = clearscreen::clear();

	initscr();
	raw();
	keypad(stdscr(), true);
	noecho();
	timeout(0);

	let mut paddle_l = Paddle { x: 0.0, y: 0.0 };
	let mut paddle_r = Paddle { x: 0.0, y: 0.0 };
	let mut ball = Ball { x: 0.0, y: 0.0 };
	let mut score = Score { score1: 0, score2: 0 };
	let mut term: Console;
	if let Some((w, h)) = term_size::dimensions() {
		term = Console {
			width: w as f64,
			height: h as f64
		};
		let paddle_offset: f64 = term.width / 12.0;
		paddle_l.x = paddle_offset;
		paddle_r.x = term.width - paddle_offset;
	} else {
		println!("Error\n");
		return ;
	}

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
						match json["action"].as_str().unwrap() {
							"ball" => {
								ball.x = json["bx"].as_f64().unwrap() / 19.0 * term.width;
								ball.y = json["by"].as_f64().unwrap() / 36.0 * term.height;
							},
							"paddle1" => { // RIGHT ONE
								paddle_r.y = (json["prz"].as_f64().unwrap() + 8.5) / 19.0 * (term.height - 2.0) - (PADDLE_HEIGHT / 2.0);

							},
							"paddle2" => { // LEFT ONE
								paddle_l.y = (json["plz"].as_f64().unwrap() + 8.5) / 19.0 * (term.height - 2.0) - (PADDLE_HEIGHT / 2.0);
							},
							// "score" => {
							// 	score = json["score"];
							// },
							_ => {}
						}
						render(&term, &paddle_l, &paddle_r, &ball, &score);
					},
					_ => {}
				},
				Err(err) => match err {
					tungstenite::error::Error::Io(err) if err.kind() == std::io::ErrorKind::Interrupted => {
						if let Some((w, h)) = term_size::dimensions() {
							term = Console {
								width: w as f64,
								height: h as f64
							};
							let paddle_offset: f64 = term.width / 12.0;
							paddle_l.x = paddle_offset;
							paddle_r.x = term.width - paddle_offset;
						}
						continue
					}
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
fn render(term: &Console, paddle_l: &Paddle, paddle_r: &Paddle, ball: &Ball, score: &Score) {

	// Print the score
	_ = term_cursor::set_pos(((term.width / 2.0 - 3.0) as i32).try_into().unwrap(), 1);
	println!("{} - {}", score.score1, score.score2);
	_ = term_cursor::set_pos(0, 2);
	for _ in 0..term.width as i32 {
		print!("-");
	}

	print_paddle(paddle_l);
	print_paddle(paddle_r);
	print_ball(ball);

	sleep(Duration::from_millis(100));
}

fn print_paddle(paddle: &Paddle) {
	let x = paddle.x as i32;
	let y = paddle.y as i32;
	for i in 0..PADDLE_HEIGHT as i32 {
		_ = term_cursor::set_pos(x, y + i);
		print!("|");
	}
}

fn print_ball(ball: &Ball) {
	let x = ball.x as i32;
	let y = ball.y as i32;
	_ = term_cursor::set_pos(x, y);
	print!("o");
}