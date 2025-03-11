#!/bin/sh

APP=rocko_backend

# This script will deploy a docker version to an environment
if [ -z "$1" ]
  then
    echo "Usage: ${0} <environment>"
    exit 1
fi

echo aws ecs update-service --region us-east-1 --cluster ${1}-rocko --service ${1}-${APP} --force-new-deployment
aws ecs update-service --no-cli-pager --region us-east-1 --cluster ${1}-rocko --service ${1}-${APP} --force-new-deployment
