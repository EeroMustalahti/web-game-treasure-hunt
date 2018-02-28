import React, { Component } from 'react';
import './App.css';
import Drawer from 'material-ui/Drawer';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

/**
 * Asetukset
 */
class Settings extends Component {
  render() {

    let lang = this.props.lang;
    let theme = this.props.theme;

    return(
      <Drawer
        docked={false}
        width={350}
        open={this.props.settingsOpen}
        onRequestChange={this.props.handleSettingsOpen}
        containerStyle={{backgroundColor: theme.lightTwo}}
      >

        <RaisedButton
          label={lang.close}
          style={{width: "100%"}}
          onClick={this.props.handleSettingsOpen}
          backgroundColor={theme.darkTwo}
          labelColor="#ffffff"
        />

        <div style={{position: "absolute", top: 100, left: 20}}>{lang.lang}:</div>
        <DropDownMenu
          style={{position: "absolute", top: 85, right: 20}}
          listStyle={{backgroundColor: theme.lightOne}}
          value={this.props.langValue} onChange={this.props.handleLangChange}
        >
          <MenuItem value={"en"} primaryText={lang.english} />
          <MenuItem value={"fi"} primaryText={lang.finnish} />
        </DropDownMenu>

        <div style={{position: "absolute", top: 200, left: 20}}>{lang.theme}:</div>
        <DropDownMenu
          style={{position: "absolute", top: 185, right: 20}}
          listStyle={{backgroundColor: theme.lightOne}}
          value={this.props.themeValue} onChange={this.props.handleThemeChange}
        >
          <MenuItem value={"sapphire"} primaryText={lang.sapphire} />
          <MenuItem value={"ruby"} primaryText={lang.ruby} />
          <MenuItem value={"emerald"} primaryText={lang.emerald} />
        </DropDownMenu>

        <div style={{position: "absolute", width: 125, top: 300, left: 20}}>{lang.confirmDisplay}</div>
        <Checkbox
          style={{position: "absolute", width: 200, top: 300, left: 150}}
          label={lang.executingTurn}
          checked={this.props.confirmTurnChecked}
          onCheck={this.props.changeConfirmTurnCheck}
          iconStyle={{fill: theme.mediumTwo}}
        />
        <Checkbox
          style={{position: "absolute", width: 200, top: 325, left: 150}}
          label={lang.quittingGame}
          checked={this.props.confirmQuitChecked}
          onCheck={this.props.changeConfirmQuitCheck}
          iconStyle={{fill: theme.mediumTwo}}
        />

        <div style={{position: "absolute", width: 100, top: 400, left: 20}}>{lang.turnActionSpeed}</div>
        <Slider
          min={0}
          max={5}
          step={1}
          value={this.props.actionSpeed}
          onChange={this.props.handleTurnActionSpeedChange}
          style={{position: "absolute", width: 100, top: 380, left: 145}}
        />
        <span style={{position: "absolute", width: 50, top: 400, left: 260}} >{this.props.actionSpeed} {lang.seconds}</span>

      </Drawer>
    );
  }
}

export default Settings;