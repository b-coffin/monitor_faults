const fs = require('fs');
const path = require('path');

const File = require('./file');
const Server = require('./server');
const Network = require('./network');

const DEFAULT_N = 2;
const DEFAULT_M = 2;
const DEFAULT_T = 100;

(async () => {
  try {
    fs.mkdirSync(path.join(__dirname, '..', 'output'), { recursive : true });

    // N回連続でタイムアウトであればサーバの故障とみなす
    const n = Number(process.argv[2]) || DEFAULT_N;
    if (n < 0) {
      throw new Error('unexpected value : n');
    }

    // 直近m回の平均応答時間がtミリ秒を超える場合に過負荷状態とみなす
    const m = Number(process.argv[3]) || DEFAULT_M;
    const t = Number(process.argv[4]) || DEFAULT_T;
    if (m < 0) {
      throw new Error('unexpected value : m');
    }
    if (t < 0) {
      throw new Error('unexpected value : t');
    }

    for (let i = 1; i <= 5; i++) {

      // ファイル読み込み
      const inputData = await File.read(path.join(__dirname, '..', 'input', `sample${i}.csv`));

      // サーバ毎に故障期間を取得
      const servers = getServers(inputData);
      const result = [];
      for (let server in servers) {
        if (n > servers[server].logs.length) {
          throw new Error('unexpected value : n');
        }
        const periods = servers[server].getFaultPeriods(n);
        for (let period of periods) {
          result.push({ network: servers[server].network, server: servers[server].address, status: 'fault', period: period});
        }
      }

      // サーバ毎に過負荷期間を取得
      for (let server in servers) {
        if (m > servers[server].logs.length) {
          throw new Error('unexpected value : m');
        }
        const periods = servers[server].getOverloadPeriods(m, t);
        for (let period of periods) {
          result.push({ network: servers[server].network, server: servers[server].address, status: 'overload', period: period});
        }
      }

      // ネットワーク毎に故障期間を取得
      const networks = getNetwork(servers);
      for (let network in networks) {
        const periods = networks[network].getFaultPeriods(n);
        for (let period of periods) {
          result.push({ network: networks[network].address, server: '*', status: 'fault', period: period});
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
 * @returns {object} サーバのリスト
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

/**
 *
 * @param {object} servers サーバのリスト
 * @returns {object} ネットワークのリスト
 */
function getNetwork(servers) {
  const networks = {};
  for (let server in servers) {
    const network = servers[server].network;
    if (!(network in networks)) {
      networks[network] = new Network(network);
    }
    networks[network].servers.push(servers[server]);
  }
  return networks;
}
