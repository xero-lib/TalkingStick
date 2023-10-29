import { client } from "../exports/configExports.js"

export default function (id) {
    let uid = client.users.cache.find(id);
    if (uid) return uid;
}