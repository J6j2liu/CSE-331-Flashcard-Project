import React, { Component, MouseEvent} from "react";
import { Create } from "./Create";
import { isRecord } from "./record";
import { Practice } from "./Practice";

// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type FlashcardAppState = {
  screen : 'menu' | 'practice' | 'create',
  fileList? : string[],
  currCards : Card[],
  currRecord : string[],
  currDeck? : string
}

export type Card = {front: string, back : string};

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = 
        {screen : 'menu',
        currCards : [],
        currRecord : []
        };
  }

  componentDidMount = () : void => {
    this.doListClick();
  };
  
  render = (): JSX.Element => {
    if(this.state.screen === 'menu') {
      return this.renderMenu();
    } else if(this.state.screen === 'create') {
      return this.renderCreate();
    } else if(this.state.screen === 'practice') {
      return this.renderPractice();
    } else {
      throw new Error('invalid screen state');
    }
  };

  //Render methods that handle the assembly of the 
  //jsx elements

  //displays the menu wiht the list of saved flashcard sets
  //as well as the recorded scores if there are any
  renderMenu = () : JSX.Element => {
    return <div>
      <div className="bold">List</div>
      <br/>
      {this.renderList()}
      <br/>
      <button onClick={this.doCreateClick}>New</button>
      <br/>
      <br/>
      {this.renderScores()}
    </div>
  };

  //displays the flashcard creation menu
  renderCreate = () : JSX.Element => {
    return <Create   onSaveClick={this.doSaveClick} 
                     onMenuClick={this.doMenuClick}
                     checkContains={this.doContainsClick}/>
  };

  //displays the flashcard practice menu
  renderPractice = () : JSX.Element => {
    const set = this.state.currCards
      return <Practice cardSet={set}
                       deckName={this.state.currDeck}
                       onMenuClick={this.doMenuClick}
                       saveRecord={this.doSaveRecordClick}/>
  };

  //renders the list of saved files
  //clicking a file loads the practice for that set
  renderList = () : JSX.Element => {
    //updates the list before rendering it
    this.doListClick();
    
    if (this.state.fileList === undefined) {
      return <div></div>
    } else {
      const saved : JSX.Element[] = [];
      for(const name of this.state.fileList) {
        saved.push(
          <li key={name} >
            <a href="#" onClick={(evt) => this.doPracticeClick(evt, name)}>{name}</a>
          </li>);
      }
      return <ul>{saved}</ul>;
    }
  }

  //displays the scores that are savedon the server
  renderScores = () : JSX.Element => {
    this.doLoadRecordClick();

    if (this.state.currRecord.length === 0) {
      return <div></div>
    } else {
      const saved : JSX.Element[] = [];
      for(const rec of this.state.currRecord) {
        saved.push(<li key={rec} >
          <a>{rec}</a>
        </li>)
      }
      return (<div>
              <div className="bold">Scores:</div>
              <br/>
              <ul>{saved}</ul>
              </div>);
    }
  }

  //Click and change handlers for actions initially

  //sets the screen to the practice
  //also loads a flashcard set from the server
  //depending on the name selected
  doPracticeClick = (_evt: MouseEvent<HTMLAnchorElement>, name :string) : void => {
    this.setState({screen : 'practice', currDeck : name});

    const url = "/api/load" +
        "?name=" + encodeURIComponent(name);
    fetch(url).then(this.doLoadResp)
              .catch(() => this.doLoadError("failed to connect to server"));
  }

  //ensures that the status code of the load
  //request was valid
  doLoadResp = (res : Response) : void => {
    if(res.status === 200) {
      res.json().then(this.doLoadJson);
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
          .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code from /api/list: ${res.status}`);
    }
  }

  //ensures that the flashcard set
  //loaded form the server is a valid format
  doLoadJson = (val: unknown): void => {
    
    if (!isRecord(val)) {
      console.error("bad data from /list: not a record", val)
      return;
    }
    
    const cards = val.file;

    if(Array.isArray(cards)) {
      this.setState({currCards : cards, screen : 'practice'});
    } else {
      console.error("bad data from /list: not an array", val)
      return;
    }
  }

  //fetches the lsit of saved file names 
  //fromthe server
  doListClick = () : void => {
    fetch("/api/list").then(this.doListResp)
          .catch(() => this.doListError("failed to connect to server"));
  }

  //ensrues that the status code of the response is valid
  doListResp = (res :Response) : void => {
    if(res.status === 200) {
      res.json().then(this.doListJson);
    } else if (res.status === 400) {
      res.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${res.status}`);
    }
  }
  
  //ensures that the list of saved decks is
  //in a valid format
  doListJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.error("bad data from /list: not a record", val)
      return;
    }
    
    const names = val.names;
    if(Array.isArray(names)) {
      this.setState({fileList : names});
    }
  }
  
  //saves a passed in name and flashcard set to 
  //the server
  doSaveClick = (name : string, data : Card[]): void => {
    fetch("/api/save", { method : "POST",
      body : JSON.stringify({name : name, file : data}),
      headers : {"Content-Type" : "application/json"} })
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));

    this.doMenuClick();
  }

  //checsk the save status code is valid
  doSaveResp = (res :Response) : void => {
    if(res.status === 200) {
      //:D
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/save: ${res.status}`);
    }
  }

  //checks if a file name is in the list of save files
  doContainsClick = (name : string) : boolean => {
    //update the list with the server
    //before checking if it contains name
    this.doListClick();

    const names = this.state.fileList;
    if (names === undefined) {
      return false;
    } else {
      return names.includes(name);
    }
  }

  //set the screen to the inital menu
  doMenuClick = ():void => {
    this.setState({screen : 'menu'});
    this.doListClick();
  }

  //set the screen to the flashcard creation
  doCreateClick = ():void => {
    this.setState({screen : 'create'});
  }

  //saves a record to the server
  doSaveRecordClick = (name : string): void => {
    fetch("/api/saveRecord", { method : "POST",
      body : JSON.stringify({name : name}),
      headers : {"Content-Type" : "application/json"} })
      .then(this.doSaveRecordResp)
      .catch(() => this.doSaveRecordError("failed to connect to server"));

    this.doMenuClick();
  }

  //ensrues the status code of the save is valid
  doSaveRecordResp = (res :Response) : void => {
    if(res.status === 200) {
      //:D
    } else if (res.status === 400) {
      res.text().then(this.doSaveRecordError)
          .catch(() => this.doSaveRecordError("400 response is not text"));
    } else {
      this.doSaveRecordError(`bad status code from /api/saveRecord: ${res.status}`);
    }
  }

  //loadRecord requests the deck records stored in the server
  doLoadRecordClick = () : void => {
    fetch("/api/loadRecord").then(this.doLoadRecordResp)
          .catch(() => this.doLoadRecordError("failed to connect to server"));
  }

  //ensures the status code from the server is valid
  doLoadRecordResp = (res :Response) : void => {
    if(res.status === 200) {
      res.json().then(this.doLoadRecordJson);
    } else if (res.status === 400) {
      res.text().then(this.doLoadRecordError)
          .catch(() => this.doLoadRecordError("400 response is not text"));
    } else {
      this.doLoadRecordError(`bad status code from /api/loadRecord: ${res.status}`);
    }
  }
  
  //ensures the requested record is a valid format
  doLoadRecordJson = (val: unknown): void => {
    if (!isRecord(val)) {
      console.error("bad data from /loadRecord: not a record", val)
      return;
    }
    
    const names = val.record;
    if(Array.isArray(names)) {
      this.setState({currRecord : names});
    }
  }

  //returns either an empty list or 
  //the current records stored in state
  getRecord = (): string[] => {
    //updates records stored
    this.doLoadRecordClick();

    const record = this.state.currRecord;
    if (record === undefined) {
      return [];
    } else {
      return record;
    }
    
  }

  //error handlers
  doSaveRecordError = (msg: string): void => {
    console.error(`Error fetching /api/saveRecord: ${msg}`);
  };

  doLoadRecordError = (msg: string): void => {
    console.error(`Error fetching /api/:loadRecord: ${msg}`);
  };

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /api/load: ${msg}`);
  };
}
