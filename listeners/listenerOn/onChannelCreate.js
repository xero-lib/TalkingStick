import {client} from '../../coagulators/configCoagulator.js';

export default async function onChannelCreate(c) {
    if(c.name) {
        await c.fetch()
            .then(s => console.log(`Fetched new channel "${s?.name}" in "${client.guilds.cache.get(s.id)?.name}"`))
            .catch(e => console.log(e, `\nCould not fetch ${e?.name}`));
    }
}