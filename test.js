function dostuff(min, max, ticks) {
    var result = [];
    
    if(min == max)
    {
        min = min - 10;   // some small value
        max = max + 10;   // some small value
    }
    // Determine Range
    var range = max - min;
    // Adjust ticks if needed
    if(ticks < 2) {
        ticks = 2;
    } else if(ticks > 2) {
        ticks -= 2;
    }
    // Get raw step value
    var tmpStep = range / ticks;
    // Calculate pretty step value
    var mag = Math.floor(Math.log10(tmpStep));
    var magPow = Math.pow(10,mag);
    var magMsd = Math.floor(tmpStep / magPow + 0.5);
    var stepSize = magMsd * magPow;

    // build Y label array.
    // Lower and upper bounds calculations
    var lb = stepSize * Math.floor(min / stepSize);
    var ub = stepSize * Math.ceil((max / stepSize));
    // Build array
    var val = lb;
    while(1)
    {
        result.push(val);
        val += stepSize;
        if(val > ub) {
            break;
        }
    }
    return result;
}

// Create some sample data for demonstration purposes
yMin = -75;
yMax = 330;
scale =  dostuff(yMin, yMax, 10);
console.log(scale);

scale = dostuff(yMin, yMax, 5);
console.log(scale);

yMin = 60847326;
yMax = 73425330;
scale =  dostuff(yMin, yMax, 10);
console.log(scale);
