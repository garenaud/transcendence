use reqwest::blocking::Client;

#[derive(Clone)]
#[derive(Debug)]
pub struct User {
	id: String,
	username: String,
	logged_in: bool,
	session_id: String,
	client: Client,
	server: String,
	csrf: String,
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
			csrf: String::new(),
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

	pub fn fill(&mut self, id: String, username: String, session_id: String, client: Client, server: String, csrf: String) {
		self.id = id;
		self.username = username;
		self.logged_in = true;
		self.session_id = session_id;
		self.client = client;
		self.server = server;
		self.csrf = csrf;
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

	pub fn get_csrf(&self) -> String {
		self.csrf.clone()
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
