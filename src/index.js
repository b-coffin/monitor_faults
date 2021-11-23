const fs = require('fs');
const path = require('path');

const File = require('./file');
const Server = require('./server');

(async () => {
  try {
    fs.mkdirSync(path.join(__dirname, '..', 'output'), { recursive : true });
    for (let i = 1; i <= 5; i++) {

      // ファイル読み込み
      const inputData = await File.read(path.join(__dirname, '..', 'input', `sample${i}.csv`));

      // サーバ毎に故障期間を取得
      const servers = getServers(inputData);
      const result = [];
      for (let server in servers) {
        const periods = servers[server].getFaultPeriods();
        for (let period of periods) {
          result.push({ server: servers[server].address, status: 'fault', period: period});
        }
      }

      // ファイル書き込み
      await File.write(result, path.join(__dirname, '..', 'output', `sample${i}.csv`));
    }
  } catch(e) {
    console.error(e);
  }
})();

/**
 * サーバのリストを作成
 * @param {array} data
 * @returns {array} サーバのリスト
 */
function getServers(data) {
  const servers = {};
  for (let i = 0; i < data.length; i++) {
    const address = data[i][1];
    const serverName = address.match(/[0-9.]+(?=\/)/)[0];
    if (!(serverName in servers)) {
      servers[serverName] = new Server(address);
    }
    const date = data[i][0];
    const response = (data[i][2] === '-') ? data[i][2] : Number(data[i][2]);
    servers[serverName].logs.push({ date: date, response: response});
  }
  return servers;
}
