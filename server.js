var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");

var Firebase = require("firebase")
var WebSocketServer = require('websocket').server;
var reqobj = require("request")

var fb = new Firebase("radiant-torch-7198.firebaseIO.com");

var server = my_http.createServer(function(request,response){

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
            username = json_msg.username;
            console.log(json_msg);
	    
	    
	    var num_msgs = 0;
	
	    //get number of messages
	    fb.on("num_msgs", function(snapshot) {
		num_msgs = snapshot.val());
	    }, 
	    function (errorObject) {
		fb.child("num_msgs").set(1);
		num_msgs++;
	    }		

	    var fb_messages = fb.child("messages");
	    fb_messages.child(0).set({
		message
	    });

            for(var i = 0; i < clients.length; i++) {
                clients[i].sendUTF(obj);
            }
        }
    });

    connection.on('close', function(reasonCode, description) {
        for(var i = 0; i < clients.length; i++) {
            clients[i].sendUTF(JSON.stringify({username: username, message: 'User disconnected.'}));
        }
    });
});
