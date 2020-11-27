import {client, defaultPrefix} from '../coagulators/configCoagulator.js';

export default async function() {
  client?.user?.setPresence({
    status: 'online',
    activity: {
      name: `${defaultPrefix}help`,
      type: 'LISTENING'  
    }
  })
}
