#!/bin/bash
REGISTRY=localhost:5000  # push to local registry
CI_FULL_NAME='dfkibasys/ppr-dashboard'
CI_UNPRIVILEGED_NAME='dfkibasys/ppr-dashboard-unprivileged'
TARGET_PLATFORMS='linux/amd64'
VERSION=test

sed -i 's/\r$//' ./deploy_unprivileged.sh

docker buildx build --platform $TARGET_PLATFORMS --load -t "$CI_UNPRIVILEGED_NAME:$VERSION" -f Dockerfile . --load
docker buildx build --platform $TARGET_PLATFORMS --load -t "$CI_UNPRIVILEGED_NAME:$VERSION" -f Dockerfile.unprivileged . --load

k3d image import $CI_UNPRIVILEGED_NAME:$VERSION -c basyscluster