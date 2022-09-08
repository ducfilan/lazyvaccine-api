
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
	NODE_PORT=8080
	NODE_ENV=dev
	JWT_KEY=7eaa951e-6688-42cc-be3a-78a712da979d
	GOOGLE_CLIENT_ID=45752199260-mh4bu2geh3f7bi39fvrni7ajsb30ck59.apps.googleusercontent.com
	RECAPTCHA_SECRET_KEY=6LeZTkUcAAAAALyFMb7rWO-u-DgGqXbGn0O-EbmU
	```
- Run `docker-compose up` from terminal
#### Usage:
- Run bash in docker container:

	`docker exec -it <container name>`

