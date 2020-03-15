## Start

Set env variables (fetched by docker): <br />
`echo "MONGO_URI=<mongodb_url_here>" >> .env` <br />
`echo "SECRET_KEY=<secret_jwt_salt_here>" >> .env`

### Dev

##### Hot-reload typescript from docker container:

- From Dockerfile <br />
  `docker build -t crwn-server:dev --target dev .`<br />
  `docker run --rm -it -p 8080:8080 -v $(pwd):/app/server crwn-server:dev bash` <br />
  Then from container run:
  `root@1fdb0daaa93b:/app/server# npm start`

---

- Or run from docker-compose (without npm logs)
  `docker-compose up -d`

---

<br />
 
### Build

- From Dockerfile <br />
  `docker build -t crwn-server --target prod . && docker run -p 8080:8080 crwn-server`<br />

- From docker-compose <br />
  `docker-compose build && docker-compose up`<br />

---
