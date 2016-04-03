window.onload = function() {

  // Get references to elements on the page.
  var form = document.getElementById('message-form');
  var messageField = document.getElementById('message');
  var messagesList = document.getElementById('messages');
  //var socketStatus = document.getElementById('status');


  // Create a new WebSocket.
  var socket = new WebSocket('ws://ipp.chtr.us');


  // // Handle any errors that occur.
  // socket.onerror = function(error) {
  //   console.log('WebSocket Error: ' + error);
  // };


  // // Show a connected message when the WebSocket is opened.
  // socket.onopen = function(event) {
  //   socketStatus.innerHTML = 'Connected to: ws://ipp.chtr.us';
  //   socketStatus.className = 'open';
  // };


  // Handle messages sent by the server.
  socket.onmessage = function(event) {
    var message = JSON.parse(event.data);
    messagesList.innerHTML += '<li class="media"><div class="media-body"><div class="media"><div class="media-body" >' +
                               message.message + '<br /><small class="text-muted">Alex Deo | 23rd June at 5:00pm</small><hr /></div></div></div></li>';
  };


  // // Show a disconnected message when the WebSocket is closed.
  // socket.onclose = function(event) {
  //   socketStatus.innerHTML = 'Disconnected from WebSocket.';
  //   socketStatus.className = 'closed';
  // };


  // Send a message when the form is submitted.
  form.onsubmit = function(e) {
    e.preventDefault();

    // Retrieve the message from the textarea.
    var json = {
        "message": messageField.value,
        "username": "yogert96"
    };
    var message = JSON.stringify(json);

    // Send the message through the WebSocket.
    socket.send(message);

    // Add the message to the messages list.
    //messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
                              //'</li>';

    // Clear out the message field.
    messageField.value = '';

    return false;
  };

};