# Install

1. Docker 
   1. Docker
   2. Docker Compose

2. Run

a. Mount docker servers 
```shell
docker-compose up -build -d
```
b. Stop docker file

```shell
CTRL + C
docker-compose down
```

c. If you want to delete volume (data) !!!
```shell
docker-compose down -v 
# or
docker volume prune 
```

d. View logs
```shell
docker-compose logs -f <web_server_1|web_client_1|...>
```

e. See more information about Docker 
> https://docs.docker.com/
