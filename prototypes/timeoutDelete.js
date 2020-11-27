import './tempReply.js';
import './tempSend.js';
import { date } from '../coagulators/functionCoagulator.js';

Object.defineProperty(Promise.prototype, "timeoutDelete", {
    value: function timeoutDelete(message) {
        this.then(async sentMessage => {
            //implement more specific delete keys
            if(!sentMessage?.deleted){
                await sentMessage.delete({timeout: 30000})
                    .then(() => console.log(date,`Successfully deleted message requested by ${message?.author?.username}#${message?.author?.discriminator} (${message?.member?.id}) in ${message?.channel?.name} in ${message?.guild?.name}`))
                    .catch(e => console.error(date,`Could not delete message requested by ${message?.author?.username}#${message?.author?.discriminator} (${message?.member?.id}) in ${message?.channel?.name} in ${message?.guild?.name}:`,e))
            } 
            if(!message?.deleted){
                await message.delete()
                    .then(() => console.log(date,`Successfully deleted message sent by ${message?.author?.username}`))
                    .catch(e => console.error(date,`Unable to delete message sent by ${message?.author?.username}#${message?.author?.discriminator} (${message?.author?.id}) :`,e))
            }
            else {
                null; //find out why it tries to delete twice
            }
        })
            .catch(e => {
                if(!message.deleted){
                    console.error(date,`Unable to apply delete timeout to message from ${message.author.username}#${message.author.discriminator} (${message.member.id}) in ${message.channel.name} in ${message.guild.name}:`, e);
                }
                else if (message.deleted){
                    null;
                } else {
                    console.error(date,'An unknown error has occured in timeoutDelete:',e);
                }
            })
        return this;
    },
    writable: true,
    configurable: true
});