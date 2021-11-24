class Network {
  constructor(address) {
    this.address = address;
    this.servers = [];
  }

  /**
   * ネットワーク内のサーバ全てがタイムアウトだった場合にネットワーク自体もタイムアウト状態であるとするため、ネットワーク自体のログを作成
   * @returns {object[]}
   */
  get faultLog() {
    if (this.servers.length <= 0) {
      return [];
    }
    const faultLog = [];
    for (let l = 0; l < this.servers[0].logs.length; l++) {
      let response = '-';
      for (let s = 0; s < this.servers.length; s++) {
        if (this.servers[s].logs[l].response !== '-') {
          response = null;
          break;
        }
      }
      faultLog.push({ date: this.servers[0].logs[l].date, response: response });
    }
    return faultLog;
  }

  /**
   * 故障期間を取得
   * @param {number} n n回連続でタイムアウトであればネットワークの故障とみなす
   * @returns {array}
   */
  getFaultPeriods(n) {
    let start = null;
    let end = null;
    let count = 0;
    const periods = [];
    for (let log of this.faultLog) {
      if (log.response === '-') {
        count++;
        if (start === null) {
          start = log.date;
        }
      } else {
        if (start !== null) {
          if (count >= n) {
            end = log.date;
            periods.push(`${start} ~ ${end}`);
          }
          start = null;
          count = 0;
        }
      }
    }
    return periods;
  }

}

module.exports = Network;
