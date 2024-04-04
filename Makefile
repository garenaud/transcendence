RUST_FILES = main.rs menu.rs login.rs pong.rs
RUST_SOURCE = $(addprefix cli/src/, $(RUST_FILES))

all:
	@mkdir -p ~/data/db
	@mkdir -p ~/data/back
	@mkdir -p ~/data/front
	docker-compose -f ./docker-compose.yml up -d --build

cli: ${RUST_SOURCE}
	cargo build --manifest-path=cli/Cargo.toml

down:
	docker-compose -f ./docker-compose.yml down

debug: all
	docker-compose -f ./docker-compose.yml logs -f

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
	docker-compose -f ./docker-compose.yml down

fclean: clean vol
	docker system prune -a --volumes
	
vol:
	docker volume rm ft_transcendence_backend
	docker volume rm ft_transcendence_db
	docker volume rm ft_transcendence_frontend
	rm -rf ~/data

re: fclean
	docker-compose -f ./docker-compose.yml up -d --build
	
.PHONY: all down re clean fclean vol debug look $(RUST_SOURCE)
