use ncurses::*;
use std::{thread, time};

pub fn game() {
	thread_userinput();
	loop {
		render();
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

fn thread_userinput() {
	thread::spawn(move || {
		initscr();
		raw();
		keypad(stdscr(), true);
		noecho();
		loop {
			let ch = getch();
			if ch == 27 {
				endwin();
				break;
			}
			println!("Received: {}", ch);
		}
	});
}