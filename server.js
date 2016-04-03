var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var stormpath = require('express-stormpath');

var Firebase = require("firebase")
var WebSocketServer = require('websocket').server;
var reqobj = require("request")

var fb = new Firebase("improvplusplus.firebaseIO.com");


var users = fb.child("users");
users.set({
    PatrickPistor:{
        Password: "password"
    },
    ChrisTran:{
        Password: "password"
    },
    KevinKong:{
        Password: "password"
    }
});

var server = my_http.createServer(app).listen(3000,'0.0.0.0');

wsServer = new WebSocketServer({
    httpServer: server
});

var history = [];
var clients = [];
var usernames = [];
var num_msgs = 0;

app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(stormpath.init(app, {
    client: {
        apiKey: {
            id: '3QI3SYEB0OGRP00C2TUDJCUGX',
            secret: 'WwZ2iU9x4HkXwcGSFjEnL5hy5KcLc31rOFLOV/dmwWc'
        }
    },
    application: {
        href: 'https://api.stormpath.com/v1/applications/1ZaIXY48DTOswO9TRiafxW'
    },
    web: {
        register: {
            form: {
                fields: {
                    givenName: {
                        required: false
                    },
                    surname: {
                        required: false
                    }
                }
            }
        }
    }
}));



app.on('stormpath.ready', function() {
    console.log('stormpath ready');
});

var sess;

app.get('/get/username', stormpath.getUser, function(req, res) {
    res.send(JSON.stringify({"username": req.user.email}));
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
            if(json_msg.type==="register") {
                usernames.push(username);
            } 
            else if (json_msg.type==="online") {
                var info = {"message": usernames, "username": "system"};
                connection.sendUTF(JSON.stringify(info));
            }
            else {
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
        }
    });

    connection.on('close', function(reasonCode, description) {
        for(var i = 0; i < clients.length; i++) {
            clients[i].sendUTF(JSON.stringify({username: username, message: 'User disconnected.', date: (new Date()).getTime()}));
        }
    });
});
