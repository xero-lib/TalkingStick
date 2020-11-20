import './tempReply.js';
import './tempSend.js';

Object.defineProperty(Promise.prototype, "timeoutDelete", {
    value: function timeoutDelete(message) {
        this.then(async sentMessage => {
            //implement more specific delete keys
            if(!sentMessage?.deleted){
                await sentMessage.delete({timeout: 30000})
                    .then(s => console.log(`Successfully deleted message requested by ${message?.author?.username}#${message?.author?.discriminator} (${message?.member?.id}) in ${message?.channel?.name} in ${message?.guild?.name}`))
                    .catch(e => console.error(`Could not delete message requested by ${message?.author?.username}#${message?.author?.discriminator} (${message?.member?.id}) in ${message?.channel?.name} in ${message?.guild?.name}`))
            } 
            if(!message?.deleted){
                await message.delete()
                    .then(s => console.log(`Successfully deleted message sent by ${message?.author?.username}`))
                    .catch(e => console.log(`Unable to delete message sent by ${message?.author?.username}#${message?.author?.discriminator} (${message?.author?.id}) :`,e))
            }
            else {
                console.log(`Message from ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.channel.name} in guild ${message.guild.name} as well as the response from the bot: ${this.content}\n have already been deleted.`);
            }
        })
            .catch(e => {
                if(!message.deleted){
                    console.error(`Unable to apply delete timeout to message from ${message.author.username}#${message.author.discriminator} (${message.member.id}) in ${message.channel.name} in ${message.guild.name}:`, e);
                }
                else if (message.deleted){
                    message.tempSend(`I noticed you deleted the original command message! This is totally fine, however, I do it for you after 30 seconds! If you want, you can delete it sooner, but if it is still there after 30 seconds, I will delete it to save space.`);
                } else {
                    console.log('An unknown error has occured in timeoutDelete:',e);
                }
            })
        return this;
    },
    writable: true,
    configurable: true
});