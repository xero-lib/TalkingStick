import { client } from '../coagulators/configCoagulator.js';
import { date } from '../coagulators/functionCoagulator.js';

export default function (username) {
    try {
        user = client.users.cache.find(u => `${u.username}#${u.discriminator}` == username);
        return user;
    }
    catch {
        console.error(date,username, 'is either not a user in cache, or is not a valid username');
        return false;
    }
}