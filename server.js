var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    rejectUnauthorized: false,
    allowEIO3: true,
    cors: {
      origin: "http://prototipo.woodyverso.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var List_current_player = {};

const { debug } = require('console');
var Jogador = require('./Classe/Jogador.js');
var jogadores = [];
var sockets = [];


io.on('connection', function(socket){
    console.log('a user connected, user id:');

    var jogador = new Jogador();
    jogador.id = socket.id;

    jogadores[socket.id] = jogador;


socket.emit('registro', jogador);

socket.on('registrou', function(tipo){
    jogadores[socket.id].nome = tipo.nome;
    jogadores[socket.id].forma = tipo.forma;
    jogadores[socket.id].color = tipo.cor;
     socket.emit('nasce', jogadores[socket.id]);
     socket.broadcast.emit('nasce', jogadores[socket.id]);
     //console.log('id aqui >>>>>>' + thisJogadorID);
    
});


    for(var jogadorid in jogadores){
        if(jogadorid != socket.id){
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



console.log('id aqui >>>>>>' + socket.id);

socket.on('disconnect', function(){
    console.log('jogador desconectado');
    socket.broadcast.emit('disconnected', jogador);
    delete jogadores[socket.id];
    delete sockets[socket.id];
  

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