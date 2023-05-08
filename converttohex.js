// 56,151,199

let rgb = [56,151,199];

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

// console.log(hexLookup[13]);
console.log(convertToHex(rgb));