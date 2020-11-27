import {date} from '../../coagulators/functionCoagulator.js';

export default async function (c) {
    if(c.name) {
        await c.fetch()
            .then(s => console.log(date,`Fetched new channel "${s?.name}" in "${s?.guild.name}"`))
            .catch(e => console.log(date,`Could not fetch ${e?.name} in ${e?.guild.name}:`,e));
    }
}