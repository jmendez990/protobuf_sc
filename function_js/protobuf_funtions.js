var protobuf = require('protobufjs')
var dbfunc = require('./db_functions')
var r = require('rethinkdb')

 function encodePayload(){
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
        
        // //Creating connection with the rethinkDB to send the Exemplary payload
        // var connection = null
        // r.connect({host: 'localhost', port : 28015}, function(err, conn) {
        //     if (err) throw err;
        //     connection = conn;
        // }).then(() => {
        //     r.db('supplychain').table('Material').insert([{
        //         ID : payload.materialId,
        //         NAME : payload.materialName,
        //         GROUP : payload.materialGroup,
        //         TYPE : payload.materialType,
        //         PRICE : payload.materialPrice,
        //         COST : payload.materialCost,
        //         AMOUNT : payload.materialAmount
        //     }]).run(connection)
        // })
    
        // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
        var errMsg = PayloadMessage.verify(payload);
        if (errMsg)
            throw Error(errMsg);
    
        // Create a new message
        var message = PayloadMessage.create(payload); // or use .fromObject if conversion is necessary
        console.log(payload)
        // Encode a message to an Uint8Array (browser) or Buffer (node)
        var buffer = PayloadMessage.encode(message).finish();
        // ... do something with buffer
        return buffer;

    })
}


    function decodePayload(bufferReturned){
    
    protobuf.load("payload.proto", function(err, root) {
        if (err)
            throw err;

    // Obtain a message type
    var PayloadMessage = root.lookupType("payloadpackage.MaterialMessage");

    // Decode an Uint8Array (browser) or Buffer (node) to a message
    var message = PayloadMessage.decode(bufferReturned);
    // ... do something with message

    // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

    // Maybe convert the message back to a plain object
    var object = PayloadMessage.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        // see ConversionOptions
    });

    //Testing to write to rethinkdb the decoded payload
    var connection = null
    r.connect({host: 'localhost', port : 28015}, function(err, conn) {
        if (err) throw err;
        connection = conn;
    }).then(() => {
        r.db('supplychain').table('Material').insert([{
            ID : object.materialId,
            NAME : object.materialName,
            GROUP : object.materialGroup,
            TYPE : object.materialType,
            PRICE : object.materialPrice,
            COST : object.materialCost,
            AMOUNT : object.materialAmount
        }]).run(connection, function(err, result){
            if(err)
            throw err;
            console.log(JSON.stringify(result,null,2))
        })
     })
    })
}
    
module.exports = {
    encodePayload,
    decodePayload,
}