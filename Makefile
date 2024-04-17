RUST_FILES = main.rs menu.rs login.rs pong.rs user.rs
RUST_SOURCE = $(addprefix cli/src/, $(RUST_FILES))

all:
	@mkdir -p ~/data/db
	docker-compose build
	docker-compose up -d

cli: ${RUST_SOURCE}
	cargo build --manifest-path=cli/Cargo.toml

down: 
	docker-compose down

debug: all
	docker-compose logs -f

look:
	docker ps -a
	@echo ''
	docker image ls -a
	@echo ''
	docker volume ls
	@echo ''
	docker network ls

clean:
	cargo clean --manifest-path=cli/Cargo.toml
	docker image prune -a

fclean: down clean vol
	docker system prune -a --volumes
	
vol:
	docker volume rm ft_transcendence_db
	rm -rf ~/data

re: fclean all
	
.PHONY: all down re clean fclean vol debug look $(RUST_SOURCE)