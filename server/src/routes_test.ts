import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { clear, clearRecord, list, load, loadRecord, save, saveRecord } from './routes';


describe('routes', function() {


  it('save', function() {
    //test working branch 2 tests
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'save', file : "im not sur ehwat to put here"}}); 
    const res = httpMocks.createResponse();

    save(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(), {name: 'save', saved: true});

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'dafsadcsdfxc', file : 213453635643253654}}); 
    const res1 = httpMocks.createResponse();

    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getData(), {name: 'dafsadcsdfxc', saved: true});

    //test error branch 2 tests

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 12, file : "im not sur ehwat to put here"}}); 
    const res2 = httpMocks.createResponse();

    save(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepEqual(res2._getData(), 'invalid name');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: undefined, file : "im not sur ehwat to put here"}}); 
    const res3 = httpMocks.createResponse();

    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepEqual(res3._getData(), 'invalid name');

  });

  it('load', function() {
    //call to clear helper function to clean up saved maps for testing
    clear();

    //saving files to be used in load testing
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'save', file : "im not sur ehwat to put here"}}); 
    const res = httpMocks.createResponse();

    save(req, res);

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'dafsadcsdfxc', file : 213453635643253654}}); 
    const res1 = httpMocks.createResponse();

    save(req1, res1);

    //test error branch 1 2 tests (invalid input)
    const load_req = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: undefined}}); 
    const load_res = httpMocks.createResponse();

    load(load_req, load_res);
    assert.strictEqual(load_res._getStatusCode(), 400);
    assert.deepEqual(load_res._getData(), 'invalid name');

    const load_req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 224124123314}}); 
    const load_res1 = httpMocks.createResponse();

    load(load_req1, load_res1);
    assert.strictEqual(load_res1._getStatusCode(), 400);
    assert.deepEqual(load_res1._getData(), 'invalid name');

    //test error branch 2 2 tests (name isnt in map)
    const load_req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'pablo'}}); 
    const load_res2 = httpMocks.createResponse();

    load(load_req2, load_res2);
    assert.strictEqual(load_res2._getStatusCode(), 400);
    assert.deepEqual(load_res2._getData(), 'no item called "pablo"');

    const load_req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'amogus'}}); 
    const load_res3 = httpMocks.createResponse();

    load(load_req3, load_res3);
    assert.strictEqual(load_res3._getStatusCode(), 400);
    assert.deepEqual(load_res3._getData(), 'no item called "amogus"');

    //test error branch 3 working
    const load_req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'save'}}); 
    const load_res4 = httpMocks.createResponse();

    load(load_req4, load_res4);
    assert.strictEqual(load_res4._getStatusCode(), 200);
    assert.deepEqual(load_res4._getData(), {file: "im not sur ehwat to put here"});

    const load_req5= httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'dafsadcsdfxc'}}); 
    const load_res5 = httpMocks.createResponse();

    load(load_req5, load_res5);
    assert.strictEqual(load_res5._getStatusCode(), 200);
    assert.deepEqual(load_res5._getData(), {file: 213453635643253654});
  });

  it('list', function() {
    //call to clear helper function to clean up saved maps for testing
    clear();
    
    //test list no names saved
    const list_req = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'}); 
    const list_res = httpMocks.createResponse();

    list(list_req, list_res);
    assert.strictEqual(list_res._getStatusCode(), 200);
    assert.deepEqual(list_res._getData(), {names: []});

    //saving file to be used in list testing
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'save', file : "im not sur ehwat to put here"}}); 
    const res = httpMocks.createResponse();

    save(req, res);

    //test list 1 name saved
    const list_req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'}); 
    const list_res1 = httpMocks.createResponse();

    list(list_req1, list_res1);
    assert.strictEqual(list_res1._getStatusCode(), 200);
    assert.deepEqual(list_res1._getData(), {names: ['save']});
    

    //saving files to be used in list testing
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 'dafsadcsdfxc', file : 213453635643253654}}); 
    const res1 = httpMocks.createResponse();

    save(req1, res1);

    //test list 2 names saved
    const list_req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'}); 
    const list_res2 = httpMocks.createResponse();

    list(list_req2, list_res2);
    assert.strictEqual(list_res2._getStatusCode(), 200);
    assert.deepEqual(list_res2._getData(), {names: ['save', 'dafsadcsdfxc']});
    
  });


  it('saveRecord', function() {
    //test working branch 2 tests
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: 'saveRecord', file : "im not sur ehwat to put here"}}); 
    const res = httpMocks.createResponse();

    saveRecord(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepEqual(res._getData(), {name: 'saveRecord', saved: true});

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: 'dafsadcsdfxc', file : 213453635643253654}}); 
    const res1 = httpMocks.createResponse();

    saveRecord(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getData(), {name: 'dafsadcsdfxc', saved: true});

    //test error branch 2 tests

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: 12, file : "im not sur ehwat to put here"}}); 
    const res2 = httpMocks.createResponse();

    saveRecord(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepEqual(res2._getData(), 'invalid record');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: undefined, file : "im not sur ehwat to put here"}}); 
    const res3 = httpMocks.createResponse();

    saveRecord(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepEqual(res3._getData(), 'invalid record');

  });

  it('loadRecord', function() {
    //call to clear helper function to clean up saved maps for testing
    clearRecord();
    
    //test loadRecord no names saved
    const loadRecord_req = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadRecord'}); 
    const loadRecord_res = httpMocks.createResponse();

    loadRecord(loadRecord_req, loadRecord_res);
    assert.strictEqual(loadRecord_res._getStatusCode(), 200);
    assert.deepEqual(loadRecord_res._getData(), {record: []});

    //saving file to be used in loadRecord testing
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: 'save', file : "im not sur ehwat to put here"}}); 
    const res = httpMocks.createResponse();

    saveRecord(req, res);

    //test loadRecord 1 name saved
    const loadRecord_req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadRecord'}); 
    const loadRecord_res1 = httpMocks.createResponse();

    loadRecord(loadRecord_req1, loadRecord_res1);
    assert.strictEqual(loadRecord_res1._getStatusCode(), 200);
    assert.deepEqual(loadRecord_res1._getData(), {record: ['save']});
    

    //saving files to be used in loadRecord testing
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveRecord', body: {name: 'dafsadcsdfxc', file : 213453635643253654}}); 
    const res1 = httpMocks.createResponse();

    saveRecord(req1, res1);

    //test loadRecord 2 names saved
    const loadRecord_req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadRecord'}); 
    const loadRecord_res2 = httpMocks.createResponse();

    loadRecord(loadRecord_req2, loadRecord_res2);
    assert.strictEqual(loadRecord_res2._getStatusCode(), 200);
    assert.deepEqual(loadRecord_res2._getData(), {record: ['save', 'dafsadcsdfxc']});
    
  });
});
