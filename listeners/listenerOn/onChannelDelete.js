export default async function (e) {
    if(e.name){
        await e.fetch()
            .then(s => console.log(`Fetching deleted channel ${e.name})`))
            .catch(e => console.log(`Could not refetch ${e.id}`));
    }
}