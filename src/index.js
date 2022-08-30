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
    if ('doesNodeExist' in ConsoleArgs.options) {
      const nodeName = ConsoleArgs.options.doesNodeExist;
      SamCore.doesNodeExist(nodeName);
    }

    else if ('doesSettingsExist' in ConsoleArgs.options) {
      SamCore.doesSettingsExist();
    }
  }

  SamCore.doesNodeExistReturn = (data) => {
    Helpers.log({loud: true}, `{"response": ${data.response ? 1 : 0}}`);
    SamCore.disconnect();
  }

  SamCore.doesSettingsExistReturn = (data) => {
    Helpers.log({loud: true}, `{"response": ${data.response ? 1 : 0}}`);
    SamCore.disconnect();
  }

  // Start the connection process
  SamCore.run();
}

main();