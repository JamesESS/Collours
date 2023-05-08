/* all const for landing page */
const colourWheel = document.getElementById("colourwheel");
const mousePosition = document.getElementById("mouseposition");
const colourOutput = document.getElementById("colouroutput");
const saturation = document.getElementById("saturationslider");
const saturationBackground = document.getElementById("saturationbackground");
const hue = document.getElementById("hueslider");
const hueBackground = document.getElementById("huebackground");
const useRandomColour = document.getElementById("randomcolour");
const useSelectedColour = document.getElementById("selectedcolour");
/* all const for actual colourscheme page */
const containers = document.getElementsByClassName("hsl");
const monochromaticButton = document.getElementById("monochromatic");
const analogousButton = document.getElementById("analogous");
const quadSchemeButton = document.getElementById("square");
const splitComplementaryButton = document.getElementById("splitcomp");

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

/* change saturation and lightness of selected colour */
saturation.addEventListener('input', e => {
    console.log(saturation.value);
    hsl[1] = 100 - saturation.value;
    colourChoice(hsl);
})
hue.addEventListener('input', e => { //should be lightness not hue!! go through and correct in all relevant places
    console.log(hue.value);
    hsl[2] = 100 - hue.value;
    colourChoice(hsl);
})

/* finds coordinates of mouseclick and passes them on to the circle function*/
colourWheel.addEventListener('click',e => { //slightly redundant can combine with circle func
    let cursorX = e.pageX; //save coords of mouseclick
    let cursorY = e.pageY;
    circle(cursorX,cursorY);
})

/* calculates hue from coords of mouseclick */
function circle(cursorX,cursorY) { //Should split this in to mulptiple functions too much happening in here 
    let colourWheelY = colourWheel.offsetTop + colourWheel.parentElement.offsetTop;  //get variables related to circle
    let colourWheelX = colourWheel.offsetLeft + colourWheel.parentElement.offsetLeft;
    let colourWheelHeight = colourWheel.offsetHeight;
    // console.log(colourWheelX,colourWheelY)
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

    /* find angle difference between calculated circumference point */
    let circStartX,circStartY = 0;
    let angleAdjust = 5;
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
    /* Find angle between point clicked on and  relevant quadrant store angle as hue in hsl array*/
    let hypotenus = (circX - midpointX)**2 + (circY - midpointY)**2;
    let opposite = (circStartX - circX)**2 + (circStartY - circY)**2;
    hsl[0] = Math.round(Math.asin(opposite/hypotenus) * (180/Math.PI)) + angleAdjust; //having to add to result to get correct colour? something wrong somehwere!
    colourChoice(hsl);
}

/* outputs the hsl combination selected */
function colourChoice(hsl) {
    colourOutput.style.backgroundColor = String("hsl("+hsl[0]+","+hsl[1]+"%,"+hsl[2]+"%");
    saturationBackground.style.background = "linear-gradient(hsl("+hsl[0]+",100%,"+hsl[2]+"%),hsl("+hsl[0]+",30%,"+hsl[2]+"%))";
    hueBackground.style.background = "linear-gradient(hsl("+hsl[0]+","+hsl[1]+"%,70%),hsl("+hsl[0]+","+hsl[1]+"%,30%))";
}
let selector = 1;
useSelectedColour.addEventListener("click", e => {
    e.target.parentElement.classList.toggle("hidden");
    selector = 0;
    firstScheme(selector);
    selector = 1;
})
useRandomColour.addEventListener("click", e => {
    e.target.parentElement.classList.toggle("hidden");
    selector = 1;
    firstScheme(selector);
    console.log("backhere")
})

monochromaticButton.addEventListener("click",monochromatic);
analogousButton.addEventListener("click",analogous);
quadSchemeButton.addEventListener("click",quadScheme);
splitComplementaryButton.addEventListener("click",splitComplementary);

function firstScheme(selector) {
    containers[0].parentElement.parentElement.classList.toggle("hidden");
    let schemeChoice = Math.floor(Math.random()*4);
    console.log(schemeChoice);
    if (schemeChoice == 1) monochromatic(selector);
    else if (schemeChoice == 2) analogous(selector);
    else if (schemeChoice == 3) quadScheme(selector);
    else splitComplementary(selector);
}

/* function to convert hsl to rgb */
function convertToRGB (hslConv) {
    light = hslConv[2]/100;      //change light to be between 0 & 1
    sat = hslConv[1]/100;          //same for saturation
    //calculate values required for conversion formula
    let hue2 = hslConv[0]/60.0;
    let chroma = (1-Math.abs(2*light-1))*sat;
    let convVal = chroma * (1 - Math.abs(hue2 % 2 - 1));
    let rgbLight = light - chroma/2;
    //match hue2 to appropriate rgb set up
    let rgb = [];  
    if      (0 <= hue2 && hue2 <= 1) rgb = [chroma, convVal, 0];
    else if (1 <= hue2 && hue2 <= 2) rgb = [convVal, chroma, 0];
    else if (2 <= hue2 && hue2 <= 3) rgb = [0, chroma, convVal];
    else if (3 <= hue2 && hue2 <= 4) rgb = [0, convVal, chroma];
    else if (4 <= hue2 && hue2 <= 5) rgb = [convVal, 0, chroma];
    else rgb = [chroma, 0, convVal];
    rgb = rgb.map(n => Math.round((n + rgbLight)*255));
    // console.log(rgb)
    return rgb;
}

/* convert rgb to hex */
function convertToHex(rgb) {
    let hexLookup = {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F',
    }
    let hex = [];
    rgb.forEach(n => {
        let hexCalc = []
        let remainder = n % 16;
        hexCalc.unshift(hexLookup[remainder]);
        // console.log(n,remainder);
        n = Math.floor(n/16);
        // console.log(n)
        remainder = n % 16;
        hexCalc.unshift(hexLookup[remainder]);
        // console.log(n,remainder);
        // console.log(hex)
        hex.push(hexCalc.join(""));
        // console.log(hex)
    });
    return hex;
}

function monochromatic() {
    if (selector === 1) randomColor();
    hsl2 = hsl.slice();
    hsl3 = hsl.slice();
    hsl4 = hsl.slice();
    hsl2[2] += 8;
    hsl3[2] += 16;
    hsl4[2] += 24;
    output();
}

function analogous() {
    if (selector == 1) randomColor();
    hsl2 = hsl.slice();
    hsl3 = hsl.slice();
    hsl4 = hsl.slice();
    hsl2[0] += 25;
    hsl3[0] += 50;
    hsl4[0] += 75;
    if (hsl2[0] > 360) {
        hsl2[0] -= 360;
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl3[0] > 360) {
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl4[0] > 360) hsl4[0] -= 360;
    output();
}

// analogous();

function quadScheme() {
    if (selector == 1) randomColor();
    hsl2 = hsl.slice();
    hsl3 = hsl.slice();
    hsl4 = hsl.slice();
    hsl2[0] += 90;
    hsl3[0] += 180;
    hsl4[0] += 270;
    if (hsl2[0] > 360) {
        hsl2[0] -= 360;
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl3[0] > 360) {
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl4[0] > 360) hsl4[0] -= 360;
    output();
}

function splitComplementary() {
    if (selector == 1) randomColor();
    hsl2 = hsl.slice();
    hsl3 = hsl2.slice();
    hsl2[0] += 180;
    hsl3[0] += 30;
    hsl4 = hsl3.slice();
    hsl4[0] += 180;
    if (hsl2[0] > 360 && hsl3[0]) {
        hsl2[0] -= 360;
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl2[0] > 360) {
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl4[0] > 360) hsl4[0] -= 360;
    output();
}

function output() {
    containers[0].style.backgroundColor = /* "rgb("+convertToRGB(hsl)+")" */ "hsl("+hsl[0]+","+hsl[1]+"%,"+hsl[2]+"%)";
    containers[1].style.backgroundColor = "rgb("+convertToRGB(hsl2)+")";
    containers[2].style.backgroundColor = "rgb("+convertToRGB(hsl3)+")";
    containers[3].style.backgroundColor = "rgb("+convertToRGB(hsl4)+")";
    containers[0].innerText = "RGB: "+convertToRGB(hsl);
    containers[1].innerText = "RGB: "+convertToRGB(hsl2);
    containers[2].innerText = "RGB: "+convertToRGB(hsl3);
    containers[3].innerText = "RGB: "+convertToRGB(hsl4);
}

function randomColor() {
    hsl[0] = Math.round(Math.random()*360);
    // hsl[1] = (Math.random()+0.2)*70;
    hsl[2] = Math.round((Math.random()+0.2)*70);
    console.log("random");
}