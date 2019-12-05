## leanlearn API  
### Docker configuration:  
#### Requirements:
 - docker  
 - docker-compose
#### Steps:
 - Create an `.env` file to config database information:
    ```bash
    MONGO_USERNAME=[your-mongodb-username]
    MONGO_PASSWORD=[your-mongodb-password]
    MONGO_PORT=[your-mongodb-port]
    MONGO_DB=[your-mongodb-database-name]
    ```
- Run `docker-compose up` from terminal
