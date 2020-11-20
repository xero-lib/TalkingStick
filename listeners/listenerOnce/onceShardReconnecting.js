import {client, defaultPrefix} from '../../coagulators/configCoagulator.js';

export default async function () {
    console.log('Reconnecting...');
    client?.user?.setPresence({
        status: 'online',
        activity: {
          name: `${defaultPrefix}help`,
          type: 'LISTENING'  
        }
    })
    .then(s => console.log('Reconnected.', s))
    .catch(e => console.log('Could not set status, check if bot is online/status is set.'));
}