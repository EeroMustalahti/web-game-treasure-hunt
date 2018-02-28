import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import StartingDialog from './StartingDialog'; // Pelin aloitusdialogi.
import MapView from './MapView'; // Karttanäkymä.
import ItemsView from './ItemsView'; // Esinenäkymä.
import Settings from './Settings'; // Asetukset.

import everyItem from './EveryItem'; // Pelin esineet.

import languageBundle from './LanguageBundle'; // Kielitiedosto.
import themeBundle from './ThemeBundle'; // Teemavärien tiedosto.

import treasureImage from './images/treasure.png'; // Aarteen kuva.
import playerImage1 from './images/playerImage1.png'; // Kolme valmista vaihtoehtoa pelaajan kuvalle.
import playerImage2 from './images/playerImage2.png';
import playerImage3 from './images/playerImage3.png';

import helpImage1 from './images/helpImage1.png'; // Viisi kuvaa pelin ohjeisiin.
import helpImage2 from './images/helpImage2.png';
import helpImage3 from './images/helpImage3.png';
import helpImage4 from './images/helpImage4.png';
import helpImage5 from './images/helpImage5.png';


/**
 * Päänäkymä
*/
class App extends Component {

  constructor(props) {
    super(props);

    let itemSlots = [null, null, null, null, null, null, null, null];// Taulukon 2 viimeistä alkiota ovat käyttöesinepaikkoja.
    let slotStates = []; // Esinepaikkojen historia.
    slotStates.push([itemSlots.slice(), null, null]); // Asetetaan nykyinen esinepaikkojen tilanne esinehistoriaan.

    let player = {
      name: "",
      desc: "Move by selecting an area from the map.",
      targetable: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,0], [0,1], [1,-1], [1,0], [1,1]],
      effect: "move",
      affects: [[0,0]],
      image: playerImage1,
    };

    let treasure = {
      name: "Treasure",
      image: treasureImage,
    };

    let map = [];
    // Kartta on 12 x 12 ruudun kokoinen.
    for (let row = 0; row < 12; ++row) {
      let mapRow = [];
      for (let col = 0; col < 12; ++col) {
        // Karttapaikalla on neljä ominaisuutta. entity: paikassa oleva entiteetti, eli pelaaja, aarre, jokin esine tai ei mitään.
        // revealed: onko paikka paljastettu vai ei. targetable: onko paikka valittavissa valitun toiminnon kohteeksi.
        // targetedBy: toiminto, jonka kohteena paikka on. 'player' = pelaajan liikkumiskohteena. 1 = ensimmäisen käyttöesinepaikan esineen kohteena. 2 = toisen käyttöesinepaikan esineen kohteena.
        mapRow[col] = {entity: null, revealed: false, targetable: false, targetedBy: null};
      }
      map[row] = mapRow;
    }

    this.state = {
      startingDialogStepIndex: 0, // Aloitusdialogin stepperin indeksi.
      playerImageSource: "options", // Pelaajan kuvan lähde. 'options' = valmiista vaihtoehdoista. 'url' = käyttäjän antamasta url-osoitteesta.
      playerImageOption: 1, // Kuvan numero jonka pelaaja on valinnut valmiista vaihtoehdoista.
      playerImageUrl: "", // Pelaajan antama url-osoite omalle kuvalle.
      difficultyLevel: 3, // Pelin vaikeustasto (helpoin 1, vaikein 5).

      player: player, // Pelaajan pelihahmo.
      treasure: treasure, // Aarre, jonka saaminen on pelin voittamisen edellytys.

      currentView: "map", // Nykyinen näkymä eli auki oleva välilehti. 'map' = karttanäkymä, 'items' = esinenäkymä.

      map: map, // Kartalla olevien esineiden ja pelaajan paikka.
      hoverArea: null, // Alueen id, jonka päällä pidetään hiirtä.
      actionSlots: [player, 6, 7], // Toimintopaikat.
      selectedAction: null, // Valitun karttatoimintopaikan id.
      confirmTurnOpen: false, // Onko vuoron suorittamisen vahvistusdialogi auki.
      turns: 100, // Jäljellä olevien vuorojen määrä.
      disabledUI: false, // Onko (karttanäkymän) käyttöliittymä jäädytetty.
      endGameDialog: false, // Onko pelin voittamisesta ilmoittava dialogi auki.

      playerTopPosition: 0, // Pelaajan kuvan sijainti kartalla
      playerLeftPosition: 0, // suhteessa nykyiseen karttapaikkaan.
      revealingAreas: [], // Alueet, jotka tullaan paljastamaan karttatoiminnon yhteydessä.

      itemSlots: itemSlots, // Nykyinen esinepaikkojen tilanne.
      slotStates: slotStates, // Esinepaikkojen tilannehistoria. Hyödynnetään esineisiin kohdistuvien kumoamis/uudelleentekemis-operaatioissa.
      selectedItemSlot: null, // Valitun esinepaikan id.
      currentSlotState: 0, // Monettako esinepaikkatilaa käytetään.
      combineMode: false, // Määrittää yritetäänkö esineitä yhdistää raahatessa niitä toistensa päälle.
      playerNameIsHovered: false, // Onko hiiri pelaajan nimen päällä.
      playerImageIsHovered: false, // Onko hiiri pelaajan kuvan päällä.
      startingDialogOpenedMidGame: false, // Onko aloitusdialogi avattu kesken pelin (pelaajan nimen tai kuvan vaihtamista varten).

      confirmQuitOpen: false, // Onko pelin lopettamisen vahvistusdialogi auki.
      helpOpen: false, // Onko pelin ohjeet sisältävä dialogi auki.

      settingsOpen: false, // Onko asetuspalkki auki.
      langValue: "en", // Valitun käyttöliittymäkielen arvo.
      themeValue: "sapphire", // Valitun käyttöliittymän väritysteeman arvo.
      confirmTurnChecked: true, // Onko vuoron suorittamisen vahvistusdialogi-valintaruutu valittuna.
      confirmQuitChecked: true, // Onko pelin lopettamisen vahvistusdialogi-valintaruutu valittuna.
      actionSpeed: 2, // Nopeus sekunneissa, joka kuluu yhden animoidun toiminnon suorittamiseen.

      notificationMessage: "", // Ilmoitusviestin sisältö.
      notificationOpen: false, // Onko ilmoitusviestin näyttävä "snackbar" auki.
    }
  }

  /* Karttanäkymään liittyvät funktiot. */

  /**
   * Vaihtaa korostettavan alueen siihen alueeseen, jonka päällä käyttäjän kursori on, tai
   * jos kursori ei ole minkään kartta-alueen päällä poisasettaa alueen korostamisen.
   * @param cellId Kursorilla korostettavan alueen id.
   */
  toggleAreaHover = (cellId) => {
    this.setState({
      hoverArea: cellId === null ? null : cellId,
    });
  };

  /**
   * Karttatoiminnon raahauksen alkaessa asettaa liikuteltavaksi dataksi raahattavan toiminnon id:n ja
   * asettaa raahattavan toiminnon valituksi.
   * @param e Raahaustapahtuma.
   */
  actionDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "move";
    let draggedActionSlotId = parseInt(e.target.id, 10);
    if (draggedActionSlotId != this.state.selectedAction) {
      this.selectAction(draggedActionSlotId);
    }
  };

  /**
   * Pudotettaessa karttatoiminto toimintopaikkaan vaihtaa raahauksen lähteen ja pudostuskohteen toiminnot keskenään.
   * @param e Raahaus/pudotustapahtuma.
   */
  onActionDrop = (e) => {
    e.preventDefault();
    let sourceSlot = parseInt(e.dataTransfer.getData("text"), 10);
    if (Number.isInteger(sourceSlot)) { // Tarkistetaan, että raahattavan mukana saatiin id.
      let targetSlot = parseInt(e.target.id, 10);
      let actionSlots = this.state.actionSlots;

      if (sourceSlot != targetSlot) { // Mitään ei tarvitse tehdä jos pudotettiin samaan paikkaan mistä raahaus aloitettiin.
        let tmp = actionSlots[targetSlot];
        actionSlots[targetSlot] = actionSlots[sourceSlot];
        actionSlots[sourceSlot] = tmp;
        this.selectAction(this.state.selectedAction); // Poisasetetaan valinta kutsumalla toiminnon valintafunktiota nykyisellä valinnalla.
        let map = this.clearUnreachableMoveAreas(this.state.map);
        this.setState({
          map: map,
          actionSlots: actionSlots,
        });
      }
    }
  };

  /**
   * Asettaa kaikki kartan alueet siten, että mikään alue ei ole minkään toiminnon kohdistettavissa.
   */
  clearTargetableAreas() {
    let map = this.state.map;
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map[row].length; ++col) {
        map[row][col]["targetable"] = null;
      }
    }
  }

  /**
   * Valitsee karttatoiminnon tai poisasettaa valitun karttatoiminnon jos parametrina annettu toiminnon id on sama kuin nykyisen valitun toiminnon.
   * @param selectedAction Valitun toiminnon id.
   */
  selectAction = (selectedAction) => {
    this.clearTargetableAreas();
    let entity = null;
    if (this.state.actionSlots[selectedAction] != this.state.player) { // Käyttöesinepaikka.
      entity = this.state.itemSlots[this.state.actionSlots[selectedAction]];
    } else { // Pelaaja.
      entity = this.state.actionSlots[selectedAction];
    }
    if (entity != null && entity.targetable != false) {
      this.determineTargetableAreas(selectedAction, entity);
    }
    this.setState({
      selectedAction: selectedAction === this.state.selectedAction ? null : selectedAction,
    });
  };

  /**
   * Tarkistaa, onko käyttöesineiden joukossa parametrina annetun efektin omaavaa esinettä.
   * @param effect Efekti, jonka olemassaolo tarksitetaan.
   * @returns {boolean} Onko käyttöesineissä haetun efektin omaavaa esinettä.
   */
  checkInUseItemExistenceWithEffect(effect) {
    let actionSlots = this.state.actionSlots;
    let itemSlots = this.state.itemSlots;
    for (let i = 0; i < actionSlots.length; ++i) {
      if (actionSlots[i] != this.state.player && itemSlots[actionSlots[i]] != null) {
        if (itemSlots[actionSlots[i]].effect == effect) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Määrittää kartan alueet, jotka ovat entiteetin (pelihahmon tai käyttöesineen) kohdennettavissa.
   * @param selectedAction Valittuna oleva toimintopaikka.
   * @param entity Toimintopaikan entiteetti, jolle määritellään kohdennettavat alueet.
   */
  determineTargetableAreas(selectedAction, entity) {
    let map = this.state.map;
    let itemSlots = this.state.itemSlots;
    let deselection = selectedAction == this.state.selectedAction; // Onko kyseessä toiminnon poisasettaminen.
    let player = this.state.player;
    // Haetaan pelaajan paikkakoordinaatit kartalta ja poisasetetaan mahdolliset edelliset kohdennettavissa olleet paikat, tai
    // jos entiteetti on kohdistettavissa globaalisti eikä sen kohdetta olla poisasettamassa asetetaan kaikki alueet kohdistettaviksi.
    let possibleStarts = [];
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map.length; ++col) {
        if ((entity["targetable"] == "global" ||
          (entity == player && this.checkInUseItemExistenceWithEffect("playerGlobalMove") == true)) && deselection == false) {
          map[row][col]["targetable"] = true;
        } else {
          map[row][col]["targetable"] = false;
          let areaEntity = map[row][col]["entity"];
          let areaTargetedBy = map[row][col]["targetedBy"];
          if (areaEntity == player || (areaTargetedBy != null &&
            (areaTargetedBy == player || itemSlots[areaTargetedBy].effect == "move"))) {
            possibleStarts.push({x: row, y: col});
            // Jos pelaajapaikka niin lisätään alue kahteen kertaan. Tarvitaan silloin jos pelaajan
            // nykyinen paikka on jonkin liikkumistoiminnon kohteena.
            if(areaEntity == player) {
              possibleStarts.push({x: row, y: col});
            }
          }
        }
      }
    }
    // Jos toiminto on kohdistettavissa pelaajaan nähden eli sisältää taulukon kohdistettavista paikoista
    // eikä olla poisasettamassa toiminnon valintaa niin asetetaan kohdistettavat alueet.
    if (entity["targetable"].constructor === Array &&
      (entity == player && this.checkInUseItemExistenceWithEffect("playerGlobalMove") == true) == false && deselection == false) {
      let startX;
      let startY;
      let chosenStart = -2; // Lähtöpaikaksi määritelty toimintopaikka.
      let playerAreaNotYetEncountered = true;
      for (let i = 0; i < possibleStarts.length; ++i) {
        let x = possibleStarts[i].x;
        let y = possibleStarts[i].y;
        let possStart = this.state.actionSlots.findIndex(function(action) {
          return action == map[x][y]["targetedBy"];
        });
        if(playerAreaNotYetEncountered == true && map[x][y]["entity"] == player) {
          possStart = -1;
          playerAreaNotYetEncountered = false;
        }
        if (selectedAction > possStart && possStart > chosenStart) {
          startX = x;
          startY = y;
          chosenStart = possStart;
        }
      }
      // Määritetään kohteeksi kelpaavat alueet suhteessa pelaajan paikkaan tai edellisen liikkumistoiminnon kohdepaikkaan.
      for (let area = 0; area < entity["targetable"].length; ++area) {
        let x = entity["targetable"][area][0];
        let y = entity["targetable"][area][1];
        // Jos kohdistettavissa oleva alue on kartan ulkopuolella, mutta pelaaja omaa sellaisen esineen, joka mahdollistaa kohdistamisen
        // toiselle puolelle karttaa, asetetaan kohdistettava alue kartan toiselle puolelle.
        if ((0 > startX + x || startX + x >= map.length || 0 > startY + y || startY + y >= map.length) &&
          this.checkInUseItemExistenceWithEffect("overEdgeEffects") == true) {
          let overMapEdgeX = startX + x;
          if (overMapEdgeX < 0) {
            overMapEdgeX = map.length + overMapEdgeX;
          } else if (overMapEdgeX >= map.length) {
            overMapEdgeX = overMapEdgeX - map.length;
          }
          let overMapEdgeY = startY + y;
          if (overMapEdgeY < 0) {
            overMapEdgeY = map.length + overMapEdgeY;
          } else if (overMapEdgeY >= map.length) {
            overMapEdgeY = overMapEdgeY - map.length;
          }
          map[overMapEdgeX][overMapEdgeY]["targetable"] = true;
        }
        // Jos kohdistettava alue ei ole kartan ulkopuolella, voidaan kartan alue asettaa kohdistettavaksi.
        if ((0 <= startX + x && startX + x < map.length) && (0 <= startY + y && startY + y < map.length)) {
          map[startX + x][startY + y]["targetable"] = true;
        }
      }
    }
    this.setState({
      map: map,
    });
  }

  /**
   * Poisasettaa kartalta ne liikkumistoimintojen kohteet, jotka eivät olisi saavutettavissa pelaajan nykyisestä tai
   * aikaisemman liikkumistoiminnon määrittämästä tulevasta paikasta.
   * @param map Pelin kartta.
   * @returns {*} Viite pelin karttaan.
   */
  clearUnreachableMoveAreas(map) {
    let itemSlots = this.state.itemSlots;
    let player = this.state.player;
    let possibleStarts = []; // Alueet, joissa on pelaaja tai ovat pelaajan liikkumistoiminnon kohteena.
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map.length; ++col) {
        let areaEntity = map[row][col]["entity"];
        let areaTargetedBy = map[row][col]["targetedBy"];
        if (areaEntity == player || (areaTargetedBy != null &&
          (areaTargetedBy == player || itemSlots[areaTargetedBy].effect == "move"))) {
          possibleStarts.push({x: row, y: col});
        }
      }
    }

    let actionSlots = this.state.actionSlots;
    let actionSlotIndex;
    let getActionTargetIdx = function(possSrt) {
      return map[possSrt.x][possSrt.y]["targetedBy"] == actionSlots[actionSlotIndex];
    };
    let isFirstTargetedMoveAction = true;

    // Tarkistetaan toimintolistan alusta alkaen onko toimintoa seuraavan liikkumistoiminnon alue vielä saavutettavissa.
    for (let slotIdx = 0; slotIdx < actionSlots.length; ++slotIdx) {
      actionSlotIndex = slotIdx;
      if ((actionSlots[slotIdx] == player ||
        (itemSlots[actionSlots[slotIdx]] != null && itemSlots[actionSlots[slotIdx]].effect == "move")) &&
        -1 < possibleStarts.findIndex(getActionTargetIdx)) {
        let firstMoveTargetX = possibleStarts[possibleStarts.findIndex(getActionTargetIdx)].x;
        let firstMoveTargetY = possibleStarts[possibleStarts.findIndex(getActionTargetIdx)].y;

        if (isFirstTargetedMoveAction == true) { // Jos liikkumistoiminto on ensimmäinen tarkistetaan, että sen kohde on pelaajan saavutettavissa.
          let playerLocationCoordinates = possibleStarts[possibleStarts.findIndex(function (possSrt) {
            return map[possSrt.x][possSrt.y]["entity"] == player;
          })];
          let firstMoveTargetIsReachable = false;
          let playerLocationX = playerLocationCoordinates.x;
          let playerLocationY = playerLocationCoordinates.y;
          let firstMoveActionTargets;
          if (actionSlots[slotIdx] == player) {
            firstMoveActionTargets = player.targetable;
            // Jos pelaajalla on globaalin liikkumisen mahdollistava esine todetaan liikkumiskohteen olevan saavutettavissa.
            if (this.checkInUseItemExistenceWithEffect("playerGlobalMove") == true) {
              firstMoveTargetIsReachable = true;
            }
          } else {
            firstMoveActionTargets = itemSlots[actionSlots[slotIdx]].targetable;
          }

          // Jos ensimmäisen liikkumistoiminnon kohde ei ole saavutettavissa pelaajan paikasta katsotaan, että onko jonkin muun
          // liikkumistoiminnon paikaa saavutettavissa.
          if (firstMoveTargetIsReachable == false) {
            for (let targetIdx = 0; targetIdx < firstMoveActionTargets.length; ++targetIdx) {
              let possMoveTargetX = firstMoveActionTargets[targetIdx][0];
              let possMoveTargetY = firstMoveActionTargets[targetIdx][1];

              if ((0 > playerLocationX + possMoveTargetX || playerLocationX + possMoveTargetX >= map.length ||
                0 > playerLocationY + possMoveTargetY || playerLocationY + possMoveTargetY >= map.length) &&
                this.checkInUseItemExistenceWithEffect("overEdgeEffects") == true) {
                let overMapEdgeX = playerLocationX + possMoveTargetX;
                if (overMapEdgeX < 0) {
                  overMapEdgeX = map.length + overMapEdgeX;
                } else if (overMapEdgeX >= map.length) {
                  overMapEdgeX = overMapEdgeX - map.length;
                }
                let overMapEdgeY = playerLocationY + possMoveTargetY;
                if (overMapEdgeY < 0) {
                  overMapEdgeY = map.length + overMapEdgeY;
                } else if (overMapEdgeY >= map.length) {
                  overMapEdgeY = overMapEdgeY - map.length;
                }
                if (map[overMapEdgeX][overMapEdgeY] == map[firstMoveTargetX][firstMoveTargetY]) {
                  firstMoveTargetIsReachable = true;
                  break;
                }
              }

              if ((0 <= playerLocationX + possMoveTargetX && playerLocationX + possMoveTargetX < map.length) &&
                (0 <= playerLocationY + possMoveTargetY && playerLocationY + possMoveTargetY < map.length)) {
                if (map[playerLocationX + possMoveTargetX][playerLocationY + possMoveTargetY] ==
                  map[firstMoveTargetX][firstMoveTargetY]) {
                  firstMoveTargetIsReachable = true;
                  break;
                }
              }
            }
          }
          // Jos ensimmäisen liikkumistoiminnon kohde on saavutettavissa pelaajasta ei tarvitse enää tutkia ensimmäistä liikkumistoimintoa.
          if (firstMoveTargetIsReachable == true) {
            isFirstTargetedMoveAction = false;
          } else { // Jos ensimmäisen liikkumistoiminnon kohde ei ole saavutettavissa pelaajasta poisasetetaan kohde.
            map[firstMoveTargetX][firstMoveTargetY]["targetedBy"] = null;
          }
        }

        if (isFirstTargetedMoveAction == false) { // Tarkistetaan muut kuin ensimmäinen liikkumistoiminto.
          // Löytyi liikkumistoiminto, jonka kohde on valittu kartalta. Katsotaan onko tämänkin jälkeen olemassa
          // kohdistettua liikkumistoimintoa.
          for (let nextSlotIdx = slotIdx + 1; nextSlotIdx < actionSlots.length; ++nextSlotIdx) {
            actionSlotIndex = nextSlotIdx;
            if ((actionSlots[nextSlotIdx] == player ||
              (itemSlots[actionSlots[nextSlotIdx]] != null && itemSlots[actionSlots[nextSlotIdx]].effect == "move")) &&
              -1 < possibleStarts.findIndex(getActionTargetIdx)) {
              // Löytyi slotIdx:ää seuraava kohdistettu liikkumistoiminto nextSlotIdx.
              // Katsotaan, onko nextSlotIdx:n kohde saavutettavissa slotIdx:n kohteesta.
              let nextMoveTargetIsReachable = false;
              let secondMoveTargetX = possibleStarts[possibleStarts.findIndex(getActionTargetIdx)].x;
              let secondMoveTargetY = possibleStarts[possibleStarts.findIndex(getActionTargetIdx)].y;
              let secondMoveActionTargets;
              if (actionSlots[nextSlotIdx] == player) {
                secondMoveActionTargets = player.targetable;
                // Jos pelaajalla on globaalin liikkumisen mahdollistava esine todetaan liikkumiskohteen olevan saavutettavissa.
                if (this.checkInUseItemExistenceWithEffect("playerGlobalMove") == true) {
                  nextMoveTargetIsReachable = true;
                }
              } else {
                secondMoveActionTargets = itemSlots[actionSlots[nextSlotIdx]].targetable;
              }

              if (nextMoveTargetIsReachable == false) {
                for (let targetIdx = 0; targetIdx < secondMoveActionTargets.length; ++targetIdx) {
                  let secPossMoveTargetX = secondMoveActionTargets[targetIdx][0];
                  let secPossMoveTargetY = secondMoveActionTargets[targetIdx][1];

                  if ((0 > firstMoveTargetX + secPossMoveTargetX || firstMoveTargetX + secPossMoveTargetX >= map.length ||
                    0 > firstMoveTargetY + secPossMoveTargetY || firstMoveTargetY + secPossMoveTargetY >= map.length) &&
                    this.checkInUseItemExistenceWithEffect("overEdgeEffects") == true) {
                    let overMapEdgeX = firstMoveTargetX + secPossMoveTargetX;
                    if (overMapEdgeX < 0) {
                      overMapEdgeX = map.length + overMapEdgeX;
                    } else if (overMapEdgeX >= map.length) {
                      overMapEdgeX = overMapEdgeX - map.length;
                    }
                    let overMapEdgeY = firstMoveTargetY + secPossMoveTargetY;
                    if (overMapEdgeY < 0) {
                      overMapEdgeY = map.length + overMapEdgeY;
                    } else if (overMapEdgeY >= map.length) {
                      overMapEdgeY = overMapEdgeY - map.length;
                    }
                    if (map[overMapEdgeX][overMapEdgeY] == map[secondMoveTargetX][secondMoveTargetY]) {
                      nextMoveTargetIsReachable = true;
                      break;
                    }
                  }

                  if ((0 <= firstMoveTargetX + secPossMoveTargetX && firstMoveTargetX + secPossMoveTargetX < map.length) &&
                    (0 <= firstMoveTargetY + secPossMoveTargetY && firstMoveTargetY + secPossMoveTargetY < map.length)) {
                    if (map[firstMoveTargetX + secPossMoveTargetX][firstMoveTargetY + secPossMoveTargetY] ==
                      map[secondMoveTargetX][secondMoveTargetY]) {
                      nextMoveTargetIsReachable = true;
                      break;
                    }
                  }
                }
              }

              if (nextMoveTargetIsReachable == false) { // Jos seuraavan liikkumistoiminnon kohde ei ole saavutettavissa poisasetetaan kohde.
                map[secondMoveTargetX][secondMoveTargetY]["targetedBy"] = null;
              } else { // Jos seuraavan kohdistetun liikkumistoiminnon kohde oli saavutettavissa voidaan lopettaa etsintä.
                break;
              }
            }
          }
        }

      }
    }
    return map;
  }

  /**
   * Viimeistelee pelaajan liikkumttamistoiminnon asettamalla pelaaja valittuun karttapaikkaan sekä pyrkii
   * asettamaan paikassa olleen mahdollisen esineen pelaajan inventaarioon. Jos inventaario on täynnä löydetty
   * esine hylätään.
   * @param playerLocationX Pelaajan rivi kartalla.
   * @param playerLocationY Pelaajan sarake kartalla.
   * @param moveLocationX Uusi pelaajan rivi kartalla.
   * @param moveLocationY Uusi pelaajan sarake kartalla.
   */
  finishMoveAction(playerLocationX, playerLocationY, moveLocationX, moveLocationY) {
    let map = this.state.map;
    let message = "";
    map[playerLocationX][playerLocationY]["entity"] = null;
    if (map[moveLocationX][moveLocationY]["entity"] != null) {
      let foundEntity = map[moveLocationX][moveLocationY]["entity"];
      let itemSlots = this.state.itemSlots;
      let inventoryHasSpace = false;
      // Esinepaikoista kahta viimeistä ei oteta huomioon, koska ne ovat käyttöesineiden paikkoja, eivät inventaarion.
      for (let itemSlotIdx = 0; itemSlotIdx < itemSlots.length - 2; ++itemSlotIdx) {
        if (itemSlots[itemSlotIdx] == null) {
          itemSlots[itemSlotIdx] = foundEntity;
          inventoryHasSpace = true;
          break;
        }
      }
      if (inventoryHasSpace == true) {
        message = languageBundle[this.state.langValue].messageFoundItem+" "+foundEntity.name;
      } else {
        message = languageBundle[this.state.langValue].messageInvFull+": "+foundEntity.name;
      }
    }
    map[moveLocationX][moveLocationY]["entity"] = this.state.player;
    map[moveLocationX][moveLocationY]["revealed"] = true;
    this.setState({
      map: map,
      playerTopPosition: 0,
      playerLeftPosition: 0,
      revealingAreas: [],
      selectedAction: null,
      notificationMessage: message,
      notificationOpen: message != "",
    });
  }

  /**
   * Suorittaa pelaajan liikuttamistoiminnon. Määrittää ensin paljastettavan alueen ja valitun liikkumispaikan
   * sijainnin suhteessa pelaajaan animoitua liikkumista varten. Tämän jälkeen tietyn ajan kuluttua
   * kutsuu varsinaista pelaajan uuden paikan asettavaa funktiota.
   * @param actionSlotIdx Suoritettavan liikuttamistoiminnon indeksi toimintopaikoissa.
   */
  executeMoveAction(actionSlotIdx) {
    let map = this.state.map;
    let actionSlots = this.state.actionSlots;
    let playerLocationX;
    let playerLocationY;
    let moveLocationX = null;
    let moveLocationY = null;
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map[row].length; ++col) {
        if (map[row][col]["entity"] == this.state.player) {
          playerLocationX = row;
          playerLocationY = col;
        }
        if (map[row][col]["targetedBy"] == actionSlots[actionSlotIdx]) {
          moveLocationX = row;
          moveLocationY = col;
        }
      }
    }
    // Määritetään top- ja left-arvot pelaajan kuvan asettamiselle liikkumiskohteeseen, jotta voidaan
    // toteutta pelaajan liikkumista kuvaava animaatio. Lisäksi määritetään paljastettavaksi se alue johon pelaaja liikkuu.
    let topPosition = 0;
    let leftPosition = 0;
    if (moveLocationX < playerLocationX) {
      topPosition = (playerLocationX - moveLocationX) * -35;
    } else if (moveLocationX > playerLocationX) {
      topPosition = (moveLocationX - playerLocationX) * 35;
    }
    if (moveLocationY < playerLocationY) {
      leftPosition = (playerLocationY - moveLocationY) * -35;
    } else if (moveLocationY > playerLocationY) {
      leftPosition = (moveLocationY - playerLocationY) * 35;
    }
    this.setState({
      playerTopPosition: topPosition,
      playerLeftPosition: leftPosition,
      revealingAreas: [[moveLocationX, moveLocationY]],
      selectedAction: actionSlotIdx,
    });
    setTimeout(() => {this.executeAction(actionSlotIdx , "move", playerLocationX, playerLocationY, moveLocationX, moveLocationY)},
      this.state.actionSpeed * 1000);
  }

  /**
   * Toteuttaa paljastamistoiminnon asettamalla määritetyt karttapaikat paljastetuiksi.
   * @param revealedAreas
   */
  finishRevealAction(revealedAreas) {
    let map = this.state.map;
    for (let revealedIdx = 0; revealedIdx < revealedAreas.length; ++revealedIdx) {
      let revealedX = revealedAreas[revealedIdx][0];
      let revealedY = revealedAreas[revealedIdx][1];
      map[revealedX][revealedY]["revealed"] = true;
    }
    this.setState({
      map: map,
      revealingAreas: [],
      selectedAction: null,
    });
  }

  /**
   * Suorittaa karttapaikkojen paljastustoiminnon. Määrittää ensin, mitkä alueet tulevat paljastumaan animoitua paljastumista
   * varten, ja tämän jälkeen kutsuu tietyn ajan päästä varsinaisen karttapaikat paljastetuksi asettavaa funktiota.
   * @param actionItem Esine, jolla paljastustoiminto suoritetaan.
   * @param actionSlotIdx Suoritettavan paljastamistoiminnon indeksi toimintopaikoissa.
   */
  executeRevealAction(actionItem, actionSlotIdx) {
    let map = this.state.map;
    let actionSlots = this.state.actionSlots;
    let targetX = null;
    let targetY = null;
    let breakFromLoop = false;
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map[row].length; ++col) {
        // Määritellään paljastustoiminnon kohde sen perusteella onko kyseessä kohdistettava toiminto vaiko ei.
        // Jos kohdistettava niin valitun kohdealueen mukaan, jos ei kohdistettava niin pelaajan paikan mukaan.
        if ((actionItem.targetable == false && map[row][col]["entity"] == this.state.player) ||
          (actionItem.targetable != false && map[row][col]["targetedBy"] == actionSlots[actionSlotIdx])) {
          targetX = row;
          targetY = col;
          breakFromLoop = true;
          break;
        }
      }
      if (breakFromLoop == true) {
        break;
      }
    }
    // Määritetään paljastettavat alueet karttapaikan suhteen.
    let revealingAreas = [];
    if (actionItem.affected.constructor === Array) {
      for (let affectedIdx = 0; affectedIdx < actionItem.affected.length; ++affectedIdx) {
        let x = actionItem.affected[affectedIdx][0];
        let y = actionItem.affected[affectedIdx][1];
        if ((0 <= targetX + x && targetX + x < map.length) && (0 <= targetY + y && targetY + y < map.length)) {
          revealingAreas.push([targetX + x, targetY + y]);
        }
      }
    } else { // Jos vaikutusalueita ei ole annettu taulukkona on kyse satunnaisten esinepaikkojen paikat paljastavasta esineestä.
      let mapItemAreas = [];
      for (let row = 0; row < map.length; ++row) {
        for (let col = 0; col < map[row].length; ++col) {
          if (map[row][col]["entity"] != null && map[row][col]["entity"] != this.state.player &&
            map[row][col]["entity"] != this.state.treasure && map[row][col]["revealed"] != true) {
            mapItemAreas.push({x: row, y: col});
          }
        }
      }
      // Sekoitetaan kartan esinepaikkojen koordinaatit satunnaiseen järjestykseen.
      for (let i = mapItemAreas.length - 1; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = mapItemAreas[i];
        mapItemAreas[i] = mapItemAreas[j];
        mapItemAreas[j] = temp;
      }
      for (let i = 0; i < mapItemAreas.length && i < 3; ++i) {
        revealingAreas.push([mapItemAreas[i].x, mapItemAreas[i].y]);
      }
    }
    this.setState({
      revealingAreas: revealingAreas,
      selectedAction: actionSlotIdx,
    });
    setTimeout(() => {this.executeAction(actionSlotIdx, "reveal", revealingAreas);}, this.state.actionSpeed * 1000);
  }

  /**
   * Suorittaa vuorolle määrätyn toiminnon. Funktiota suoritetaan rekursiivisesti niin kauan kunnes kaikki toiminnot
   * on käyty läpi. Suoritettavien toimintojen loputtua asettaa sovelluksen tilan seuraavan vuoron määrittelyä varten
   * vapauttamalla käyttöliittymän, poistamalla vuoron aikana käytetyt esineet pelaajan käyttöesineistä, tyhjentämällä
   * esinetilojen historian ja poisasettamalla sekä karttatoimintojen että esinepaikkojen valinnat.
   * @param actionSlotIdx Sen toimintopaikan indeksi, jonka toimintoa kulloinkin ollaan suorittamassa.
   * @param actionToFinish Mitä toimintoa ollaan viimeistelemässä. Jos 'continue' niin keskeneräistä toimintoa ei ole.
   * @param param1 Mahdollinen parametri liikkumis- tai paljastamistoiminnosta. Liikkumisessa pelaajapaikan vanha rivi, paljastamisessa paljastetut alueet.
   * @param param2 Mahdollinen parametri liikkumistoiminnosta. Pelaajapaikan vanha sarake.
   * @param param3 Mahdollinen parametri liikkumistoiminnosta. Pelaajapaikan uusi rivi.
   * @param param4 Mahdollinen parametri liikkumistoiminnosta. Pelaajapaikan uusi sarake.
   */
  executeAction(actionSlotIdx, actionToFinish, param1, param2, param3, param4) {
    let actionSlots = this.state.actionSlots;
    // Animoitujen toimintojen loppuun saattaminen asetetaan suoriutumaan ajastimen avulla.
    if (actionToFinish == "move") {
      if (this.state.map[param3][param4]["entity"] == this.state.treasure) { // Jos liikkumiskohteessa on aarre näytetään voittodialogi.
        this.setState({
          endGameDialog: "victory",
        });
      } else { // Viimeistellään liikkumistoiminto ja siirrytään seuraavaan toimintoon.
        this.finishMoveAction(param1, param2, param3, param4);
        setTimeout(() => {this.executeAction(actionSlotIdx + 1, "continue")}, 1);
      }
    } else if (actionToFinish == "reveal") { // Viimeistellään paljastamistoiminto ja siirrytään seuraavaan toimintoon.
      this.finishRevealAction(param1);
      setTimeout(() => {this.executeAction(actionSlotIdx + 1, "continue")}, 1);
    } else {
      if (actionSlotIdx < actionSlots.length) { // Toimintopaikkoja on vielä jäljellä.
        if (actionSlots[actionSlotIdx] == this.state.player || this.state.itemSlots[actionSlots[actionSlotIdx]] != null) {
          let actionEntity;
          if (actionSlots[actionSlotIdx] == this.state.player) {
            actionEntity = this.state.player;
          } else {
            actionEntity = this.state.itemSlots[actionSlots[actionSlotIdx]];
          }
          if (actionEntity.effect == "move") {
            this.executeMoveAction(actionSlotIdx);
          } else if (actionEntity.effect == "reveal") {
            this.executeRevealAction(actionEntity, actionSlotIdx);
          } else if (actionEntity.effect == "extraTurn") {
            this.setState({
              turns: this.state.turns + 1,
            });
            this.executeAction(actionSlotIdx + 1, "continue");
          } else {
            this.executeAction(actionSlotIdx + 1, "continue");
          }
        } else { // Toimintopaikan ollessa tyhjä jätetään se huomiotta ja siirrytään seuraavaan toimintoon.
          this.executeAction(actionSlotIdx + 1, "continue");
        }
      } else { // Kaikki toimintopaikat on käyty läpi.
        if (this.state.turns > 0) { // Jos vuoroja on vielä jäljellä valmistetaan seuraavan vuoron suunnittelua.
          let map = this.state.map;
          // Asetetaan kartalta pois kohdistetut alueet.
          for (let row = 0; row < map.length; ++row) {
            for (let col = 0; col < map[row].length; ++col) {
              map[row][col]["targetedBy"] = null;
            }
          }
          let itemSlots = this.state.itemSlots.slice();
          // Poistetaan vuorossa käytetyt esineet pelaajan käyttöesineistä.
          for (let itemIdx = itemSlots.length - 2; itemIdx < itemSlots.length; ++itemIdx) {
            itemSlots[itemIdx] = null;
          }
          let slotStates = [];
          slotStates.push([itemSlots.slice(), null, null]); // Korvataan edellisen vuoron esinehistoria uudella.
          this.setState({
            map: map,
            disabledUI: false,
            selectedAction: null,
            selectedItemSlot: null,
            itemSlots: itemSlots,
            slotStates: slotStates,
            currentSlotState: 0,
            combineMode: false,
          });
        } else { // Jos vuoroja ei ole enää jäljellä näytetään häviödialogi.
          this.setState({
            endGameDialog: "defeat",
          });
        }
      }
    }
  }

  /**
   * Jos kaikilla kohdennettaville toiminnoile on annettu kohteet, suorittaa vuoron aloittamalla toiminnon suorittaminfunktion
   * rekursiivisen suorittamisen ja vähentämällä jäljellä olevia vuoroja yhdellä. Muuten näyttää viestin, jossa kehotetaan asettamaan
   * kaikille kohdennettaville toiminnoille kohteet.
   */
  executeTurn = () => {
    let message = "";
    let allActionsAreTargeted = this.checkIfAllTargetableActionsAreTargeted();
    if (allActionsAreTargeted == true) {
      message = languageBundle[this.state.langValue].messageExecutingTurn;
      // Aloitetaan toimintojen rekursiivinen suorittaminen. Asetetaan suoritettavaksi vasta millisekunnin päästä,
      // jotta sovelluksen tila ehtisi päivittyä ensin.
      setTimeout(() => {this.executeAction(0, "continue")}, 1);
    } else {
      message = languageBundle[this.state.langValue].messageUntargetedActions;
    }
    this.setState({
      turns: allActionsAreTargeted == true ? this.state.turns - 1 : this.state.turns,
      disabledUI: allActionsAreTargeted == true,
      notificationMessage: message,
      notificationOpen: true,
      confirmTurnOpen: false,
    });
  };

  /**
   * Jos kaikille kohdennettaville toiminnoille on annettu kohteet, avaa tai sulkee vahvistusdialogin vuoron suorittamiselle.
   * Muuten näyttää viestin, jossa kehotetaan asettamaan kaikille kohdennettaville toiminnoille kohteet.
   */
  handleConfirmTurnOpen = () => {
    let allActionsAreTargeted = this.checkIfAllTargetableActionsAreTargeted();
    if (allActionsAreTargeted == true) {
      this.setState({
        confirmTurnOpen: !this.state.confirmTurnOpen,
      });
    } else {
      let message = languageBundle[this.state.langValue].messageUntargetedActions;
      this.setState({
        notificationMessage: message,
        notificationOpen: true,
        confirmTurnOpen: false,
      });
    }
  };

  /**
   * Tarkistaa onko kaikille toimintopaikkojen kohdennettaville toiminnoille annettu kohteet kartalta.
   * Palauttaa toden jos on, epätoden jos ei ole.
   * @returns {boolean} Onko kaikille kohdennettaville toiminnoille annettu kohteet.
   */
  checkIfAllTargetableActionsAreTargeted() {
    let actionSlots = this.state.actionSlots;
    let itemSlots = this.state.itemSlots;
    let targetableActions = []; // Toiminnot, jotka ovat kohdistettavia.
    for (let slotIdx = 0; slotIdx < actionSlots.length; ++slotIdx) {
      if (actionSlots[slotIdx] == this.state.player ||
        (itemSlots[actionSlots[slotIdx]] != null && itemSlots[actionSlots[slotIdx]].targetable != false)) {
        targetableActions.push(actionSlots[slotIdx]);
      }
    }
    let map =  this.state.map;
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map[row].length; ++col) {
        // Jos karttapaikka on jonkin toiminnon kohteena, niin poistetaan toiminto taulukosta.
        if (map[row][col]["targetedBy"] != null) {
          let targetableActionIndex = targetableActions.indexOf(map[row][col]["targetedBy"]);
          targetableActions.splice(targetableActionIndex, 1);
        }
      }
    }
    if (targetableActions.length == 0) { // Jos kaikki kohdistettavat toiminnot poistettiin taulukosta on niille kaikille kohteet kartalla.
      return true;
      // Jos kaikille kohdistettaville toiminnoille ei ole kohdetta asetetaan ensimmäinen kohdistamaton toiminto valituksi
      // ja palautetaan epätosi.
    } else {
      let firstUntargetedActionIndex = actionSlots.indexOf(targetableActions[0]);
      if (firstUntargetedActionIndex != this.state.selectedAction) {
        this.selectAction(firstUntargetedActionIndex);
      }
      return false;
    }
  }

  /**
   * Valitaan karttapaikalta kohdealue valitulle toiminnolle.
   * @param selectedTarget Valitun karttapaikan id.
   */
  selectActionTarget = (selectedTarget) => {
    if (this.state.selectedAction != null) {
      let map = this.state.map;
      let coordinates = selectedTarget.split(" "); // Alueen id on sen rivi- ja sarakeindeksit välilyönnillä erotettuina.
      if (map[coordinates[0]][coordinates[1]]["targetable"] == true) {
        if (map[coordinates[0]][coordinates[1]]["targetedBy"] == this.state.actionSlots[this.state.selectedAction]) {
          map[coordinates[0]][coordinates[1]]["targetedBy"] = null;
        } else {
          map = this.clearPreviouslySelectedActionTarget(map);
          map[coordinates[0]][coordinates[1]]["targetedBy"] = this.state.actionSlots[this.state.selectedAction];
        }
        for (let row = 0; row < map.length; ++row) {
          for (let col = 0; col < map.length; ++col) {
            map[row][col]["targetable"] = false;
          }
        }
        map = this.clearUnreachableMoveAreas(map);
        this.setState({
          map: map,
          selectedAction: null,
        });
      }
    }
  };

  /**
   * Poisasettaa kartalta valitun toiminnon kohteen. Tarvitaan, kun toiminnolle valitaan uusi kohde.
   * @param map Pelikartta.
   * @returns {*} Viite karttaan.
   */
  clearPreviouslySelectedActionTarget(map) {
    let breakFromLoop = false;
    for(let row = 0; row < map.length; ++row) {
      for(let col = 0; col < map.length; ++col) {
        if(map[row][col]["targetedBy"] == this.state.actionSlots[this.state.selectedAction]) {
          map[row][col]["targetedBy"] = null;
          breakFromLoop = true;
          break;
        }
      }
      if (breakFromLoop == true) {
        break;
      }
    }
    return map;
  }

  /**
   * Tarkistaa onko käyttöesinepaikoissa tapahtunut muutoksia ja jos on, niin poisasettaa
   * valitun karttatoiminnon ja valitut tai valittavissa olevat alueet.
   * @param itemSlots
   */
  clearTargetedMapAreas(itemSlots) {
    let prevItemSlots = this.state.itemSlots;
    let map = this.state.map;
    let selectedAction = this.state.selectedAction;
    if (itemSlots[6] != prevItemSlots[6] || itemSlots[7] != prevItemSlots[7]) {
      selectedAction = null;
      for (let row = 0; row < map.length; ++row) {
        for (let col = 0; col < map.length; ++col) {
          map[row][col]["targetable"] = null;
          map[row][col]["targetedBy"] = null;
        }
      }
    }
    this.setState({
      map: map,
      selectedAction: selectedAction,
    });
  }

  /* Esinenäkymään liittyvät funktiot. */

  /**
   * Esineen raahauksen aloittamisessa esinepaikan id:n talteen ottaminen ja sen esinepaikan valitseminen, josta raahaus aloitetaan.
   * @param e Raahaustapahtuma.
   */
  dragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "move";
    this.setState({
      selectedItemSlot: parseInt(e.target.id, 10),
    });
  };

  /**
   * Estää oletustoiminnon raahatessa.
   * @param e Tapahtuma.
   */
  onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /**
   * Jos esineiden yhdistämistila on pois päältä, raahatun esineen pudotuksessa vaihtaa pudotuspaikan ja
   * raahauksen aloittamispaikan sisältöjä keskenään. Esineiden yhdistämistilan ollessa päällä ja kun pudotuskohteessa
   * on toinen esine pyrkii luomaan uuden esineen. Jos esineet ovat yhdistettävissä poistaa molemmat esineet ja asettaa
   * uuden esineen pudotuksen kohdepaikkaan. Muuten antaa viestin siitä, että esineet eivät ole yhdistettävissä.
   * @param e Raahaus/pudotustapahtuma.
   */
  onDrop = (e) => {
    e.preventDefault();
    let sourceSlot = parseInt(e.dataTransfer.getData("text"), 10);
    let targetSlot = parseInt(e.target.id, 10);

    if (targetSlot !== sourceSlot) {
      let itemSlots = this.state.itemSlots.slice();
      let itemSlotsStateChanged = false;
      if (itemSlots[targetSlot] !== null && this.state.combineMode === true) { // Yritetään yhdistää esineet.
        let itemOne = itemSlots[sourceSlot];
        let itemTwo = itemSlots[targetSlot];
        for (let item in everyItem) {
          if (everyItem[item].hasOwnProperty("recipe")) {
            let recipeCodes = everyItem[item].recipe.split(" ");
            if ((recipeCodes[0] === itemOne.code && recipeCodes[1] === itemTwo.code) ||
              (recipeCodes[0] === itemTwo.code && recipeCodes[1] === itemOne.code)) {
              itemSlots[sourceSlot] = null;
              itemSlots[targetSlot] = everyItem[item];
              itemSlotsStateChanged = true;
              this.displayNotification("combine", everyItem[item].name);
              break;
            }
          }
        }
        if (itemSlotsStateChanged == false) {
          this.displayNotification("combine failed", null);
        }
      } else { // Vaihdetaan lähde- ja kohdepaikkojen sisältöjä keskenään.
        let tmp = itemSlots[targetSlot];
        itemSlots[targetSlot] = itemSlots[sourceSlot];
        itemSlots[sourceSlot] = tmp;
        itemSlotsStateChanged = true;
      }
      if (itemSlotsStateChanged) {
        let slotStates = this.insertToSlotStates(itemSlots, sourceSlot, targetSlot);
        this.clearTargetedMapAreas(itemSlots);
        this.setState({
          itemSlots: itemSlots,
          selectedItemSlot: targetSlot,
          slotStates: slotStates,
          currentSlotState: this.state.currentSlotState + 1,
        });
      }
    }
  };

  /**
   * Asettaa esinepaikan valituksi tai poisasettaa valinnan jos esinepaikka on sama kuin jo valittu esinepaikka.
   * @param selectedSlot Esinepaikan id.
   */
  selectSlot = (selectedSlot) => {
    this.setState({
      selectedItemSlot: selectedSlot === this.state.selectedItemSlot ? null : selectedSlot,
    });
  };

  /**
   * Kumoaa esineisiin kohdistuneen operaation asettamalla nykyiseksi esinepaikkojen tilaksi esinepaikkatilahistorian
   * edellisen esinetilan.
   */
  undoAction = () => {
    if (this.state.currentSlotState-1 >= 0) {
      let prevItemSlots = this.state.slotStates[this.state.currentSlotState - 1][0].slice();
      this.clearTargetedMapAreas(prevItemSlots);
      this.setState({
        itemSlots: prevItemSlots,
        selectedItemSlot: this.state.slotStates[this.state.currentSlotState][1],
        currentSlotState: this.state.currentSlotState - 1,
      });
    }
  };

  /**
   * Tekee uudelleen esineisiin kohdistuneen operaation asettamalla nykyiseksi esinepaikkojen tilaksi
   * seuraavan esinepaikkatilahistorian tilan.
   */
  redoAction = () => {
    if (this.state.currentSlotState+1 < this.state.slotStates.length) {
      let nextItemSlots = this.state.slotStates[this.state.currentSlotState + 1][0].slice();
      this.clearTargetedMapAreas(nextItemSlots);
      this.setState({
        itemSlots: nextItemSlots,
        selectedItemSlot: this.state.slotStates[this.state.currentSlotState + 1][2],
        currentSlotState: this.state.currentSlotState + 1,
      });
    }
  };

  /**
   * Vaihtaa esineiden yhdistämistilaa.
   */
  toggleCombineMode = () => {
    this.setState({
      combineMode: this.state.combineMode === false,
    });
  };

  /**
   * Poistaa valitun esinepaikan esineen.
   */
  deleteItem = () => {
    let itemSlots = this.state.itemSlots.slice();
    itemSlots[this.state.selectedItemSlot] = null;
    let slotStates = this.insertToSlotStates(itemSlots, this.state.selectedItemSlot, this.state.selectedItemSlot);
    this.clearTargetedMapAreas(itemSlots);
    this.setState({
      itemSlots: itemSlots,
      slotStates: slotStates,
      currentSlotState: this.state.currentSlotState + 1,
    });
  };

  /**
   * Lisää esinepaikkatilojen historiaan uuden esinepaikkatilan.
   * @param itemSlots Uusi lisättävä esinepaikkatila.
   * @param selectedBeforeChange Esinepaikka, joka oli valittuna ennen esinepaikkatilan muutosta.
   * @param selectedAfterChange Esinepaikka, joka on valittuna esinepaikkatilan muutoksen jälkeen.
   * @returns {Array} Päivitetty esinepaikkatilahistoria.
   */
  insertToSlotStates(itemSlots, selectedBeforeChange, selectedAfterChange) {
    let slotStates = this.state.slotStates;
    slotStates.splice(this.state.currentSlotState+1);
    slotStates.push([itemSlots.slice(), selectedBeforeChange, selectedAfterChange]);
    return slotStates;
  }

  /**
   * Näyttää tapahtumasta viestin ja mahdollisesti tapahtumaan liittyvän esineen nimen.
   * @param event Viestin sisältö.
   * @param item Vapaaehtoinen tapahtumaan liittyneen esineen nimi.
   */
  displayNotification(event, item) {
    let message = "";
    if (event == "combine") { // Kerrotaan, minkä esineen luominen onnistui.
      message = languageBundle[this.state.langValue].messageCombineSuccess+": "+ item;
    } else if (event == "combine failed") { // Kerrotaan, että esineet eivät ole yhdistettävissä.
      message = languageBundle[this.state.langValue].messageCombineFail;
    }
    this.setState({
      notificationMessage: message,
      notificationOpen: true,
    });
  }

  /**
   * Vaihtaa pelaajan nimen korostamistilan sen perusteella, onko kursori pelaajan nimen päällä vai ei.
   * @param isHovered Onko kursori pelaajan nimen päällä.
   */
  togglePlayerNameHover = (isHovered) => {
    this.setState({
      playerNameIsHovered: isHovered,
    });
  };

  /**
   * Vaihtaa pelaajan kuvan korostamistilan sen perusteella, onko kursori pelaajan kuvan päällä vai ei.
   * @param isHovered Onko kursori pelaajan kuvan päällä.
   */
  togglePlayerImageHover = (isHovered) => {
    this.setState({
      playerImageIsHovered: isHovered,
    });
  };

  /**
   * Avaa pelin aloitusdialogin kesken pelin tietyssä kohdassa pelaajan nimen tai kuvan vaihtamista varten.
   * @param stepIndex Kohta, jossa aloitusdialogi avataan. 0 = pelaajan nimen asettaminen, 1 = pelaajan kuvan asettaminen.
   */
  openStartingDialogAtStep = (stepIndex) => {
    this.setState({
      startingDialogStepIndex: stepIndex,
      startingDialogOpenedMidGame: true,
    });
  };

  /**
   * Sulkee kesken pelin avatun aloitusdialogin.
   */
  closeMidGameOpenedStartingDialog = () => {
    this.setState({
      startingDialogStepIndex: 3,
      startingDialogOpenedMidGame: false,
    });
  };

  /* Asetuksiin liittyvät funktiot. */

  /**
   * Avaa tai sulkee asetusvalikon.
   */
  handleSettingsOpen = () => {
    this.setState({settingsOpen: !this.state.settingsOpen});
  };

  /**
   * Vaihtaa käyttöliittymän kieltä.
   * @param event Kielen vaihtotapahtuma.
   * @param index Kieliarvon indeksi.
   * @param value Valittu kieli.
   */
  handleLangChange = (event, index, value) => {
    this.changeEntitiesLanguage(value);
    this.setState({langValue: value});
  };

  /**
   * Vaihtaa pelin entiteettien (pelaaja, aarre ja esineet) nimet ja kuvaukset valitulle kielelle.
   * @param langValue Valittu kieli.
   */
  changeEntitiesLanguage(langValue) {
    for (let item in everyItem) {
      if (everyItem[item].hasOwnProperty("name")) { // Asetetaan esineen nimi valitulle kielelle.
        let itemName = item + "Name";
        everyItem[item].name = languageBundle[langValue][itemName];
      }
      if (everyItem[item].hasOwnProperty("desc")) { // Asetetaan esineen kuvaus valitulle kielelle.
        let itemDesc = item + "Desc";
        everyItem[item].desc = languageBundle[langValue][itemDesc];
      }
    }
    let player = this.state.player;
    let treasure = this.state.treasure;
    player.desc = languageBundle[langValue].playerDesc; // Asetetaan pelaajan kuvaus valitulle kielelle.
    treasure.name = languageBundle[langValue].treasureName; // Asetetaan aarteen nimi valitulle kielelle.
    this.setState({
      player: player,
      treasure: treasure,
    });
  }

  /**
   * Vaihtaa käyttöliittymän teemaväritystä.
   * @param event Teeman vaihtotapahtuma.
   * @param index Valitun teeman indeksi.
   * @param value Valittu teema.
   */
  handleThemeChange = (event, index, value) => {
    this.setState({themeValue: value});
  };

  /**
   * Vaihtaa vuoron suorittamisen vahvistusdialogin näyttämisen valintalaatikon valituksi tai poisvalituksi.
   */
  changeConfirmTurnCheck = () => {
    this.setState((oldState) => {
      return {
        confirmTurnChecked: !oldState.confirmTurnChecked,
      };
    });
  };

  /**
   * Vaihtaa pelin lopettamisen vahvistusdialogin näyttämisen valintalaatikon valituksi tai poisvalituksi.
   */
  changeConfirmQuitCheck = () => {
    this.setState((oldState) => {
      return {
        confirmQuitChecked: !oldState.confirmQuitChecked,
      };
    });
  };

  /**
   * Vaihtaa animoidun toiminnon suorittamisnopeutta sekunneissa.
   * @param event Valintatapahtuma.
   * @param value Valittu sekuntimäärä vuoron suorittamiseen.
   */
  handleTurnActionSpeedChange = (event, value) => {
    this.setState({
      actionSpeed: value,
    });
  };

  /* Peliohjeeseen liittyvä funktio. */

  /**
   * Aukaisee tai sulkee pelin ohjedialogin.
   */
  handleHelpOpen = () => {
    this.setState({ helpOpen: !this.state.helpOpen });
  };

  /* Näkymän vaihtamisen funktio. */

  /**
   * Vaihtaa pelin näkymää vaihtamalla avointa välilehteä.
   * @param view Valittu näkymä/välilehti.
   */
  handleViewChange = (view) => {
    this.setState({ currentView: view});
  };

  /* Aloitusdialogiin liittyvät funktiot. */

  /**
   * Siirtyy aloitusdialogissa seuraavaan vaiheeseen.
   */
  handleNextStep = () => {
    const stepIndex = this.state.startingDialogStepIndex;
    this.setState({
      startingDialogStepIndex: stepIndex + 1,
    });
  };

  /**
   * Siirtyy aloitusdialogissa edelliseen vaiheeseen.
   */
  handlePrevStep = () => {
    const stepIndex = this.state.startingDialogStepIndex;
    if (stepIndex > 0) {
      this.setState({startingDialogStepIndex: stepIndex - 1});
    }
  };

  /**
   * vaihtaa pelaajan nimeä.
   * @param event Pelaajan nimen vaihtotapahtuma.
   */
  handlePlayerNameChange = (event) => {
    if (event.target.value.length <= 35) {
      let player = this.state.player;
      player.name = event.target.value;
      this.setState({
        player: player,
      });
    }
  };

  /**
   * Vaihtaa pelaajan kuvan lähdettä ja kuvaa.
   * @param event Valintatapahtuma.
   * @param value Pelaajan kuvan lähde.
   */
  handleImageSourceChange = (event, value) => {
    if (value === "options") { // Pelaajan kuva on valmiista vaihtoehdoista.
      this.changePlayerImage(this.state.playerImageOption, value);
    } else { // Pelaajan kuva on käyttäjän antamasta url-osoitteesta.
      this.changePlayerImage(this.state.playerImageUrl, value);
    }
    this.setState({
      playerImageSource: value,
    });
  };

  /**
   * Vaihtaa pelaajan kuvaa.
   * @param value Pelaajan kuvan url-osoite tai valmiiden vaihtoehtokuvien numero.
   * @param imageSource Pelaajan kuvan lähde.
   */
  changePlayerImage(value, imageSource) {
    let player = this.state.player;
    if (imageSource === "options") { // Kuva asetetaan valmiista vaihtoehdoista.
      let playerImage;
      if (value === 1) {
        playerImage = playerImage1;
      } else if (value === 2) {
        playerImage = playerImage2;
      } else if (value === 3) {
        playerImage = playerImage3;
      }
      player.image = playerImage;
    } else { // Kuva asetetaan url-osoitteesta.
      if (value === "") { // Jos url-osoitetta ei vielä ole annettu pidättäydytään valmiiden vaihtoehtojen kuvassa.
        this.changePlayerImage(this.state.playerImageOption, "options");
      } else {
        player.image = value;
      }
    }
    this.setState({
      player: player,
    });
  }

  /**
   * Vaihtaa pelaajan kuvan valmiista vaihtoehdoista valittuun kuvaan.
   * @param event Valintatapahtuma.
   * @param index Valinnan indeksi.
   * @param value Valitun kuvan numero.
   */
  handlePlayerImageOptionChange = (event, index, value) => {
    this.changePlayerImage(value, this.state.playerImageSource);
    this.setState({
      playerImageOption: value,
    });
  };

  /**
   * Vaihtaa pelaajan kuvan url-osoitteessa annettuun kuvaan.
   * @param event Url-osoitteen antotapahtuma.
   */
  handlePlayerImageUrlChange = (event) => {
    this.changePlayerImage(event.target.value, this.state.playerImageSource);
    this.setState({
      playerImageUrl: event.target.value
    });
  };

  /**
   * Vaihtaa pelin vaikeustasoa.
   * @param event Valintatapahtuma.
   * @param value Valittu vaikeustaso. 1 = helpoin, 5 = vaikein.
   */
  handleDifficultyLevelChange = (event, value) => {
    this.setState({
      difficultyLevel: value,
    });
  };

  /**
   * Aloittaa uuden pelin asettamalla kartalle pelaajan, aarteen sekä esineitä ja vuorojen määrän valitun vaikeustason mukaan ja
   * sulkemalla aloitusdialogin.
   */
  startGame = () => {
    let diffLvl = this.state.difficultyLevel;
    // Kartalla olevien esineiden määrä riippuu vaikeustasosta. Suurempi vaikeustaso -> vähemmän esineitä.
    let numberOfMapItems = Math.floor(100 / diffLvl);

    // Määritetään kartalla useimmin esiintyvät esineet ja asetetaan ne taulukkoon.
    // Nämä esineet ovat sellaisia, jotka eivät ole rakennettavissa muita esineitä yhdistämällä.
    // Lisäksi vesipullo ja esinepaikkojen kartta jätetään näistä pois.
    let regularItems = [];
    for (let item in everyItem) {
      if (everyItem[item].hasOwnProperty("recipe") == false && everyItem[item] != everyItem.bottle && everyItem[item] != everyItem.chart) {
        regularItems.push(everyItem[item]);
      }
    }

    let mapEntities = []; // Taulukko karttaan asetettaville entiteeteille (kartan esineille, pelaajalle ja aarteelle).
    let regularItemIndex = 0; // Tavanomaisia esineitä läpikäyvä indeksi.
    for(let i = 0; i < this.state.map.length * this.state.map.length; ++i) { // Entiteettipaikkoja on yhtä monta kuin karttapaikkoja.
      if (i < 6 - diffLvl) { // Asetetaan muutamaan ensimmäiseen paikkaan vesipullo. Suurempi vaikeustaso -> vähemmän vesipulloja.
        mapEntities[i] = everyItem.bottle;
      } else if (i < (6 - diffLvl) * 2) { // Asetetaan vesipullojen jälkeen esinepaikkoja paljastavia karttoja. Suurempi vaikeustaso -> vähemmän karttoja.
        mapEntities[i] = everyItem.chart;
      } else if (i < numberOfMapItems) { // Täyettään loput esinepaikat tavanomaisilla esineillä.
        mapEntities[i] = regularItems[regularItemIndex];
        if (regularItemIndex === regularItems.length - 1) {
          regularItemIndex = 0;
        } else {
          ++regularItemIndex;
        }
      } else if (i === numberOfMapItems) { // Asetetaan esineiden jälkeen pelaaja.
        mapEntities[i] = this.state.player;
      } else if (i === numberOfMapItems + 1) { // Asetetaan pelaajan jälkeen aarre.
        mapEntities[i] = this.state.treasure;
      } else { // Kun kaikki entiteetit on asetettu täytetään loput paikat null-arvoilla.
        mapEntities[i] = null;
      }
    }

    // Sekoitetaan taulukon entiteetit (ja tyhjät null-paikat) satunnaiseen järjestykseen.
    for (let i = mapEntities.length - 1; i > 0; --i) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = mapEntities[i];
      mapEntities[i] = mapEntities[j];
      mapEntities[j] = temp;
    }

    // Täytetään karttapaikat satunnaiseen järjestykseen asetetuilla entiteeteillä.
    let map = this.state.map;
    let mapEntityIndex = 0;
    for (let row = 0; row < map.length; ++row) {
      for (let col = 0; col < map[row].length; ++col) {
        map[row][col]["entity"] = mapEntities[mapEntityIndex];
        if (map[row][col]["entity"] == this.state.player) { // Pelaajapaikan alue on heti aluksi paljastettu.
          map[row][col]["revealed"] = true;
        }
        ++mapEntityIndex;
      }
    }

    let turns = Math.floor(100 / diffLvl); // Käytössä olevien vuorojen määrä riippuu vaikeustasosta. Suurempi vaikeustaso -> vähemmän vuoroja.

    this.setState({
      turns: turns,
      map: map,
      startingDialogStepIndex: this.state.startingDialogStepIndex + 1,
    });
  };

  /* Pelin lopettamiseen liittyvät funktiot. */

  /**
   * Avaa tai sulkee pelin lopetusvahvistusdialogin.
   */
  handleConfirmQuitOpen = () => {
    this.setState({
      confirmQuitOpen: !this.state.confirmQuitOpen,
    });
  };

  /**
   * Lopettaa pelin asettamalla pelin alkutilanteeseen ja avaamalla aloitusdialogin alusta.
   */
  quitGame = () => {
    let itemSlots = [null, null, null, null, null, null, null, null];
    let slotStates = [];
    slotStates.push([itemSlots.slice(), null, null]);

    let map = [];
    // Asetetaan kartan alueet alkuperäiseen tilaansa.
    for (let row = 0; row < 12; ++row) {
      let mapRow = [];
      for (let col = 0; col < 12; ++col) {
        mapRow[col] = {entity: null, revealed: false, targetable: false, targetedBy: null};
      }
      map[row] = mapRow;
    }
    this.setState({
      disabledUI: false,

      map: map,
      hoverArea: null,
      actionSlots: [this.state.player, 6, 7],
      selectedAction: null,

      itemSlots: itemSlots,
      slotStates: slotStates,
      selectedItemSlot: null,
      currentSlotState: 0,
      combineMode: false,

      playerTopPosition: 0,
      playerLeftPosition: 0,
      revealingAreas: [],

      confirmQuitOpen: false, // Suljetaan mahdollisesti auki ollut pelin lopettamisen vahvistusdialogi.
      endGameDialog: false, // Suljetaan mahdollisesti auki ollut voittodialogi.
      startingDialogStepIndex: 0, // Avataan pelin aloitusdialogi.
    });
  };

  /* Muut funktiot. */

  /**
   * Sulkee snackbar-viestin, jos syynä on viestin näyttämisajan kuluminen loppuun.
   * @param reason Syy viestin sulkemisyritykseen.
   */
  closeNotification = (reason) => {
    if(reason == "timeout") {
      this.setState({
        notificationOpen: false,
      });
    }
  };

  /**
   * Kutsutaan näppäimen painalluksesta. Suorittaa toiminnon jos painettu näppäin on määritelty näppäinoikotieksi
   * jollekin toiminnolle ja jos edellytykset toiminnon suorittamiselle täyttyvät.
   * @param e Näppäimen alaspainamisesta tuleva tapahtuma.
   */
  checkPressedKey = (e) => {
    let currentView = this.state.currentView;
    // Näppäinoikoteitä voi käyttää kun aloitusdialogi ei ole auki eikä käyttöliittymä ole jäädytetty.
    if (this.state.startingDialogStepIndex > 2 && this.state.disabledUI == false) {
      // Nuolinäppäimillä valitaan esinepaikka.
      if ((e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) && currentView == "items") {
        let selected = this.state.selectedItemSlot;
        if (selected == null) {
          this.selectSlot(0);
        } else {
          let newSelected;
          let itemSlotsLenght = this.state.itemSlots.length;
          if (e.keyCode === 37) { // Vasen nuoli.
            newSelected = selected - 1 < 0 ? itemSlotsLenght - 1 : selected - 1;
          } else if (e.keyCode === 39) { // Oikea nuoli.
            newSelected = selected + 1 >= itemSlotsLenght ? 0 : selected + 1;
          } else if (e.keyCode === 38) { // Ylänuoli.
            newSelected = selected - 2 < 0 ? itemSlotsLenght + (selected - 2) : selected - 2;
          } else { // Alanuoli.
            newSelected = selected + 2 >= itemSlotsLenght ? (selected + 2) - itemSlotsLenght : selected + 2;
          }
          this.selectSlot(newSelected);
        }
      } else if (e.keyCode === 77) { // 'm' näppäimellä valitaan karttanäkymä.
        this.setState({ currentView: "map" });
      } else if (e.keyCode === 73) { // 'i' näppäimellä valitaan esinenäkymä.
        this.setState({ currentView: "items" });
      } else if (e.keyCode === 85 && currentView == "items") { // 'u' näppäimellä kumotaan esineisiin kohdistunut operaatio.
        if (this.state.currentSlotState > 0) {
          this.undoAction();
        }
      } else if (e.keyCode === 82 && currentView == "items") { // 'r' näppäimellä tehdään uudelleen esineisiin kohdistunut operaatio.
        if (this.state.currentSlotState < this.state.slotStates.length - 1) {
          this.redoAction();
        }
      } else if (e.keyCode === 68 && currentView == "items") { // 'd' näppäimellä poistetaan valittu esine.;
        if (this.state.selectedItemSlot != null && this.state.itemSlots[this.state.selectedItemSlot] != null) {
          this.deleteItem();
        }
      } else if (e.keyCode === 67 && currentView == "items") { // 'c' näppäimellä asetetaan/poisasetetaan esineiden yhdistämistila.
        this.toggleCombineMode();
      } else if (e.keyCode === 13 && currentView == "map") { // 'Enter' näppäimellä suoritetaan vuoro.
        if (this.state.confirmTurnChecked) {
          this.handleConfirmTurnOpen();
        } else {
          this.executeTurn();
        }
      } else if (e.keyCode === 81) { // 'q' näppäimellä lopetetaan peli.
        if (this.state.confirmQuitChecked) {
          this.handleConfirmQuitOpen();
        } else {
          this.quitGame();
        }
      } else if (e.keyCode === 72) { // 'h' näppäimellä avataan ohjeet.
        this.handleHelpOpen();
      } else if (e.keyCode === 83) { // 's' näppäimellä aukaistaan asetusvalikko.
        this.handleSettingsOpen();
      }
    }
  };


  render() {

    let lang = languageBundle[this.state.langValue]; // Valittu kieli.
    let theme = themeBundle[this.state.themeValue]; // Valittu teema.
    document.onkeydown = this.checkPressedKey; // Näppäinpainalluksien käsittely.
    document.body.style.backgroundColor = theme.mediumTwo; // Asetetaan sivun taustaväri.
    document.title = lang.gameTitle; // Asetetaan sivun otsikko.

    const muiTheme = getMuiTheme({ // Asetetaan slidereiden väritys.
      slider: {
        trackColor: theme.differ,
        selectionColor: theme.mediumTwo
      },
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <StartingDialog
            lang={lang}
            theme={theme}
            startingDialogStepIndex={this.state.startingDialogStepIndex}
            player={this.state.player}
            playerImageSource={this.state.playerImageSource}
            playerImageOption={this.state.playerImageOption}
            playerImageUrl={this.state.playerImageUrl}
            difficultyLevel={this.state.difficultyLevel}
            startingDialogOpenedMidGame={this.state.startingDialogOpenedMidGame}
            handleNextStep={this.handleNextStep}
            handlePrevStep={this.handlePrevStep}
            handlePlayerNameChange={this.handlePlayerNameChange}
            handleImageSourceChange={this.handleImageSourceChange}
            handlePlayerImageOptionChange={this.handlePlayerImageOptionChange}
            handlePlayerImageUrlChange={this.handlePlayerImageUrlChange}
            handleDifficultyLevelChange={this.handleDifficultyLevelChange}
            startGame={this.startGame}
            closeMidGameOpenedStartingDialog={this.closeMidGameOpenedStartingDialog}
          />
          <div style={{width: 800, height: 55, margin: "5px auto 20px", fontSize: 60, textAlign: "center", color: "#ffffff"}}>
            {lang.gameTitle}
          </div>
          <img
            src={this.state.treasure.image}
            alt={this.state.treasure.name}
            style={{position: "absolute", width: 60, height: 60, top: 10, left: "50%", marginLeft: 340}}
          />
          <Paper
            style={{backgroundColor: theme.lightTwo, width: 800, height: 550, margin: "0 auto 50px"}}
            zDepth={5}
          >
            <Paper style={{backgroundColor: theme.mediumOne, width: 775, height: 490, margin: "auto"}} zDepth={3}>
              <Tabs
                value={this.state.currentView}
                onChange={this.state.disabledUI == false && this.handleViewChange}
                tabItemContainerStyle={{backgroundColor: theme.darkTwo}}
                inkBarStyle={{backgroundColor: theme.differ}}
              >
                <Tab label={lang.mapTab} value="map">
                  <MapView
                    lang={lang}
                    theme={theme}
                    player={this.state.player}
                    map={this.state.map}
                    hoverArea={this.state.hoverArea}
                    actionSlots={this.state.actionSlots}
                    selectedAction={this.state.selectedAction}
                    itemSlots={this.state.itemSlots}
                    actionSpeed={this.state.actionSpeed}
                    playerTopPosition={this.state.playerTopPosition}
                    playerLeftPosition={this.state.playerLeftPosition}
                    revealingAreas={this.state.revealingAreas}
                    notificationMessage={this.state.notificationMessage}
                    notificationOpen={this.state.notificationOpen}
                    confirmTurnChecked={this.state.confirmTurnChecked}
                    confirmTurnOpen={this.state.confirmTurnOpen}
                    turns={this.state.turns}
                    disabledUI={this.state.disabledUI}
                    endGameDialog={this.state.endGameDialog}
                    treasure={this.state.treasure}
                    difficultyLevel={this.state.difficultyLevel}
                    toggleAreaHover={this.toggleAreaHover}
                    actionDragStart={this.actionDragStart}
                    onDragOver={this.onDragOver}
                    onActionDrop={this.onActionDrop}
                    selectAction={this.selectAction}
                    selectActionTarget={this.selectActionTarget}
                    handleConfirmTurnOpen={this.handleConfirmTurnOpen}
                    executeTurn={this.executeTurn}
                    closeNotification={this.closeNotification}
                    quitGame={this.quitGame}
                  />
                </Tab>
                <Tab label={lang.itemTab} value="items">
                  <ItemsView
                    lang={lang}
                    theme={theme}
                    itemSlots={this.state.itemSlots}
                    slotStates={this.state.slotStates}
                    currentSlotState={this.state.currentSlotState}
                    selectedItemSlot={this.state.selectedItemSlot}
                    combineMode={this.state.combineMode}
                    notificationMessage={this.state.notificationMessage}
                    notificationOpen={this.state.notificationOpen}
                    player={this.state.player}
                    playerNameIsHovered={this.state.playerNameIsHovered}
                    playerImageIsHovered={this.state.playerImageIsHovered}
                    dragStart={this.dragStart}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                    selectSlot={this.selectSlot}
                    undoAction={this.undoAction}
                    redoAction={this.redoAction}
                    toggleCombineMode={this.toggleCombineMode}
                    deleteItem={this.deleteItem}
                    closeNotification={this.closeNotification}
                    togglePlayerNameHover={this.togglePlayerNameHover}
                    togglePlayerImageHover={this.togglePlayerImageHover}
                    openStartingDialogAtStep={this.openStartingDialogAtStep}
                  />
                </Tab>
              </Tabs>
            </Paper>

            <RaisedButton
              label={lang.quitBtn}
              disabled={this.state.disabledUI}
              onClick={this.state.confirmQuitChecked ? this.handleConfirmQuitOpen : this.quitGame}
              style={{float:"left", margin: "12.5px", width: 175}}
              backgroundColor={theme.darkTwo}
              labelColor="#ffffff"
              disabledBackgroundColor={theme.mediumTwo}
            />
            <Dialog
              title={lang.quitConfirm}
              actions={
                [<FlatButton
                  label={lang.yes}
                  primary={true}
                  onClick={this.quitGame}
                  hoverColor={theme.darkTwo}
                />,
                <FlatButton
                  label={lang.no}
                  secondary={true}
                  onClick={this.handleConfirmQuitOpen}
                  hoverColor={theme.darkTwo}
                />]
              }
              modal={false}
              open={this.state.confirmQuitOpen}
              onRequestClose={this.handleConfirmQuitOpen}
              bodyStyle={{backgroundColor: theme.lightOne}}
              titleStyle={{backgroundColor: theme.lightOne}}
              actionsContainerStyle={{backgroundColor: theme.lightOne}}
            >
              {lang.turnsLeft}: {this.state.turns}
              <br />
              {lang.gameDiff}: {
                this.state.difficultyLevel === 1 ? lang.veryEasy :
                  this.state.difficultyLevel === 2 ? lang.easy :
                    this.state.difficultyLevel === 3 ? lang.normal :
                      this.state.difficultyLevel === 4 ? lang.hard :
                        lang.veryHard
              }
            </Dialog>

            <RaisedButton
              label={lang.settings}
              disabled={this.state.disabledUI}
              onClick={this.handleSettingsOpen}
              style={{float: "right", margin: "12.5px", width: 175}}
              backgroundColor={theme.darkTwo}
              labelColor="#ffffff"
              disabledBackgroundColor={theme.mediumTwo}
            />
            <Settings
              lang={lang}
              theme={theme}
              helpOpen={this.state.helpOpen}
              settingsOpen={this.state.settingsOpen}
              langValue={this.state.langValue}
              themeValue={this.state.themeValue}
              confirmTurnChecked={this.state.confirmTurnChecked}
              confirmQuitChecked={this.state.confirmQuitChecked}
              actionSpeed={this.state.actionSpeed}
              handleSettingsOpen={this.handleSettingsOpen}
              handleLangChange={this.handleLangChange}
              handleThemeChange={this.handleThemeChange}
              changeConfirmTurnCheck={this.changeConfirmTurnCheck}
              changeConfirmQuitCheck={this.changeConfirmQuitCheck}
              handleTurnActionSpeedChange={this.handleTurnActionSpeedChange}
            />

            <RaisedButton
              label={lang.help}
              disabled={this.state.disabledUI}
              onClick={this.handleHelpOpen}
              style={{display: "block", margin: "12.5px auto", width: 175}}
              backgroundColor={theme.darkTwo}
              labelColor="#ffffff"
              disabledBackgroundColor={theme.mediumTwo}
            />
            <Dialog
              title={lang.helpTitle}
              actions={
                <FlatButton
                  label={lang.close}
                  primary={true}
                  onClick={this.handleHelpOpen}
                  hoverColor={theme.darkTwo}
                />
              }
              modal={false}
              autoDetectWindowHeight={false}
              autoScrollBodyContent={true}
              style={{height: "100%", maxHeight: "100%"}}
              open={this.state.helpOpen}
              onRequestClose={this.handleHelpOpen}
              bodyStyle={{backgroundColor: theme.lightOne}}
              titleStyle={{backgroundColor: theme.lightOne}}
              actionsContainerStyle={{backgroundColor: theme.lightOne}}
            >
              {lang.helpPartOne}<br/><br/>
              {lang.helpPartTwo}<br/>
              <img src={helpImage1} alt="helpImage1" style={{display: "block", width: 500, margin: " 5px auto"}} />
              {lang.helpPartThree}<br/><br/>
              <img src={helpImage2} alt="helpImage1" style={{display: "block", width: 250, margin: " 5px auto"}} />
              {lang.helpPartFour}<br/><br/>
              <img src={helpImage3} alt="helpImage1" style={{display: "block", width: 300, margin: " 5px auto"}} />
              {lang.helpPartFive}<br/><br/>
              <img src={helpImage4} alt="helpImage1" style={{display: "block", width: 500, margin: " 5px auto"}} />
              {lang.helpPartSix}<br/><br/>
              <img src={helpImage5} alt="helpImage1" style={{display: "block", width: 200, margin: " 5px auto"}} />
              {lang.helpPartSeven}<br/><br/>
              {lang.helpPartEight}<br/><br/>
              {lang.helpKeyShortCutsMapView}<br/><br/>
              {lang.helpKeyShortCutsEnter}<br/><br/>
              {lang.helpKeyShortCutsItemsView}<br/><br/>
              {lang.helpKeyShortCutsArrows}<br/>
              {lang.helpKeyShortCutsD}<br/>
              {lang.helpKeyShortCutsC}<br/>
              {lang.helpKeyShortCutsU}<br/>
              {lang.helpKeyShortCutsR}<br/><br/>
              {lang.helpKeyShortCutsBothViews}<br/><br/>
              {lang.helpKeyShortCutsM}<br/>
              {lang.helpKeyShortCutsI}<br/>
              {lang.helpKeyShortCutsQ}<br/>
              {lang.helpKeyShortCutsH}<br/>
              {lang.helpKeyShortCutsS}
            </Dialog>

          </Paper>

          <Snackbar
            open={this.state.notificationOpen}
            message={this.state.notificationMessage}
            autoHideDuration={3000}
            onRequestClose={this.closeNotification}
          />

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
