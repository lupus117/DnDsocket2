// client.js
 
const WebSocket = require('ws');
//const url = 'ws://ec2-54-197-7-155.compute-1.amazonaws.com:8080';
const url = 'ws://localhost:8080'
const connection = new WebSocket(url);
var stdin = process.openStdin();


connection.onopen = () => {
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}
 
connection.onmessage = (e) => {
  console.log(e.data);
}

connection.onclose = function(event) {
  console.log('connection closed');
};
//reads console
stdin.addListener("data", function(d) { 
      if(connection.OPEN){
        connection.send(d.toString().trim());
      }
  });
