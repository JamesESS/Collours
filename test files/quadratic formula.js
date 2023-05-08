// 2x^2 + 200x - 40000 = 0
// ax² + bx + c = 0
// x = (-b ± sqrt(b² — 4ac)) / 2a
// x = (-200 +/- sqrt(200^2 - 4*2*-40000)) / 4

let discrim = 200*200 - (4*2*-40000);
console.log(discrim);
let sqrDiscrim = Math.sqrt(discrim);
let x = (-200 + sqrDiscrim) / 4;
let xNeg = (-200 - sqrDiscrim) / 4;
console.log(x,xNeg);

let squareCheck = 3**2;
console.log(squareCheck);


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
    console.log(rgb)
    return rgb;
}

convertToRGB([10,100,50]);