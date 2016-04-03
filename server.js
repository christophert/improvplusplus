
var my_http = require("http");
var url = require("url");

var Firebase = require("firebase")
var WebSocketServer = require('websocket').server;
var reqobj = require("request")

var server = my_http.createServer(function(request,response){
    var fb = new Firebase("https://improvplusplus.firebaseio.com");
    //TODO serve front-end objects
}).listen(3000,'0.0.0.0');

wsServer = new WebSocketServer({
    httpServer: server
});

var history = [];
var clients = [];

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var username = false;
    var result = false;

    connection.on('message', function(message) {
        if(message.type === 'utf8') {
            var obj = message.utf8Data;
            var json_msg = JSON.parse(obj);
            console.log(json_msg);

	    //TODO put message into firebase, see if message parts need to be picked out piece by piece`    

            for(var i = 0; i < clients.length; i++) {
                clients[i].sendUTF(obj);
            }
        }
    });

    connection.on('close', function(reasonCode, description) {
        for(var i = 0; i < clients.length; i++) {
            clients[i].sendUTF(JSON.stringify({message: 'User disconnected.'}));
        }
    });
});
