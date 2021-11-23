#!/bin/sh

# イメージの作成
docker build -t monitor_faults:latest .

# 起動
# docker run -p 49160:8080 -itd --name mf_container monitor_faults:latest
docker run -p 49160:8080 -itd --name mf_container monitor_faults:latest
