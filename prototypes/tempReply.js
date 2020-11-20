import './tempSend.js';
import './timeoutDelete.js'
import Discord from 'discord.js';

Object.defineProperty(Discord.Message.prototype, "tempReply", {
    value: function tempReply(msg) {
        return this.reply(msg).timeoutDelete(this)
            .catch(e => {
                console.log(`\nCould not send message in reply to ${this.author.username}#${this.author.discriminator} (${this.member.id}) in ${this.channel.name} in ${this.guild.name}, attempting to override...`);
                this.channel.updateOverwrite(findRole(this.guild, 'Talking Stick'), {SEND_MESSAGES: true})
                    .then(s => {
                        console.log(`Set Talking Stick type permissions in ${this.channel.name} (${this.guild.name})`);
                        this.tempReply(msg)
                            .catch(e3 => {
                                console.log(e3, `\nChannel typing override for ${this.channel.name} successful, but still unable to send message. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}).`);
                            })
                    })
                    .catch(e2 => console.log(`\nCould not override permissions for ${this.channel.name} in ${this.guild.name}. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}) due to ${e}\nLast error:`, e2));
            });
    },
    writable: true,
    configurable: true
});
