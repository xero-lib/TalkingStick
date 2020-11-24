export default async function onChannelCreate(c) {
    if(c.name) {
        await c.fetch()
            .then(s => console.log(`Fetched new channel "${s?.name}" in "${s?.guild.name}"`))
            .catch(e => console.log(`Could not fetch ${e?.name} in ${e?.guild.name}:`,e));
    }
}