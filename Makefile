# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppotier <ppotier@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/22 11:53:18 by vgroux            #+#    #+#              #
#    Updated: 2024/04/06 13:42:27 by ppotier          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	@mkdir -p ~/data/db
	docker-compose build
	docker-compose up -d

down: 
	docker-compose down

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

fclean: down clean vol
	docker system prune -a --volumes
	
vol:
	docker volume rm ft_transcendence_db
	rm -rf ~/data/db

re: fclean all
	
.PHONY: all down re clean fclean vol debug look
