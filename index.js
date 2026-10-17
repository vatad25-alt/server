const express = require('express');
const socketio = require('socket.io');
const exp = express();
exp.use(express.static('web'))
const web = exp.listen(3000, function () {
  console.log("Running")
})
const io = socketio(web)

let BourdPositstion = [
  ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"]
]

let memoryBourdPositstion = [
  ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"]
]

let pieceimage
let type
let CastleRook
let whitekingpos
let blackkingpos
let blackcheck = 0
let whitecheck = 0

let direction
let direction2

let legalMove

let startTime = 1800000
let endTime
let timepassed

let bourdsize = 8 // gridsize
let cellSize = 100 // size of each sqare
let cellcolor = ["white", "grey"]
let xoffset = (cellSize / 4)
let yoffset = cellSize / 10

let click = 0

let selectedY = 99
let selectedX = 99

let oldSelectedX = 99
let oldSelectedY = 99
let findMoves = 0

let pieceType
let pieceColor

let playerColour = 0
let WhiteMoves = []
let BlackMoves = []
let whiteSimulatedBlackMoves = []
let blackSimulatedWhiteMoves = []
let simboardposistion
let whiteSimulatedBlackMoves2d = []
let blackSimulatedWhiteMoves2d = []

let playerData = {}
let gameData = {}

let moved = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
let game = 0

let turns = 1

io.on('connection', function (socket) {
  // a new connection has been created  
  // i.e. a web browser has connected to the server 
  console.log("connected to " + socket.id)
  playerColour = 1 - playerColour
  if ((Object.keys(playerData).length % 2) == 0) {
    game++
  }
  playerData[socket.id] = { colour: playerColour, game: game }// add the player to the playerData object with their colour and turns and game number
  console.log(playerData)

  BourdPositstion = [
    ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
    ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
    ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"]
  ]

  moved = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]

  memoryBourdPositstion = [
    ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
    ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
    ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"]
  ]
  turns = 1

  let gamenumber = playerData[socket.id].game
  gameData[gamenumber] = { BourdPositstion: BourdPositstion, moved: moved, memoryBourdPositstion: memoryBourdPositstion, turns: turns }// add the game to the gameData object with the board position and moved and memoryBourdPositstion

  socket.emit("connected", { colour: playerColour, turns: turns, game: game, socketid: socket.id }) // send the player their colour and turns and game number

  socket.on('requestBoard', function (value) {
    gamenumber = playerData[socket.id].game//the board that the request came from

    BourdPositstion = gameData[gamenumber].BourdPositstion
    memoryBourdPositstion = gameData[gamenumber].memoryBourdPositstion
    moved = gameData[gamenumber].moved

    socket.emit("board", { board: BourdPositstion, moved: moved, memoryBourdPositstion: memoryBourdPositstion, gamenumber })// send the player the board position and moved and memoryBourdPositstion
  })
  //socket.on("")

  socket.on('request_move', function (value) {

    console.log("request_move: " + value)
    gamenumber = playerData[socket.id].game//the board that the request came from
    //update values to be about this board

    BourdPositstion = gameData[gamenumber].BourdPositstion
    memoryBourdPositstion = gameData[gamenumber].memoryBourdPositstion
    moved = gameData[gamenumber].moved
    turns = gameData[gamenumber].turns


    BlackMoves = value.BlackMoves
    console.log("Blackmoves " + BlackMoves)
    WhiteMoves = value.WhiteMoves
    console.log("Whitemoves " + WhiteMoves)

    oldSelectedX = value.request.charAt(0)
    oldSelectedX = parseInt(oldSelectedX)

    oldSelectedY = value.request.charAt(1)
    oldSelectedY = parseInt(oldSelectedY)

    selectedX = value.request.charAt(2)
    selectedX = parseInt(selectedX)

    selectedY = value.request.charAt(3)
    selectedY = parseInt(selectedY)

    pieceColor = value.request.charAt(4)
    pieceColor = pieceColor.toUpperCase()

    pieceType = value.request.charAt(5)
    pieceType = pieceType.toUpperCase()

    let defendingColor = BourdPositstion[selectedY][selectedX].charAt(0)
    defendingColor = defendingColor.toUpperCase()

    let ChangeInX = selectedX - oldSelectedX
    let ChangeInY = selectedY - oldSelectedY

    let absChangeInX = Math.abs(ChangeInX)
    let absChangeInY = Math.abs(ChangeInY)

    console.log("oldSelectedX: " + oldSelectedX + " oldSelectedY: " + oldSelectedY + " selectedX: " + selectedX + " selectedY: " + selectedY + " pieceColor: " + pieceColor + " pieceType: " + pieceType)
    console.log("ChangeInX: " + ChangeInX + " ChangeInY: " + ChangeInY + " absChangeInX: " + absChangeInX + " absChangeInY: " + absChangeInY)

    function moves(selectedX, selectedY, pieceColor, pieceType, legalMove) {
      console.log("move is running")

      if (legalMove == 1) {//move is legal so rook moves and move selection reset
        console.log("move allowed")

        console.log("turns: " + turns)
        turns++
        memoryBourdPositstion = structuredClone(BourdPositstion)
        BourdPositstion[selectedY][selectedX] = BourdPositstion[oldSelectedY][oldSelectedX] //new position is old position
        let temp = ""
        BourdPositstion[oldSelectedY][oldSelectedX] = temp //old position is empty
        moved[oldSelectedY][oldSelectedX] = 1 //old position has been moved
        moved[selectedY][selectedX] = 1 //new position has been moved

        gameData[gamenumber] = { BourdPositstion: BourdPositstion, moved: moved, memoryBourdPositstion: memoryBourdPositstion, turns: turns }// add the game to the gameData object with the board position and moved and memoryBourdPositstion

        console.log("BourdPositstion: " + BourdPositstion)
        socket.emit('score', { value: value, turns: turns, result: "move allowed", board: BourdPositstion, moved: moved, memoryBourdPositstion: memoryBourdPositstion, simulatedBoards: simulatedBoards })

      } else {// move is not legal no move selection reset
        console.log("move not allowed")
        socket.emit('score', { value: value, turns: turns, result: "move not allowed", board: BourdPositstion, moved: moved, memoryBourdPositstion: memoryBourdPositstion })
      }
    }
    const simulatedBoards = []
    if ((turns % 2 == 0 && pieceColor == "B")) {//simulate move B
      for (const tempmoves of BlackMoves) {
        const simoldSelectedX = parseInt(tempmoves.charAt(0))
        const simoldSelectedY = parseInt(tempmoves.charAt(1))
        const simselectedX = parseInt(tempmoves.charAt(2))
        const simselectedY = parseInt(tempmoves.charAt(3))

        const simboardposistion = structuredClone(BourdPositstion)
        simboardposistion[simselectedY][simselectedX] = simboardposistion[simoldSelectedY][simoldSelectedX]
        simboardposistion[simoldSelectedY][simoldSelectedX] = ""
        simulatedBoards.push(simboardposistion)
      }

    } else if ((turns % 2 == 1 && pieceColor == "W")) {//simulate move W
      for (const tempmoves of BlackMoves) {
        const simoldSelectedX = parseInt(tempmoves.charAt(0))
        const simoldSelectedY = parseInt(tempmoves.charAt(1))
        const simselectedX = parseInt(tempmoves.charAt(2))
        const simselectedY = parseInt(tempmoves.charAt(3))

        const simboardposistion = structuredClone(BourdPositstion)
        simboardposistion[simselectedY][simselectedX] = simboardposistion[simoldSelectedY][simoldSelectedX]
        simboardposistion[simoldSelectedY][simoldSelectedX] = ""
        simulatedBoards.push(simboardposistion)
      }


    }
    //console.log(simulatedBoards)
    simboardposistion = -1
    whiteSimulatedBlackMoves = []
    blackSimulatedWhiteMoves = []
    for (const [[board]] of simulatedBoards) {
      console.log[board]
      //console.log(board)
      simboardposistion++
      if ((turns % 2 == 0 && pieceColor == "B")) {//find all the next moves to be made of white
        for (let yyy = 0; yyy < bourdsize; yyy++) {
          for (let xxx = 0; xxx < bourdsize; xxx++) {
            possibleMoves(xxx, yyy)
          }
        }
        blackSimulatedWhiteMoves[simboardposistion] = { blackSimulatedWhiteMoves2d }

      } else if ((turns % 2 == 1 && pieceColor == "W")) {//find all the next moves to be made of black
        for (let yyy = 0; yyy < bourdsize; yyy++) {
          for (let xxx = 0; xxx < bourdsize; xxx++) {
            possibleMoves(xxx, yyy)
          }
        }

        whiteSimulatedBlackMoves[simboardposistion] = { whiteSimulatedBlackMoves2d }
      }



    }
    for (let i = 0; i < simulatedBoards.length; i++) {
      console.log(whiteSimulatedBlackMoves[i])
      console.log(blackSimulatedWhiteMoves[i])
    }



    if ((turns % 2 == 1 && pieceColor == "W") || (turns % 2 == 0 && pieceColor == "B")) {
      if (!(BourdPositstion[oldSelectedY][oldSelectedX] == "")) {
        if (oldSelectedX > -1 && oldSelectedX < 8 && oldSelectedY > -1 && oldSelectedY < 8) {//check if the move is on the board
          if (selectedX > -1 && selectedX < 8 && selectedY > -1 && selectedY < 8) {
            if (!(pieceColor == defendingColor)) {
              if (((pieceType == "N"))) { //knight moves
                console.log("knights")
                if ((absChangeInX == (1) && absChangeInY == (2)) || (absChangeInX == (2) && absChangeInY == (1))) {//can the piece move
                  let legalMove = 1
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else {//the move failed
                  let legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }
              } else if ((pieceType == "R")) {//rook moves 
                console.log("rook")
                if (((absChangeInX >= 1) && (absChangeInY == 0))) {//can rook move in the x axis
                  console.log("rook moves in x")
                  // now we must check if the path is free

                  if (oldSelectedX > selectedX) {//is the rook moving left or right
                    direction = -1//left
                    console.log("left")
                  } else {
                    direction = 1//right
                    console.log("right")
                  }

                  legalMove = 1
                  if (direction == 1) {//check if something is in the way of right
                    for (let i = oldSelectedX + 1; i < selectedX; i = i + direction) {//loop through the path of the rook
                      console.log(selectedY, i)
                      console.log(BourdPositstion[selectedY][i])
                      if (!(BourdPositstion[selectedY][i]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  } else if (direction == -1) {//check if something is in the way of left
                    for (let j = oldSelectedX - 1; j > selectedX; j = j + direction) {
                      console.log(selectedY, j)
                      console.log(BourdPositstion[selectedY][j])
                      if (!(BourdPositstion[selectedY][j]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  }



                  //depending on the legality of the move we will either move the rook or not
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)


                } else if (((absChangeInY >= 1) && (absChangeInX == 0))) {//rook move in the y axis
                  console.log("rook moves in y")
                  if (selectedY < oldSelectedY) {//we must check if the rook is moving up or down
                    direction = -1//up
                    console.log("up")
                  } else {
                    direction = 1//down
                    console.log("down")
                  }

                  legalMove = 1
                  //Check if something is in the way of the rook

                  if (direction == 1) {//check if something is in the way of down
                    for (let i = oldSelectedY + 1; i < selectedY; i = i + direction) {//loop through the path of the rook
                      console.log(i, selectedX)
                      console.log(BourdPositstion[i][selectedX])
                      if (!(BourdPositstion[i][selectedX]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  } else if (direction == -1) {//check if something is in the way of up
                    for (let j = oldSelectedY - 1; j > selectedY; j = j + direction) {
                      console.log(j, selectedX)
                      console.log(BourdPositstion[j][selectedX])
                      if (!(BourdPositstion[j][selectedX]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  }
                  //depending on the legality of the move we will either move the rook or not
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else {//the move failed
                  legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }

              } else if ((pieceType == "B")) {//bishop moves
                if (absChangeInX == absChangeInY) {//does the bishop move diagianly
                  //now we know that we the bishop could move on an empty grid we must find out if anything is in the way of its path
                  //we must know wether the piece moves diaginally  (up or down )and (left or right)

                  if (selectedX > oldSelectedX) {
                    console.log("right")
                    direction = 1
                  } else {
                    console.log("left")
                    direction = -1
                  }

                  if (selectedY > oldSelectedY) {
                    console.log("down")
                    direction2 = 1
                  } else {
                    console.log("up")
                    direction2 = -1
                  }

                  legalMove = 1

                  if ((direction == 1) && (direction2 == 1)) {//down right
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY + i][oldSelectedX + i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == -1) && (direction2 == 1)) {//down left
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY + i][oldSelectedX - i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == 1) && (direction2 == -1)) {//up right
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY - i][oldSelectedX + i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == -1) && (direction2 == -1)) {//up left
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY - i][oldSelectedX - i] == "")) {
                        legalMove = 0
                      }
                    }
                  }



                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else {
                  legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }



              } else if ((pieceType == "Q")) {//queen moves
                if (((absChangeInX >= 1) && (absChangeInY == 0))) {//can rook move in the x axis
                  console.log("rook moves in x")
                  // now we must check if the path is free

                  if (oldSelectedX > selectedX) {//is the rook moving left or right
                    direction = -1//left
                    console.log("left")
                  } else {
                    direction = 1//right
                    console.log("right")
                  }

                  legalMove = 1
                  if (direction == 1) {//check if something is in the way of right
                    for (let i = oldSelectedX + 1; i < selectedX; i = i + direction) {//loop through the path of the rook
                      console.log(selectedY, i)
                      console.log(BourdPositstion[selectedY][i])
                      if (!(BourdPositstion[selectedY][i]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  } else if (direction == -1) {//check if something is in the way of left
                    for (let j = oldSelectedX - 1; j > selectedX; j = j + direction) {
                      console.log(selectedY, j)
                      console.log(BourdPositstion[selectedY][j])
                      if (!(BourdPositstion[selectedY][j]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  }



                  //depending on the legality of the move we will either move the rook or not
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)


                } else if (((absChangeInY >= 1) && (absChangeInX == 0))) {//rook move in the y axis
                  console.log("rook moves in y")
                  if (selectedY < oldSelectedY) {//we must check if the rook is moving up or down
                    direction = -1//up
                    console.log("up")
                  } else {
                    direction = 1//down
                    console.log("down")
                  }

                  legalMove = 1
                  //Check if something is in the way of the rook

                  if (direction == 1) {//check if something is in the way of down
                    for (let i = oldSelectedY + 1; i < selectedY; i = i + direction) {//loop through the path of the rook
                      console.log(i, selectedX)
                      console.log(BourdPositstion[i][selectedX])
                      if (!(BourdPositstion[i][selectedX]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  } else if (direction == -1) {//check if something is in the way of up
                    for (let j = oldSelectedY - 1; j > selectedY; j = j + direction) {
                      console.log(j, selectedX)
                      console.log(BourdPositstion[j][selectedX])
                      if (!(BourdPositstion[j][selectedX]) == "") {//if something is in the way of the rook
                        console.log("move illegal")//make the move illegal
                        legalMove = 0
                      }

                    }
                  }
                  //depending on the legality of the move we will either move the rook or not
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else if (absChangeInX == absChangeInY) {//does the bishop move diagianly
                  //now we know that we the bishop could move on an empty grid we must find out if anything is in the way of its path
                  //we must know wether the piece moves diaginally  (up or down )and (left or right)

                  if (selectedX > oldSelectedX) {
                    console.log("right")
                    direction = 1
                  } else {
                    console.log("left")
                    direction = -1
                  }

                  if (selectedY > oldSelectedY) {
                    console.log("down")
                    direction2 = 1
                  } else {
                    console.log("up")
                    direction2 = -1
                  }

                  legalMove = 1

                  if ((direction == 1) && (direction2 == 1)) {//down right
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY + i][oldSelectedX + i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == -1) && (direction2 == 1)) {//down left
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY + i][oldSelectedX - i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == 1) && (direction2 == -1)) {//up right
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY - i][oldSelectedX + i] == "")) {
                        legalMove = 0
                      }
                    }
                  } else if ((direction == -1) && (direction2 == -1)) {//up left
                    for (let i = 1; i < absChangeInX; i++) {
                      console.log((oldSelectedX + i), (oldSelectedY + i))
                      if (!(BourdPositstion[oldSelectedY - i][oldSelectedX - i] == "")) {
                        legalMove = 0
                      }
                    }
                  }

                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else {//the move failed
                  legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }
              } else if ((pieceType == "K")) {//king move
                if ((absChangeInX < 2) && (absChangeInY < 2)) {//normal move
                  legalMove = 1
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                } else if ((absChangeInX == 2) && (ChangeInY == 0)) {//attpemet to castle
                  if (oldSelectedX > selectedX) {//is the rook moving left or right
                    direction = -1//left
                    console.log("left")
                  } else {
                    direction = 1//right
                    console.log("right")
                  }
                  if (direction == 1) {
                    CastleRook = BourdPositstion[selectedY][selectedX + direction]
                    console.log(CastleRook)
                  } else if (direction == -1) {
                    CastleRook = BourdPositstion[selectedY][selectedX + (2 * direction)]
                    console.log(CastleRook)
                  }
                  if (((pieceColor == "W") && (CastleRook == "WR") || ((pieceColor == "B") && (CastleRook == "BR")))) {//is thier a rook next to king
                    if ((moved[oldSelectedY][oldSelectedX] == 0) && (((moved[selectedY][selectedX + direction] == 0) && (direction == 1)) || ((moved[selectedY][selectedX + (2 * direction)] == 0) && (direction == -1)))) {//Has the position of rook and king had no moves happen before
                      if (((BourdPositstion[oldSelectedY][oldSelectedX + direction] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (2 * direction)] == "") && (direction == 1))
                        || ((BourdPositstion[oldSelectedY][oldSelectedX + direction] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (2 * direction)] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (3 * direction)] == "") && (direction == -1))) {
                        if (CastleRook == "WR") {
                          if (direction == 1) {
                            BourdPositstion[7][7] = ""//remove rook at old postision
                            BourdPositstion[7][5] = CastleRook//create rook at new pos
                          } else if (direction == -1) {
                            BourdPositstion[7][0] = ""//remove rook at old postision
                            BourdPositstion[7][3] = CastleRook//create rook at new pos
                          }
                        } else if (CastleRook == "BR") {
                          if (direction == 1) {
                            BourdPositstion[0][7] = ""//remove rook at old postision
                            BourdPositstion[0][5] = CastleRook//create rook at new pos
                          } else if (direction == -1) {
                            BourdPositstion[0][0] = ""//remove rook at old postision
                            BourdPositstion[0][3] = CastleRook//create rook at new pos
                          }
                        }
                        console.log("can castle")
                        legalMove = 1
                        moves(selectedX, selectedY, pieceColor, pieceType, legalMove)


                      } else {
                        console.log("not free so move failed")
                        legalMove = 0
                        moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                      }




                    } else {//move fails as either king or rook have moved before
                      console.log("move illegal as move before")
                      legalMove = 0
                      moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                    }
                  } else {//move fails as there is no rook
                    console.log("no rook so move fails")
                    legalMove = 0
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else {//all move fail
                  console.log("no possilbe moves")
                  legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }
              } else if ((pieceType == "P")) {//pawn moves{

                if ((pieceColor == "B" && ChangeInY == 1 && absChangeInX == 0) && !(defendingColor == "W")) {//black one sqaure advance
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "B" && ChangeInY == 1 && absChangeInX == 1) && (defendingColor == "W")) {//black diaginal attack
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "B" && ChangeInY == 2 && absChangeInX == 0) && (moved[oldSelectedY][oldSelectedX] == 0) && ((BourdPositstion[oldSelectedY + 1][oldSelectedX] == "") && (BourdPositstion[oldSelectedY + 2][oldSelectedX] == ""))) {//black 2 sqaure advasnce
                  console.log("black 2 sqaure advasnce")
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "B" && ChangeInY == 1 && ChangeInX == 1) && (defendingColor == "") && (BourdPositstion[selectedY - 1][selectedX] == "WP") && (memoryBourdPositstion[selectedY + 1][selectedX])) {//black en passent right
                  if (pieceColor != defendingColor) {
                    BourdPositstion[selectedY - 1][selectedX] = ""
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "B" && ChangeInY == 1 && ChangeInX == -1) && (defendingColor == "") && (BourdPositstion[selectedY - 1][selectedX] == "WP") && (memoryBourdPositstion[selectedY + 1][selectedX])) {//black en passent left
                  if (pieceColor != defendingColor) {
                    BourdPositstion[selectedY - 1][selectedX] = ""
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "W" && ChangeInY == -1 && absChangeInX == 0) && !(defendingColor == "B")) {//move forward
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "W" && ChangeInY == -1 && absChangeInX == 1) && (defendingColor == "B")) {//daiginal attack
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "W" && ChangeInY == -2 && absChangeInX == 0) && (moved[oldSelectedY][oldSelectedX] == 0) && ((BourdPositstion[oldSelectedY - 1][oldSelectedX] == "") && (BourdPositstion[oldSelectedY - 2][oldSelectedX] == ""))) {//2 square advance
                  if (pieceColor != defendingColor) {
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "W" && ChangeInY == -1 && ChangeInX == 1) && (defendingColor == "") && (BourdPositstion[selectedY + 1][selectedX] == "BP") && (memoryBourdPositstion[selectedY - 1][selectedX])) {//white en passent right
                  if (pieceColor != defendingColor) {
                    BourdPositstion[selectedY + 1][selectedX] = ""
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else if ((pieceColor == "W" && ChangeInY == -1 && ChangeInX == -1) && (defendingColor == "") && (BourdPositstion[selectedY + 1][selectedX] == "BP") && (memoryBourdPositstion[selectedY - 1][selectedX])) {//white en passent left
                  if (pieceColor != defendingColor) {
                    BourdPositstion[selectedY + 1][selectedX] = ""
                    legalMove = 1
                    moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                  }
                } else {
                  legalMove = 0
                  moves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                }
              }
            } else {
              moves(selectedX, selectedY, pieceColor, pieceType, 0)
            }
          } else {
            moves(selectedX, selectedY, pieceColor, pieceType, 0)
          }
        } else {
          moves(selectedX, selectedY, pieceColor, pieceType, 0)
        }
      } else {
        moves(selectedX, selectedY, pieceColor, pieceType, 0)
      }
    } else {
      moves(selectedX, selectedY, pieceColor, pieceType, 0)
    }


  })

  function possibleMoves(oldSelectedX, oldSelectedY) {
    let moveNum = 0
    whiteSimulatedBlackMoves2d = []
    blackSimulatedWhiteMoves2d = []
    function psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove) {
      if ((legalMove == 1)) {

        if ((turns + 1) % 2 == 1) {//find all the next moves to be made of black
          //let temp = [oldSelectedX, oldSelectedY, selectedX, selectedY, pieceColor, pieceType]
          let temp = "hi"
          //temp2 = temp.join("")
          blackSimulatedWhiteMoves2d.push(temp)
          moveNum++

        } else if ((turns + 1) % 2 == 0) {
          //let temp = [oldSelectedX, oldSelectedY, selectedX, selectedY, pieceColor, pieceType]
          let temp = "hi"
          //temp2 = temp.join("")
          whiteSimulatedBlackMoves2d.push(temp)
          moveNum++
        }
      }
    }
    for (let y = 0; y < bourdsize; y++) {
      for (let x = 0; x < bourdsize; x++) {
        psudoMoves(0, 0, 0, 0, 1)
      }
    }


  }



  // note when the browser disconnects 
  socket.on('disconnect', function () {
    console.log(socket.id + " disconnected")
  })
}) 
