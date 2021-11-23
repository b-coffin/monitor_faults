# Docker Hubから入手したimageを元にimageを作成します
FROM node:14.17.1

# image内にアプリケーションディレクトリを作成する
WORKDIR /usr/app

# package.jsonおよびpackage-lock.jsonをコピー
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# npm installの処理を走らせた後に，アプリケーションのソースコードをimage内にコピー（バンドル）する
COPY . .

# 外部に公開するポート番号を指定する
EXPOSE 8080
