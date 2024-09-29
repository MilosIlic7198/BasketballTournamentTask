import { loadExibitionsData, loadGroupsData } from './config/loader.js';
import TournamentService from './services/TournamentService.js';

const exibitions = loadExibitionsData();
const groups = loadGroupsData();

export function runSimulation() {
    const tournament = new TournamentService(groups, exibitions);
    tournament.simulateGroupStage();
    tournament.simulateGroupStandings();
    tournament.rankTeams();
    tournament.simulateQualificationStage();
    tournament.log();
}
