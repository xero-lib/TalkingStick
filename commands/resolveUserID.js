import '../prototypes/tempSend.js';
import util from 'util';
import { developer } from '../coagulators/configCoagulator.js';
import { resolveUserID } from '../coagulators/functionCoagulator.js'

export default async function (message, args) {
    if(message.member.id == developer.id) {
        let user = resolveUserID(args);
        if(user) message.channel.send(`\`\`\`js\n${util.inspect(user)}\n\`\`\``);// message.channel.send(`\`\`\`\nUsername: ${user.username}#${user.discriminator},\nUserID: ${user.id},\nAvatarURL: ${user.avatarURL()}\nIsBot?: ${user.bot},\nClient: ${user.client},\nCreatedAt: ${user.createdAt},\nCreatedTimestamp: ${user.createdTimestamp},\nlastMessageObject: ${user.lastMessage},\nflags: ${user?.flags},\n\`\`\``);
        else{message.tempSend(args, 'resolveUserID returned **`false`**')}
    }
}