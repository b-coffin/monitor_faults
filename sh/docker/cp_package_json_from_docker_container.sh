#!/bin/sh

# dockerコンテナからpackage.jsonをコピー
docker cp mf_container:/usr/app/package.json package.json

# dockerコンテナからpackage-lock.jsonをコピー
docker cp mf_container:/usr/app/package-lock.json package-lock.json
