use rand::Rng;
use std::cmp::Ordering;

fn main() {
	println!("Welcome user");
	
	let mut choice: String = String::new();
	loop {
		println!("1: Devinez le nombre");
		println!("2: Quitter");

		choice.clear();
		std::io::stdin()
			.read_line(&mut choice)
			.expect("Échec de la lecture de l'entrée utilisateur");

		match choice.trim().parse() {
			Ok(num) => match num {
				1 => {
					plus_or_minus();
					continue;
				},
				2 => {
					println!("Au revoir !");
					break;
				},
				_ => {
					println!("Veuillez entrer un choix valide !");
					continue;
				}
			},
			Err(_) => {
				println!("Veuillez entrer un nombre !");
				continue;
			}
		};
	}
}

fn plus_or_minus() {
	let to_find: u32 = rand::thread_rng().gen_range(1..101);
	let mut supposition: String = String::new();
	
	println!("Devinez le nombre !");
	loop {
		supposition.clear();
		
		std::io::stdin()
			.read_line(&mut supposition)
			.expect("Échec de la lecture de l'entrée utilisateur");
	
		let supposition: u32 = match supposition.trim().parse() {
			Ok(num) => num,
			Err(_) => {
				println!("Veuillez entrer un nombre !");
				continue;
			}
		};
		
		match supposition.cmp(&to_find) {
			Ordering::Less => println!("C'est plus !"),
			Ordering::Greater => println!("C'est moins !"),
			Ordering::Equal => {
				println!("Vous avez gagné !");
				break;
			}
		}
		println!("Veuillez entrer un nombre.");
	}
}
