const ws = require('ws')
const rolls = require('./rolls')
const wss = new ws.Server({ port: 8080 })
//create connection array
Connections = [];
var ConnectionNames = []
var stdin = process.openStdin();

console.log('server initiated')
wss.on('connection', Server => {
 
 //Add the made collection to the array
  Connections.push(Server);
  //add event for recieving messages
  let n = Connections.length-1;
  ConnectionNames.push(n);
  Connections[Connections.length-1].addEventListener('message', function(event){
    console.log(`>[${n}]${ConnectionNames[n]}:${event.data}`)
    //add nickname option
    let nameChangevar = "-name:";
    if(event.data.substring(0,nameChangevar.length) == nameChangevar){
      ConnectionNames[n] = event.data.substring(nameChangevar.length).trim();
      console.log(`player ${n} is now  ${ConnectionNames[n]}`)
    }
    //send each connection the message
    sendToAll(`player ${ConnectionNames[n]}:  ${rolls.searchAndRollDice(event.data)}`);
    
  });
  Connections[Connections.length-1].on('close', event => {
    console.log(`Connection closed by [${n}]${ConnectionNames[n]}`)

    sendToAll(`> ${ConnectionNames[n]} left the server`);
  //  Connections.remove(n);
  //  ConnectionNames.remove(n);

    
  });
  
 
  Server.send('You are now connected to the server\nuse "-name: " to change name')

  console.log(`Number of users: ${Connections.length}`)

});

//reads terminal input
stdin.addListener("data", function(d) {
  str =rolls.searchAndRollDice("dm: "+d.toString().trim())
    sendToAll(str);
    console.log(str);
    
});

function sendToAll(string){
  Connections.forEach(connection => {
    if(connection.OPEN){
      connection.send(string)
    }
  });
}