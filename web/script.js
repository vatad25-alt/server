let socket = io();
let finished = false

async function setup() {
    frameRate(60)
    createCanvas(windowWidth, windowHeight)


    //load white pieces images
    BB_image = await loadImage("blackbishop.png")
    BK_image = await loadImage("blackking.png")
    BN_image = await loadImage("blackknight.png")
    BP_image = await loadImage("blackpawn.png")
    BQ_image = await loadImage("blackqueen.png")
    BR_image = await loadImage("blackrook.png")


    //load black piece images
    WB_image = await loadImage("whitebishop.png")
    WK_image = await loadImage("whiteking.png")
    WN_image = await loadImage("whiteknight.png")
    WP_image = await loadImage("whitepawn.png")
    WQ_image = await loadImage("whitequeen.png")
    WR_image = await loadImage("whiterook.png")


    //empty
    empty_images = await loadImage("Empty.png")
}
let playerColour
let turns
let game
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

let selected = 0

let selectedY = 99
let selectedX = 99

let oldSelectedX = 99
let oldSelectedY = 99

let gridX
let gridY
let findMoves = 1

let pieceType = 6
let pieceColor

let turn = 1
let WhiteMoves = []
let BlackMoves = []
let simulatedBoards
let simulatedWhiteMoves
let whiteSimulatedBoards
let whiteSimulatedBlackMoves




let bourd = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
]

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



function draw() {

    socket.emit("requestBoard", socket.id)//request board from server
    socket.on('board', function (d) {
        if (d.gamenumber == gamenumber) {
            BourdPositstion = d.board // update the board position with the new result from the server
            moved = d.moved // update the moved array with the new result from the server
            memoryBourdPositstion = d.memoryBourdPositstion // update the memoryBourdPositstion array with the new result from the server
        }
    })

    fill("lightskyblue")
    stroke("lightskyblue")



    rect(0, 0, 2000, 1000)
    for (let y = 0; y < bourdsize; y++) {
        for (let x = 0; x < bourdsize; x++) {


            fill(cellcolor[bourd[x][y]])
            stroke(255)

            rect(((x * cellSize) + xoffset), ((y * cellSize) + yoffset), cellSize, cellSize);
            //piece color

            if ((BourdPositstion[y][x].startsWith("W"))) {
                fill("grey")

            } else if ((BourdPositstion[y][x].startsWith("B"))) {
                fill("brown")

            } else {

            }




            if ((BourdPositstion[y][x]) == "WK") {//check array to see what pieces to be drawn
                pieceimage = WK_image
            } else if (((BourdPositstion[y][x]) == "BK")) {
                pieceimage = BK_image
            } else if (((BourdPositstion[y][x]) == "WQ")) {
                pieceimage = WQ_image
            } else if (((BourdPositstion[y][x]) == "BQ")) {
                pieceimage = BQ_image
            } else if (((BourdPositstion[y][x]) == "WB")) {
                pieceimage = WB_image
            } else if (((BourdPositstion[y][x]) == "BB")) {
                pieceimage = BB_image
            } else if (((BourdPositstion[y][x]) == "WN")) {
                pieceimage = WN_image
            } else if (((BourdPositstion[y][x]) == "BN")) {
                pieceimage = BN_image
            } else if (((BourdPositstion[y][x]) == "WR")) {
                pieceimage = WR_image
            } else if (((BourdPositstion[y][x]) == "BR")) {
                pieceimage = BR_image
            } else if (((BourdPositstion[y][x]) == "WP")) {
                pieceimage = WP_image
            } else if (((BourdPositstion[y][x]) == "BP")) {
                pieceimage = BP_image
            } else {
                pieceimage = empty_images
            }



            //text
            textSize(cellSize / 5)
            text((BourdPositstion[y][x]), ((x * cellSize) + xoffset), ((y * cellSize) + yoffset + (yoffset * 2.5)))
            fill("black")
            for (let k = 0; k < 8; k++) {
                text((8 - k), ((0 * cellSize) + xoffset / 3), ((k * cellSize) + yoffset + (yoffset * 2.5)))//draw text of piece

                let letter = String.fromCharCode(65 + k)
                text((letter), ((k * cellSize) + xoffset), ((8 * cellSize) + yoffset + (yoffset * 2.5)))
            }

            image(pieceimage, ((x * cellSize) + (xoffset) * 1), ((y * cellSize) + (yoffset * 1)), cellSize, cellSize)//draw image of piece
        }
    }
    gridX = floor((mouseX - xoffset) / cellSize)
    gridY = floor((mouseY - yoffset) / cellSize)





    findMoves = 0//draw moves
    possibleMoves(selectedX, selectedY)
    //squaredraws(selectedX, selectedY)

    if (selectedX > -1 && selectedX < 8 && selectedY > -1 && selectedY < 8) {//move checker
        ////console.log("draw square")
        fill(50, 204, 20, 120);
        rect(((selectedX * cellSize) + xoffset), ((selectedY * cellSize) + yoffset), cellSize, cellSize)
    }
}

socket.on('connected', function (d) {
    if (d.socketid == socket.id) {
        playerColour = d.colour
        turns = d.turns
        gamenumber = d.game
        console.log("connected to server with colour: " + playerColour + " turns: " + turns + " game: " + game)
    }
})

socket.on('score', function (d) {


    turns = d.turns
    BourdPositstion = d.board // update the board position with the new result from the server
    moved = d.moved // update the moved array with the new result from the server
    memoryBourdPositstion = d.memoryBourdPositstion // update the memory board position with the new result from the server
    simulatedBoards = d.simulatedBoards
    console.log(simulatedBoards)

    click = 0

    oldSelectedX = 99
    oldSelectedY = 99

    selectedY = 99
    selectedX = 99

})

function mouseClicked() {
    //console.log("click")
    selected = 1
    if (selected) {

        WhiteMoves = []
        BlackMoves = []

        findMoves = 1//find psudo moves
        for (let yyy = 0; yyy < bourdsize; yyy++) {
            for (let xxx = 0; xxx < bourdsize; xxx++) {
                possibleMoves(xxx, yyy)
            }
        }



        oldSelectedX = selectedX
        oldSelectedY = selectedY

        selectedX = gridX
        selectedY = gridY
        console.log("selectedX: " + selectedX + " selectedY: " + selectedY)

        pieceType = BourdPositstion[oldSelectedY][oldSelectedX].charAt(1)
        pieceColor = BourdPositstion[oldSelectedY][oldSelectedX].charAt(0)
        if ((playerColour == 1 && pieceColor == "W") || (playerColour == 0 && pieceColor == "B")) {
            if (!(BourdPositstion[oldSelectedY][oldSelectedX] == "")) {//check if there is a piece in the old selected position
                if (!(BourdPositstion[oldSelectedY][oldSelectedX].charAt(0) == BourdPositstion[selectedY][selectedX].charAt(0))) {
                    if (oldSelectedX > -1 && oldSelectedX < 8 && oldSelectedY > -1 && oldSelectedY < 8) {//check if the piece is not the same color as the defending piece
                        if (selectedX > -1 && selectedX < 8 && selectedY > -1 && selectedY < 8) {



                            let request = [oldSelectedX, oldSelectedY, selectedX, selectedY, pieceColor, pieceType]
                            let request2 = request.join("")
                            socket.emit('request_move', ({
                                request: request2,
                                BlackMoves: BlackMoves,
                                WhiteMoves: WhiteMoves
                            }))
                            console.log("request sent: " + request2)

                            console.log(WhiteMoves)
                            console.log(BlackMoves)


                        }
                    }
                }
            }
        }


    }
}
/*
function squaredraws(oldSelectedX, oldSelectedY) {
    pieceColor = BourdPositstion[oldSelectedY][oldSelectedX].charAt(0)
    
    if (playerColour == 1 && pieceColor == "W"){
        for(let move of WhiteMoves){
            if ((move.charAt(0) == oldSelectedX)  &&  (move.charAt(1) == oldSelectedY) ) {
                let selectedX = move.charAt(2)
                selectedX = parseInt(selectedX)

                let selectedY  = move.charAt(3)
                selectedY = parseInt(selectedY)

                rect(((selectedX * cellSize) + xoffset), ((selectedY * cellSize) + yoffset), cellSize, cellSize)
            }
        } 
    } else if (playerColour == 0 && pieceColor == "B"){
        for(let move of BlackMoves){
            if ((move.charAt(0) == oldSelectedX)  &&  (move.charAt(1) == oldSelectedY) ) {
                let selectedX = move.charAt(2)
                selectedX = parseInt(selectedX)

                let selectedY  = move.charAt(3)
                selectedY = parseInt(selectedY)

                rect(((selectedX * cellSize) + xoffset), ((selectedY * cellSize) + yoffset), cellSize, cellSize)
            }
        } 
    }else{

    }
}
    */


function possibleMoves(oldSelectedX, oldSelectedY) {
    fill(100, 204, 0, 120)
    //console.log(selectedX, selectedY)

    function squaredraw(legalMove, selectedX, selectedY) {
        if (((playerColour == 1 && pieceColor == "W") || (playerColour == 0 && pieceColor == "B")) && (findMoves == 0)) {
            if ((legalMove == 1) && (findMoves == 0)) {
                rect(((selectedX * cellSize) + xoffset), ((selectedY * cellSize) + yoffset), cellSize, cellSize)
            }
        }
    }

    function psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove) {

        if ((legalMove == 1) && (findMoves == 1)) {
            if (pieceColor == "B") {
                let temp = [oldSelectedX, oldSelectedY, selectedX, selectedY, pieceColor, pieceType]
                temp2 = temp.join("")
                BlackMoves.push(temp2)

            } else if (pieceColor == "W") {
                let temp = [oldSelectedX, oldSelectedY, selectedX, selectedY, pieceColor, pieceType]
                temp2 = temp.join("")
                WhiteMoves.push(temp2)
            }
        }
    }


    //find psudo moves
    if ((oldSelectedX < 8) && (oldSelectedY < 8) && (oldSelectedX > -1) && (oldSelectedY > -1)) {
        if (!(BourdPositstion[oldSelectedY][oldSelectedX] == "")) {
            pieceType = BourdPositstion[oldSelectedY][oldSelectedX].charAt(1)
            pieceColor = BourdPositstion[oldSelectedY][oldSelectedX].charAt(0)
            for (let y = 0; y < bourdsize; y++) {
                for (let x = 0; x < bourdsize; x++) {

                    let selectedX = x
                    let selectedY = y
                    let defendingColor = BourdPositstion[selectedY][selectedX].charAt(0)
                    let ChangeInX = selectedX - oldSelectedX
                    let ChangeInY = selectedY - oldSelectedY

                    let absChangeInX = Math.abs(ChangeInX)
                    let absChangeInY = Math.abs(ChangeInY)


                    ////console.log(x, y)
                    ////console.log(pieceType)
                    ////console.log(defendingColor)
                    if (((pieceType == "N"))) { //knight moves
                        //console.log("knight")
                        if ((absChangeInX == (1) && absChangeInY == (2)) || (absChangeInX == (2) && absChangeInY == (1))) {
                            if (pieceColor != defendingColor) {
                                let legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else {
                            ////console.log("move not allowed")
                            let legalMove = 0
                            psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                            squaredraw(legalMove, selectedX, selectedY)

                        }
                    } else if ((pieceType == "R")) {//rook moves
                        //console.log("rook")
                        // find if you can move the knight
                        if (((absChangeInX >= 1) && (absChangeInY == 0))) {//can rook move in the x axis
                            //console.log("rook moves in x")
                            // now we must check if the path is free

                            if (oldSelectedX > selectedX) {//is the rook moving left or right
                                direction = -1//left
                                //console.log("left")
                            } else {
                                direction = 1//right
                                //console.log("right")
                            }

                            legalMove = 1


                            if (direction == 1) {//check if something is in the way of right
                                for (let i = oldSelectedX + 1; i < selectedX; i = i + direction) {//now we will check if the rows are free
                                    //console.log(selectedY, i)
                                    //console.log(BourdPositstion[selectedY][i])
                                    if (!(BourdPositstion[selectedY][i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if (direction == -1) {//check if something is in the way of the left

                                for (let j = oldSelectedX - 1; j > selectedX; j = j + direction) {
                                    //console.log(selectedY, j)
                                    //console.log(BourdPositstion[selectedY][j])
                                    if (!(BourdPositstion[selectedY][j]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)


                            }
                        } else if (((absChangeInY >= 1) && (absChangeInX == 0))) {//rook move in the y axis
                            //console.log("rook moves in y")


                            if (selectedY < oldSelectedY) {//we must check if the rook is moving up or down
                                direction = -1//up
                                //console.log("up")
                            } else {
                                direction = 1//down
                                //console.log("down")
                            }

                            legalMove = 1

                            if (direction == 1) {
                                for (let i = oldSelectedY + 1; i < selectedY; i = i + direction) {//now we will check if the colums are free
                                    //console.log(i, selectedX)
                                    //console.log(BourdPositstion[i][selectedX])
                                    if (!(BourdPositstion[i][selectedX]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if (direction == -1) {

                                for (let j = oldSelectedY - 1; j > selectedY; j = j + direction) {
                                    //console.log(j, selectedX)
                                    //console.log(BourdPositstion[j][selectedX])
                                    if (!(BourdPositstion[j][selectedX]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else {// the move is not in a cross formation so it fails
                            legalMove = 0
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        }
                    } else if ((pieceType == "B")) {//bishop moves
                        if (absChangeInX == absChangeInY) {//does the bishop move diagianly
                            //now we know that we the bishop could move on an empty grid we must find out if anything is in the way of its path
                            //we must know wether the piece moves diaginally  (up or down )and (left or right)

                            if (selectedX > oldSelectedX) {
                                ////console.log("right")
                                direction = 1
                            } else {
                                ////console.log("left")
                                direction = -1
                            }

                            if (selectedY > oldSelectedY) {
                                ////console.log("down")
                                direction2 = 1
                            } else {
                                ////console.log("up")
                                direction2 = -1
                            }

                            legalMove = 1

                            if ((direction == 1) && (direction2 == 1)) {
                                //console.log("right and down")//x++ y--

                                for (let i = 1; i < ChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX + i), (oldSelectedY + i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY + i][oldSelectedX + i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }


                            } else if ((direction == 1) && (direction2 == -1)) {
                                //console.log("right and up")// x++ y--

                                for (let i = 1; i < ChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX + i), (oldSelectedY - i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY - i][oldSelectedX + i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }


                            } else if ((direction == -1) && (direction2 == 1)) {
                                //console.log("left and down")

                                for (let i = 1; i < absChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX - i), (oldSelectedY + i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY + i][oldSelectedX - i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if ((direction == -1) && (direction2 == -1)) {
                                //console.log("left and up")

                                for (let i = 1; i < absChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX - i), (oldSelectedY - i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY - i][oldSelectedX - i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else {
                            legalMove = 0
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }

                        }
                    } else if ((pieceType == "Q")) {//queen moves
                        if (absChangeInX == absChangeInY) {//does the bishop move diagianly
                            //now we know that we the bishop could move on an empty grid we must find out if anything is in the way of its path
                            //we must know wether the piece moves diaginally  (up or down )and (left or right)

                            if (selectedX > oldSelectedX) {
                                ////console.log("right")
                                direction = 1
                            } else {
                                ////console.log("left")
                                direction = -1
                            }

                            if (selectedY > oldSelectedY) {
                                ////console.log("down")
                                direction2 = 1
                            } else {
                                ////console.log("up")
                                direction2 = -1
                            }

                            legalMove = 1

                            if ((direction == 1) && (direction2 == 1)) {
                                //console.log("right and down")//x++ y--

                                for (let i = 1; i < ChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX + i), (oldSelectedY + i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY + i][oldSelectedX + i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }


                            } else if ((direction == 1) && (direction2 == -1)) {
                                //console.log("right and up")// x++ y--

                                for (let i = 1; i < ChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX + i), (oldSelectedY - i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY - i][oldSelectedX + i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }


                            } else if ((direction == -1) && (direction2 == 1)) {
                                //console.log("left and down")

                                for (let i = 1; i < absChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX - i), (oldSelectedY + i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY + i][oldSelectedX - i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if ((direction == -1) && (direction2 == -1)) {
                                //console.log("left and up")

                                for (let i = 1; i < absChangeInX; i++) {//find size of diaginal
                                    //console.log((oldSelectedX - i), (oldSelectedY - i))//console log cells in path

                                    if (!(BourdPositstion[oldSelectedY - i][oldSelectedX - i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }

                        } else if (((absChangeInX >= 1) && (absChangeInY == 0))) {//can rook move in the x axis
                            //console.log("rook moves in x")
                            // now we must check if the path is free

                            if (oldSelectedX > selectedX) {//is the rook moving left or right
                                direction = -1//left
                                //console.log("left")
                            } else {
                                direction = 1//right
                                //console.log("right")
                            }

                            legalMove = 1


                            if (direction == 1) {//check if something is in the way of right
                                for (let i = oldSelectedX + 1; i < selectedX; i = i + direction) {//now we will check if the rows are free
                                    //console.log(selectedY, i)
                                    //console.log(BourdPositstion[selectedY][i])
                                    if (!(BourdPositstion[selectedY][i]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if (direction == -1) {//check if something is in the way of the left

                                for (let j = oldSelectedX - 1; j > selectedX; j = j + direction) {
                                    //console.log(selectedY, j)
                                    //console.log(BourdPositstion[selectedY][j])
                                    if (!(BourdPositstion[selectedY][j]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if (((absChangeInY >= 1) && (absChangeInX == 0))) {//rook move in the y axis
                            //console.log("rook moves in y")


                            if (selectedY < oldSelectedY) {//we must check if the rook is moving up or down
                                direction = -1//up
                                //console.log("up")
                            } else {
                                direction = 1//down
                                //console.log("down")
                            }

                            legalMove = 1

                            if (direction == 1) {
                                for (let i = oldSelectedY + 1; i < selectedY; i = i + direction) {//now we will check if the colums are free
                                    //console.log(i, selectedX)
                                    //console.log(BourdPositstion[i][selectedX])
                                    if (!(BourdPositstion[i][selectedX]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            } else if (direction == -1) {

                                for (let j = oldSelectedY - 1; j > selectedY; j = j + direction) {
                                    //console.log(j, selectedX)
                                    //console.log(BourdPositstion[j][selectedX])
                                    if (!(BourdPositstion[j][selectedX]) == "") {
                                        //console.log("move illegal")


                                        legalMove = 0
                                    }
                                }
                            }
                            if (pieceColor != defendingColor) {

                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        }
                    } else if ((pieceType == "K")) {//king move
                        if ((absChangeInX < 2) && (absChangeInY < 2)) {//normal move
                            legalMove = 1
                            if (pieceColor != defendingColor) {
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((absChangeInX == 2) && (ChangeInY == 0)) {//attpemet to castle
                            if (oldSelectedX > selectedX) {//is the rook moving left or right
                                direction = -1//left
                                //console.log("left")
                            } else {
                                direction = 1//right
                                //console.log("right")
                            }
                            if (direction == 1) {
                                CastleRook = BourdPositstion[selectedY][selectedX + direction]
                                //console.log(CastleRook)
                            } else if (direction == -1) {
                                CastleRook = BourdPositstion[selectedY][selectedX + (2 * direction)]
                                //console.log(CastleRook)
                            }
                            if (((pieceColor == "W") && (CastleRook == "WR") || ((pieceColor == "B") && (CastleRook == "BR")))) {//is thier a rook next to king
                                if ((moved[oldSelectedY][oldSelectedX] == 0) && (((moved[selectedY][selectedX + direction] == 0) && (direction == 1)) || ((moved[selectedY][selectedX + (2 * direction)] == 0) && (direction == -1)))) {//Has the position of rook and king had no moves happen before
                                    if (((BourdPositstion[oldSelectedY][oldSelectedX + direction] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (2 * direction)] == "") && (direction == 1))
                                        || ((BourdPositstion[oldSelectedY][oldSelectedX + direction] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (2 * direction)] == "") && (BourdPositstion[oldSelectedY][oldSelectedX + (3 * direction)] == "") && (direction == -1))) {
                                        //console.log("can castle")
                                        legalMove = 1
                                        if (pieceColor != defendingColor) {
                                            psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                            squaredraw(legalMove, selectedX, selectedY)

                                        }

                                    }
                                }
                            }
                        }
                    } else if ((pieceType == "P")) {//pawn moves{
                        if ((pieceColor == "B" && ChangeInY == 1 && absChangeInX == 0) && !(defendingColor == "W")) {//black one sqaure advance
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "B" && ChangeInY == 1 && absChangeInX == 1) && (defendingColor == "W")) {//black diaginal attack
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "B" && ChangeInY == 2 && absChangeInX == 0) && (moved[oldSelectedY][oldSelectedX] == 0) && ((BourdPositstion[oldSelectedY + 1][oldSelectedX] == "") && (BourdPositstion[oldSelectedY + 2][oldSelectedX] == ""))) {//black 2 sqaure advasnce
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "B" && ChangeInY == 1 && ChangeInX == 1) && (defendingColor == "") && (BourdPositstion[selectedY - 1][selectedX] == "WP") && (memoryBourdPositstion[selectedY + 1][selectedX])) {//black en passent right
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "B" && ChangeInY == 1 && ChangeInX == -1) && (defendingColor == "") && (BourdPositstion[selectedY - 1][selectedX] == "WP") && (memoryBourdPositstion[selectedY + 1][selectedX])) {//en passent left
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "W" && ChangeInY == -1 && absChangeInX == 0) && !(defendingColor == "B")) {//move forward
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "W" && ChangeInY == -1 && absChangeInX == 1) && (defendingColor == "B")) {//daiginal attack
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "W" && ChangeInY == -2 && absChangeInX == 0) && (moved[oldSelectedY][oldSelectedX] == 0) && ((BourdPositstion[oldSelectedY - 1][oldSelectedX] == "") && (BourdPositstion[oldSelectedY - 2][oldSelectedX] == ""))) {//2 square advance
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "W" && ChangeInY == -1 && ChangeInX == 1) && (defendingColor == "") && (BourdPositstion[selectedY + 1][selectedX] == "BP") && (memoryBourdPositstion[selectedY - 1][selectedX])) {//en passent right
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        } else if ((pieceColor == "W" && ChangeInY == -1 && ChangeInX == -1) && (defendingColor == "") && (BourdPositstion[selectedY + 1][selectedX] == "BP") && (memoryBourdPositstion[selectedY - 1][selectedX])) {//en passent left
                            if (pieceColor != defendingColor) {
                                legalMove = 1
                                psudoMoves(selectedX, selectedY, pieceColor, pieceType, legalMove)
                                squaredraw(legalMove, selectedX, selectedY)

                            }
                        }
                    }

                }

            }
        }
    }
}
