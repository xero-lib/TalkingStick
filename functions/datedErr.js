import date from "./date.js";

/**
 * @param {Error | Array<string | Error>} args
 * @returns {void}
 */

export default (...args) => console.error(date(), ...args);
