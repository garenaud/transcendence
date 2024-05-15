use reqwest::blocking::Client;
use colored::Colorize;
use std::time::Duration;

#[derive(Clone)]
#[derive(Debug)]
pub struct User {
	id: String,
	username: String,
	logged_in: bool,
	session_id: String,
	client: Client,
	server: String,
}

impl User {
	pub fn new() -> User {
		User {
			id: String::new(),
			username: String::new(),
			logged_in: false,
			session_id: String::new(),
			client: Client::new(),
			server: String::new(),
		}
	}

	// pub fn from(username: String, session_id: String, client: Client, server: String, csrf: String) -> User {
	// 	User {
	// 		username,
	// 		logged_in: true,
	// 		session_id,
	// 		client,
	// 		server,
	// 		csrf,
	// 	}
	// }

	pub fn fill(&mut self, id: String, username: String, session_id: String, client: Client, server: String) {
		self.id = id;
		self.username = username;
		self.logged_in = true;
		self.session_id = session_id;
		self.client = client;
		self.server = server;
	}
	
	pub fn get_client(&self) -> Client {
		self.client.clone()
	}

	pub fn get_server(&self) -> String {
		self.server.clone()
	}

	pub fn get_id(&self) -> String {
		self.id.clone()
	}

	pub fn get_username(&self) -> String {
		self.username.clone()
	}

	// pub fn get_session_id(&self) -> String {
	// 	self.session_id.clone()
	// }

	pub fn get_csrf(&self) -> Option<String> {
		let crsf = self.client.get("https://{server}/auth/".replace("{server}", self.server.as_str()))
			.header("User-Agent", "cli_rust")
			.header("Accept", "application/json")
			.timeout(Duration::from_secs(3));
		let crsf = crsf.build();
		let res_csrf = self.client.execute(crsf.expect("ERROR WHILE BUILDING THE REQUEST"));
		let csrf = match res_csrf {
			Ok(res) => {
				if res.headers().get("set-cookie").is_none() {
					eprintln!("{}", format!("No CSRF-Token in the header").red());
					return None;
				}
				let csrf = res.headers().get("set-cookie").unwrap();
				csrf.to_str().unwrap().to_string()
			},
			Err(err) => {
				eprintln!("{}", format!("Error in respond: {:#?}", err).red());
				return None;
			}
		};
		let csrf_token = csrf.split(';').nth(0).unwrap().split('=').nth(1).unwrap().to_string();

		return Some(csrf_token);
	}

	// pub fn is_logged(&self) -> bool {
	// 	self.logged_in
	// }
}



/*
"{	\"message\": \"OK\",
	\"id\": 1,
	\"username\": \"we\",
	\"first_name\": \"we\",
	\"last_name\": \"we\",
	\"email\": \"we@we.com\"
}"
*/
