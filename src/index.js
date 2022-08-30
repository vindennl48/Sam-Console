const { SamCore, Helpers } = require('./SamCore.js');

function main() {

  // Name of the node we are running
  SamCore.nodeName = 'testNode';

  // When connection to SamCore is initialized
  SamCore.onConnect = () => {
    SamCore.doesNodeExist('gdrive');  // See if this node is connected
    SamCore.doesSettingsExist();  // See if settings.json exists for SamCore
  }

  SamCore.doesNodeExistReturn = (data) => {
    Helpers.log({leader: 'warning', space: true}, `Does Node "${data.nodeName}" exist?:`, data.response);
  }

  SamCore.doesSettingsExistReturn = (data) => {
    Helpers.log({leader: 'warning', space: true}, 'Does SamCore settings exist?:', data.response);
  }

/**
  // Responses from SamCore
  SamCore.onMessage = (data) => {
    // Responses from SamCore
    if (data.nodeSender = 'samCore') {
      // List all API calls we will need to receive responses from
      if (data.apiCall = 'doesNodeExist') {
        Helpers.log('sub', `doesNodeExist: ${data.packet}`, {space: true});
      }

      return;
    }

    // Responses from other nodes
    if () {

    }
  }
*/

  // Start the connection process
  SamCore.run();
}

main();