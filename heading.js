const colourWheel = document.getElementById("colourwheel");
const mousePosition = document.getElementById("mouseposition");
const colourOutput = document.getElementById("colouroutput");
const saturation = document.getElementById("saturationslider");
const saturationBackground = document.getElementById("saturationbackground");
const hue = document.getElementById("hueslider");
const hueBackground = document.getElementById("huebackground");

let hsl = [0,100,50];
colourWheelConicGradient(hsl[1],hsl[2]); 
colourChoice(hsl);

/* Creates colour wheel where each degree is new hsl colour */
function colourWheelConicGradient(sat,light) {
    let gradient = [];
    for (i = 0; i <= 360; i += 3) {
        gradient.push(String("hsl("+i+", "+sat+"%, "+light+"%)"));
    }
    colourWheel.style.background = "conic-gradient("+gradient+")";
}

saturation.addEventListener('input', e => {
    console.log(saturation.value);
    hsl[1] = 100 - saturation.value;
    colourChoice(hsl);
})
hue.addEventListener('input', e => {
    console.log(hue.value);
    hsl[2] = 100 - hue.value;
    colourChoice(hsl);
})

colourWheel.addEventListener('click',e => {
    let cursorX = e.pageX; //save coords of mouseclick
    let cursorY = e.pageY;
    circle(cursorX,cursorY);
})

/* Should split this in to mulptiple functions too much happening in here */
function circle(cursorX,cursorY) {
    let colourWheelX = colourWheel.offsetTop + colourWheel.parentElement.offsetTop;  //get variables related to circle
    let colourWheelY = colourWheel.offsetLeft + colourWheel.parentElement.offsetLeft;
    let colourWheelHeight = colourWheel.offsetHeight;
    // let colourWheelWidth = colourWheel.offsetWidth;
    let colourWheelRadius = colourWheelHeight/2;
    let adjustedY = cursorY*-1; //change y coordinate to be negative axis
    let adjustedX = cursorX;    //could just use cursorX?

    /* SHOULD SET BOTH MIDPOINTS TO BE WORKED OUT INCLUDING COLOURWHEELX AND Y SO IT STILL WORKS WHEN CIRCLE NOT AT 0,0 */  
    let midpointY = -1*(colourWheelRadius + colourWheelY); //change y coord to be negative axis
    let midpointX = colourWheelX + colourWheelRadius;
    console.log(midpointX,midpointY,colourWheelX,colourWheelY);
    /* gradient = m and yintersect = c where y=mx+c */
    let gradient = (adjustedY-midpointY)/(adjustedX-midpointX);
    let yIntersect = midpointY - gradient*midpointX;
    /*  
    set up for quadratic equation using formula for line intersecting circle (x - h)**2 + (y - k)**2 = r**2
    where h&k are x&y coordinates of midpoint of circle and r is radius of circle
    y is replaced with mx+c
    */
    let coefA = 1+gradient**2;
    let coefB = -2*midpointX + 2*gradient*yIntersect - 2*gradient*midpointY;
    let coefC = midpointX**2 + yIntersect**2 + midpointY**2 - 2*yIntersect*midpointY - colourWheelRadius**2;
    let discriminant = coefB**2 - 4 * coefA * coefC;
    // console.log(coefA,coefB,coefC,discriminant);
    /* quadratic equation result is x coord at circumference then find y coord using y=mx+c */
    let circX,circY = 0;
    if (cursorX >= midpointX) circX = (-coefB + Math.sqrt(discriminant)) / (2 * coefA); //if mouseclick was right of circle midpoint use result 1 of quadratic
    else circX = (-coefB - Math.sqrt(discriminant)) / (2 * coefA);                      //otherwise use result 2
    circY = circX*gradient + yIntersect;  // find y coord at circum using x at circum
    
    /* FOR TESTING REMOVE BEFORE FINAL PUSH */
    // circumPosition.style.top = circY*-1 - 2.5 + "px";
    // circumPosition.style.left = circX - 2.5 + "px";
    /* FOR TESTING REMOVE BEFORE FINAL PUSH */

    /* find angle difference between calculated circumference point */
    let circStartX,circStartY = 0;
    let angleAdjust = 13;
    /* check which quadrant mouseclick was in and set appropriate angle */
    if (adjustedX >= midpointX && adjustedY >= midpointY) {
        circStartX = midpointX;
        circStartY = circY;
    }
    else if (adjustedX >= midpointX) {
        circStartX = circX
        circStartY = midpointY
        angleAdjust += 90;
    }
    else if (adjustedX < midpointX && adjustedY > midpointY) {
        circStartX = circX
        circStartY = midpointY
        angleAdjust += 270;
    }
    else if (adjustedX < midpointX) {
        circStartX = midpointX;
        circStartY = circY;
        angleAdjust += 180;
    }
    let hypotenus = (circX - midpointX)**2 + (circY - midpointY)**2;
    let opposite = (circStartX - circX)**2 + (circStartY - circY)**2;
    hsl[0] = Math.round(Math.asin(opposite/hypotenus) * (180/Math.PI)) + angleAdjust; //having to add to result to get correct colour? something wrong somehwere!
    // angle = Math.round(angle);
    // colourOutput.style.backgroundColor = String("hsl("+angle+",100%,50%");
    // console.log(angle);
    colourChoice(hsl);
}


function colourChoice(hsl) {
    colourOutput.style.backgroundColor = String("hsl("+hsl[0]+","+hsl[1]+"%,"+hsl[2]+"%");
    saturationBackground.style.background = "linear-gradient(hsl("+hsl[0]+",100%,"+hsl[2]+"%),hsl("+hsl[0]+",0%,"+hsl[2]+"%))";
    hueBackground.style.background = "linear-gradient(hsl("+hsl[0]+","+hsl[1]+"%,100%),hsl("+hsl[0]+","+hsl[1]+"%,0%))";
}