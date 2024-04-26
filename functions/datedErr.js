import { appendFileSync } from "node:fs";
import date from "./date.js";
import { appendFile } from "node:fs/promises"

/**
 * @param {Error | Array<string | Error>} args
 * @returns {void}
 */

export default (...args) => {
    let data = `${date()} ${args.join(' ')}`
    console.error(data);
    appendFile("./logs.txt", data);
}
