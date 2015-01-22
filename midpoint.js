function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function float2color( percentage ) {
    var color_part_dec = 255 * percentage;
    var color_part_hex = Number(parseInt( color_part_dec , 10)).toString(16);
    return "#" + color_part_hex + color_part_hex + color_part_hex;
}

function normalizeHeight(height){
    return (height).toFixed(6);
}

function getTerrainColor(height){
    var water = 0;

    return float2color(height);

    switch(true){
        case(height > water + .7):
         var color = 'snow';
            break;
        case(height > water + .6):
            var color = 'lightSlateGray';
            break;
        case(height > water + .5):
            var color = 'darkSlateGray';
            break;
        case(height > water + .4):
            var color = 'forestgreen';
            break;
        case(height > water + .3):
            var color = 'darkOliveGreen';
            break;
        case(height > water +.2):
            var color = 'sienna';
            break;
        case(height > water +.1):
            var color = 'tan';
            break;
        case(height > water - 0):
            var color = 'skyBLue';
            break;
        case(height > water - .1):
            var color = 'deepSkyBlue';
            break;
        case(height > water - .2):
            var color = 'royalBlue';
            break;
        case(height > water - .3):
            var color = 'blue';
            break;
        case(height > water - .4):
            var color = 'mediumBlue';//float2color(height);
            break;
        case(height > water - .5):
            var color = 'midnightBlue';//float2color(height);
            break;
        case(height > water - .6):
            var color = 'navy';//float2color(height);
            break;
        default:
            var color = 'red';//float2color(height);
            break;
    }

    return color;
}

function adjust(map, mdiff) {
    var s = false, b = false, d;
    for (var y=0; y<map.length; y++)
        for (var x=0; x<map[y].length; x++) {
            if (map[y][x] < s || s === false)
                s = map[y][x];

            if (map[y][x] > b || b === false)
                b = map[y][x];
        }
            
    d = b-s;
            
    for (var y=0; y<map.length; y++)
        for (var x=0; x<map[y].length; x++) {
            map[y][x] = Math.floor((map[y][x]-s) / d * mdiff);
        }
            
    return map;
}


function drawTerrain(hMap){   
    $('#seed').html(G.seed);
    for(y in hMap){
        squares = [];
        for(x in hMap[y]){

            var height = normalizeHeight(hMap[y][x]);      
            
            color = getTerrainColor(height);
           
            squares.push("<div class='tile' style='background: " + color + ";'></div>");
        }
        $('#map').append("<div id='y" + y + "'class='row'>" + squares.join('') + "</div>");
    }
}

function drawProfile(y){  

    $('#profile *').remove();
    
    rows = [];
    
    for(x = 0; x < map[y].length; x++){
        height = normalizeHeight(map[y][x]);
        rows.push("<div id='x" + x + "' class='profile tile' style='height: " + height * 100 + "px; background: " +
        getTerrainColor(height) + "'></div>");
    }   

    $('#profile').css({height: G.H_map * G.tilesize + 50 + 'px', width: G.W_map * G.tilesize + 'px'});

    $('#profile').append("<div class='profilewrap'>" + rows.join('') + "</div>");

    $('.profile.tile').bind('mouseover', function(){
        var x = $(this).attr('id').substring(1);
        var h = map[y][x];    
        $('#meter').html('XY: ' + x + ':' + y + ' | TRUE HEIGHT: ' + h + ' | NORMALIZED HEIGHT: ' + normalizeHeight(h));
        
    });
}

Math.rndseed = function(opt){
    opt         = opt || {};
    var seed    = opt.seed  || Math.random();
    var max     = opt.max   || 1;
    var min     = opt.min   || 0;

    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280;

    return min + rnd * (max - min);
}

G = {
    W_map:      257,
    H_map:      257,
    seed:       Math.random() * 100,
    tilesize:   5,
    H:          .65
}

function seededMap(){
    
    matrix = [];
    
    for(y = 0; y < G.H_map; y++){
        matrix[y] = []
        
        //for(x = 0; x < G.W_map; x++)
           // matrix[y][x] = 0; 
    }
     
    matrix[0][0]                        = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[0][G.W_map - 1]              = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[G.H_map - 1][G.W_map - 1]    = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[G.H_map - 1][0]              = Math.random(); //Math.rndseed({seed: G.seed}); 
    
    return matrix;
}

function midpoint(){
    
    map = seededMap();

    var sqsize = G.W_map - 1;
    
    var queue = new Array();
    queue.push([
        {x: 0,      y: 0},
        {x: sqsize, y: 0},
        {x: sqsize, y: sqsize},
        {x: 0,      y: sqsize}
    ]);

    var i = 0;
    var j = 0;
    var d = 1;

    while(queue.length > 0){
             
        rand = (Math.random() * (d - (d/2)));
        
        //rand = 0;

        var sq = queue.shift(); 

        // define center coords
        var pC = {x: sq[0].x + ((sq[1].x - sq[0].x) / 2), y: sq[0].y + ((sq[3].y - sq[0].y) / 2)};

        if(pC.x % 1 !== 0 || pC.y % 1 !== 0)
            continue;
        
        // sum square vertices heights
        sum = 0;
        for(n = 0; n < 4; n++)
            if(map[pC.y][pC.x] === undefined)
                sum += map[sq[n].x][sq[n].y];
        // set square center height
        map[pC.y][pC.x] = 1/(((sum / 4) + rand) * 10); 
        
        // define diamond center points
        var dm = [
            {x: pC.x,       y: sq[0].y},
            {x: sq[1].x,    y: pC.y},
            {x: pC.x,       y: sq[2].y},
            {x: sq[0].x,    y: pC.y}            
        ];
        
        // set diamond heights in map
        for(n = 0; n < 4; n++)
            if(map[dm[n].y][dm[n].x] === undefined) 
                map[dm[n].y][dm[n].x] = 1/((((map[pC.y][pC.x] + map[sq[n].y][sq[n].y]) / 2) + rand) * 10);
                      
        queue.push(
            [sq[0], dm[0], pC, dm[3]],
            [dm[0], sq[1], dm[1], pC],
            [pC, dm[1], sq[2], dm[2]],
            [dm[3], pC, dm[2], sq[3]]
        );
       
        if(++i == Math.pow(2, j+1)){
            d = d/G.H; 
            j++;
        } 
       
    }

}

$(document).ready(function(){
    

    midpoint();

    //map = adjust(map, 100);

    drawTerrain(map);    

    $('.row').bind('mouseover', function(){
        drawProfile($(this).attr('id').substring(1));    
    });
           
});
