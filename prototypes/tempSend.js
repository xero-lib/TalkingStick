import './timeoutDelete.js';
import Discord from 'discord.js';
import { date } from '../coagulators/functionCoagulator.js';

Object.defineProperty(Discord.Message.prototype, "tempSend", {
    value: function tempSend(msg) {
        return this.channel.send(msg).timeoutDelete(this)
            .catch(e => {
                console.log(date(),`Could not send message in response to ${this.author.username}#${this.author.discriminator} (${this.member.id}) in ${this.channel.name} in ${this.guild.name}, attempting to override...`);
                this.channel.updateOverwrite(findRole(this.guild, 'Talking Stick'), {SEND_MESSAGES: true})
                    .then(() => {
                        console.log(date(),`Set Talking Stick type permissions in ${this.channel.name} (${this.guild.name})`);
                        this.tempSend(msg).timeoutDelete(this)
                            .catch(e3 => {
                                console.error(date(),`Channel typing override for ${this.channel.name} successful, but still unable to send message. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}):`,e3);
                            })
                    })
                    .catch(e2 => console.error(date(),`Could not override permissions for ${this.channel.name} in ${this.guild.name}. Original command ${chalk.greenBright(this.content)} issued by ${this.author.username}#${this.author.discriminator} (${this.author.id}) due to ${e}\n${date}Last error:`,e2));
            });
    },
    writable: true,
    configurable: true
});