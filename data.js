import fs from 'fs';
import path from 'path';
import { EXHIBITIONS_FILE_PATH, GROUPS_FILE_PATH } from './config.js';

export function loadExhibitionsData() {
    const data = fs.readFileSync(path.resolve(EXHIBITIONS_FILE_PATH), 'utf8');
    return JSON.parse(data);
}

export function loadGroupsData() {
    const data = fs.readFileSync(path.resolve(GROUPS_FILE_PATH), 'utf8');
    return JSON.parse(data);
}
