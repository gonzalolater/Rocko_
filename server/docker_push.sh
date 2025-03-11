#!/bin/sh

APP=rocko_backend
if [ -z "$1" ]
  then
    echo "Usage: ${0} <environment>"
    exit 1
fi

DT=`date +%Y%M%d%H%M%S`
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 835780150279.dkr.ecr.us-east-1.amazonaws.com
docker tag ${APP} 835780150279.dkr.ecr.us-east-1.amazonaws.com/${APP}:${DT}
docker push 835780150279.dkr.ecr.us-east-1.amazonaws.com/${APP}:${DT}

docker tag ${APP} 835780150279.dkr.ecr.us-east-1.amazonaws.com/${APP}:${1}_latest
docker push 835780150279.dkr.ecr.us-east-1.amazonaws.com/${APP}:${1}_latest

echo "Version: ${DT}"

