import { client } from '../coagulators/configCoagulator.js'
import { date } from '../coagulators/functionCoagulator.js';

export default function (id) {
    try {
        let id = client.users.cache.get(id);
        return id;    
    }
    catch (err) {
        console.error(date(),id,'is either not a user in cache, or is not a valid user id. Error:',err);
        return false;
    }
}