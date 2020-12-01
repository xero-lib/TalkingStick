import { developer } from '../coagulators/configCoagulator.js';
import { setPresence } from '../coagulators/functionCoagulator.js';
import { date } from '../coagulators/functionCoagulator.js';

export default async function(message) {
    console.log(date(),`Refresh Presence requested by ${message.author.username}#${message.author.discriminator}`)
    if(message.member.id == (developer.id || '178973249500217344')) {
        setPresence()
            .then(() => console.log(date(),'Presence set.'));
    }
}