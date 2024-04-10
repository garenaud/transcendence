# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: grenaud- <grenaud-@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/22 11:53:18 by vgroux            #+#    #+#              #
#    Updated: 2024/04/10 21:32:25 by grenaud-         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	@mkdir -p ~/data/db
	@mkdir -p ~/data/back
	@mkdir -p ~/data/front
	docker-compose build
	@sleep 3
	docker-compose up -d

down: 
	docker-compose down

debug:
	@mkdir -p ~/data/db
	@mkdir -p ~/data/back
	@mkdir -p ~/data/front
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

fclean: down clean vol
	docker system prune -a --volumes
	
vol:
# docker volume rm ft_transcendence_backend
	docker volume rm ft_transcendence_db
# docker volume rm ft_transcendence_frontend
	rm -rf ~/data

re: fclean all
	
.PHONY: all down re clean fclean vol debug look