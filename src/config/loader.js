import fs from 'fs';
import { EXIBITIONS_FILE_PATH, GROUPS_FILE_PATH } from './paths.js';

export function loadExibitionsData() {
    const data = fs.readFileSync(EXIBITIONS_FILE_PATH, 'utf8');
    return JSON.parse(data);
}

export function loadGroupsData() {
    const data = fs.readFileSync(GROUPS_FILE_PATH, 'utf8');
    return JSON.parse(data);
}
