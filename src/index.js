const { Client }  = require('../../samcore/src/Client.js');
const { Helpers } = require('../../samcore/src/Helpers.js');

// Setup all of the command line arguments
let cargs = {
  commander: null,
  options:   null,

  setup() {
    this.commander = require('commander');

    this.commander
      .version('1.0.0', '-v, --version')
      .usage('[OPTIONS]...')
      .option('-l, --get-songs',                        'get all songs')
      .option('-s, --get-song <song name>',             'get data on specific song')
      .option('-u, --update-song <name/attr/value...>', 'add data to song or create new song')
      .option('-n, --new-song <name/daw...>',           'create a new song')
      .option('-w, --get-daw-home-dir <name>',          'Get working directory of daw')
      .option('-c, --call <node/api/args...>',          'Call an api call from the node network')
      .parse(process.argv);
      // .option('-n, --does-node-exist <value>', 'Find out if a node is active in the network')
      // .option('-m, --send-message <message>', 'Send a message to another node')
      // .option('--node <node>', 'Specify node to send message to')
      // .option('-f, --flag', 'Detects if the flag is present.')

    this.options = this.commander.opts();
  }
}
cargs.setup();

// Helpers with exporting to console
Helpers.log_silent = true;
function output(obj, pretty=true) {
  let result = ""
  if (pretty) { result = JSON.stringify(obj, null, 2); }
  else        { result = JSON.stringify(obj); }
  Helpers.log({loud: true}, result);
}
//--------------------

let nodeName   = 'console';
let serverName = 'samcore';
let node       = new Client(nodeName, serverName);

node.run({
  onInit:    onInit,
  onConnect: onConnect
});

/**
  * Before we can start running the node, we need to get the username
  * and settings
  */
async function onInit() {}

/**
  * Any code that needs to run when the node starts
  */
async function onConnect() {
  /**
    * Make an API call in the node network. args must be in the form of an
    * object.
    */
  if ('call' in cargs.options) {
    let node = cargs.options.call[0];
    let api  = cargs.options.call[1];
    let args = cargs.options.call[2];

    if (args === undefined) {
      output( await this.callApi(node, api) );
    }
    else {
      output( await this.callApi(node, api, JSON.parse(args)) );
    }
  }

  else if ('getSongs' in cargs.options) {
    output( await this.callApi('dbjson', 'getSongs') );
  }

  else if ('getSong' in cargs.options) {
    let song = cargs.options.getSong;

    output( await this.callApi('dbjson', 'getSong', { name: song }) );
  }

  else if ('getMixers' in cargs.options) {
    output( await this.callApi('dbjson', 'getMixers') );
  }

  else if ('getMixer' in cargs.options) {
    let mixer = cargs.options.getMixer;

    output( await this.callApi('dbjson', 'getMixer', { name: mixer }) );
  }

  else if ('updateSong' in cargs.options) {
    let name  = cargs.options.updateSong[0];
    let attr  = cargs.options.updateSong[1];
    let value = cargs.options.updateSong[2];

    output(await this.callApi(
      'dbjson',
      'updateSong',
      { name: name, attr: attr, value: value }
    ));
  }

  else if ('newSong' in cargs.options) {
    let name = cargs.options.newSong[0];
    let daw  = cargs.options.newSong[1];

    let packet = await this.callApi('dbjson', 'newSong', { name: name })

    if (packet.status) {
      output(await this.callApi('files', 'newSong', { name: name, daw: daw }));
    } else {
      output(packet)
    }
  }

  else if ('duplicateSong' in cargs.options) {
    let name    = cargs.options.newSong[0];
    let newName = cargs.options.newSong[1];
    let daw     = cargs.options.newSong[2];
  }

  else if ('getDawHomeDir' in cargs.options) {
    let name = cargs.options.getDawHomeDir;

    output(await this.callApi('files', 'getDawHomeDir', { name: name }));
  }

  this.ipc.disconnect(serverName);
}
