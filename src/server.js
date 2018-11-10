const app = require( "./app.js" );
const http = require( "http" );
const server = http.createServer( app );
const port = 3000;
const base = `http://localhost:${ port }/`;

server.listen( port );

server.on( "listening", () => {
  console.log( `Server is listening for requests on port ${ port }.` );
} );

module.exports = { base };
