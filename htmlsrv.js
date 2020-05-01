const ws = require('ws')
const rolls = require('./rolls')
Connections = [];
var ConnectionNames = []
document.getElementById("startServer").onclick = initiates;

 function initiates() {
    const wss = new ws.Server({ port: 8080 })
    //create connection array

    var stdin = process.openStdin();


    wss.on('connection', Server => {

        //Add the made collection to the array
        Connections.push(Server);
        //add event for recieving messages
        let n = Connections.length - 1;
        ConnectionNames.push(n);
        Connections[Connections.length - 1].addEventListener('message', function (event) {
            console.log(`>[${n}]${ConnectionNames[n]}:${event.data}`)
            //add nickname option
            let nameChangevar = "-name:";
            if (event.data.substring(0, nameChangevar.length) == nameChangevar) {
                ConnectionNames[n] = event.data.substring(nameChangevar.length).trim();
                console.log(`player ${n} is now  ${ConnectionNames[n]}`)
            }
            //send each connection the message
            sendToAll(`player ${ConnectionNames[n]}:  ${rolls.searchAndRollDice(event.data)}`);

        });
        Connections[Connections.length - 1].on('close', event => {
            console.log(`Connection closed by [${n}]${ConnectionNames[n]}`)

            sendToAll(`> ${ConnectionNames[n]} left the server`);
            //  Connections.remove(n);
            //  ConnectionNames.remove(n);


        });


        Server.send('You are now connected to the server\nuse "-name: " to change name')

        console.log(`Number of users: ${Connections.length}`)

    });
}
export function init(){
    return new ws.Server(8080)
}
function outPut(string) {
    document.getElementById('console.log').textContent += `\n${string}`;
}

function sendToAll(string) {
    Connections.forEach(connection => {
        if (connection.OPEN) {
            connection.send(string)
        }
    });
}
//reads terminal input
document.getElementById('txtInput').addListener("keyup", function (d) {
    txt = document.getElementById('txtInput').textContent;
    sendToAll(rolls.searchAndRollDice("dm: " + txt.toString().trim()));

});

