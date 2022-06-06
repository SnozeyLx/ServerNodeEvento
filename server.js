var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(_dirname + '/index.html');
});

var List_current_player = {};

var Jogador = require('./Classe/Jogador.js');
var jogadores = [];
var sockets = [];

io.on('connect', function(socket){
    

    var jogador = new Jogador();
    var thisJogadorID = jogador.id;
    console.log('a user connected, user id:' + jogador.id);

    jogadores[thisJogadorID] = jogador;
    sockets[thisJogadorID] = socket;


socket.emit('registro', jogador);

socket.on('registrou', function(tipo){
    jogadores[thisJogadorID].nome = tipo.nome;
    jogadores[thisJogadorID].forma = tipo.forma;
    jogadores[thisJogadorID].color = tipo.cor;     
    

    socket.emit('nasce', jogador);
    socket.broadcast.emit('nasce', jogador);
    console.log('id aqui >>>>>>' + thisJogadorID);


}); 



 
    for(var jogadorid in jogadores)
    {
        if(jogadorid != thisJogadorID){
           socket.emit('nasce', jogadores[jogadorid]);
        }
    }




socket.on('updatePosition', function(data){
    console.log(data);
    jogador.position.x = data.position.x;
    jogador.position.y = data.position.y;
    jogador.position.z = data.position.z;
    //console.log(jogador);

    socket.broadcast.emit('updatePosition', jogador);

});


socket.on('disconnect', function(){
    console.log('jogador desconectado');
    socket.broadcast.emit('disconnected', jogador);
    delete jogadores[thisJogadorID];
    delete sockets[thisJogadorID];
  

});

  /*   socket.on('ping', function(data) {
        console.log("ping");
    socket.emit ('pong', data);
        
    }) */

    // socket.on('Join_Room', function(data){

  
    //     socket.emit('logou');
    // });

    // socket.on('player', function(data){

        
    //     var current_player = {

    //         name : data.nome,
    //         id : socket.id,
    //         playerId : data.id

    //     };

    //     List_current_player[current_player.id] = current_player;
        
    //     console.log(data);
    //     console.log(current_player);
    //     //socket.emit('logou', current_player);
    // });

});





http.listen(3000, function() {
console.log('listening on 3000');
});