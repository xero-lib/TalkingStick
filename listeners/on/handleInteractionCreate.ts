import { ButtonBuilder, ActionRowBuilder, ButtonStyle, GuildMember, Interaction, MessageFlags, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js"

import { logger } from "../../main.ts";

import { tsinit } from "../../exports/commandExports.ts";
import { Roles, ValidInteraction } from "../../exports/dataExports.ts";
import { CommandMap, CommandNames, getRole, replyEphemeral, replySafe } from "../../exports/functionExports.ts";

function isValidInteraction(interaction: ChatInputCommandInteraction): interaction is ValidInteraction {
    return interaction.inCachedGuild() && interaction.channel !== null; 
}

/**
 * Handler for InteractionCreate event. Resolves and executes command from {@link CommandMap}.
 * @param interaction The {@link Interaction} to operate on.
 */
export default async function handleInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (!isValidInteraction(interaction)) {
        let responseString = "";
        // if the interaction did not occur in a normal channel
        if (!interaction.channel) responseString += "Talking Stick can only be in normal channels.\n";
        // if the interaction did not occur in a guild
        if (!interaction.guild) responseString += "You can only use Talking Stick in servers.";

        await interaction.reply({
            content: responseString || "Invalid Interaction.",
            flags: MessageFlags.Ephemeral
        }).catch(logger.error);

        return;
    }

    const guild = interaction.guild;

    let member = interaction.member;
    if (!(member instanceof GuildMember)) {
        try {
            member = await guild.members.fetch(interaction.user.id);
            if (!member) throw "Failed to find user, even after fetch.";
        } catch(err) {
            logger.error(`Failed to fetch user ${interaction.user.username} (${interaction.user.id}) from ${guild.name}:\n${err}`);
            await replyEphemeral(interaction, "Sorry, we were unable to fetch your information. Please try again in a moment.").catch(logger.error);

            return;
        }
    }

    const command = CommandMap.get(interaction.commandName as CommandNames);

    if (!command) {
        logger.warn(`Attempted use of removed command: ${interaction.commandName} in ${guild.name} (${guild.id}). You should unregister it.`);
        await replyEphemeral(interaction, "This command is no longer available.").catch(logger.error);

        return;
    }

    // ensure guild has all required roles, asking to initialize them if not
    if (!["tsdestroy", "tsinit"].includes(interaction.commandName)) for (const role of Object.values(Roles)) {
        if (!await getRole(guild, role)) {
            if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                await replySafe(interaction, "The server appears to be lacking roles critical to Talking Stick functionality. Please ask an administrator or a member with Manage Roles permission to run the `tsinit` command.").catch(logger.error);
                return;
            }

            // defer
            try {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            } catch (err) {
                logger.debug(`Failed to defer reply. Attempting to continue without...\n${err}`);
            }
            const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Roles")
                .setStyle(ButtonStyle.Success)
            ;

            const cancel = new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)
            ;

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);

            // seems not to work?
            const response = await replyEphemeral(interaction, {
                content: "The server appears to be lacking roles critical to Talking Stick functionality. Would you like to create them now?",
                withResponse: true,
                components: [row],
            }).catch(logger.error);
            
            try {
                const confirmation = await response?.awaitMessageComponent({ time: 60_000 });
                if (!confirmation) throw "No confirmation status received";
                await confirmation.deferUpdate();
                await confirmation.editReply({ content: "Creating roles...", components: [] });

                if (confirmation.customId === "confirm") {
                    try {
                        await tsinit(interaction);
                    } catch (err) {
                        logger.error(`Failed to execute JIT tsinit in ${interaction.guild?.name} by ${interaction.user.username}:\n${err}`);
                        await replySafe(interaction, "An error was encountered while creating roles. Please directly run the `tsinit` command.").catch(logger.error);
                        
                        return;
                    }

                    await confirmation.editReply({ content: "Talking Stick roles initialized successfully!", components: [] }).catch(logger.error);

                    break;
                }

                await confirmation.editReply({ content: "Initialization cancelled.", components: [] }).catch(logger.error);
                return;
            } catch {
                await interaction.editReply({ content: "No confirmation received, cancelling.", components: [] }).catch(logger.error);
                return;
            }
        }
    }
    
    try {
        await command(interaction);
    } catch (err) {
        logger.error(`Encountered error when attempting to execute ${interaction.commandName}:\n${err}`);
        replyEphemeral(interaction, "Talking Stick encountered an issue. Please try again.").catch(logger.error);
    }
}