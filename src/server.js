class Server {
  constructor(address) {
    this.address = address.match(/[0-9.]+(?=\/)/)[0];
    this.prefix = Number(address.match(/(?<=\/)[0-9]*/)[0]);
    this.logs = [];
  }

  /**
   * アドレスのネットワーク部を抽出
   * @returns {string}
   */
  get network() {
    const binaryAddress = this.address.split('.').map((value) => {
      return parseInt(value, 10).toString(2).padStart(8, '0');
    }).join('');
    const networkString = new Array(32 - this.prefix).fill(0).join('').padStart(32, binaryAddress);
    const network = networkString.match(/.{8}/g).map((value) => {
      return parseInt(value, 2);
    }).join('.');
    return network;
  }

  /**
   * 故障期間を取得
   * @param {number} n n回連続でタイムアウトであればサーバの故障とみなす
   * @returns {array}
   */
  getFaultPeriods(n) {
    let start = null;
    let end = null;
    let count = 0;
    const periods = [];
    for (let log of this.logs) {
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

  /**
   * 直近m回の平均応答時間がtを超えた場合（サーバが過負荷状態になっている場合）の期間を取得
   * @param {number} m 直近何回の平均応答時間を参照するか
   * @param {number} t 過負荷状態とする平均応答時間の閾値
   * @returns {array}
   */
  getOverloadPeriods(m, t) {
    let start = null;
    let end = null;
    const periods = [];
    for (let i = m - 1; i < this.logs.length; i++) {
      let sum = 0;
      for (let j = i; j > i - m; j--) {
        if (this.logs[j].response !== '-') {
          sum += this.logs[j].response;
        }
      }
      const average = sum/m;
      if (average > t) {
        if (start === null) {
          start = this.logs[i].date;
        }
      } else {
        if (start !== null) {
          end = this.logs[i].date;
          periods.push(`${start} ~ ${end}`);
          start = null;
        }
      }
    }
    return periods;
  }

}

module.exports = Server
