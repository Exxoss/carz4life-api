.PHONY: build docker-build docker-run docker run stop start remove

IMAGENAME=mobile-carz4life-api-img
CONTAINERNAME=mobile-carz4life-api
SHELL:=/bin/bash

build:
	npm install

docker-build:
	docker build -t ${IMAGENAME}:latest .

docker-run:
	docker run --name ${CONTAINERNAME} -p 8080:8080 -d ${IMAGENAME}

docker: build docker-build docker-run

run: build
	node index.js

stop:
	docker stop ${CONTAINERNAME}

start:
	docker start ${CONTAINERNAME}

remove:
	docker rm ${CONTAINERNAME}
	docker rmi ${IMAGENAME}