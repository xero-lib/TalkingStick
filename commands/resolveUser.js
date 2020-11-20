import '../prototypes/tempSend.js';
import { resolveUser } from '../coagulators/functionCoagulator.js';
import { developer } from '../coagulators/configCoagulator.js';

export default async function (message, args) {
    if(message.member.id == developer.id) {
        let user = resolveUser(args);
        if(user) message.channel.send(`\`\`\`\nUsername: ${user.username}#${user.discriminator},\nUserID: ${user.id},\nAvatarURL: ${user.avatarURL()}\nIsBot?: ${user.bot},\nClient: ${user.client},\nCreatedAt: ${user.createdAt},\nCreatedTimestamp: ${user.createdTimestamp},\nlastMessageObject: ${user.lastMessage}\nflags: ${user.flags},\n\`\`\``);
        else{message.tempSend(args, 'resolveUser returned **`false`**')}
    }
}