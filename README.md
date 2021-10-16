# ![Image](https://media.discordapp.net/attachments/764720954499924001/783273517349208064/Talking_Stick64.png) Talking Stick<div style="text-align: right">[![Discord Bots](https://top.gg/api/widget/609233676471107584.svg)](https://top.gg/bot/609233676471107584)</div>

## A bot that can act as a talking stick!

___

If one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel).

However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!

You can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel (This feature is in beta)

# Commands  
    Prefix: //

---
# &emsp;`help`
The basic Talking Stick commands are `//tsjoin` which will allow you to start the Talking Stick, and `//tspass` to pass the talking stick.

To get help on a specific command, run `//help <command>` without the `<` and `>`.
## **Example:**
`//help tsjoin`

---

# &emsp;`tsinit`
Creates all necessary roles for Talking Stick. (In the future, this will also run a tutorial)
## **Example**:
`//tsinit`

---

# &emsp;`tsjoin`
Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.
## **Example**:
`//tsjoin text`

---

# &emsp;`tsleave`
Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.
## **Example**:
`//tsleave text`

---

# &emsp;`tspass`
If you have the talking stick, you can pass it to someone else by pinging them with this command.
## **Example**:
`//tspass text @Thoth`

---

# &emsp;`tsdestroy`
Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.
## **Example**:
`//tsdestroy`

---

# &emsp;`tsgivecon`
Allows you to give another user the `Stick Controller` role by pinging them with this command.
## **Example**:
`//tsgivecon @Thoth`

---

# &emsp;`tsremcon`
Allows you to remove another user from the `Stick Controller` role by pinging them with this command.
### **Example**:
`//tsremcon @Thoth`

---

# &emsp;`tsaddstick`
Allows you to give another user in the voice channel a talking stick, while keeping your own by pinging them with this command.
### **Example**:
`//tsaddstick @Thoth`

---

# &emsp;`tsremstick`
Allows you to take a stick from a mentioned user by pinging them with this command.
### **Example**:
`//tsremstick @Thoth`
