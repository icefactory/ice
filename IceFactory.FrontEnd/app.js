'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server({
    host: 'localhost',
    port: '3000',
    routes: {cors: true}
});

const init = async () => {
    await server.register(require('inert'));

    server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "public",
                listing: false,
                index: true
            }
        }
    });

    await server.start();
    console.log('Server running at: ${server.info.uri}');
};

process.on('unhandledRejection', (err) => {

    console.log(err);
process.exit(1);
});

init();

