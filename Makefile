# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppotier <ppotier@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/22 11:53:18 by vgroux            #+#    #+#              #
#    Updated: 2024/03/18 10:38:04 by ppotier          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	@mkdir -p ~/data/db
	@mkdir -p ~/data/back
	@mkdir -p ~/data/front
	docker-compose -f ./docker-compose.yml up -d --build

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
	docker image prune -a
	docker-compose -f ./docker-compose.yml down

fclean: clean
	docker system prune -a --volumes
	
vol:
	docker volume rm web42_backend
	docker volume rm web42_db
	docker volume rm web42_frontend
	sudo rm -rf ~/data

re: fclean
	docker-compose -f ./docker-compose.yml up -d --build
	
.PHONY: all down re clean fclean vol debug look