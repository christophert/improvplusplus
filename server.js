var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");

var Firebase = require("firebase")

my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathme;
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
})

my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathname;
}).listen(3000,'0.0.0.0');