pub fn fibonnaci() {
	let mut choice: String = String::new();

	loop {
		println!("Entrez l'index de Fibonnaci recherché");
		choice.clear();

		std::io::stdin()
			.read_line(&mut choice)
			.expect("Veuillez entrer un nombre !");

		match choice.trim().parse() {
			Ok(num) => match num {
				0 => {
					println!("0");
					break;
				},
				1 => {
					println!("1");
					break;
				},
				_ => {
					println!("Le {}ieme nombre de Fibonnaci est {}", num, fibo(num));
					break;
				}
			},
			Err(_) => {
				println!("Veuillez entrer un nombre valide !");
				continue;
			}
		};
	}
}

fn fibo(num: u32) -> u32
{
	let mut n0 = 0;
	let mut n1 = 1;
	let mut n2 = 0;

	let mut i = 0;
	while i <= num {
		n2 = n0 + n1;
		n0 = n1;
		n1 = n2;
		i += 1;
	}
	return n2;
}