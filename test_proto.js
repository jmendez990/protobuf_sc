'use strict'
const r = require('rethinkdb')
var protobuf = require('protobufjs')
//Variable created to hold the exports from the protobuf_functions
const protobufj = require('./function_js/protobuf_funtions')

protobuf.load("payload.proto", function(err, root) {
    if (err)
        throw err;


    // Obtain a message type
    var PayloadMessage = root.lookupType("payloadpackage.MaterialMessage");

    // Exemplary payload
    var payload = {
        materialId : "001",
        materialName : "Pizza",
        materialGroup : "Food",
        materialType : "Frozen Food",
        materialPrice : 10,
        materialCost : 5,
        materialAmount : 50
                    };
    console.log(payload)


    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = PayloadMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);

    // Create a new message
    var message = PayloadMessage.create(payload); // or use .fromObject if conversion is necessary

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = PayloadMessage.encode(message).finish();
    // ... do something with buffer


    protobufj.decodePayload(buffer)


 /*This code snippet is what's inside the decodePayload function
    // Decode an Uint8Array (browser) or Buffer (node) to a message
    // var message = PayloadMessage.decode(buffer);
    // // ... do something with message

    // // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

    // // Maybe convert the message back to a plain object
    // var object = PayloadMessage.toObject(message, {
    //     longs: String,
    //     enums: String,
    //     bytes: String,
    //     // see ConversionOptions
    // });

    // //Testing to write to rethinkdb the decoded payload
    // var connection = null
    // r.connect({host: 'localhost', port : 28015}, function(err, conn) {
    //     if (err) throw err;
    //     connection = conn;
    // }).then(() => {
    //     r.db('supplychain').table('Material').insert([{
    //         ID : object.materialId,
    //         NAME : object.materialName,
    //         GROUP : object.materialGroup,
    //         TYPE : object.materialType,
    //         PRICE : object.materialPrice,
    //         COST : object.materialCost,
    //         AMOUNT : object.materialAmount
    //     }]).run(connection, function(err, result){
    //         if(err)
    //         throw err;
    //         console.log(JSON.stringify(result,null,2))
    //     })
    // })
    */
  
});