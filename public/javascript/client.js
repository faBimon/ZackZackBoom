"use strict"

var socket = io.connect();

createjs.Sound.setMute(false);
createjs.Sound.registerSound("/sounds/bomb.mp3", "boom");
createjs.Sound.registerSound("/sounds/tick.mp3", "tick");
createjs.Sound.registerSound("/sounds/click.mp3", "click");


var tickloopSound = createjs.Sound.createInstance("tick");
tickloopSound.addEventListener("complete", function (event) {
    tickloopSound.play();
});
tickloopSound.setMute(false);
tickloopSound.volume = 0.5;

var clickSound = createjs.Sound.createInstance("click");
clickSound.setMute(false);
clickSound.volume = 0.5;

function gotBomb() {
  tickloopSound.play();
  $(".bomb").show();
  $(".nobomb").hide();
  $(".button_active").show();
  $(".button_inactive").hide();
};

function lostBomb() {
  tickloopSound.pause();
  $(".bomb").hide()
  $(".nobomb").show()
  $(".button_active").hide()
  $(".button_inactive").show()
};

function registerName() {
  $("#login_overlay").fadeOut();
  socket.emit('register', { name: $(".loginname").val() , email: "franz@aol.de"} );
  console.log($(".loginname").val());
}

function throwBomb() {
  clickSound.play();
  socket.emit('throwBomb');
  console.log('sent throwBomb')
}

function setBombHolder(name) {
  $("#content .nobomb p").text(name + " has the bomb");
}


socket.on('explodeBomb', function (data) {
  console.log("Explodiere!");
  var instance = createjs.Sound.play("boom");
  instance.setMute(false);
  instance.volume = 0.5;
  lostBomb();
  alert("You've got bombed!!!")
});

socket.on('info', function (data) {
  console.log("Players/Connections: " + data.players_cnt + "/" + data.connections_cnt + ", Bombs: " + data.bombs_cnt + ", TTL: " + data.bombs_ttl + ", Holder: " + data.bomb_holder);
  $("#stats .player p").text(data.connections_cnt);
  $("#stats .bomb p").text(data.bombs_cnt);
  setBombHolder(data.bomb_holder);
});

socket.on('lostBomb', function () {
  lostBomb();
});

socket.on('caughtBomb', function () {
  gotBomb();
});

socket.on('bombMoved', function (data) {
  setBombHolder(data.bomb_holder);
});

$(document).ready( function() {
  $(".button_active").click( function() {
    throwBomb();
  });
  
  $(".bomb").click( function() {
    throwBomb();
  });
  
  $("#login_overlay").on('keydown',"input.loginname", function (e) {
    if (e.keyCode == 13) {
      registerName();
    }
  });

  $(".submit").click( function() {
    clickSound.play();
    registerName();
  });

  $(document).bind('keyup', function(e) {
    if (e.keyCode == 32) {
      throwBomb();
    }
  });

});