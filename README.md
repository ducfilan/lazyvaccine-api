
## lazy-vaccine API
### Docker configuration:
#### Requirements:
- docker
- docker-compose
#### Installation:
- Mac OS: https://docs.docker.com/docker-for-mac/install/
- Windows (not verified): https://docs.docker.com/docker-for-windows/install/
- Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04, https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04
#### Steps:
- Create an `.env` file to config database information:
	```bash
	MONGO_USERNAME=lazyvaccine
	MONGO_PASSWORD=password
	MONGO_PORT=27017
	MONGO_DB=lazyvaccine
	NODE_PORT=80 (Need 80 to work with jest)
	NODE_ENV=dev
	JWT_KEY=
	GOOGLE_CLIENT_ID=
	RECAPTCHA_SECRET_KEY=

	DO_SPACES_KEY=
	DO_SPACES_SECRET=

	REDIS_ENDPOINT=cache
	REDIS_PORT=6379
	REDIS_PASSWORD=zUCXCkxt
	REDIS_USERNAME=default
	REDIS_SCHEME=redis
	```
- Run `docker-compose up` from terminal
#### Usage:
- Run bash in docker container:

	`docker exec -it <container name>`

- Local redis access:

	`docker exec -it cache redis-cli -u redis://default:zUCXCkxt@localhost`
