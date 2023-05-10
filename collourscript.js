/* all const for landing page */
const colourWheel = document.getElementById("colourwheel");  //colour wheel
const colourOutput = document.getElementById("colouroutput"); //outputs result colour from colour wheel and sliders
const saturation = document.getElementById("saturationslider"); //slider for saturation
const saturationBackground = document.getElementById("saturationbackground"); //controls background gradient for saturation slider
const hue = document.getElementById("hueslider");   //slider to control lightness (need to go through all files and correct hue to light)
const hueBackground = document.getElementById("huebackground"); //controls background gradient for lightness slider  (need to go through all files and correct hue to light)
const useRandomColour = document.getElementById("randomcolour"); //use random colour button
const useSelectedColour = document.getElementById("selectedcolour"); //use selected colour button
/* all const for actual colourscheme page */
const containers = document.getElementsByClassName("hsl"); //colour outputs
const monochromaticButton = document.getElementById("monochromatic"); //monochromatic button
const analogousButton = document.getElementById("analogous"); //analgous button
const quadSchemeButton = document.getElementById("square"); //square button
const splitComplementaryButton = document.getElementById("splitcomp");  //split complementary button

const lockColours = document.getElementsByClassName("lock"); //colour lock buttons
const dropContainer = document.getElementById("dropcontainer"); //drop down container
const colourDropdownButton = document.getElementById("dropdowncolour"); //drop down menu
const dropContent = document.getElementsByClassName("dropdowncitem"); //drop down buttons


class colourconstruct {
    constructor(hsl,locked) {
        this.hsl = hsl;
        this.locked = locked;
    }
    get rgb() {
        return convertToRGB(this.hsl);
    }
    get hex() {
        return convertToHex(this.rgb);
    }
    get luminance() {
        return findRelativeLum(this.rgb)
    }
    get contrastWhite() {
        return (Math.round((1 + 0.05)/(this.luminance + 0.05)*100))/100;
    }
    get contrastBlack() {
        return (Math.round(((this.luminance + 0.05)/(0 + 0.05)*100))/100);
    }
}

/* initialise all four colours */
const colours = [];
for (i = 0; i < 4; i++){
    colours.push(new colourconstruct([0,100,50],false))
}

let outputType = 0; //controls how colour codes are displayed

colourWheelConicGradient(colours[0].hsl[1],colours[0].hsl[2]);  //creates background gradient for colour wheel
colourChoice(colours[0].hsl);   //output initial colour choice

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
    // console.log(saturation.value);
    colours[0].hsl[1] = 100 - saturation.value;
    colourChoice(colours[0].hsl);
})
hue.addEventListener('input', e => { //should be lightness not hue!! go through and correct in all relevant places
    // console.log(hue.value);
    colours[0].hsl[2] = 100 - hue.value;
    colourChoice(colours[0].hsl);
})

/* finds coordinates of mouseclick and passes them on to the circle function*/
colourWheel.addEventListener('click',e => { //slightly redundant can combine with circle func
    let cursorX = e.pageX; //save coords of mouseclick
    let cursorY = e.pageY;
    circle(cursorX,cursorY);
})

/* calculates hue from coords of mouseclick */
function circle(cursorX,cursorY) { //Should split this in to mulptiple functions too much happening in here and tidy up could condense this code a bit
    let colourWheelY = colourWheel.offsetTop + colourWheel.parentElement.offsetTop;  //get y coord(*-1) for the topmost point of circle
    let colourWheelX = colourWheel.offsetLeft + colourWheel.parentElement.offsetLeft; //get x coord for leftmost point of circle
    let colourWheelHeight = colourWheel.offsetHeight;
    // console.log(colourWheelX,colourWheelY)
    let colourWheelRadius = colourWheelHeight/2;
    let adjustedY = cursorY*-1; //change y coordinate to be negative axis
    let adjustedX = cursorX;    //could just use cursorX?
    let midpointY = -1*(colourWheelRadius + colourWheelY); //change y coord to be negative axis
    let midpointX = colourWheelX + colourWheelRadius;
    // console.log(midpointX,midpointY,colourWheelX,colourWheelY);
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
    colours[0].hsl[0] = Math.round(Math.asin(opposite/hypotenus) * (180/Math.PI)) + angleAdjust; //having to add to result to get correct colour? something wrong somehwere!
    // console.log(colours[0].hsl);
    colourChoice(colours[0].hsl);
}

/* outputs the hsl combination selected */
function colourChoice(hsl) {
    colourOutput.style.backgroundColor = String("hsl("+hsl[0]+","+hsl[1]+"%,"+hsl[2]+"%");
    saturationBackground.style.background = "linear-gradient(hsl("+hsl[0]+",100%,"+hsl[2]+"%),hsl("+hsl[0]+",30%,"+hsl[2]+"%))";
    hueBackground.style.background = "linear-gradient(hsl("+hsl[0]+","+hsl[1]+"%,70%),hsl("+hsl[0]+","+hsl[1]+"%,30%))";
}

/* Moves from landing page to scheme page */
useSelectedColour.addEventListener("click", e => {
    e.target.parentElement.classList.toggle("hidden");
    colours[0].locked = true;
    randomScheme();
    colours[0].locked = false;
})
useRandomColour.addEventListener("click", e => {
    e.target.parentElement.classList.toggle("hidden");
    randomScheme();
    // console.log("backhere")
})

monochromaticButton.addEventListener("click",monochromatic);
analogousButton.addEventListener("click",analogous);
quadSchemeButton.addEventListener("click",quadScheme);
splitComplementaryButton.addEventListener("click",splitComplementary);

/* selects a random scheme from the four available */
function randomScheme() {
    if (containers[0].parentElement.parentElement.classList.contains("hidden")) containers[0].parentElement.parentElement.classList.toggle("hidden");
    let schemeChoice = Math.floor(Math.random()*4);
    // let schemeChoice = 1; //for testing
    if (schemeChoice == 1) monochromatic();
    else if (schemeChoice == 2) analogous();
    else if (schemeChoice == 3) quadScheme();
    else splitComplementary();
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
    return hex
}
/* find relative luminance from rgb */
function findRelativeLum(rgb) {
    let convertConstants = [0.2126,0.7152,0.0722]; //constants used in conversion taken from -https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    let decimalPlaces = 10**4;  //used to round to x decimal places where x is the the power
    let sRGB = rgb.map(x => x/255);
    sRGB.forEach((x, i) => {
        if (x <= 0.03928) sRGB[i] = x/12.92;
        else sRGB[i] = ((x+0.055)/1.055)**2.4;
    });
    let luminance = sRGB.reduce((sum, curr, index) => {
        sum = (sum + curr*convertConstants[index])*(decimalPlaces);
        return (Math.round(sum))/(decimalPlaces);
    },0);
    // console.log(Math.round(luminance))/(decimalPlaces);
    return luminance;
}

/* Colour scheme generators */
function monochromatic() { //only changes lightness when generating lightness in random or splashscreen it's capped so this function should never output lightness>100 for any colours
    if (!colours[0].locked) randomColor();
    spliceColours();
    colours[1].hsl[2] += 8;
    colours[2].hsl[2] += 16;
    colours[3].hsl[2] += 24;
    output();
}
function analogous() {
    if (!colours[0].locked) randomColor();
    spliceColours();
    colours[1].hsl[0] += 25;
    colours[2].hsl[0] += 50;
    colours[3].hsl[0] += 75;
    if (colours[1].hsl[0] > 360) {
        colours[1].hsl[0] -= 360;
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[2].hsl[0] > 360) {
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[3].hsl[0] > 360) colours[3].hsl[0] -= 360;
    output();
}
function quadScheme() {
    if (!colours[0].locked) randomColor();
    spliceColours();
    colours[1].hsl[0] += 90;
    colours[2].hsl[0] += 180;
    colours[3].hsl[0] += 270;
    if (colours[1].hsl[0] > 360) {
        colours[1].hsl[0] -= 360;
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[2].hsl[0] > 360) {
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[3].hsl[0] > 360) colours[3].hsl[0] -= 360;
    output();
}
function splitComplementary() {
    if (!colours[0].locked) randomColor();
    spliceColours();
    colours[1].hsl[0] += 180;
    colours[2].hsl[0] += 30;
    colours[3].hsl[0] += 210;
    if (colours[1].hsl[0] > 360 && colours[2].hsl[0] > 360) {
        colours[1].hsl[0] -= 360;
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[1].hsl[0] > 360) {
        colours[1].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[2].hsl[0] > 360) {
        colours[2].hsl[0] -= 360;
        colours[3].hsl[0] -= 360;
    }
    else if (colours[3].hsl[0] > 360) colours[3].hsl[0] -= 360;
    output();
}

/* sets background colour based on colours and outputs the colour code in hsl to innertext */
function output() {
    colours.forEach((colour, index) => {
        // console.log(colour.hsl);
        containers[index].style.backgroundColor = "hsl("+colour.hsl[0]+", "+colour.hsl[1]+"%, "+colour.hsl[2]+"%)" ;
        if (outputType == 1) {
            containers[index].children[0].innerText = "RGB: "+colour.rgb;
            containers[index].children[1].innerText = "RGB: "+colour.rgb;
        }
        else if (outputType == 2) {
            containers[index].children[0].innerText = "HEX: #"+colour.hex.join('');
            containers[index].children[1].innerText = "HEX: #"+colour.hex.join('');
        }
        else if (outputType == 3) {
            containers[index].children[0].innerText = "Contrast on black: "+colour.contrastBlack;
            containers[index].children[1].innerText = "Contrast on white: "+colour.contrastWhite;
        }
        else {
            containers[index].children[0].innerText = "HSL: "+colour.hsl[0]+", "+colour.hsl[1]+"%, "+colour.hsl[2]+"%";
            containers[index].children[1].innerText = "HSL: "+colour.hsl[0]+", "+colour.hsl[1]+"%, "+colour.hsl[2]+"%";
        }
    })
}

/* generates random hue saturation and lightness then saves to colours[0].hsl */
function randomColor() {
    // console.log("random"+colours[0].hsl[0]);
    colours[0].hsl[0] = Math.round(Math.random()*360);
    colours[0].hsl[1] = Math.round((Math.random()+0.3)*70);
    colours[0].hsl[2] = Math.round((Math.random()+0.3)*70);
    // console.log("random"+colours[0].hsl[0]);
}

/* make deep copies of hsl value */
function spliceColours() {
    colours[1].hsl = colours[0].hsl.slice();
    colours[2].hsl = colours[0].hsl.slice();
    colours[3].hsl = colours[0].hsl.slice();
}


colourDropdownButton.addEventListener('click',colourDropdown);

function colourDropdown() {
    dropContainer.classList.toggle("show");
    dropContainer.classList.toggle("hidden");
    colourDropdownButton.classList.toggle("hidden");
}

/* controls drop down buttons */
[...dropContent].forEach((content,i) => {
    content.addEventListener("click",e => {
        outputType = i;
        colourDropdownButton.innerText = content.innerText;
        output();
        colourDropdown();
    })
});

/* Controls lock buttons toggles colour.locked on click */
[...lockColours].forEach((e,i) => {
   e.addEventListener("click", e => {
        colours[i].locked = !colours[i].locked;  //toggles between true and false
    })
});


document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        // console.log(useRandomColour.parentElement.classList);
        if (useRandomColour.parentElement.classList.contains("hidden")) randomScheme();
        else {
            useRandomColour.parentElement.classList.toggle("hidden");
            randomScheme();
        }
    }
  }

// setInterval(console.log(colours[0].locked),800);
setInterval(() => {
    console.log(colours[0].locked);
}, 800);