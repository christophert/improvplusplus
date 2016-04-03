var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var Firebase = require("firebase")
var WebSocketServer = require('websocket').server;
var reqobj = require("request")

var fb = new Firebase("improvplusplus.firebaseIO.com");

var server = my_http.createServer(app).listen(3000,'0.0.0.0');

wsServer = new WebSocketServer({
    httpServer: server
});

var history = [];
var clients = [];
var num_msgs = 0;

app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat'
}));


app.post('/login', function(req, res) {
    if(req.body.username !== ""  && req.body.password !== "") {
        var info = {};
        info['username'] = req.body.username;
        info['password'] = req.body.password;
        info['loginStatus'] = 'OK';
        req.session.user_id = req.body.username;
        res.redirect('/');
    } else {
        var info = {};
        info['loginStatus'] = 'notFound';
        res.send(JSON.stringify(info));
    }
});

app.use('/', express.static('public'));

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
	
	    //get number of messages
	    fb.child("num_msgs").on("value", function(snapshot) {
		num_msgs = snapshot.val();
	    }, 
	    function (errorObject) {
		fb.child("num_msgs").set(0);
	    });		

	    var fb_messages = fb.child("messages");
	    fb_messages.child(num_msgs).set({
		obj
	    });

	    //log console because my dumbass computer doesn't do CSS
	    console.log(json_msg);

	    //record number of messages locally and on database
	    num_msgs++;
	    fb.child("num_msgs").set(num_msgs);
	    console.log(num_msgs);

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
