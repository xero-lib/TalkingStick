import { client } from "../exports/configExports.js"

export default function (id) {
    let uid = client.users.cache.get(id);
    if (uid) return uid;
}