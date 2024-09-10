import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check




// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

const saved : Map<string, unknown> = new Map();

/**
 * Saves a file to the server
 * User must give a name for the file that
 * is saved
 * @param req the request 
 * @param res the response
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if(typeof name !== 'string' || typeof name === "undefined") {
    res.status(400).send('invalid name');
    return;
  }

  const file = req.body.file;
  saved.set(name, file);
  res.send({name, saved: true});
}

/**
 * Loads a file that was saved on the server
 * @param req the request
 * @param res the response
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if(typeof name !== 'string' || typeof name === "undefined") {
    res.status(400).send('invalid name');
    return;
  }
  
  const file = saved.get(name);
  if(file === undefined) {
    res.status(400).send(`no item called "${req.query.name}"`);
    return;
  }

  res.send({file});
}

/**
 * Gives a list of files saved on the server
 * @param req the request
 * @param res the response
 */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  const keys : Array<string> = Array.from(saved.keys());
  res.send({names: keys});
}

/**
 * Helper function to clear the map for testing
 */
export const clear = (): void => {
  saved.clear();
}

//record holds the past compeltionts for decks
const record : string[] = [];

/**
 * Saves a file to the server
 * User must give a name for the file that
 * is saved
 * @param req the request 
 * @param res the response
 */
export const saveRecord = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if(typeof name !== 'string' || typeof name === "undefined") {
    res.status(400).send('invalid record');
    return;
  }

  record.push(name);
  res.send({name, saved: true});
}

/**
 * Loads a file that was saved on the server
 * @param req the request
 * @param res the response
 */
export const loadRecord = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({record});
}

/**
 * Helper function to clear the map for testing
 * @modifies top level record to be empty
 */
export const clearRecord = (): void => {
  record.splice(0, record.length);
}
