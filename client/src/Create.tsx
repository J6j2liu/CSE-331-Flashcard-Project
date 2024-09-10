import React, { Component, ChangeEvent, MouseEvent} from "react";
import { Card } from "./FlashcardApp";
import "./style.css"

type CreateProps = {
    /** Initial state of the file. */
    onSaveClick: (name :string, data : Card[]) => void,
    onMenuClick: () => void,
    checkContains: (name :string) => boolean
};

type CreateState = {
    /** Text inseted into the box to be  */
    text?: string,
    name?: string,
    error?: string,
};

export class Create extends Component<CreateProps, CreateState> {

    constructor(props: CreateProps) {
      super(props);
  
      this.state = {};
    }
  
    render = (): JSX.Element => {
        return (<div>
            Create
            <br/>
            <br/>
            Name: <input onChange={this.doNameChange}></input>
            <br/>
            Options (one per line formmated as front|back)
            <label htmlFor="textbox"></label>
            <br/>
            <textarea id="textbox" rows={3} cols={40}
            onChange={this.doTextChange}></textarea>
            <br/>
            <button onClick={this.props.onMenuClick}>Back</button>
            <button onClick={this.doAddClick}>Add</button>
            {this.renderError()}
        </div>)
    };

    doTextChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({text: evt.target.value});
    };
    
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value});
    };

    //Checks if the current name and text is valid
    //throws errors is any part is invalid
    //Formats the text then sends it to the server
    // to be saved
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        const cards = this.state.text;
        if (cards === undefined || cards === "") {
            this.doError("Text input is empty");
            return;
        }

        const name = this.state.name
        if (name === undefined
            || this.state.name === "") {
            this.doError('Name is empty');
            return;
        }

        if(this.props.checkContains(name)) {
            console.log(name);
            this.doError('Name is already in the deck');
            return;
        }

        const toSave : Card[] = [];

        for (const card of cards.split('\n')) {
            const split = card.split('|');
            if (split.length === 2) {
                toSave.push({front : split[0], back : split[1]});
            } else {
                this.doError('Invalid text entry, not formatted correctly');
                return;
            }
        }

        this.props.onSaveClick(name, toSave);
    };


    doError = (name : string) : void => {
        this.setState({error : name});
    }

    //for displaying errors
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