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
   * @returns {array}
   */
  getFaultPeriods() {
    let start = null;
    let end = null;
    const periods = [];
    for (let log of this.logs) {
      if (log.response === '-') {
        if (start === null) {
          start = log.date;
        }
      } else {
        if (start !== null) {
          end = log.date;
          periods.push(`${start} ~ ${end}`);
          start = null;
        }
      }
    }
    return periods;
  }

}

module.exports = Server
