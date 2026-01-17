import { Guild, GuildMember, ChatInputCommandInteraction, User, NonThreadGuildBasedChannel } from "discord.js";

export type ValidInteraction = ChatInputCommandInteraction & { guild: Guild, member: GuildMember, channel: NonThreadGuildBasedChannel };