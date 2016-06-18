//console.log("Hello Workshop Juni 2016!");

// canvas element in javascript hinein:

//var canvasEl =document.getElementsByTagName('canvas')[0]  ---[0] das erste Element

var GRID_SIZE = 20;  // unten überall wo 20 steht, wird mit GRID_SIZE ersetzt.

var canvasEl =document.querySelector('canvas');

//Höhe und Breite setzen:
canvasEl.width = 500;
canvasEl.height = 500;
canvasEl.style.backgroundColor = 'navy';         //Hintergrundfarbe , mit style kann ich css Eigenschaft manipulieren
canvasEl.style.display = 'block';                // es muss vorhanden sein, damit sich canvas zentriert, es kommt in kombination mit der nächsten zeile
canvasEl.style.margin = '0 auto';                //Canvas (blaue Bild) zentrieren
//canvasEl.style.float = 'right';                // Canvas ganz nach rechts 

//LINIEN MALEN
var context = canvasEl.getContext ('2d');


function drawGrid(){
		//Linienfarbe aussuchen:
		context.strokeStyle = 'white';                   //stroke heißt strich; Alternative Schreibweisen: #ffffffff #fff rgb(255, 255, 255) rgba(255, 255, 255, .5)

		//vertikale Linien, Schleife
		for (var x = GRID_SIZE; x < canvasEl.width; x += GRID_SIZE) {  //weil x als variablenname verwende

		//Linie malen: x achse
		context.beginPath();                             //Pfad anfangen, als würde ich mit der Hand malen
		context.moveTo(x - 0.5, 0);                      //20 pixel; - 0.5 abziehen, damit der Browser weiß...??? (R*)
		context.lineTo(x - 0.5, canvasEl.height);        //500, weil 500 ist das canvas element
		context.closePath();
		context.stroke();                                //male jetzt mit dem Stift. Erst jetzt wird sich die Linie zeichen. 
		}

		//horisontale Linien, Schleife
		for (var y = GRID_SIZE; y < canvasEl.height; y += GRID_SIZE) {  //weil y als variablenname verwende

		//Linie malen: y achse
		context.beginPath();                             //Pfad anfangen, als würde ich mit der Hand malen
		context.moveTo(0, y - 0.5);                      //20 pixel; - 0.5 abziehen, damit der Browser weiß...??? (R*)
		context.lineTo(canvasEl.width, y - 0.5);         //500, weil 500 ist das canvas element
		context.closePath();
		context.stroke();                                //male jetzt mit dem Stift. Erst jetzt wird sich die Linie zeichen. 
		}
}

//Schlange zeichnen - Rechteck definieren
var SNAKE_COLOR = 'orange';
//liste von elementen machen
var SNAKE = [    								 //Objekte in JavaScript macht man nur mit {}. Es reicht nur das {} zu schreiben und der Objekt ist schon da.  
{   								   			 //erster Schlangenteil = Footer
	x: 0,
	y: 0

},
{  											     //zweiter Schlangenteil
	x: GRID_SIZE,
	y: 0
},
{  										         //letzter Schlangenteil = Header (Schlangenkopf)
	x: 2 * GRID_SIZE,
	y: 0
	}
];

//#############################################
//Essen für die Schlange einbauen

function randomX() {
	var seed = Math.random(); //Zufallszahl zwischen 0.0 und 1.0
	var maxWidth = canvasEl.width;
	
	return Math.floor((maxWidth / GRID_SIZE) * seed) * GRID_SIZE;
}	

function randomY() {
	var seed = Math.random(); //Zufallszahl zwischen 0.0 und 1.0
	var maxHeight = canvasEl.height;
	
	return Math.floor((maxHeight / GRID_SIZE) * seed) * GRID_SIZE;
}	
	//Essen generieren - weiter unten im Code
	var ESSEN = {
		x: randomX(),
		y: randomY()
	};
	
	
//##############################################
//Keycode, Tastaturnummern
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var LEFT = 37
var DIRECTION = RIGHT; //groß geschrieben, weil Konstanten sind und sie werden nicht verändert. Es ist nur fürs Auge, damit es schön übersichtlich ist. 

window.addEventListener('keyup', function(event){
	switch(event.keyCode) {
		case UP:
			DIRECTION = UP;
			break;
		case DOWN:
			DIRECTION = DOWN;
			break;
		case LEFT:
			DIRECTION = LEFT;
			break;
		case RIGHT:
			DIRECTION = RIGHT;
			break;
		default:                           
			break;
	}
  }
)

	
//#################################################################################################	
	
//Bewegung für die Schlange
//time Schleife:
var gamespeed = 250; //
function gameManager() {
        //das gesamte Spielfeld löschen:
		context.clearRect(0, 0, canvasEl.width, canvasEl.height);		
		
		//hier drawGrid funktion
		drawGrid();
		
		//Schlange bewegen
		var newHead = SNAKE.shift();                            // aus dem Array ausschneiden/shift
		var oldHead = SNAKE[SNAKE.length - 1];                  // 
		
		if (DIRECTION === RIGHT){
			newHead.x = oldHead.x + GRID_SIZE;
			newHead.y = oldHead.y;
		} else if (DIRECTION === LEFT) {
			newHead.x = oldHead.x - GRID_SIZE;
			newHead.y = oldHead.y;
		} else if (DIRECTION === UP) {
			newHead.y = oldHead.y - GRID_SIZE;
			newHead.x = oldHead.x;
		} else if (DIRECTION === DOWN) {
			newHead.y = oldHead.y + GRID_SIZE;
			newHead.x = oldHead.x;
		}

        //auch rotieren von wand
		if (newHead.x + GRID_SIZE > canvasEl.width) {  //für wenn die schlange nach rechst in die wand geht
			newHead.x = 0;                             //für wenn die schlange nach rechts in die wand geht
		}
		if (newHead.x <0){
			newHead.x = canvasEl.width - GRID_SIZE;    //für nach links in die weil
		}
		if (newHead.y + GRID_SIZE > canvasEl.height) {
			newHead.y = 0;
		}	
		if (newHead.y <0){
			newHead.y = canvasEl.height - GRID_SIZE;
		}
		
		SNAKE.push(newHead);
		
		
		//Anfang Bounding Box Collisionsabfrage (AABB)
		
		if (newHead.x < (ESSEN.x + GRID_SIZE / 2) && newHead.x + GRID_SIZE > (ESSEN.x + GRID_SIZE / 2)){
			
			if (newHead.y < (ESSEN.y + GRID_SIZE / 2) && newHead.y + GRID_SIZE > (ESSEN.y + GRID_SIZE / 2)) {
				var newPart = {
					x: SNAKE[0].x,
					y: SNAKE[0].y
				};
				SNAKE.unshift(newPart);                         // unshift ist 'vorne dran hängen'
				ESSEN = {
					x: randomX(),
					y: randomY()
				};
				
				clearInterval(gameloop);
				gamespeed -= 20;
				gameloop = setInterval(gameManager, gamespeed)
			}
		}
		
		
		//Ende Bounding Box Collisionsabfrage (AABB)
		
		//Schlange zeichen
		context.fillStyle = SNAKE_COLOR;                     	//hier in {} kommen alle Beschreibungen für die Schlange
		for (var i = 0; i < SNAKE.length; i += 1) {
			var part = SNAKE[i];
			context.fillRect(
				part.x,
				part.y,
				GRID_SIZE,
				GRID_SIZE
			);
			
		}
		// Essen generieren
		context.fillStyle = 'lime';
		context.beginPath();
		context.arc(
			ESSEN.x + GRID_SIZE / 2,
			ESSEN.y + GRID_SIZE / 2,
			GRID_SIZE / 3,
			0, //von wo fange ich mit zeichnen an
			2 * Math.PI,
			false //Im Uhrzeigersinn			
		);
		context.closePath();
		context.fill();
		
}
var gameloop = setInterval(gameManager, gamespeed);











