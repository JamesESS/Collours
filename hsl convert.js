let containerLeft = document.getElementById("hsl1");
let containerRight = document.getElementById("hsl2");
let containers = document.getElementsByClassName("hsl");
let monochromaticButton = document.getElementById("monochromatic");
let analogousButton = document.getElementById("analogous");
let quadSchemeButton = document.getElementById("square");
let splitComplementaryButton = document.getElementById("splitcomp");

monochromaticButton.addEventListener("click",monochromatic);
analogousButton.addEventListener("click",analogous);
quadSchemeButton.addEventListener("click",quadScheme);
splitComplementaryButton.addEventListener("click",splitComplementary);


/* 
function to convert hsl to rgb 
*/
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

let hsl = [50,100,50];
analogous();

// console.log(rgb1)

function monochromatic() {
    randomColor();
    hsl2 = hsl.slice();
    hsl3 = hsl.slice();
    hsl4 = hsl.slice();
    hsl2[2] += 8;
    hsl3[2] += 16;
    hsl4[2] += 24;
    /* if (hsl2[0] > 360) {
        hsl2[0] -= 360;
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl3[0] > 360) {
        hsl3[0] -= 360;
        hsl4[0] -= 360;
    }
    else if (hsl4[0] > 360) hsl4[0] -= 360; */
    // console.log(hsl,hsl2,hsl3,hsl4);
    /* containers[0].style.backgroundColor = "rgb("+convertToRGB(hsl)+")";
    containers[1].style.backgroundColor = "rgb("+convertToRGB(hsl2)+")";
    containers[2].style.backgroundColor = "rgb("+convertToRGB(hsl3)+")";
    containers[3].style.backgroundColor = "rgb("+convertToRGB(hsl4)+")";
    containers[0].innerText = "RGB: "+convertToRGB(hsl);
    containers[1].innerText = "RGB: "+convertToRGB(hsl2);
    containers[2].innerText = "RGB: "+convertToRGB(hsl3);
    containers[3].innerText = "RGB: "+convertToRGB(hsl4); */
    output();
}

// monochromatic();

// hsl  = [0,100,50];
// monochromatic();

function analogous() {
    randomColor();
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
    /* containers[0].style.backgroundColor = "rgb("+convertToRGB(hsl)+")";
    containers[1].style.backgroundColor = "rgb("+convertToRGB(hsl2)+")";
    containers[2].style.backgroundColor = "rgb("+convertToRGB(hsl3)+")";
    containers[3].style.backgroundColor = "rgb("+convertToRGB(hsl4)+")";
    containers[0].innerText = "RGB: "+convertToRGB(hsl);
    containers[1].innerText = "RGB: "+convertToRGB(hsl2);
    containers[2].innerText = "RGB: "+convertToRGB(hsl3);
    containers[3].innerText = "RGB: "+convertToRGB(hsl4); */
    output();
    logs();
}

// analogous();

function quadScheme() {
    randomColor();
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
    /* containers[0].style.backgroundColor = "rgb("+convertToRGB(hsl)+")";
    containers[1].style.backgroundColor = "rgb("+convertToRGB(hsl2)+")";
    containers[2].style.backgroundColor = "rgb("+convertToRGB(hsl3)+")";
    containers[3].style.backgroundColor = "rgb("+convertToRGB(hsl4)+")";
    containers[0].innerText = "RGB: "+convertToRGB(hsl);
    containers[1].innerText = "RGB: "+convertToRGB(hsl2);
    containers[2].innerText = "RGB: "+convertToRGB(hsl3);
    containers[3].innerText = "RGB: "+convertToRGB(hsl4); */
    output();
    // console.log(hsl,hsl2,hsl3,hsl4);
    logs();
}

function splitComplementary() {
    randomColor();
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
    /* containers[0].style.backgroundColor = "rgb("+convertToRGB(hsl)+")";
    containers[1].style.backgroundColor = "rgb("+convertToRGB(hsl2)+")";
    containers[2].style.backgroundColor = "rgb("+convertToRGB(hsl3)+")";
    containers[3].style.backgroundColor = "rgb("+convertToRGB(hsl4)+")";
    containers[0].innerText = "RGB: "+convertToRGB(hsl);
    containers[1].innerText = "RGB: "+convertToRGB(hsl2);
    containers[2].innerText = "RGB: "+convertToRGB(hsl3);
    containers[3].innerText = "RGB: "+convertToRGB(hsl4); */
    output();
    logs();
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
}

function logs() {
    console.log("hsl: ",hsl," hsl2: ",hsl2," hsl3: ",hsl3," hsl4: ",hsl4);
    console.log(convertToRGB(hsl),convertToRGB(hsl2),convertToRGB(hsl3),convertToRGB(hsl4));
}