const { RouterOSClient } = require('routeros-client');

class MikroTik {
  constructor() {
    this.host = '192.168.88.1'; // colocar o ip real aqui
    this.client = new RouterOSClient({
      host: this.host,
      user: 'admin',
      password: '',
    });

    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  async getBandwidth(interfaceName) {
    await this.connect();
    const result = await this.client.menu('/interface/monitor-traffic')
      .getOnly({ interface: interfaceName, once: '' });

    return {
      timestamp: new Date().toLocaleTimeString(),
      rx: (result['rx-bits-per-second'] / 1e6).toFixed(2),
      tx: (result['tx-bits-per-second'] / 1e6).toFixed(2),
    };
  }
}

module.exports = MikroTik;
