import {findRole} from '../coagulators/functionCoagulator.js';

export default async function (roleName, message) {
    try {
        await findRole(message.guild, roleName).delete(`TSDestroyed by ${message.author.name} (${message.author.id})`); //delete Stick Controller
        console.log(`Deleted role ${roleName} in ${message.guild.name} (${message.guild.id})`);
    }
    catch (err) {
        console.error(err, `\n Error in ${message.guild} (${message.guild.id}) by ${message.member.displayName} (${message.member.id})`);
        return;
    }
}