# Colour Scheme Generator
## This is my attempt at a colour generator with some heavy influence from coolors
# Planning
* I  started by researching colour schemes and colour theory a fair bit. Everything seemed to be based around colour wheels so I decided HSL values (hue,saturation,lightness) would be the best as the hue value represents a point on a colour wheel.
* From here I started looking in to how I could convert an HSL value in to RGB or hex to improve useability.
* Finally I decided on a few specific colour schemes that seemed easier to generate

# Building
* I started out by building my HSL to RGB and RGB to hex functions. I wanted to get these sorted straight out the gate before my script got too complex to easily test these parts.
* Next I made functions to generate different colour schemes.
* Then I added a way to randomise the colours.

# Testing
* I started out just using two divs that used up half my screen preset the colour on one using HSL and then set the value of the other using the value I got from converting to RGB. With a little tweaking the colour were 'to my eyes' identical
* With all the colour schemes I started out using a preset HSL to generate my schemes from this helped make it a bit clearer if everything was working as expected
* I noticed with hue values near either extreme there were some issues with generated colour schemes having multiples of the exact same colour. I realised this was because values were going outside the bounds so defaulting to 0 or 360
