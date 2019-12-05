## leanlearn API  
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
    MONGO_USERNAME=[your-mongodb-username]
    MONGO_PASSWORD=[your-mongodb-password]
    MONGO_PORT=[your-mongodb-port]
    MONGO_DB=[your-mongodb-database-name]
    ```
- Run `docker-compose up` from terminal
