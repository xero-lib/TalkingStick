import {client} from '../coagulators/configCoagulator.js'

export default function (id) {
    try {
        id = client.users.cache.get(id);
        return id;    
    }
    catch {
        console.log(id, 'is either not a user in cache, or is not a valid user id');
        return false;
    }
}