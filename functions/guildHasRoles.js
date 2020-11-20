import {roles} from '../coagulators/configCoagulator.js';
import {someRole} from '../coagulators/functionCoagulator.js';

export default async function (memObj) {
    roles.forEach(r => {
        if(!someRole(memObj, r)){
            return false;
        }
    })
}