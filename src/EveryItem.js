import copterImage from './images/copter.png';
import scopeImage from './images/scope.png';
import bootsImage from './images/boots.png';
import lanternImage from './images/lantern.png';
import torchImage from './images/torch.png';
import teleImage from './images/tele.png';
import chartImage from './images/chart.png';
import bottleImage from './images/bottle.png';
import flareImage from './images/flare.png';
import illuminator from './images/illuminator.png';
import lighterImage from './images/lighter.png';
import powerfulImage from './images/powerful.png';
import reinforcedImage from './images/reinforced.png';

const everyItem = {
  copter: {
    code: "copter", // Esineen tunnistuskoodi.
    name: "Helicopter", // Esineen nimi.
    desc: "Allows player to move anywhere on the map.", // Kuvaus esineen vaikutuksesta.
    targetable: false, // Alueet joihin esineen toiminto voidaan kohdistaa. false = ei kohdistettava, taulukko = kohdistettavat alueet pelaajan paikkaan nähden, 'global' = kaikki kartan alueet ovat kohdistettavissa.
    effect: "playerGlobalMove", // Esineen vaikutus. 'move' = pelaajan liikuttaminen, 'reveal' = alueiden paljastaminen, playerGlobalMove = pelaajan liikkumisen mihin tahansa mahdollistaminen, extraTurn = yhden vuoron lisääminen, overEdgeEffects = toimintoja voi kohdistaa vastapäätä karttaa,
    affected: "player", // Mihin esine vaikuttaa. 'player' = vaikuttaa pelaajan liikkumistoimintoon, taulukko = alueisiin pelaajan paikkaan nähden, 'actions' = kohdistettaviin toimintoihin, 'random' = kolmeen satunnaiseen esinealueeseen, 'turnCounter' = vuorolaskuriin.
    image: copterImage, // Esineen kuva.
  },
  scope: {
    code: "scope",
    name: "Telescope",
    desc: "Reveals any chosen area from the map.",
    targetable: "global",
    effect: "reveal",
    affected: [[0,0]],
    image: scopeImage,
  },
  boots: {
    code: "boots",
    name: "Hiking boots",
    desc: "Gives one extra move maneuver to area that is adjacent to player's current position or targeted move area.",
    targetable: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,0], [0,1], [1,-1], [1,0], [1,1]],
    effect: "move",
    affected: [[0,0]],
    image: bootsImage,
  },
  lantern: {
    code: "lantern",
    name: "Travel lantern",
    desc: "Reveals surrounding areas in cardinal directions around player.",
    targetable: false,
    effect: "reveal",
    affected: [[-1,0], [0,-1], [0,1], [1,0]],
    image: lanternImage,
  },
  torch: {
    code: "torch",
    name: "Tar torch",
    desc: "Reveals surrounding areas in intermediate directions around player.",
    targetable: false,
    effect: "reveal",
    affected: [[-1,-1], [-1,1], [1,-1], [1,1]],
    image: torchImage,
  },
  tele: {
    code: "tele",
    name: "Teleport",
    desc: "While at brink of the map, those areas which are at opposite direction of map are considered adjacent.",
    targetable: false,
    effect: "overEdgeEffects",
    affected: "actions",
    image: teleImage,
  },
  chart: {
    code: "chart",
    name: "Chart of item locations",
    desc: "Reveals locations of three items on the map. Will not reveal treasure's location.",
    targetable: false,
    effect: "reveal",
    affected: "random",
    image: chartImage,
  },
  bottle: {
    code: "bottle",
    name: "Water bottle",
    desc: "Gives one extra turn.",
    targetable: false,
    effect: "extraTurn",
    affected: "turnCounter",
    image: bottleImage,
  },
  flare: {
    code: "flare",
    name: "Flare gun",
    desc: "Reveals all surrounding areas around player both in cardinal and intermediate directions.",
    targetable: false,
    effect: "reveal",
    affected: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]],
    recipe: "lantern torch", // Esineen resepti, eli mitkä esineet yhdistämällä syntyy tämä esine.
    image: flareImage,
  },
  illuminator: {
    code: "illuminator",
    name: "Illuminating scope",
    desc: "Reveals targeted area and areas around it in cardinal directions.",
    targetable: "global",
    effect: "reveal",
    affected: [[-1,0], [0,-1], [0,0], [0,1], [1,0]],
    recipe: "scope lantern",
    image: illuminator,
  },
  lighter: {
    code: "lighter",
    name: "Lighting gadget",
    desc: "Reveals targeted area and areas around it in intermediate directions.",
    targetable: "global",
    effect: "reveal",
    affected: [[-1,-1], [-1,1], [0,0], [1,-1], [1,1]],
    recipe: "scope torch",
    image: lighterImage,
  },
  powerful: {
    code: "powerful",
    name: "Powerful revealing device",
    desc: "Reveals targeted area and all surrounding areas around it both in cardinal and intermediate directions.",
    targetable: "global",
    effect: "reveal",
    affected: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,0], [0,1], [1,-1], [1,0], [1,1]],
    recipe: "scope flare",
    image: powerfulImage,
  },
  reinforced: {
    code: "reinforced",
    name: "Reinforced hiking boots",
    desc: "Gives one extra move maneuver to area which location is at maximum two areas away from player's current position or targeted move area.",
    targetable: [[-2,-2], [-2,-1], [-2,0], [-2,1], [-2,2], [-1,-2], [-1,-1], [-1,0], [-1,1], [-1,2],
      [0,-2], [0,-1], [0,0], [0,1], [0,2], [1,-2], [1,-1], [1,0], [1,1], [1,2], [2,-2], [2,-1], [2,0], [2,1], [2,2]],
    effect: "move",
    affected: [[0,0]], // Tarpeeton kun efekti on 'move'?
    recipe: "boots boots",
    image: reinforcedImage,
  },
};

export default everyItem;
