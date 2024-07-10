#!/bin/bash
REGISTRY=localhost:5000  # push to local registry
CI_FULL_NAME='dfkibasys/ppr-dashboard'
TARGET_PLATFORMS='linux/amd64'
VERSION=test

docker buildx build --platform $TARGET_PLATFORMS --load -t "$CI_FULL_NAME:$VERSION" -f Dockerfile . --load

k3d image import $CI_FULL_NAME:$VERSION -c basyscluster