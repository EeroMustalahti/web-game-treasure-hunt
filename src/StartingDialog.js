import React, { Component } from 'react';
import './App.css';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {Stepper, Step, StepLabel} from 'material-ui/Stepper';

/**
 * Pelin aloitusdialogi.
 */
class StartingDialog extends Component {
  render() {
    let lang = this.props.lang;
    let theme = this.props.theme;

    const stepIndex = this.props.startingDialogStepIndex;
    let stepContent;
    switch (stepIndex) {
      case 0:
        const playerName = this.props.player.name;
        stepContent = <div>
          <div>{lang.yourCharName}
            <TextField value={playerName} onChange={this.props.handlePlayerNameChange} style={{marginLeft: "20"}}/>
          </div>
        </div>;
        break;
      case 1:
        stepContent = <div>
          <img
            src={this.props.playerImageSource === "options" ? this.props.player.image : this.props.playerImageUrl}
            alt={this.props.player.name}
            style={{float: "right", width: 150, height: 150, borderStyle: "solid", borderWidth: 1}}
          />
          <div style={{float: "left"}}>{lang.charImageFrom}</div>
          <RadioButtonGroup
            name="playerImageSource"
            defaultSelected={this.props.playerImageSource}
            onChange={this.props.handleImageSourceChange}
            style={{float: "left", marginLeft: "20"}}>
            <RadioButton
              value="options"
              label={lang.options}
            />
            <RadioButton
              value="url"
              label={lang.url}
            />
          </RadioButtonGroup>
          <br /><br /><br /><br />
          {
            this.props.playerImageSource === "options" ?
              <DropDownMenu
                value={this.props.playerImageOption}
                onChange={this.props.handlePlayerImageOptionChange}
                style={{borderStyle: "solid", borderWidth: 1}}
              >
                <MenuItem value={1} primaryText={lang.imageOne} />
                <MenuItem value={2} primaryText={lang.imageTwo} />
                <MenuItem value={3} primaryText={lang.imageThree} />
              </DropDownMenu>
              :
              <div>{lang.url}:
                <TextField value={this.props.playerImageUrl} onChange={this.props.handlePlayerImageUrlChange} style={{marginLeft: "20"}}/>
              </div>
          }
        </div>;
        break;
      case 2:
        stepContent = <div>
          <div style={{float: "left", marginTop: 20, marginRight: 20}}>{lang.gameDiffLevel}:</div>
          <Slider
            min={1}
            max={5}
            step={1}
            value={this.props.difficultyLevel}
            onChange={this.props.handleDifficultyLevelChange}
            style={{float: "left", width: 300}}
          />
          <span style={{float: "left", marginTop: 20, marginLeft: 20}}>
            {
              this.props.difficultyLevel === 1 ? lang.veryEasy :
                this.props.difficultyLevel === 2 ? lang.easy :
                  this.props.difficultyLevel === 3 ? lang.normal :
                    this.props.difficultyLevel === 4 ? lang.hard :
                      lang.veryHard
            }
          </span>
        </div>;
    }

    return(
      <Dialog
        title={this.props.startingDialogOpenedMidGame == true ? stepIndex === 0 ? lang.charName : lang.charImage
          : lang.startingGame}
        actions={
          this.props.startingDialogOpenedMidGame == true ?
            <FlatButton
              label={lang.backToGame}
              primary={true}
              disabled={stepIndex === 0 && this.props.player.name.length === 0}
              onClick={this.props.closeMidGameOpenedStartingDialog}
              hoverColor={theme.darkTwo}
            />
            :
            [<FlatButton
              label={lang.prev}
              secondary={true}
              disabled={stepIndex === 0}
              onClick={this.props.handlePrevStep}
              hoverColor={theme.darkTwo}
            />,
            <FlatButton
              label={stepIndex === 2 ? lang.startGame : lang.next}
              primary={true}
              disabled={stepIndex === 0 && this.props.player.name.length === 0}
              onClick={stepIndex === 2 ? this.props.startGame : this.props.handleNextStep}
              hoverColor={theme.darkTwo}
            />]
        }
        modal={true}
        open={stepIndex < 3}
        bodyStyle={{backgroundColor: theme.lightOne}}
        titleStyle={{backgroundColor: theme.lightOne}}
        actionsContainerStyle={{backgroundColor: theme.lightOne}}
      >
        {
          this.props.startingDialogOpenedMidGame == false &&
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>{lang.charName}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{lang.charImage}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{lang.gameDiff}</StepLabel>
            </Step>
          </Stepper>
        }
        {stepContent}
      </Dialog>
    );
  }
}

export default StartingDialog;