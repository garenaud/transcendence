# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: vgroux <vgroux@student.42lausanne.ch>      +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/22 11:53:18 by vgroux            #+#    #+#              #
#    Updated: 2024/03/11 19:03:12 by vgroux           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

RUST_SOURCE = cli/src/main.rs

all: cli
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

fclean: clean
	docker system prune -a --volumes

vol:
	docker volume rm $$(docker volume ls)

re: fclean
	docker-compose -f ./docker-compose.yml up -d --build
	
.PHONY: all down re clean fclean vol debug look $(RUST_SOURCE)