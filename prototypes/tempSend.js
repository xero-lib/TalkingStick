import './timeoutDelete.js';
import Discord from 'discord.js';

Object.defineProperty(Discord.Message.prototype, "tempSend", {
    value: function tempSend(msg) {
        return this.channel.send(msg).timeoutDelete(this)
            .catch(e => {
                console.log(e, `\nCould not send message in response to ${this.author.username}#${this.author.discriminator} (${this.member.id}) in ${this.channel.name} in ${this.guild.name}, attempting to override...`);
                this.channel.updateOverwrite(findRole(this.guild, 'Talking Stick'), {SEND_MESSAGES: true})
                    .then(s => {
                        console.log(`Set Talking Stick type permissions in ${this.channel.name} (${this.guild.name})`);
                        this.tempSend(msg).timeoutDelete(this)
                            .catch(e3 => {
                                console.log(e3, `\nChannel typing override for ${this.channel.name} successful, but still unable to send message. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}).`);
                            })
                    })
                    .catch(e2 => console.log(e2, `\nCould not override permissions for ${this.channel.name} in ${this.guild.name}. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}).`));
            });
    },
    writable: true,
    configurable: true
});