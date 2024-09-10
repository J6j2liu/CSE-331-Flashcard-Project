import React, { ChangeEvent, Component } from "react";
import { Card } from "./FlashcardApp";
import "./style.css"

type PracticeProps = {
    /** Initial state of the file. */
    cardSet : Card[],
    deckName : string | undefined
    saveRecord: (name :string) => void,
    onMenuClick: () => void,
};

type PracticeState = {
    numCorrect : number,
    numIncorrect : number,
    currCard : number,
    name? : string,
    front : boolean
    error? : string
};

export class Practice extends Component<PracticeProps, PracticeState> {

    constructor(props: PracticeProps) {
      super(props);
  
      this.state = {
        numCorrect : 0,
        numIncorrect : 0,
        currCard : 0,
        front : true
      };
    }

    render = () : JSX.Element => {
        if(this.state.numCorrect + this.state.numIncorrect !== this.props.cardSet.length) {
            //practicing state
            return (
                <div>
                <div className="bold">Practicing: {this.props.deckName}</div>
                <br/>
                <div className="bold">Correct: {this.state.numCorrect}</div>
                <div className="bold">Incorrect: {this.state.numIncorrect}</div>
                <div className={'card'}>
                    {this.renderCard()}
                </div>
                <button onClick={this.doFlipClick}>Flip</button>
                <button onClick={this.doCorrectClick}>Correct</button>
                <button onClick={this.doIncorrectClick}>Inorrect</button>
                </div>
            )
        } else {
            //finished state, asks to enter name to be stored
            return (
                <div>
                    <div className="bold">Nice job studying: {this.props.deckName}</div>
                    <br/>
                    <div className="bold">Correct: {this.state.numCorrect}</div>
                    <div className="bold">Incorrect: {this.state.numIncorrect}</div>
                    End of Quiz:
                    <br/>
                    Name:
                    <input onChange={this.doNameChange}></input>
                    <button onClick={this.doFinishClick}>Finish</button>
                    {this.renderError()}
                </div>
            )
        }
    }
    
    //displays the front or back of the card
    //depending on the state
    renderCard = () : JSX.Element => {
        if (this.state.front) {
            return <div>
            {this.props.cardSet[this.state.currCard].front}
            </div>
        } else {
            return <div>
            {this.props.cardSet[this.state.currCard].back}
            </div>
        }
    };

    //flips the card
    doFlipClick = () :void => {
        this.setState({front : !this.state.front});
    };

    //increments the correct counter and moves to the next card
    doCorrectClick = () :void => {
        this.setState({numCorrect : this.state.numCorrect + 1,
                    currCard : this.state.currCard + 1,
                    front : true});
    };

    //increments the incorrect counter and moves to the next card
    doIncorrectClick = () :void => {
        this.setState({numIncorrect : this.state.numIncorrect + 1,
                   currCard : this.state.currCard + 1,
                   front : true});
    };


    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value});
    };

    //checks that a valid name is given
    //formats the record and sends it to the
    //server to be saved
    doFinishClick = () :void => {
        const name = this.state.name
        if (name === undefined
            || this.state.name === "") {
            this.doError('Name is empty');
            return;
        }

        const toSave = 
            name + ', ' + this.props.deckName +': ' 
            + Math.round((this.state.numCorrect / (this.props.cardSet.length)) * 100)

        this.props.saveRecord(toSave);
    };

    doError = (name : string) : void => {
        this.setState({error : name});
    }

    //displays errors
    renderError =() : JSX.Element => {
        const error = this.state.error;
        if (error === undefined) {
            return <div></div>
        } else {
            return <div className="error">
                Error : {error}
            </div>
        }
    }
    
}