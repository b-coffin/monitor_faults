# monitor_faults

## 概要
サーバのログファイルを読み込み、対象サーバの故障期間を出力します。
読み込むログファイルは、監視対象のサーバに一定間隔でping応答を行なった結果をcsv形式に変換したものです。
csvファイルには、サーバのアドレスと確認した日時、応答時間が記入されています。
故障期間の出力結果も同様にcsv形式で出力され、サーバのアドレス・故障期間が記入されています。
なお、読み込むファイルはinputフォルダ、出力ファイルはoutputフォルダに格納されます。

## 実行方法
実行はDockerを使用して行います。

### Dockerの起動
```
$ sh sh/docker/start.sh
```

### ファイル実行
```
$ sh sh/docker/run_index.sh
```

### 出力結果をDockerコンテナからホストにコピー
```
$ sh sh/docker/cp_output.sh
```

### Dockerの終了
```
$ sh sh/docker/finish.sh
```
