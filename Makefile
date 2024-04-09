all:
	@mkdir -p ~/data/db
	docker-compose build
	@sleep 3
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
	rm -rf ~/data

re: fclean all
	
.PHONY: all down re clean fclean vol debug look