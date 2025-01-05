#! /bin/bash

#ci-cd script to update the ec2 instance with the latest version of node image

# stop the current running containers
echo "docker-compose -f dashboard/docker-compose-aws-2.yaml down"
docker-compose -f dashboard/docker-compose-aws-2.yaml down

# Check if image exists before attempting to remove it
echo "remove the old image from the VM"

# the "|| true" at the end allows to return 0 even when there is no image on the machin.
docker images | grep harbor.getapp.sh/getapp-dev/dashboard | awk '{print $3}' | xargs -I {} docker rmi {} || true
echo "docker-compose -f dashboard/docker-compose-aws-2.yaml up -d"
docker-compose -f dashboard/docker-compose-aws-2.yaml up -d
