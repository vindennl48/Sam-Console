const { Client }  = require('../../samcore/src/Client.js');
const { Helpers } = require('../../samcore/src/Helpers.js');

// Setup all of the command line arguments
let ConsoleArgs = {
  commander: null,
  options: null,

  setup() {
    this.commander = require('commander');

    this.commander
      .version('1.0.0', '-v, --version')
      .usage('[OPTIONS]...')
      .option('-n, --new-song <name>', 'add song')
      .option('-l, --get-song-list', 'get list of all songs')
      .parse(process.argv);
      // .option('-n, --does-node-exist <value>', 'Find out if a node is active in the network')
      // .option('-m, --send-message <message>', 'Send a message to another node')
      // .option('--node <node>', 'Specify node to send message to')
      // .option('-f, --flag', 'Detects if the flag is present.')

    this.options = this.commander.opts();
  }
}
ConsoleArgs.setup();

Helpers.log_silent = true;

let nodeName   = 'console';
let serverName = 'samcore';
let node       = new Client(nodeName, serverName);

node
  .addReturnCall('dbjson', 'newSong', function(packet) {
    let result = {data: packet.data};
    Helpers.log({loud: true}, JSON.stringify(result));
    this.ipc.disconnect(serverName);
  })
  .addReturnCall('dbjson', 'getSongList', function(packet) {
    let result = packet.data;
    // let result = packet.data[0];
    Helpers.log({loud: true}, JSON.stringify(result));
    this.ipc.disconnect(serverName);
  })

  .run(function() {
    if ('newSong' in ConsoleArgs.options) {
      let name = ConsoleArgs.options.newSong;
      let username = 'mitch';  // get this from samcore data
      this.callApi('dbjson', 'newSong', { name: name, username: username });
    }

    if ('getSongList' in ConsoleArgs.options) {
      this.callApi('dbjson', 'getSongList');
    }
  });
