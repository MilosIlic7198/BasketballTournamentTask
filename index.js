import { loadExhibitionsData, loadGroupsData } from './data.js';

const exibitions = loadExhibitionsData();
const groups = loadGroupsData();

console.log(exibitions, groups);
