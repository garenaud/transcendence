use ncurses::*;
use colored::Colorize;
use reqwest::blocking::*;
use tungstenite::{connect, Message, WebSocket};
use url::Url;
use std::io::{stdout, Write};
use std::thread;
use std::thread::sleep;
use std::time::Duration;
use crate::user::User;

struct Console {
	width: f64,
	height: f64
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

pub fn matchmaking(user: User)
{
	// SEARCH FOR A GAME
	let req = user.get_client().get("https://{server}/api/game/search/".replace("{server}", user.get_server().as_str()));
	let req = req.build();
	let res = user.get_client().execute(req.expect("ERROR WHILE EXECUTING THE REQUEST"));
	let room_id = match res {
		Ok(res) => {
			if res.status().is_success() {
				let body = res.text().expect("ERROR WHILE READING THE BODY");
				let json = json::parse(body.as_str()).unwrap();
				let room_id = &json["id"];
				room_id.to_string()
			} else {
				eprintln!("{}", format!("Error while searching for a game").red().bold());
				return ;
			}
		},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return ;
		}
	};

	let socket = connect_ws(user.clone(), room_id.to_string());
	let mut socket = match socket {
		Ok(socket) => {
			// game(user.clone(), socket);
			socket
		},
		Err(err) => {
			return ;
		}
	};

	// THIS IS TEMP: SEND A MESSAGE TO THE SERVER TO START THE GAME
	match socket.send(Message::Text(r#"{"message":"start"}"#.to_string())) {
		Ok(_) => {
			game(user.clone(), socket);
		},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return ;
		}
	};
}

pub fn create_game(user: User) {
	println!("Create a game !!!!!!!!!!!");
	// CREATE A ROOM ON THE SERVER

	// api/game/create/ -> return {"message": "ok"} == Id choisi est valide
	//					-> return {"message": "ko", "id": "NEW_ID"} == Id choisi est invalide donc server en a choisi un autre
	
	// PRINT THE ROOM ID

	// WAIT FOR THE OTHER PLAYER TO JOIN

	// START THE GAME WHEN THE OTHER PLAYER JOINED
}

pub fn join_game(user: User) {
	// ASK THE USER FOR THE ROOM ID
	let mut room: String = String::new();
	loop {
		room.clear();
		print!("Room ID: ");
		let _ = std::io::stdout().flush();
	
		std::io::stdin()
			.read_line(&mut room)
			.expect(&format!("Erreur lors de la lecture de l'utilisateur").red());
		room = (*room.trim()).to_string();
	
		if room.len() <= 0 {
			eprintln!("{}", format!("Room ID is empty, please try again").red());
			continue;
		}
		let req = user.get_client().get("https://{server}/api/game/{room_id}/".replace("{server}", user.get_server().as_str()).replace("{room_id}", room.as_str()));
		let res = req.build();
		let res = user.get_client().execute(res.expect("ERROR WHILE BUILDING THE REQUEST"));
		match res {
			Ok(res) => {
				if res.status().is_success() {
					break;
				} else if res.status().is_client_error() {
					eprintln!("{}", format!("Room not found or ID invalid").red().bold());
					continue;
				}
			},
			Err(err) => {
				eprintln!("{}", format!("{}", err).red());
				return ;
			}
		}
		break;
	}

	let socket = connect_ws(user.clone(), room);
	let mut socket = match socket {
		Ok(socket) => socket,
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return ;
		}
	};

	// THIS IS TEMP: SEND A MESSAGE TO THE SERVER TO START THE GAME
	match socket.send(Message::Text(r#"{"message":"start"}"#.to_string())) {
		Ok(_) => {},
		Err(err) => {
			eprintln!("{}", format!("{}", err).red());
			return ;
		}
	};

	// socket.write_message(Message::Text(r#"{"message":"update"}"#.to_string()))?;
	game(user.clone(), socket);
}

fn connect_ws(user: User, room: String) -> Result<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>, Box<dyn std::error::Error>> {
	let mut socket = match connect(("wss://{server}/ws/game/{room_id}/").replace("{server}", user.get_server().as_str()).replace("{room_id}", room.as_str())).danger_connect {
		Ok((socket, res)) => {
			return Ok(socket);
		},
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red().bold());
			return Err(Box::new(err));
		}
	};
}

fn game(user: User, mut socket: tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>) {
	// Read from command line and send messages
	let _ = clearscreen::clear();

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

	initscr();
	raw();
	keypad(stdscr(), true);
	noecho();
	timeout(0);
	loop { // game loop
		sleep(Duration::from_millis(5));
		match socket.read() {
			Ok(msg) => match msg {
				Message::Text(msg) => {
					let msg = msg.as_str();
					let json = json::parse(msg).unwrap();
					match json["action"].as_str().unwrap() {
						"game" => {
							ball.x = (json["bx"].as_f64().unwrap() + 18.0) / 36.0 * term.width;
							ball.y = (json["bz"].as_f64().unwrap() + 9.5) / 19.0 * term.height;
							paddle_l.y = (json["plz"].as_f64().unwrap() + 9.5) / 19.0 * term.height - (PADDLE_HEIGHT / 2.0);
							paddle_r.y = (json["prz"].as_f64().unwrap() + 9.5) / 19.0 * term.height - (PADDLE_HEIGHT / 2.0);
						},
						"ball" => {
							ball.x = (json["bx"].as_f64().unwrap() + 18.0) / 36.0 * term.width;
							ball.y = (json["bz"].as_f64().unwrap() + 9.5) / 19.0 * term.height;
						},
						"paddle1" => { // RIGHT ONE
							paddle_r.y = (json["prz"].as_f64().unwrap() + 9.5) / 19.0 * term.height - (PADDLE_HEIGHT / 2.0);
						},
						"paddle2" => { // LEFT ONE
							paddle_l.y = (json["plz"].as_f64().unwrap() + 9.5) / 19.0 * term.height - (PADDLE_HEIGHT / 2.0);
						},
						"score" => {
							score.score1 = json["scorep1"].as_i32().unwrap();
							score.score2 = json["scorep2"].as_i32().unwrap();
						},
						"private" => continue,
						_ => {
							endwin();
							println!("Unknown action: {}", json["action"]);
							break ;
						}
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
					break;
				}
			}
		}
		match getch() {
			27 => {
				endwin();
				let _ = clearscreen::clear();
				break;
			},
			ch => {
				let ch = match char::from_u32(ch as u32) {
					Some(ch) => {
						ch
					},
					None => ' '
				};
				if ch != ' ' {
					_ = socket.send(Message::Text(r#"{"message":"{ch}"}"#.to_string().replace("{ch}", &ch.to_string())));
				}
			}
		}
	}
}

/*
** TAILLE ELEMENTS:

** Wall left/right = 19
** Wall top/bottom = 36
** Ball = 0.5 (circle)
** Paddle = 5.5	
*/
const PADDLE_HEIGHT: f64 = 6.5;
fn render(term: &Console, paddle_l: &Paddle, paddle_r: &Paddle, ball: &Ball, score: &Score) {
	match term_cursor::clear() {
		Ok(_) => {
			// Print the score
			_ = term_cursor::set_pos(((term.width / 2.0 - 3.0) as i32).try_into().unwrap(), 1);
			println!("{} - {}", score.score1, score.score2);
			_ = term_cursor::set_pos(0, 2);
			for _ in 0..term.width as i32 {
				print!("-");
			}
			println!();
			print_paddle(&paddle_l);
			print_paddle(&paddle_r);
			print_ball(&ball);
		},
		Err(err) => {
			eprintln!("{:?}", err);
			return ;
		}
	}
}

fn print_paddle(paddle: &Paddle) {
	let x = paddle.x as i32;
	let y = paddle.y as i32;
	for i in 0..PADDLE_HEIGHT as i32 {
		_ = term_cursor::set_pos(x, y + i + 2);
		print!("|");
	}
	println!();
}

fn print_ball(ball: &Ball) {
	let x = ball.x as i32;
	let y = ball.y as i32;
	_ = term_cursor::set_pos(x, y + 2);
	print!("o");
	println!();
}