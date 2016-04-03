var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");

var Firebase = require("firebase")
var WebSocketServer = require('websocket').server;
var reqobj = require("request")

var server = my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathname;
    var full_path = path.join(process.cwd(),my_path);
    path.exists(full_path, function(exists){
	      if(!exists){
	          response.writeHeader(404, {"Content-Type": "text/plain"});
	          response.write("404 Not Found\n");
	          response.end();
	      }
	      else{
	          // a reference here doesn't open a connection until r/w ops are invoked
	          var fb = new Firebase("https://improvplusplus.firebaseio.com")
	          
	      }
    });
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
