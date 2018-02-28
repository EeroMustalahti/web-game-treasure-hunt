import React, { Component } from 'react';
import './App.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import mapViewStyles from './MapViewStyles';

/**
 * Karttanäkymä
 */
class MapView extends Component {

  render() {

    let lang = this.props.lang;
    let theme = this.props.theme;

    const styles = mapViewStyles;

    // Asetetaan tyyleihin teeman mukaiset värit.
    styles.highlightedArea = {...styles.highlightedArea,...{borderColor: theme.darkOne}};
    styles.hoverArea = {...styles.hoverArea,...{borderColor: theme.differ}};
    styles.targetedAreaAction = {...styles.targetedAreaAction,...{color: theme.darkOne}};
    styles.selectedActionSlot = {...styles.selectedActionSlot,...{backgroundColor: theme.lightTwo}};
    styles.turnsDisplay = {...styles.turnsDisplay,...{backgroundColor: theme.lightOne}};

    styles.unrevealedArea.transitionDuration = this.props.actionSpeed+"s"; // Asetetaan tyyliin pimennetyn alueen paljastumisnopeus.
    styles.playerImage.transitionDuration = this.props.actionSpeed+"s"; // Asetetaan tyyliin pelaajan kuvan liikkumisnopeus.
    // Asetetaan pelaajan kuvan paikka siten, että se on liikkumiskohteen päällä.
    styles.playerImage = {...styles.playerImage,...{top: this.props.playerTopPosition, left: this.props.playerLeftPosition}};

    // Pelikartta.
    let map = this.props.map;
    let rows = [];
    for (let row = 0; row < map.length; ++row) {
      let cells = [];
      for (let col = 0; col < map.length; ++col) {
        let cellId = row.toString() + " " + col.toString(); // Id on rivin indeksi ja sarakkeen indeksi.
        let isRevealingArea = this.props.revealingAreas.findIndex(function (revealingArea) {
            return revealingArea[0] == row && revealingArea[1] == col;
          }) > -1;
        cells.push(
          <div
            id={cellId}
            onClick={() => this.props.selectActionTarget(cellId)}
            onMouseEnter={(e) => this.props.toggleAreaHover(cellId)}
            onMouseLeave={(e) => this.props.toggleAreaHover(null)}
            style={
              cellId == this.props.hoverArea ? {...styles.cell,...styles.highlightedArea,...styles.hoverArea} :
              map[row][col]["targetable"] == true ? {...styles.cell,...styles.highlightedArea,...styles.targetableArea} :
              map[row][col]["targetedBy"] != null ? {...styles.cell,...styles.highlightedArea,...styles.targetedArea} :
              styles.cell
            }
          >
            {
              map[row][col]["entity"] != null &&
                <img
                  src={map[row][col]["entity"].image}
                  alt={map[row][col]["entity"].name}
                  draggable={false}
                  style={map[row][col]["entity"] == this.props.player ? {...styles.areaImage,...styles.playerImage} : styles.areaImage}
                />
            }
            {
              map[row][col]["revealed"] == false &&
                <div style={
                  cellId == this.props.hoverArea ||  map[row][col]["targetable"] == true || map[row][col]["targetedBy"] != null ?
                    isRevealingArea == true ?
                      {...styles.unrevealedArea,...styles.revealingArea,...styles.highlightedUnrevealedArea} :
                      {...styles.unrevealedArea,...styles.highlightedUnrevealedArea} :
                    isRevealingArea == true ?
                      {...styles.unrevealedArea,...styles.revealingArea} : styles.unrevealedArea
                } />
            }
            {
              map[row][col]["targetedBy"] != null &&
                <span style={styles.targetedAreaAction}>
                  {Number.isInteger(map[row][col]["targetedBy"]) == false && "P"}
                  {map[row][col]["targetedBy"] == 6 && "1"}
                  {map[row][col]["targetedBy"] == 7 && "2"}
                </span>
            }
            {
              (cellId == this.props.hoverArea && map[row][col]["revealed"] == true && map[row][col]["entity"] != null) &&
                <span onMouseEnter={(e) => this.props.toggleAreaHover(null)} style={styles.areaTooltip}>
                  {map[row][col]["entity"].name}
                </span>
            }
          </div>

        );
      }
      rows.push(<div style={styles.row}>{cells}</div>);
    }
    const mapAreas = <div style={styles.mapTable}>{rows}</div>;

    // Karttatoiminnot.
    let firstActionSlot;
    let secondActionSlot;
    let thirdActionSlot;
    for (let actionId = 0; actionId < this.props.actionSlots.length; ++actionId) {
      let actionSlotStyle;
      if(actionId == 0) {
        actionSlotStyle = {...styles.actionSlot,...styles.firstActionSlot};
      } else if (actionId == 1) {
        actionSlotStyle = {...styles.actionSlot,...styles.secondActionSlot};
      } else if (actionId == 2) {
        actionSlotStyle = {...styles.actionSlot,...styles.thirdActionSlot};
      }
      const action = this.props.actionSlots[actionId];
      const actionSlot = <div
        id={actionId}
        onDragOver={this.props.disabledUI == false && this.props.onDragOver}
        onDrop={this.props.disabledUI == false && this.props.onActionDrop}
        style={this.props.selectedAction != actionId ? actionSlotStyle : {...actionSlotStyle,...styles.selectedActionSlot}}
      >
        {
          (Number.isInteger(action) == false || this.props.itemSlots[action] != null) &&
            <div
              id={actionId}
              draggable={this.props.disabledUI == false && true}
              onDragStart={(e) => {this.props.disabledUI == false && this.props.actionDragStart(e);}}
              onClick={() => {this.props.disabledUI == false && this.props.selectAction(actionId)}}
              style={styles.draggableAction}
            >
              <div style={styles.actionImage}>
                <img
                  id={actionId}
                  src={Number.isInteger(action) == false ? action.image : this.props.itemSlots[action].image}
                  alt={Number.isInteger(action) == false ? action.name : this.props.itemSlots[action].name}
                  width="100%" height="100%"
                  draggable={false}
                />
              </div>
              <div
                id={actionId}
                style={styles.actionInfo}
              >
                <span style={{fontWeight: "bold"}}>
                  {Number.isInteger(action) == false ? action.name+". " : this.props.itemSlots[action].name+". "}
                </span>
                {Number.isInteger(action) == false ? action.desc : this.props.itemSlots[action].desc}
              </div>
            </div>
        }
      </div>;
      if(actionId == 0) {
        firstActionSlot = actionSlot;
      } else if (actionId == 1) {
        secondActionSlot = actionSlot;
      } else if (actionId == 2) {
        thirdActionSlot = actionSlot;
      }
    }

    return (
      <div style={{position: "relative"}}>

        {mapAreas}

        {firstActionSlot}

        {secondActionSlot}

        {thirdActionSlot}

        <div style={styles.turnsDisplay}>{lang.turnsLeft}: {this.props.turns}</div>
        <RaisedButton
          label={lang.executeTurn}
          disabled={this.props.disabledUI}
          onClick={this.props.confirmTurnChecked ? this.props.handleConfirmTurnOpen : this.props.executeTurn}
          style={styles.turnBtn}
          backgroundColor={theme.darkOne}
          labelColor="#ffffff"
          disabledBackgroundColor={theme.lightOne}
        />
        <Dialog
          title={lang.executeTurnConfirm}
          actions={
            [<FlatButton
              label={lang.yes}
              primary={true}
              onClick={this.props.executeTurn}
              hoverColor={theme.darkTwo}
            />,
            <FlatButton
              label={lang.no}
              secondary={true}
              onClick={this.props.handleConfirmTurnOpen}
              hoverColor={theme.darkTwo}
            />]
          }
          modal={false}
          open={this.props.confirmTurnOpen}
          onRequestClose={this.props.handleConfirmTurnOpen}
          bodyStyle={{backgroundColor: theme.lightOne}}
          titleStyle={{backgroundColor: theme.lightOne}}
          actionsContainerStyle={{backgroundColor: theme.lightOne}}
        >
          {lang.turnsLeft}: {this.props.turns}
        </Dialog>

        <Dialog
          title={this.props.endGameDialog == "victory" ? lang.victoryAnnouncement : lang.defeatAnnouncement}
          actions={
            <FlatButton
              label={lang.startNewGame}
              primary={true}
              onClick={this.props.quitGame}
              hoverColor={theme.darkTwo}
            />
          }
          modal={true}
          open={this.props.endGameDialog != false}
          bodyStyle={{backgroundColor: theme.lightOne}}
          titleStyle={{backgroundColor: theme.lightOne}}
          actionsContainerStyle={{backgroundColor: theme.lightOne}}
        >
          {
            this.props.endGameDialog == "victory" &&
            <img
              src={this.props.treasure.image}
              alt={this.props.treasure.name}
              style={{float: "right", width: 150, height: 150, borderStyle: "solid", borderWidth: 1}}
            />
          }
          {this.props.endGameDialog == "victory" && lang.turnsLeft + ": " + this.props.turns}
          <br />
          {lang.gameDiff}: {
          this.props.difficultyLevel === 1 ? lang.veryEasy :
            this.props.difficultyLevel === 2 ? lang.easy :
              this.props.difficultyLevel === 3 ? lang.normal :
                this.props.difficultyLevel === 4 ? lang.hard :
                  lang.veryHard
        }
        </Dialog>

      </div>
    );
  }
}

export default MapView;
