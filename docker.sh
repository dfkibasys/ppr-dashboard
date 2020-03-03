#!/usr/bin/env bash
docker stop ppr-dashboard
docker rm ppr-dashboard
docker build -t basys/ppr-dashboard .
docker run -p 8090:80 --restart unless-stopped --name ppr-dashboard -d basys/ppr-dashboard