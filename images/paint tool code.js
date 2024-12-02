

//*********************************************************************************************************************************************************** */
//GLOBAL VAR
let buttons = []; // Array to store button objects
let cursorSize = 10; //Initial cursor size
let drawingMode = false; //Initially drawing mode is off so that when clicking the mouse it becomes true
let trail = [];// Array to make the trail
let currentColor = [0, 0, 0,]; //Way overused color variable, can't believe it didn't break. syncs with the button colors
let state = 1; //State based on key press
let dustBrush; //PNG brush

//*********************************************************************************************************************************************************** */
function preload() {
  // Load the image from the adjacent folder
  dustBrush = loadImage("assets/dustStamp.png");
}
//*********************************************************************************************************************************************************** */
function setup() {
  cvs = createCanvas(1420, 800); //If stuff works, this size doesnt matter
  background(220);
  //noCursor(); //Hide real cursor, not turned on because replacement cursor doesnt work with no redrawing bgc
  cvs.mousePressed(HXmultiMouse); //Mouse lick only works within canvas not sure if this is actually needed
//___________________________________________________________________________________________________________________________________
  //Making button graphics, invisible unless called in draw
  for (let i = 0; i < 6; i++) {
    let xLocation = 10 + i * 60; // xLocation is 10 px from left, also setting each button 60 px apart
    let button = {
      x: xLocation,         // X-coordinate of the button
      y: height - 60,       // Y-coordinate of the button, 60 pixels above the bottom 10 px space 
      width: 50,           // Width of the button
      height: 50,           // Height of the button
      //label: 'Button ' + (i + 1), // Label of the button and a number
      //color: color(200, 50, 50)   // Color of the button
    };
    if (i === 0) {
      button.label = "Red";
      button.color = color(174, 38, 38); // Red
    } else if (i === 1) {
      button.label = "Blue";
      button.color = color(103, 183, 219); // Green
    } else if (i === 2) {
      button.label = "Yellow";
      button.color = color(219, 215, 103); // Blue
    } else if (i === 3){
      button.label = "White";
      button.color = color(220, 220, 220); //white
    } else if (i === 4){
      button.label = "Black";
      button.color = color(50,50,50); //Black
    } else if (i === 5){
      button.label = "Size" + cursorSize; 
      button.color = color(100,100,100);
      button.strokeColor = color(0); //Shows cursor size as a number
    }
    buttons.push(button); // Still not sure what push means
  }
}
//End of Setup
//**************************************************************************************************************************************************************** */
function draw() {
  //Random number
  let rd1 = random(0,255);
  let rd2 = random(0,255);
  let rd3 = random(0,255);
  stroke(0);
  strokeWeight(12); 
  noFill();
  rect(0, 0, width, height);

//______________________________________________________________________________________________________________________________________________________________
if (keyIsPressed) {
    if (key === ']') {
      cursorSize += 1;
    } else if (key === '[') {
      cursorSize = max(1, cursorSize - 1);
    } else if (key === 'p'){
      clear_print();
    }
  }
  console.log(cursorSize)
  //Define state function based on key press
  //Could of should of used switch case here but i wrote this already
  //Pretend it looks cool ok?????
  //Pen 1 effect (regular brush)
          if (state === 1 && drawingMode) {
            //this block allow the trail to be drawn over the background loop
            HX_Pen_1();
          }
          // pen 2 effect (sketchy)
          else if (state === 2 && drawingMode) {
            HX_Pen_2();    
          }
          // pen 3 effect (action line brush)
          else if (state === 3 && drawingMode) {
            HX_Pen_3();
          //pen 4 effect (dust brush) using a circular PNG 
          } else if (state == 4 && drawingMode){
            HX_Pen_4();
          //pen 5 effect (word bubble)
          } else if (state == 5 && drawingMode){
            HX_Pen_5();
            
          }

  //__________________________________________________________________________________________________________________
  // Drawing the buttons
  for (let i = 0; i < buttons.length; i++) {
    //Drawing button rectangle
    fill(buttons[i].color);
    noStroke();
    rect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height);
    //Drawing button lables
    fill(255,255,0);
    stroke(0, 0, 0);
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    // Update the label of the 6th button
    if (i === 5) {
      buttons[i].label = "Size " + cursorSize;
      fill(255);
      stroke(buttons[i].strokeColor);
      strokeWeight(5)
      rect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height);
    }
    text(buttons[i].label, buttons[i].x + buttons[i].width / 2, buttons[i].y + buttons[i].height / 2);
  }
 }
//End of Draw
//*************************************************************************************************************************************************************************************** */
//Begin of key and mouse functions, renamed to avoid potiential issues with using the same defult function
//Luckily issues didn't come up but i'm also too lazy to name them all back
function HXmultiMouse() {
  //key press enters state
  if (key === '1') {
    state = 1;
  } else if (key === '2') {
    state = 2;
  } else if (key === '3') {
    state = 3;
  } else if (key === '4') {
    state = 4;
  } else if (key === '5') {
    state = 5;
  // } else {
  //   state = 0;
  // this stupid piece of code messed so much up just by returning the state to 0 when i changed cursor size
  // canot remember why I wanted this to happen in the first place, keeping it here as reminder
   }
//end of HXmultiMouse  
}
//____________________________________________________________________________________________________________________
function HXmousePressed() {
  let inBound = true;
  // Start a new drawing when the mouse is pressed
  if (!drawingMode) {
    trail = [];
  }
  drawingMode = true;
  //this makes it so when the button is clicked, its function is called
  for (let i = 0; i < buttons.length; i++) { //for loop checks which button is clicked
    if (mouseX > buttons[i].x && //checks the right of left edge//
        mouseX < buttons[i].x + buttons[i].width && //checks the left of right edge
        mouseY > buttons[i].y && //checks below the top edge
        mouseY < buttons[i].y + buttons[i].height) { //check above the bottom edge
      // Call the function corresponding to the clicked button
      HXbuttonActions(i);
      //marking the buttons as out of bounds
      inBound = false;
    }
  }
  //this says to not draw anything while the mouse is over the buttons. also making the effectively a higher layer than everyting else
  if (!inBound){
    drawingMode = false;
  }

}
  //making mouse pressed a custom function rather than using the P5 built in function
function mousePressed() {
  HXmousePressed();
}
//___________________________________________________________________________________________________________________________________
function HXmouseDragged() {

  // Add the current mouse position, cursor size, and color to the trail when the mouse is dragged
//   let newPoint = { 
//     x: mouseX,
//     y: mouseY,
//     size: cursorSize,
//     color: currentColor.slice()
//   };
// trail.push(newPoint);
  trail.push({ x: mouseX, y: mouseY, size: cursorSize, color: currentColor.slice() })
}
function mouseDragged() {
  HXmouseDragged();
}
//__________________________________________________________________________________________________________________________________
function HXmouseReleased() {
  // Finish the current drawing when the mouse is released
  drawingMode = false;
}
function mouseReleased() {
  HXmouseReleased();
}
//___________________________________________________________________________________________________________________________________
function HXbuttonActions(buttonNumber) {
  
    // Define actions for each button
    // Using switch/case as alternative to if else
    switch (buttonNumber) {
      case 0:
        // Action for the first button
        currentColor = [174, 38, 38]; // current to red
        console.log("Button 1 (Red) clicked");
        break;
      case 1:
        // Action for the second button
        currentColor = [103, 183, 219]; // current to blue
        console.log("Button 2 (Blue) clicked");
        break;
      case 2:
        // Action for the third button
        currentColor = [219, 215, 103]; // current to yellow
        console.log("Button 3 (Yellow) clicked");
        break;
      case 3:
        // Action for the fourth button
        currentColor = [220]; // current to white
        console.log("Button 4 (White) clicked");
        break;
      case 4:
        // Action for the fifth button
        currentColor = [50]; // current to black
        console.log("Button 5 (Black) clicked");
        break;
    }
    if (drawingMode) {
      stroke(currentColor);
      fill(currentColor, 30);
      ellipse(mouseX, mouseY, cursorSize, cursorSize);
      //noStroke();
  
      for (let i = 1; i < trail.length; i += 1) {
        fill(trail[i].color);
        ellipse(trail[i].x, trail[i].y, trail[i].size, trail[i].size);
      }
    }
  }
function clear_print() {
   // these 2 options let you choose between clearing the background
   // and saveing the current image as a file.
   //not sure how this actually works, doesn't seem to do anything other than returning data in consol
   if (key == 'x' || key == 'X') {
     background(255);
     } else if (key == 'p' || key == 'P') {
     saveFrames('paintImage', 'png', 1, 25, data => {
     print(data);
      });
         //this will save the name as the intials and a random counting number.
         // it will always be larger in value then the last one.
         //delay(100);
      }
    }
//******************************************************************************************************************************************** */
//Custom pen functions
function HX_Pen_1() {
            stroke(currentColor);
            fill(currentColor,30)
            ellipse(mouseX, mouseY, cursorSize, cursorSize);
            noStroke();
            for (let i = 1; i < trail.length; i+=1) {
            fill(trail[i].color);
            ellipse(trail[i].x, trail[i].y, trail[i].size, trail[i].size);
            }  
}
function HX_Pen_2() {
  beginShape();
            fill(255, 0)
            stroke(currentColor)
            for (let i = 0; i < trail.length; i++) {
            let jitterX = random(-5, 5); // Adjust the range as needed
            let jitterY = random(-5, 5); // Adjust the range as needed
            vertex(trail[i].x + jitterX, trail[i].y + jitterY);
            }
            endShape(); 
}
function HX_Pen_3() {
            beginShape();
            stroke(currentColor);
            strokeWeight(cursorSize);
            line(0, 0, mouseX, mouseY);
}
function HX_Pen_4() {
            //let imgX = mouseX - dustBrush.width / 2;
            //let imgY = mouseY - dustBrush.height / 2;
            let imgX = mouseX - cursorSize / 2;
            let imgY = mouseY - cursorSize / 2;
            tint(255, 10);
            //let newHeight = (cursorSize / dustBrush.width) * dustBrush.height;
            //dustBrush.resize(cursorSize, newHeight);
            // Display the image at the centered position
            image(dustBrush, imgX, imgY, cursorSize+50, cursorSize+50);
            noTint();
          //pen 5 effect (bubble)
}
function HX_Pen_5() {
            beginShape();
            for (let i = 0; i < trail.length; i += 1) {
              //stroke(rd3,rd1,rd2);
              //fill(rd1,rd2,rd3);
              stroke(currentColor);
              fill(250, 250, 250);
              strokeWeight(trail[i].size); // Adjust the size as needed
              vertex(trail[i].x, trail[i].y);
            }
            endShape();
}

// function keyPressed() {
//   // Change cursor size when '[' or ']' keys are pressed
//   if (keyCode === 219) { // '[' key
//     cursorSize -= 5;
//     cursorSize = max(cursorSize, 1); // Ensure the size doesn't go below 5
//   } else if (keyCode === 221) { // ']' key
//     cursorSize += 5;
//     cursorSize = min(cursorSize, 500); // Ensure the size doesn't exceed 50
//   }
//   trail.push({ x: mouseX, y: mouseY, size: cursorSize, color: currentColor.slice() })
  
// }