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
      .option('-n, --does-node-exist <value>', 'Find out if a node is active in the network')
      .option('-m, --send-message <message>', 'Send a message to another node')
      .option('--node <node>', 'Specify node to send message to')
      .parse(process.argv);
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
  .addReturnCall(serverName, 'doesNodeExist', function(packet) {
    Helpers.log({loud: true}, packet.data);
    this.ipc.disconnect(serverName);
  })
  .run(function() {
    if ('doesNodeExist' in ConsoleArgs.options) {
      this.callApi(serverName, 'doesNodeExist', ConsoleArgs.options.doesNodeExist);
    }
    if ('sendMessage' in ConsoleArgs.options) {
      this.callApi(ConsoleArgs.options.node, 'message', ConsoleArgs.options.sendMessage);
      this.ipc.disconnect(serverName);
    }
  });
