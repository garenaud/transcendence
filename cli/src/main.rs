mod pong;
mod login;

// fn main() {
// 	if login::login() {
// 		println!("user is logged");
// 	} else {
// 		println!("ERROR");
// 	}

// 	loop {
// 		pong::game();
// 	}
// }


use std::io;
use std::io::Read;
use std::str::from_utf8;
use std::sync::mpsc;
use std::sync::mpsc::Receiver;
use std::sync::mpsc::TryRecvError;
use std::{thread, time};

fn main() {
	let stdin_channel = spawn_stdin_channel();
	loop {
		match stdin_channel.try_recv() {
			Ok(key) => println!("Received: {}", key),
			Err(TryRecvError::Empty) => println!("Channel empty"),
			Err(TryRecvError::Disconnected) => panic!("Channel disconnected"),
		}
		sleep(500);
	}
}

fn spawn_stdin_channel() -> Receiver<String> {
	let (tx, rx) = mpsc::channel::<String>();
	thread::spawn(move || loop {
		let mut buffer: &[u8] = &[];
		io::stdin().read(&mut buffer).unwrap();
		tx.send(from_utf8(&mut buffer).unwrap().to_string());
	});
	rx
}

fn sleep(millis: u64) {
	let duration = time::Duration::from_millis(millis);
	thread::sleep(duration);
}