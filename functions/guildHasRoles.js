import { roles } from '../coagulators/configCoagulator.js';
import { someRole } from '../coagulators/functionCoagulator.js';

export default async function (memObj) {
    let roleIndicator = 0;
    roles.forEach(r => {
        if(!someRole(memObj, r)){
            roleIndicator++;
        }
    })
    if(roleIndicator != 0) return false;
}