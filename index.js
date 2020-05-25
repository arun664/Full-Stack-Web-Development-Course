var rect = require ('./rectangle');

function solveRect(l,b) {
    console.log ("Solving for rectangle with l ="+ l +"and b = "+ b);
    if ( l <= 0 || b <= 0) {
        console.log("Rect dimensions should be greather than zero, length = "+l+"and b = "+b);
    }
    else {
        console.log("Area of rectangle is"+ rect.area(l,b));
        console.log("Perimeter of rectangle is"+rect.perimeter(l,b));
    }
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);