import React, { Component } from 'react';
import './App.css';
import RaisedButton from 'material-ui/RaisedButton';

import itemsViewStyles from './ItemsViewStyles';

/**
 * Esinenäkymä
 */
class ItemsView extends Component {

  render() {

    let lang = this.props.lang;
    let theme = this.props.theme;

    let styles = itemsViewStyles;

    // Asetetaan tyyleihin teeman mukaiset värit.
    styles.selectedCell = {...styles.selectedCell,...{backgroundColor: theme.lightTwo, borderColor: theme.differ}};
    styles.playerImage = {...styles.playerImage,...{borderColor: theme.darkOne}};
    styles.playerNameHover = {...styles.playerNameHover,...{backgroundColor: theme.lightTwo}};
    styles.itemName = {...styles.itemName,...{backgroundColor: theme.lightTwo}};
    styles.itemDesc = {...styles.itemDesc,...{backgroundColor: theme.lightOne}};

    // Esinepaikkojen tiedot.
    let itemSlots = this.props.itemSlots;

    // Inventaariotaulukko, jossa löydettyjä ja yhdistämällä valmistettuja esineitä.
    let rows = [];
    let slotId = 0;
    for (let row = 0; row < 3; ++row) {
      let cells = [];
      for (let col = 0; col < 2; ++col) {
        let currentSlotId = slotId;
        cells.push(
          <div
            id={currentSlotId} onDragOver={this.props.onDragOver} onDrop={this.props.onDrop}
            onClick={() => this.props.selectSlot(currentSlotId)}
            style={currentSlotId === this.props.selectedItemSlot ? styles.selectedCell : styles.cell}
          >
            {
              itemSlots[currentSlotId] !== null &&
              <img id={currentSlotId} draggable={true} onDragStart={(e) => {this.props.dragStart(e);}}
                   src={itemSlots[currentSlotId].image} alt={itemSlots[currentSlotId].name} width="80%" height="80%" />
            }
          </div>
        );
        ++slotId;
      }
      rows.push(<div style={styles.row}>{cells}</div>);
    }
    const inventory = <div style={{...styles.table,...styles.invTable}}>{rows}</div>;

    // Taulukko, jossa seuraavalla vuorolla käytössä olevat esineet.
    let cells = [];
    for (let col = 0; col < 2; ++col) {
      let currentSlotId = slotId;
      cells.push(
        <div
          id={currentSlotId} onDragOver={this.props.onDragOver} onDrop={this.props.onDrop}
          onClick={() => this.props.selectSlot(currentSlotId)}
          style={currentSlotId === this.props.selectedItemSlot ? styles.selectedCell : styles.cell}
        >
          {
            itemSlots[currentSlotId] !== null &&
            <img id={currentSlotId} draggable={true} onDragStart={(e) => {this.props.dragStart(e);}}
                 src={itemSlots[currentSlotId].image} alt={itemSlots[currentSlotId].name} width="80%" height="80%" />
          }
        </div>
      );
      ++slotId;
    }
    const inUseItems = <div style={{...styles.table,...styles.inUseTable}}>
      <div style={styles.row}>{cells}</div>
    </div>;

    return (
      <div style={{position: "relative"}}>

        <RaisedButton
          label={lang.undo}
          onClick={this.props.undoAction}
          disabled={this.props.currentSlotState <= 0}
          style={styles.undoBtn}
          backgroundColor={theme.darkOne}
          labelColor="#ffffff"
          disabledBackgroundColor={theme.lightOne}
        />
        <RaisedButton
          label={lang.redo}
          onClick={this.props.redoAction}
          disabled={this.props.currentSlotState >= this.props.slotStates.length-1}
          style={styles.redoBtn}
          backgroundColor={theme.darkOne}
          labelColor="#ffffff"
          disabledBackgroundColor={theme.lightOne}
        />

        <div style={styles.itemInfo}>
          <div style={styles.itemName}>
            {
              this.props.selectedItemSlot !== null && this.props.itemSlots[this.props.selectedItemSlot] !== null &&
              this.props.itemSlots[this.props.selectedItemSlot].name
            }
          </div>
          <div style={styles.itemDesc}>
            {
              this.props.selectedItemSlot !== null && this.props.itemSlots[this.props.selectedItemSlot] !== null &&
              this.props.itemSlots[this.props.selectedItemSlot].desc
            }
          </div>
        </div>

        <RaisedButton
          label={this.props.combineMode === true ? lang.combineMode + ": " + lang.on : lang.combineMode + ": " + lang.off}
          onClick={this.props.toggleCombineMode}
          style={styles.combineBtn}
          backgroundColor={this.props.combineMode === true ? theme.differ : theme.darkOne}
          labelColor="#ffffff"
        />
        <RaisedButton
          label={lang.del}
          disabled={this.props.selectedItemSlot === null || this.props.itemSlots[this.props.selectedItemSlot] === null}
          onClick={this.props.deleteItem}
          style={styles.deleteBtn}
          backgroundColor={theme.darkOne}
          labelColor="#ffffff"
          disabledBackgroundColor={theme.lightOne}
        />

        <div style={styles.invName}>{lang.inventory}</div>
        {inventory}

        <div style={styles.inUseName}>{lang.inUseItems}</div>
        {inUseItems}

        <div
          onMouseEnter={(e) => this.props.togglePlayerNameHover(true)}
          onMouseLeave={(e) => this.props.togglePlayerNameHover(false)}
          onClick={() => this.props.openStartingDialogAtStep(0)}
          style={this.props.playerNameIsHovered ? {...styles.playerName,...styles.playerNameHover} : styles.playerName}
        >
          {this.props.player.name}
          </div>
        <img
          onMouseEnter={(e) => this.props.togglePlayerImageHover(true)}
          onMouseLeave={(e) => this.props.togglePlayerImageHover(false)}
          onClick={() => this.props.openStartingDialogAtStep(1)}
          style={this.props.playerImageIsHovered ? {...styles.playerImage,...styles.playerImageHover} : styles.playerImage}
          src={this.props.player.image}
          alt={this.props.player.name}
          draggable={false}
        />

      </div>
    );
  }
}

export default ItemsView;
