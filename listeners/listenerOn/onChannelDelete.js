import { date } from '../../coagulators/functionCoagulator.js';

export default async function (c) {
    if(c.name){
        await c.fetch()
            .then(c => console.log(date(),`Fetching deleted channel ${c.name})`))
            .catch(e => console.error(date(),`Could not refetch ${c?.id}`));
    }
}