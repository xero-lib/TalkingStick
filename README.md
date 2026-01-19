<p align="center">
  <br>
  <img width="25%" alt="Talking Stick logo: White microphone on a stick on a Discord-blue background." src="https://github.com/user-attachments/assets/a4430f3b-388e-41ab-a2e7-1c6f87936fa6" />

</p>
<p align="center">
<em>Discord communication management application, written in JavaScript.</em>

---
If one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel).

However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!

You can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel (This feature is in beta)

# Commands
<em>\* - optional argument</em>
| name | argument(s) |
| --- | --- | 
| [`help`](#help) | command* |
| [`tsinit`](#tsinit) | |
| [`tsjoin`](#tsjoin) | <voice\|text> |
| [`tsleave`](#tsleave) | <voice\|text> |
| [`tspass`](#tspass) | @User |
| [`tsdestroy`](#tsdestroy) | |
| [`tsgivecon`](#tsgivecon) | @User |
| [`tsremcon`](#tsremcon) | @User |
| [`tsaddstick`](#tsaddstick) | @User |
| [`tsremstick`](#tsremstick) | @User |
| `dnw` | bug-report-message* |


## `help`
The basic Talking Stick commands are `/tsjoin` which will allow you to start the Talking Stick, and `/tspass` to pass the talking stick.

To get help on a specific command, run `/help <command>` without the `<` and `>`.
<br>
**Example:**
`/help`
`/help tsjoin`

---

## `tsinit`
Creates all necessary roles for Talking Stick. (In the future, this will also run a tutorial
<br>
**Example**:
`/tsinit`

---

## `tsjoin`
Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.
<br>
**Example**:
`/tsjoin text`

---

## `tsleave`
Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.
<br>
**Example**:
`/tsleave text`

---

## `tspass`
If you have the talking stick, you can pass it to someone else by pinging them with this command.
<br>
**Example**:
`/tspass text @Thoth`

---

## `tsdestroy`
Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.
<br>
**Example**:
`/tsdestroy`

---

## `tsgivecon`
Allows you to give another user the `Stick Controller` role by pinging them with this command.
<br>
**Example**:
`/tsgivecon @Thoth`

---

## `tsremcon`
Allows you to remove another user from the `Stick Controller` role by pinging them with this command.
<br>
**Example**:
`/tsremcon @Thoth`

---

## `tsaddstick`
Allows you to give another user in the voice channel a talking stick, while keeping your own by pinging them with this command.
<br>
**Example**:
`/tsaddstick @Thoth`

---

## `tsremstick`
Allows you to take a stick from a mentioned user by pinging them with this command.
<br>
**Example**:
`/tsremstick @Thoth`
