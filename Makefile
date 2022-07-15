run:
	docker-compose up

build:
	docker-compose up --build

kill:
	docker-compose down

clean:
	sudo rm package-lock.json; sudo rm -r node_modules; npm i;