#!/bin/sh

# コンテナの停止
docker stop mf_container

# コンテナの削除
docker rm mf_container

# イメージの削除
docker rmi monitor_faults:latest
