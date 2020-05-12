const ws = require('ws')
const rolls = require('./rolls')
const wss = new ws.Server({ port: 8080 })
//the var holding all the connections
Connections = [];
//the var holding the nicknames
var ConnectionNames = [];
var stdin = process.openStdin();
let nameChangeVar = "-name:";

//The conosle colours
RedColor='\033[0;31m'
GreenColor='\033[0;32m'
BrownColor='\033[0;33m'
BlueColor='\033[0;34m'
PurpleColor='\033[0;35m'
CyanColor='\033[0;36m'
GrayColor='\033[0;37m'
NoColor='\033[0m'
Underscore='\033[4m'



console.log("\033[31;1;4mServer initiated\033[0m")
wss.on('connection', Server => {
 
 //Add the made collection to the array
  Connections.push(Server);
  //add event for recieving messages
  let n = Connections.length-1;
  ConnectionNames.push(n);


  //ON connection message
  Connections[Connections.length-1].addEventListener('message', function(event){
    //add nickname option
    if(event.data.substring(0,nameChangeVar.length) == nameChangeVar){
      ConnectionNames[n] = event.data.substring(nameChangeVar.length).trim();
      console.log(`${Underscore}player ${RedColor}${Underscore}[${n}]${NoColor}${Underscore} is now  ${RedColor}${Underscore}${ConnectionNames[n]}${NoColor}`)
    }
    //send each connection the message
    let message = rolls.searchAndRollDice(event.data);
    console.log(`>${RedColor}[${n}]${NoColor}${ConnectionNames[n]}:${message}`)
    sendToAll(`player ${ConnectionNames[n]}:  ${rolls.searchAndRollDice(event.data)}`);
    
  });
  //ON connection close
  Connections[Connections.length-1].on('close', event => {
    console.log(`${Underscore}Connection closed by ${RedColor}${Underscore}[${n}]${NoColor}${Underscore}$${ConnectionNames[n]}${NoColor}`)

    sendToAll(`> ${ConnectionNames[n]} left the server`);
  //  Connections.remove(n);
  //  ConnectionNames.remove(n);

    
  });
  
 
  Server.send(`You are now connected to the server\nuse "${nameChangeVar} " to change name`)

  console.log(`${Underscore}Number of users: ${GreenColor}${Underscore}${Connections.length}${NoColor}`)

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