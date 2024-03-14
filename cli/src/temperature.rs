pub fn choose_converter(){
	let mut choice: String = String::new();

	loop {
		println!("Que voulez-vous convertir ?");
		println!("1: Farenheit to Celsius");
		println!("2: Celsius to Farenheit");
		println!("3: Retour en arriere");
		
		choice.clear();

		std::io::stdin()
			.read_line(&mut choice)
			.expect("Échec de la lecture de l'entrée utilisateur");

		match choice.trim().parse() {
			Ok(num) => match num {
				1 => {
					farenheit_to_celsius();
					break;
				},
				2 => {
					celsius_to_farenheit();
					break;
				},
				3 => {
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

fn farenheit_to_celsius() {
	let mut choice: String = String::new();
	let faren: i32;

	loop {
		println!("Quelle temperature: ");
		choice.clear();

		std::io::stdin()
			.read_line(&mut choice)
			.expect("Échec de la lecture de l'entrée utilisateur");

		faren = match choice.trim().parse() {
			Ok(num) => num,
			Err(_) => {
				println!("Veuillez entrer un nombre !");
				continue;
			}
		};
		break;
	}

	let celsius: i32 = ((faren - 32) * 5) / 9;
	println!("{}°F correspond a {}°C", faren, celsius);
}

fn celsius_to_farenheit() {
	let mut choice: String = String::new();
	let celsius: i32;

	loop {
		println!("Quelle temperature: ");
		choice.clear();

		std::io::stdin()
			.read_line(&mut choice)
			.expect("Échec de la lecture de l'entrée utilisateur");

		celsius = match choice.trim().parse() {
			Ok(num) => num,
			Err(_) => {
				println!("Veuillez entrer un nombre !");
				continue;
			}
		};
		break;
	}

	let faren: i32 = (celsius * 9) / 5 + 32;
	println!("{}°C correspond a {}°F", celsius, faren);
}