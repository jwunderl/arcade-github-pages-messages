controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (myPlayer.overlapsWith(twitchTarget) && game.ask("Do you want to watch our twitch?")) {
        parentFrame.sendMessage("opentwitch", "msmakecode")
    }
})
parentFrame.onReceiveMessage("userinput", function (message) {
    myPlayer.sayText(message)
})
let currentlyOn: Image = null
let myPlayer: Sprite = null
let twitchTarget: Sprite = null
tiles.setCurrentTilemap(tilemap`level1`)
twitchTarget = sprites.create(img`
    . . . b b b b b b b b b . . . . 
    . . b 1 d d d d d d d 1 b . . . 
    . b 1 1 1 1 1 1 1 1 1 1 1 b . . 
    . b d b c c c c c c c b d b . . 
    . b d c 6 6 6 6 6 6 6 c d b . . 
    . b d c 6 d 6 6 6 6 6 c d b . . 
    . b d c 6 6 6 6 6 6 6 c d b . . 
    . b d c 6 6 6 6 6 6 6 c d b . . 
    . b d c 6 6 6 6 6 6 6 c d b . . 
    . b d c c c c c c c c c d b . . 
    . c b b b b b b b b b b b c . . 
    c b c c c c c c c c c c c b c . 
    c 1 d d d d d d d d d d d 1 c . 
    c 1 d 1 1 d 1 1 d 1 1 d 1 1 c . 
    c b b b b b b b b b b b b b c . 
    c c c c c c c c c c c c c c c . 
    `, SpriteKind.Player)
myPlayer = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . b 5 5 b . . . 
    . . . . . . b b b b b b . . . . 
    . . . . . b b 5 5 5 5 5 b . . . 
    . b b b b b 5 5 5 5 5 5 5 b . . 
    . b d 5 b 5 5 5 5 5 5 5 5 b . . 
    . . b 5 5 b 5 d 1 f 5 d 4 f . . 
    . . b d 5 5 b 1 f f 5 4 4 c . . 
    b b d b 5 5 5 d f b 4 4 4 4 b . 
    b d d c d 5 5 b 5 4 4 4 4 4 4 b 
    c d d d c c b 5 5 5 5 5 5 5 b . 
    c b d d d d d 5 5 5 5 5 5 5 b . 
    . c d d d d d d 5 5 5 5 5 d b . 
    . . c b d d d d d 5 5 5 b b . . 
    . . . c c c c c c c c b b . . . 
    `, SpriteKind.Player)
myPlayer.setStayInScreen(true)
tiles.placeOnTile(twitchTarget, tiles.getTileLocation(9, 6))
controller.moveSprite(myPlayer)
forever(function () {
    currentlyOn = tiles.tileImageAtLocation(myPlayer.tilemapLocation())
    if (currentlyOn.equals(sprites.castle.tileGrass2)) {
        parentFrame.sendMessage("location", "grass")
    } else if (currentlyOn.equals(sprites.castle.tileDarkGrass2)) {
        parentFrame.sendMessage("location", "dark grass")
    } else if (currentlyOn.equals(sprites.dungeon.darkGroundCenter)) {
        parentFrame.sendMessage("location", "dirt")
    } else if (currentlyOn.equals(sprites.dungeon.floorLight0)) {
        parentFrame.sendMessage("location", "tile")
    }
})
