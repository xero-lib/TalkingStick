<div align="center">
  <br>
  <img width="25%" alt="Talking Stick logo" src="https://github.com/user-attachments/assets/a4430f3b-388e-41ab-a2e7-1c6f87936fa6">

  # Talking Stick
  **Discord communication management, written in TypeScript.**
</div>

## Overview
**Talking Stick** brings order to your server. When a Stick-Session is active, **only the person(s) holding the Talking Stick can speak or type.**

Perfect for meetings, debates, or virtual classrooms.

### Key Features
* **Strict Turn-Taking:** Mutes all participants except the stick holder.
* **Stick Controllers:** Administrators can assign Stick Controllers, who can give and take additional Talking Sticks.
* **Multi-Stick:** Allow multiple people to speak simultaneously while the rest of the channel listens (or reads). Accessable via a Stick Controller using the `tsaddstick` command.

---

## Quick Start
0. Click [here](https://discord.com/oauth2/authorize?client_id=609233676471107584&scope=bot&permissions=8) to add the bot to one of your servers.
1. **Initialize:** Run the `/tsinit` command to create the necessary bot roles.
2. **Start:** Enter a voice or text channel and use the `/tsjoin` command to begin a Stick-Session.
3. **Manage:** Use the `/tspass` command to hand the stick off to someone else.
4. **End:** Use the `/tsleave` command to end the Stick-Session, reverting everyone to their normal states.

---

## Command Reference

### Session Management
| Command | Arguments | Description | Minimum Permissions |
| --- | --- | --- | --- |
| **`/tsjoin`** | `<voice \| text>` | **Start Session.** Mutes everyone except you and assigns Stick roles. | **Stick Controller**, **Manage Roles**, or **Manage Channels** |
| **`/tsleave`** | `<voice \| text>` | **End Session.** Unmutes everyone and restores original roles. | **Stick Controller**, **Manage Roles**, or **Manage Channels** |
| **`/tsdestroy`**| *(None)* | Removes all bot-created permission overwrites and roles. | <u>**Administrator Only**</u> |
| **`/tsinit`** | *(None)* | **Manage Roles.** Creates the Roles required by Talking Stick to function properly. | <u>**Administrator Only**</u> |

### Stick Control
| Command | Arguments | Description | Minimum Permissions |
| --- | --- | --- | --- |
| **`/tspass`** | `<voice \| text> <user>` | Pass your stick to another user. | **Stick Holder Only** |
| **`/tsaddstick`**| `<voice \| text> <user>` | Give a user a stick *without* losing yours (Multi-speaker). | **Stick Controller** |
| **`/tsremstick`**| `<voice \| text> <user>` | Forcefully take a stick away from a user. | **Stick Controller** |

### Permissions & Utility
| Command | Arguments | Description | Minimum Permissions |
| --- | --- | --- | --- |
| **`/tsgivecon`** | `<user>` | Promote a user to **Stick Controller**. | <u>**Administrator Only**</u> |
| **`/tsremcon`** | `<user>` | Demote a Stick Controller. | <u>**Administrator Only**</u> |
| **`/help`** | `[command]` | Show help for a specific command (e.g., `/help tsjoin`). | **everyone** |
| **`/dnw`** | `<message>` | **"Did Not Work"** - Submit a bug report to the developer. | **everyone** |

> **Legend:**
> * `a | b` = Either `a` or `b`
> * `< >` = Required argument
> * `[ ]` = Optional argument
