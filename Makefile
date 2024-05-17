RUST_FILES = main.rs menu.rs login.rs pong.rs user.rs
RUST_SOURCE = $(addprefix cli/src/, $(RUST_FILES))

all:
	@mkdir -p ~/data/db
	@bash req/ip.sh
	docker-compose build
	docker-compose up -d

cli:
	@if ! docker ps --format '{{.Names}}' | grep -q "cli"; then \
		echo "You must start the project before by using the command 'make'"; \
	else \
		docker exec -it cli /bin/bash; \
	fi

# nginx-ip:
# 	@if ! docker ps --format '{{.Names}}' | grep -q "nginx"; then \
# 		echo "You must start the project before by using the command 'make'"; \
# 	else \
# 		docker exec -it nginx ifconfig | grep 'inet addr' | cut -d: -f2 | awk '{print $1}' | grep 'Bcast' | cut -d' ' -f1; \
# 	fi

down: 
	docker-compose down --remove-orphans

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
	# cargo clean --manifest-path=cli/Cargo.toml
	docker image prune -a

fclean: down clean vol
	docker system prune -a --volumes
	
vol:
	docker volume rm ft_transcendence_db
	rm -rf ~/data

re: fclean all
	
.PHONY: all down re clean fclean vol debug look cli nginx-ip $(RUST_SOURCE)