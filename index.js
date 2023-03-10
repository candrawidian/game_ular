//******author: Candra Widian******

//the canvas
var c = document.getElementById("c"); 
//context of the canvas; allows us to draw shapes on it
var ctx = c.getContext("2d");
//generates a random number between two numbers
function rand(min, max) {
  return Math.floor((Math.random()*(max-min-1))+min);
}
/*The grass.
See the Background object for how this is formatted
*/
let Grass = {
   name: 'grass',
   type: 'rect', 
   fill: '#7ec850', 
   y: 100, 
   x: 0, 
   width: 300, 
   height: 50
}
/*The sky is a group.
By 'group' I mean it is basically an array of things to be drawn on the canvas.
It basically contains the sky and the clouds.
*/
let Sky = {
  name: 'skyGroup', 
  type: 'group',
  group: [
    {
      name: 'sky', 
      type: 'rect', 
      fill: '#87ceeb',
      y: 0, 
      x: 0, 
      width: 300, 
      height: 100, 
     },     
  ],
  
}
//The score the player has
let Score = {  
    name: "score",                  
    type: "text", 
    x: 260, 
    y: 30,
    font: "Ariel",
    fill: "#000",
    text: "0",
    font_type: "italic",
    font_size: "30px"
}
//The text that says "Game Over"
let GameOver = {
    name: "gameOver",                  
    type: "text", 
    x: 50, 
    y: 60,
    font: "Ariel",
    fill: "#000",
    text: "Game Over",
    font_type: "bold",
    font_size: "40px"
}
//The "Click Game To Restart" text
let EndInstructions = {
    name: "endInstructions",                  
    type: "text", 
    x: 50, 
    y: 120,
    font: "Ariel",
    fill: "#000",
    text: "Click Game To Restart",
    font_type: "bold",
    font_size: "20px"
}
//The opening title of the game
let Title = {  
    name: "title",                  
    type: "text", 
    x: 30, 
    y: 50,
    font: "Ariel",
    fill: "#000",
    text: "Bouncy Block",
    font_type: "bold",
    font_size: "40px"
}
//The text that says "Click The Game To Start"
let Instructions = {
    name: "instructions",
    type: "text",
    x: 39, 
    y: 100,
    font: "Ariel",
    fill: "#000",
    text: "Click The Game To Start",
    font_type: "bold",
    font_size: "20px"
}
//How fast the obstacles move per frame
let velocity = 3;
/*This is a javascript class (I think that is what it is called) that is the obstacles the player must jump over.

It has a method called 'frame' that is run when a frame has happened in the game animation.

Specifically, the obstacle's "x" decreases by the amount of the variable "velocity" for every frame that happens.

It also has a boolean property called 'jumpd', which is true if Avatar has jumped over it.*/
function Obstacle(w, h, v) {
  this.name="obst";
  this.type="rect";
  this.x=300;
  this.y=100-h;
  this.width=w;
  this.height=h;
  this.fill="#000";
  this.jumpd=false;
  this.frame = function() {
    this.x-=velocity;
  }
}
/*Yes. There are now clouds. :)
I was able to create clouds by adding a new type of item to be drawn in the "Background" class, which is 'oval'.
The clouds are randomly generated and move a little frame-by-frame.*/
function Cloud(r, y) {
  this.name="cloud";
  this.type="oval";
  this.x=c.width-100;
  this.y=y;
  this.scale=2;
  this.r=r;
  this.fill='#fff';
  this.frame = function() {
    this.x-=0.5;
  }
}
/*The javascript object that is the block that the player controls.

His name is Bob.

Like the "Obstacle" class, Bob has a frame method. 

This method simply checks if Bob is jumping. If he is, then Bob's y value simply decreases for a bit and eventually increases for a bit until Bob is back on the ground, simulating jumping.*/
const Avatar = {
  name: "bob",
  type: 'rect',
  x: 0,
  y: 80,
  width: 20,
  height: 20,
  fill: '#ff2020',
  jumping: false,
  velocity: 13,
  jump: function() {
    this.jumping=true;
  },
  frame: function() {
    if (this.jumping) {
      if (this.y >= 80 && this.velocity < 0) {
        this.jumping=false;
        this.y=80;      
        this.velocity=13;   
        return;
      }
              this.velocity-=1;
        this.y-=this.velocity;
    
    }
  }
}
/*CloudController is the Javascript object that randomly generates clouds, places them in the 'Sky' group, and moves them frame-by-frame.*/
const CloudController = {
  begin: function() {   
    let between=0;
    let max=100;
    Sky.group.push(new Cloud(rand(10, 15), rand(20, 60)));
    setInterval(function() { 
      
      Background.draw();   
      if (between++ >= max) {
        between=0;
        max=rand(80, 180); 
        Sky.group.push(new Cloud(rand(5, 15), rand(10, 50)));
        }
      Sky.group.forEach(function(v, index){                
        if (v.name=='cloud') {
          if (v.x <= 0-(v.r*v.scale)) {
            Sky.group.splice(index, 1);
          }
          else v.frame();
        }
      });
    }, 20);
  }
}
/* Background is an object I created that draws stuff on the canvas

It contains the stack, which is an array that contains all the things to be drawn on the canvas.

Drawing stuff on the canvas uses a special format I created.

For example, if I wanted to draw a rectangle, the format would be:
var variableName = {
  x: (x value),
  y: (y value),
  width: (rectangle width),
  height: (rectangle height),
  fill: (rectangle color)
}

The usage of the format does not have to be in a javascript object (Ex: Avatar); it can be in a javascript class (Ex: Obstacle).
*/
const Background = {
  stack: [
    Sky,
    Grass,
    Avatar,
    Title,
    Instructions   
  ],
  drawItem: function(thing) {
    if (thing.type == 'rect') {
        ctx.beginPath();
        ctx.fillStyle=thing.fill;
        ctx.fillRect(thing.x, thing.y, thing.width, thing.height);
        ctx.fill();
        ctx.closePath();
      } else if (thing.type == 'text') {
        ctx.fillStyle=thing.fill;
        ctx.font = `${thing.font_type} ${thing.font_size} ${thing.font}`;
        ctx.fillText(thing.text, thing.x, thing.y);
      } else if (thing.type=="oval") {       
        ctx.save() ;
        ctx.beginPath();
        ctx.scale(thing.scale, 1);
        ctx.arc(thing.x, thing.y, thing.r, 0, Math.PI*2);
        ctx.fillStyle=thing.fill;
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (thing.type=="group") {
        thing.group.forEach(function(t) {
          Background.drawItem(t);
        });
      }
  },
  draw: function() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (let thing of this.stack) {
      Background.drawItem(thing);
    }
  }
}
/*GameEngine is the javascript object that controls the game and decides what happens as a result of something else happening.*/
const GameEngine = {
  //startGame is the method that runs when the Avatar moves to the center of the canvas.
  startGame: function() {
    //Makes the Avatar jump when a key has been pressed.
    document.body.onkeyup = () =>{
      Avatar.jump();
    };
    //Makes the Avatar jump when the canvas is clicked.
    /*c.addEventListener ("touchstart", function (event) {
         event.preventDefault ();
         event.stopPropagation ();
         Avatar.jump ();
       });*/
    c.onmousedown=() =>{
      Avatar.jump();
    };
    //j is the variable that increases for every frame. When it becomes the value of 'm', a new Obstacle is added to the stack
    let j = 0;
    let m = 50
    //The animation of the game.
    var interval = setInterval(function() {
      //next frame of the Avatar
      Avatar.frame(); 
      //adds new Obstacle to stack when j equals m and resets "m" to a random value
      if (j++ >=m) {
        j=0;
        m = rand(50, 90);
        Background.stack.push(new Obstacle(rand(10, 22), rand(20, 34)));
      }
    //Checking every item of the stack
    Background.stack.forEach((thing, index) => {
        //if it is an obstacle
        if (thing.name == "obst") {
          //removes obstacle if it is not visible anymore
          if (thing.x+thing.w <= 0) {
            Background.stack.splice(index, 1);
          }
          //if the Avatar is colliding with obstacle
          else if (Avatar.y+20>=thing.y&&Avatar.x<=thing.x+thing.width&&Avatar.x+20>=thing.x) {
            
            Background.draw();
            //stops animation
            clearInterval(interval);
            //game over :(
            GameEngine.gameOver();
          } 
          //if the obstacle hasn't been jumped over yet, but Avatar has successfully jumped over it
          else if (!thing.jumpd && Avatar.x>thing.x+thing.width) {
            //proves that obstacle has been jumped over
            thing.jumpd=true;
            //increases score by 1
            Score.text=`${Number(Score.text)+1}`;
            //makes Avatar color a random shade of red
            Avatar.fill="rgb("+rand(100, 255)+", 0, 0)";
          } 
          //does one frame of the obstacle
          else thing.frame();
        }
      });
      //draws Background
      Background.draw();
    }, 30);
  },
  readyGame: function() {
    //makes sure user can't jump when Avatar is moving to center of canvas
    c.onmousedown=()=>{}
    document.body.onkeyup=()=>{} 
    //removes the opening title and instructions if they are present in stack
    if (Background.stack[Background.stack.length-1].name=="instructions") {          
      Background.stack.pop();
      Background.stack.pop();
    }
    //puts the score on the canvas
    Background.stack.push(Score);
    //puts Avatar at the left end of the canvas
    Avatar.x=0;
    Avatar.y=80;
    //animation that moves Avatar to middle of canvas
    var i = setInterval(function() {
      Background.draw();
      Avatar.x+=10;
      if (Avatar.x >= 130) {
        clearInterval(i);
        //starts game
        GameEngine.startGame();
      }
    }, 50);
  },
  /*gameOver is the function that is run when Avatar collides with an obstacle*/
  gameOver: function() {
    //places game over text on the canvas
    Background.stack.push(GameOver);
    Background.stack.push(EndInstructions);
    //draws Background
    Background.draw();
    //restarts game when canvas is clicked
    c.onmousedown = function()  {
      c.onmousedown=()=>{}
      //resets background   
      Background.stack = [
        Sky,
        Grass,
        Avatar,
        Score
      ];
      //resets score
      Score.text="0";
      
      //readies game
      GameEngine.readyGame();
    }
  },
  /*startPage is the function that is called when the game first loads.
  
  It uses a simple algorithm to have the game title blink black and red.
  
  There is a variable 'k', whose value is 1. When there is an animation frame, the algorithm checks if the value is 1. If so,   the color of the title is changed to red and k is changed to 2. Then if k is 2, the title color gets changed to black and k becomes 1.*/
  startPage: function() {
     CloudController.begin();
     let k = 1;
     let interval=setInterval(()=> {
      if (k == 1) {
        k=2;
        Background.stack[3].fill="#fc2020";      
      } else {
        k=1;
        Background.stack[3].fill="#000";    
      }
      Background.draw();
    }, 500);
    //If the canvas is clicked, the title stops blinking and the GameEngine readies the game.
    c.onmousedown = function() {
      clearInterval(interval);    
      GameEngine.readyGame();
    }
    //The Background is drawn
    Background.draw();   
  }
}
//Starts the starting page
GameEngine.startPage();