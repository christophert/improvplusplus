var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url");

var Firebase = require("Firebase")

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
	          //opens firebase connection (not sure if we need it right here,
	          //just for reference's sake)
	          var fb = new Firebase("https://improvplusplus.firebaseio.com")
	          
	      }
    });
})

my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathname;
    load_file(my_path,response);
}).listen(8080);
