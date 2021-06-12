import { client } from "../coagulators/configCoagulator.js";
import { date } from "../coagulators/functionCoagulator.js";

export default function (username) {
  try {
    let nametag = client.users.cache.find(
      (u) => `${u.username}#${u.discriminator}` == username
    );
    let name = client.users.cache.find((u) => u.username == username);

    if (nametag && !name) return nametag;
    if (!nametag && name) return name;
    if (nametag && name) return [nametag, name];
  } catch (err) {
    console.error(
      date(),
      username,
      "is most likely either not a user in cache, or possibly is not a valid username. Error:",
      err
    );
    return false;
  }
}
