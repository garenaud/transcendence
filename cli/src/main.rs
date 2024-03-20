mod pong;
mod login;
use std::io;
use tokio;

fn main() {
	println!("Welcome to T_BOOL TRANSCENDENCE !");
	let mut srv: String = String::new();

	loop {
		srv.clear();
		println!("Please enter the server IP (or URL):");
		io::stdin().read_line(&mut srv).expect("Failed to read line");
		if srv.len() > 0 {
			// PING THE SERVER (just to check if it's up)
			break;
		}
	}

	if login::login() {
		println!("user's login successfuly saved");
	} else {
		println!("ERROR");
	}
	pong::game();
}
