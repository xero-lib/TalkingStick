import '../prototypes/tempReply.js';
import {defaultPrefix as prefix} from '../coagulators/configCoagulator.js';

export default async function (roleName, message, roleColor) {
    try{
        message.guild.roles.create({
            data: {
                name: roleName,
                color: roleColor
            }, reason: `Created ${roleName}`
        });
        console.log(`Created ${roleName} in ${message.guild} (${message.guild.id})`);
    }
    catch (err) {
        console.error(err, `\n Error in ${message.guild} (${message.guild.id}), Create Role command failed. Command issued by ${message.member.displayName} (${message.member.id})`);
        message.tempReply(`Unable to create role. Check the bottom of \`${prefix}help\``);
        return;
    }
}