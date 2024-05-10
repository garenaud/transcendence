use colored::Colorize;
use std::io::Write;
use tungstenite::Connector::NativeTls;
use tungstenite::Message;

use ncurses::*;
use std::thread::sleep;
use std::time::Duration;

use crate::pong;
use crate::user::User;

pub fn create_tournament(user: User) {
	let req = user.get_client().get("https://{server}/api/tournament/create/"
		.replace("{server}", user.get_server().as_str()));
	let req = req.build();
	let res = user.get_client().execute(req.expect("ERROR WHILE BUILDING THE REQUEST"));
	let tournament_id = match res {
		Ok(res) => {
			if res.status().is_success() {
				let body = res.text().expect("ERROR WHILE READING THE RESPONSE");
				let json = json::parse(body.as_str()).unwrap();
				let tournament_id = json["tournamentid"].as_i32().unwrap();

				tournament_id.to_string()
			} else {
				eprintln!("{}", format!("Error while creating the tournament").red());
				return;
			}
		},
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return;
		}
	};

	println!("{}", format!("Tournament created with ID: {id}", id=tournament_id).green());

	let mut socket = match connect_ws_tournament(user.clone(), tournament_id) {
		Ok(socket) => socket,
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return;
		}
	};

	println!("{}", format!("Waiting for players to join the tournament").green());

	handle_tournament(user.clone(), &mut socket);
}

/**
 * Join a tournament.
 * Will ask the user for the tournament ID and then join the tournament.
 * 
 * Args:
 * 		user: User - The user object
 */
pub fn join_tournament(user: User) {

	// Get the tournament ID
	let mut tournament_id = String::new();
	loop {
		tournament_id.clear();
		print!("Enter the tournament ID: ");
		_ = std::io::stdout().flush();

		std::io::stdin()
			.read_line(&mut tournament_id)
			.expect(&format!("Erreur lors de la lecture de l'entrée").red());
		tournament_id = (*tournament_id.trim()).to_string();

		if tournament_id.len() <= 0 {
			eprintln!("{}", format!("Tournament ID can't be empty").red());
			continue;
		}

		let req = user.get_client().get("https://{server}/api/tournament/join/{id}"
			.replace("{server}", user.get_server().as_str())
			.replace("{id}", &tournament_id));
		let res = req.build();
		let res = user.get_client().execute(res.expect("ERROR WHILE BUILDING THE REQUEST"));
		match res {
			Ok(res) => {
				if res.status().is_success() {
					break;
				} else if res.status().is_client_error(){
					eprintln!("{}", format!("Tournament not found or ID invalid").red().bold());
					continue;
				}
			},
			Err(_) => {
				eprint!("{}", format!("Tournament not found or ID invalid").red().bold());
				continue;
			}
		}
		break;
	}

	// Join the tournament
	let mut socket = match connect_ws_tournament(user.clone(), tournament_id) {
		Ok(socket) => socket,
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return;
		}
	};

	handle_tournament(user.clone(), &mut socket);
}

/**
 * Connect to the tournament websocket
 
 *	Args:
 *		user: User - The user object
 *		tournament_id: String - The tournament ID
 */
fn connect_ws_tournament(user: User, tournament_id: String) -> Result<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>, Box<dyn std::error::Error>> {

	// Create a TLS connector (and TCP stream) to dodge the self-signed certificate
	let mut connector = native_tls::TlsConnector::builder();
	let connector = connector.danger_accept_invalid_certs(true);
	let connector = match connector.build() {
		Ok(connector) => connector,
		Err(err) => {
			eprintln!("{}", format!("{}", err).red().bold());
			return Err(Box::new(err));
		}
	};
	let stream = match std::net::TcpStream::connect(format!("{server}:443", server=user.get_server())) {
		Ok(stream) => stream,
		Err(err) => {
			eprintln!("{}", format!("{}", err).red().bold());
			return Err(Box::new(err));
		}
	};

	// Open the websocket connection
	match tungstenite::client_tls_with_config("wss://{server}/ws/tournament/{id}/"
		.replace("{server}", &user.get_server()).replace("{id}", tournament_id.as_str()),
		stream,
		None,
		Some(NativeTls(connector))) {
			Ok((ws, _)) => return Ok(ws),
			Err(err) => {
				eprintln!("{}", format!("{}", err).red().bold());
				
				eprintln!("Error while connecting to the websocket");

				return Err(Box::new(err));
			}
	};
}

/**
 * Handle tournament (connect to the game, tell to the server the result, etc...)
 * 
 * Args:
 * 		user: User - The user object
 * 		socket: &mut tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>> - The websocket connection to the server
 */
fn handle_tournament(user: User, socket: &mut tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>) {
	let mut player_nb = -1;
	let mut game_id = -1;

	'selection: loop {
		match socket.read() {
			Ok(msg) => {
				match msg {
					Message::Text(msg) => {
						let msg = msg.as_str();
						let json = json::parse(msg).unwrap();

						println!("{}", format!("{:#?}", json).green());

						match json["action"].as_str().unwrap() {
							"startTournament" => {
								// Ask for the gameId
								if player_nb == -1 {
									eprintln!("{}", format!("Error: player_nb not set").red());
									return;
								}
								_ = socket.send(Message::Text(r#"{"message":"getGameId", "playernb":"{pid}"}"#.to_string()
									.replace("{pid}", player_nb.to_string().as_str())));

								// Get the gameId and start the game
								loop {
									match socket.read() {
										Ok(msg) => {
											match msg {
												Message::Text(msg) => {
													let msg = msg.as_str();
													let json = json::parse(msg).unwrap();
													match json["action"].as_str().unwrap() {
														"gameid" => {
															game_id = json["game_id"].as_i32().unwrap();
															break 'selection;
														},
														_ => {}
													}
												},
												_ => {}
											}
										},
										Err(err) => {
											eprintln!("{}", format!("{:#?}", err).red());
											return;
										}
									}
								}
							},
							"playernb" => {
								player_nb = json["player_nb"].as_i32().unwrap();
								continue;
							},
							"gameid" => {
								game_id = json["game_id"].as_i32().unwrap();
								continue;
							},
							_ => {}
						}
					},
					_ => {}
				}
			},
			Err(err) => {
				eprintln!("{}", format!("{:#?}", err).red());
				break;
			}
		};
	}

	match pong::connect_game(user.clone(), game_id.to_string(), true) {
		Some(res) => {
			if res {
				println!("{}", format!("You won the game").green().bold());
				_ = socket.send(Message::Text(r#"{"message":"winner"}"#.to_string()));
			} else {
				println!("{}", format!("You lost the game").red().bold());
				_ = socket.send(Message::Text(r#"{"message":"looser"}"#.to_string()));
				return;
			}
		},
		None => {
			eprintln!("{}", format!("Error while connecting to the game").red());
			return;
		}
	};
	match socket.read() {
		Ok(msg) => {
			match msg {
				Message::Text(msg) => {
					let msg = msg.as_str();
					let json = json::parse(msg).unwrap();
					match json["action"].as_str().unwrap() {
						"gameid" => {
							game_id = json["game_id"].as_i32().unwrap();
							match pong::connect_game(user.clone(), game_id.to_string(), false) {
								Some(res) => {
									if res {
										println!("{}", format!("You won the tournament").green().bold());
									} else {
										println!("{}", format!("You lost the tournament").red().bold());
									}
								},
								None => {
									println!("{}", format!("Error during the game").red());
									return;
								}
							}
						},
						_ => {}
					};
				},
				_ => {}
			}
		},
		Err(err) => {
			eprintln!("{}", format!("{:#?}", err).red());
			return;
		}
	}
}
