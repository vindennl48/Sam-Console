/**
 * TODO: Add cli argument for node-ipc verbose
 */

const { SamCore, Helpers } = require('./SamCore.js');

let ConsoleArgs = {
  commander: null,
  options: null,

  setup() {
    this.commander = require('commander');

    this.commander
      .version('1.0.0', '-v, --version')
      .usage('[OPTIONS]...')
      .option('-n, --does-node-exist <value>', 'Find out if a node is active in the network')
      .option('-s, --does-settings-exist', 'Find out if the settings file for SamCore exists')
      .option('-m, --send-message <message>', 'Send a message to another node')
      .option('--node <node>', 'Specify node to send message to')
      .parse(process.argv);
      // .option('-f, --flag', 'Detects if the flag is present.')

    this.options = this.commander.opts();
  }
}

function main() {
  Helpers.log_silent = true; // Hide all logs, except ones we want

  // Setup outside arguments
  ConsoleArgs.setup();

  // Name of the node we are running
  SamCore.nodeName = 'console';

  SamCore.onConnect = () => {
    // for debugging
    // Helpers.log({loud: true}, 'Console Arguments: ', ConsoleArgs.options);

    if ('doesNodeExist' in ConsoleArgs.options) {
      const nodeName = ConsoleArgs.options.doesNodeExist;
      SamCore.doesNodeExist(nodeName);
    }

    else if ('doesSettingsExist' in ConsoleArgs.options) {
      SamCore.doesSettingsExist();
    }

    else if ('sendMessage' in ConsoleArgs.options) {
      if ('node' in ConsoleArgs.options) {
        SamCore.sendMessage({
          nodeSender: SamCore.nodeName,
          nodeReceiver: ConsoleArgs.options.node,
          apiCall: 'none',
          packet: {message: ConsoleArgs.options.sendMessage}
        });
      } else {
        /**
          * TODO: change the output to json format so it can be interpreted by LUA
          * */
        Helpers.log({leader: 'warning', loud: true}, 'sendMessage action requres --node argument!');
        SamCore.disconnect();
      }
    }
  }

  /**
   * Reminders on these built-in functions to communicate with SamCore:
   *  - You need to set up a call/response setup
   *  - data being received by these functions only contain the data.packet info
   *    - does not include nodeSender,nodeReceiver,apiCall
   * 
   * TODO: Need to actually add logic to filter out messages.
   */
  SamCore.onMessage = (data) => {
    Helpers.log({leader: 'highlight', loud: true}, 'Message Response: ', data);
    SamCore.disconnect();
  }

  SamCore.onError = (data) => {
    Helpers.log({loud: true}, JSON.stringify({
      response: "errorMessage",
      error: data.response
    }));
    SamCore.disconnect();
  }

  SamCore.doesNodeExistReturn = (data) => {
    Helpers.log({loud: true}, JSON.stringify({
      response: data.response
    }));
    SamCore.disconnect();
  }

  SamCore.doesSettingsExistReturn = (data) => {
    Helpers.log({loud: true}, JSON.stringify({
      response: data.response
    }));
    SamCore.disconnect();
  }

  // Start the connection process
  SamCore.run();
}

main();