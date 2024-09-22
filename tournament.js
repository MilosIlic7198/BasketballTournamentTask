import { loadExhibitionsData, loadGroupsData } from './data.js';
import { initializeTeamStats } from './init.js';

const exibitions = loadExhibitionsData();
const groups = loadGroupsData();

export function runTournament() {
    initializeTeamStats(groups, exibitions);
}
