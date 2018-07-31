'use strict'

const r = require('rethinkdb')
const HOST = 'localhost'
const PORT = 28015
const NAME = 'supplychain'

module.exports ={
    HOST,
    PORT,
    NAME
}

r.connect({host: HOST, port: PORT})
.then(conn =>{
    console.log(`Creating ${NAME} database...`)
    r.dbList().contains(NAME).run(conn)
    .then(dbExists => {
        if(dbExists)
        throw new Error(`${NAME} already exists`)
        return r.dbCreate(NAME).run(conn)
    })
    .then(() => {
        console.log('Creating Material Table...')
        return r.db(NAME).tableCreate('Material').run(conn)
        .then(() => {
            return r.db(NAME).table('Material').indexCreate('attributes', [
                r.row('ID'),
                r.row('NAME'),
                r.row('GROUP'),
                r.row('TYPE'),
                r.row('PRICE'),
                r.row('COST'),
                r.row('Amount')
            ]).run(conn)
        })
    })
})
