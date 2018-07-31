'use strict'
const r = require('rethinkdb')
//var protobuf = require('protobufjs')
const protobuf = require('./function_js/protobuf_funtions')
const dbfunc = require('./function_js/db_functions')


dbfunc.rethinkConnect();
console.log('After the rethinkDB');
var bufferReturned = protobuf.encodePayload();
console.log(bufferReturned)
//protobuf.decodePayload(bufferReturned);
