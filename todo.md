# Todo
- [ ] Devise a solution to the flag silliness
    - [ ] Class vs helper functions
- [ ] Finish/remake/polish `README`
- [ ] Replace user and channel names with <@/#{id}> in most places
- [ ] Update `replyEphemeral` to ensure previous message stops spinning.
- [ ] Integrate guild channel overwrites deletion on tsdestroy
- [?] Properly implement deferReply
    - [x] Consolidate editReply and reply to avoid `InteractionAlreadyReplied` errors, perhaps in a function tryEphemeral?
- [ ] Use Promise.allSettled instead of iterative awaits
- [ ] Update REVERT if unsynced permission detected
- [ ] Make sure to empty components, embeds, and content from interaction replies as needed
- [ ] Ensure all type `as` casts are valid
- [ ] Add a TSIgnore role and associated command so that administrators can prevent members from abusing Talking Stick to circumvent server-mutes.
- [ ] Manually server-mute any admins on tsjoin and user join, since they will not be affected by the @everyone role update?
- [ ] Add proper jsdoc.
- [ ] If user tries to `tsleave` in the wrong channel, list channels with the overwrite for `Stick Holder` and if they themselves have the `Stick Holder` role
- [ ] Align log-level text
- [ ] Consolidate comment terminology
---
# In Progress
---
# Non-critical Features
- [ ] Consolidate `e` vs `err`
- [ ] Implement response from developer to go to replied `message.id` in bot DMs
- [ ] Implement a queue/timer with an ordering system so that people leaving and joining go after the person who went before they joined. (optional manual pass order)
- [ ] Automatically remove voice-channel-type on client-side modal if not in vc?

---
# Done
- [x] Refactor to TypeScript for better type safety and linting
- [x] Switch to if guarding
- [x] Consolidate the ChatInputCommandInteraction type unions into a singular type to be imported
- [x] Make `tempX` prototypes return the promise instead of attempting to resolve them in the methods themselves
- [x] Remove chalk as a dependency
- [x] Remove all unnecessary .catch and pass the error up to be handled at the top
- [x] Implement `dnw`
- [x] Convert `helpArr` to a Map to Object and add a property for a short synopsys of the command for the `genHelpEmbed`
- [x] Add better notifications for `missing access` errors
- [x] Decide what to do if the stick holder leaves and there are no more stick holders: End the Stick-Session
- [x] Convert to `tsactive` and individual overwrites
    - [x] Rewrite to use per-user overwrites in addition to role-based overwrites to solve per-channel differences
    - [x] Bulk-update overwrites to avoid API overhead using OverwriteResolvable
- [x] TSAddStick is written only to work with voice. Fix.
    - [?] Fix `tsremstick` and `tsaddstick` to work in text channels, and provide better feedback if unable to add/rem sticks
- [x] Use channel overwrites for `VoiceStateUpdate` instead of checking to see if someone in the channel is a stick holder
- [x] Only let `tsjoin` be added to a given channel once