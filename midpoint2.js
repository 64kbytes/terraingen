function Map(size, xlen, ylen){

    this.size   = Math.pow(2, size) + 1;
    this.xlen   = xlen || 1;
    this.ylen   = ylen || 1;
    this.grid   = (function(){
    
    })(xlen, ylen)
    
    this.loadGrid = function(){
        
    }
    this.unloadGrid = function(){
        
    }
    
    /*
    this.map    = (function(size, xlen, ylen){
            
        var maps = new Array();
        
        for(p = 0; p < pag; p++){
            matrix = [];
            for(y = 0; y < size; y++)
                matrix[y] = new Array(size);
            maps.push(matrix); 
        }            
        return maps;
    })(this.size, xlen, ylen);
    */
}

//test = new Map(6, 2, 2);
//console.log(test);

/*-----------------------------------------------------------------------
    TEST
-----------------------------------------------------------------------*/


function permute(input, permArr, usedChars){
    if(permArr === undefined)
        permArr = [];
    if(usedChars === undefined)
        usedChars = [];

    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input, permArr, usedChars);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
}

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
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
    return (height);
}

function getTerrainColor(height){
    var water = 0;

    //return float2color(height);

    switch(true){
        case(height > water + 1):
            var color = '#FFFAFA';
            break;
        case(height > water + .9):
            var color = '#F5F5F5';
            break;
        case(height > water + .8):
            var color = '#DCDCDC';
            break;
        case(height > water + .7):
            var color = '#D3D3D3';
            break;
        case(height > water + .6):
            var color = '#778899';
            break;
        case(height > water + .5):
            var color = '#2F4F4F';
            break;
        case(height > water + .4):
            var color = '#228B22';
            break;
        case(height > water + .3):
            var color = '#556B2F';
            break;
        case(height > water +.25):
            var color = '#A0522D';
            break;
        case(height > water +.2):
            var color = '#CD853F';
            break;
        case(height > water +.15):
            var color = '#6B8E23';
            break;
        case(height > water +.1):
            var color = '#D2B48C';
            break;
        case(height > water +.05):
            var color = '#907B71';
            break;
        case(height > water - .05):
            var color = '#DFBE6F';
            break;
        case(height > water - .1):
            var color = '#1E90FF';
            break;
        case(height > water - .2):
            var color = '#4169E1';
            break;
        case(height > water - .3):
            var color = '#0000FF';
            break;
        case(height > water - .4):
            var color = '#0000CD';//float2color(height);
            break;
        case(height > water - .5):
            var color = '#191970';//float2color(height);
            break;
        case(height > water - .6):
            var color = '#000080';//float2color(height);
            break;
        case(height > water - .7):
            var color = '#000080';//float2color(height);
            break;
        case(height > water - .8):
            var color = '#000080';//float2color(height);
            break;
        case(height > water - .9):
            var color = '#01015A';//float2color(height);
            break;
        case(height > water - 10):
            var color = '#00001F';//float2color(height);
            break;
        default:
            var color = '#FF0000';//float2color(height);
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


function drawTerrain(hMap, mapdiv){   
    $('#seed').html(G.seed);
    
    offsetY = 64;
    offsetX = 64;
    
    y = offsetY + 1;
    x = offsetX + 1;

    while(y != offsetY){
        squares = [];

        while(x != offsetX){

            var height = normalizeHeight(hMap[y][x]);      
            color = getTerrainColor(height);           
            squares.push("<div class='tile' style='background: " + color + ";'></div>");


            x = ((x + 1) == G.W_map) ? 0 : x+1;
        }
        $(mapdiv).append("<div id='y" + y + "'class='row'>" + squares.join('') + "</div>");
        x = offsetX + 1;
        y = ((y + 1) == G.H_map) ? 0 : y + 1;
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


G = {
    W_map:      513, //257,
    H_map:      513, //257,
    tilesize:   4,
    H:          2.1
}

function seededMap(){
    
    matrix = [];
    
    for(y = 0; y < G.H_map; y++)   
        matrix[y] = [];
       
    matrix[0][0]                        = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[0][G.W_map - 1]              = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[G.H_map - 1][G.W_map - 1]    = Math.random(); //Math.rndseed({seed: G.seed});
    matrix[G.H_map - 1][0]              = Math.random(); //Math.rndseed({seed: G.seed}); 
    
    return matrix;
}

function emptyMap(size){
    matrix = [];   
    for(y = 0; y < size; y++)   
        matrix[y] = new Array(size);
    return matrix;
}

function midpoint1d(M, x0, y0, x1, y1, dh){
    var dx = x1 - x0;
    var dy = y1 - y0;
    var cx = x0 + dx/2;
    var cy = y0 + dy/2;
    var d2 = dh/2;
    
    if(cx % 1 !== 0 || cy % 1 !== 0)
        return;
    
    //center point
    M[cy][cx] = (M[y0][x0] + M[y1][x1]) / 2 + Math.random() * dh - d2;

    var nh = dh/G.H;

    midpoint1d(M, x0, y0, cx, cy, nh);
    midpoint1d(M, cx, cy, x1, y1, nh);
}

function midpoint2d(M, NWx, NWy, SEx, SEy, dh){
            
    var dx = SEx - NWx;     
    var dy = SEy - NWy;
    var cx = NWx + dx/2; 
    var cy = NWy + dy/2;
    var d2 = dh/2; 

    if(cx % 1 !== 0 || cy % 1 !== 0)
        return;
   
    // center point
    M[cy][cx] = (M[NWy][NWx] + M[NWy][SEx] + M[SEy][SEx] + M[SEy][NWx]) / 4 + Math.random() * dh - d2;
   
    // generate top, bottom, left and right pts
    if(M[NWy][cx] === undefined) M[NWy][cx] = (M[NWy][NWx] + M[NWy][SEx])/2 + Math.random() * dh - d2;
    if(M[SEy][cx] === undefined) M[SEy][cx] = (M[SEy][NWx] + M[SEy][SEx])/2 + Math.random() * dh - d2;
    if(M[cy][NWx] === undefined) M[cy][NWx] = (M[NWy][NWx] + M[SEy][NWx])/2 + Math.random() * dh - d2;
    if(M[cy][SEx] === undefined) M[cy][SEx] = (M[NWy][SEx] + M[SEy][SEx])/2 + Math.random() * dh - d2;
            
    var nh = dh/G.H;
    
    midpoint2d(M, NWx, NWy, cx, cy, nh);
    midpoint2d(M, cx, NWy, SEx, cy, nh);
    midpoint2d(M, NWx, cy, cx, SEy, nh);
    midpoint2d(M, cx, cy, SEx, SEy, nh);
    
}

function seedSectorMap(M, m, MNWx, MNWy, MSEx, MSEy, mNWx, mNWy, mSEx, mSEy){
      
    var Mdx = MSEx - MNWx;     
    var Mdy = MSEy - MNWy;
    var Mcx = MNWx + Mdx/2; 
    var Mcy = MNWy + Mdy/2;

    var mdx = mSEx - mNWx;     
    var mdy = mSEy - mNWy;
    var mcx = mNWx + mdx/2; 
    var mcy = mNWy + mdy/2;

    if(Mcx % 1 !== 0 || Mcy % 1 !== 0)
        return;
   
    // copy points
    m[mNWy][mNWx]   = M[MNWy][MNWx];    // NW
    m[mNWy][mcx]    = M[MNWy][Mcx];     // N
    m[mNWy][mSEx]   = M[MNWy][MSEx];    // NE
    m[mcy][mNWx]    = M[Mcy][MNWx];     // W
    m[mcy][mcx]     = M[Mcy][Mcx];      // CENTER    
    m[mcy][mSEx]    = M[MSEy][MNWx];    // E
    m[mSEy][mNWx]   = M[MSEy][MNWx];    // SW
    m[mSEy][mcx]    = M[MSEy][Mcx];     // S
    m[mSEy][mSEx]   = M[MSEy][MSEx];    // SE
   
    seedSectorMap(M, m, MNWx, MNWy, Mcx, Mcy, mNWx, mNWy, mcx, mcy);
    seedSectorMap(M, m, Mcx, MNWy, MSEx, Mcy, mcx, mNWy, mSEx, mcy);
    seedSectorMap(M, m, MNWx, Mcy, Mcx, MSEy, mNWx, mcy, mcx, mSEy);
    seedSectorMap(M, m, Mcx, Mcy, MSEx, MSEy, mcx, mcy, mSEx, mSEy);
    
}


function PlanetHeightMap(opt){
    this.seed = opt.seed || Math.random();
}

function drawDiamond(g, x, y, w, h, height, c){
   
    if(height < 0){
    
        // DEPTH   
        rgb = ColorLuminance(c, -.2);
        g.fillStyle = rgb;
        g.beginPath();
        g.moveTo(x + w, y + (h / 2) + height); // C
        g.lineTo(x + w, y + (h / 2)); // G
        g.lineTo(x + (w / 2), y + h); // F
        g.lineTo(x, y + (h / 2)); // E
        g.closePath();
        g.fill(); 

        rgb = ColorLuminance(c, -.6);
        g.strokeStyle = 'rgb(0, 0, 0)';
        g.fillStyle = rgb;    
        g.beginPath();    
        g.moveTo(x, y + (h / 2) + height); // B
        g.lineTo(x + (w / 2), y + h + height); // D
        g.lineTo(x + (w / 2), y + h); // F
        g.lineTo(x, y + (h / 2)); // E
        g.closePath();
        g.fill();     
        // DEPTH .END OF BLOCK
    } else {
        /* 
        rgb = ColorLuminance(c, -.2);
        g.fillStyle = rgb;
        g.beginPath();        
        g.moveTo(x, y + (h / 2) + height);
        g.lineTo(x, y + (h / 2));
        g.lineTo(x + (w / 2), y);
        g.lineTo(x + (w / 2), y + height);
        g.closePath();
        g.fill();
        
        
        //rgb = ColorLuminance(c, -.6);
        //g.strokeStyle = 'rgb(0, 0, 0)';
        //g.fillStyle = rgb;
        g.beginPath();
        g.moveTo(x + (w / 2), y);
        g.lineTo(x + w, y + (h / 2));
        g.lineTo(x + w, y + (h / 2) + height);
        g.lineTo(x + (w / 2), y + height);
        g.closePath();
        g.fill();
        */

    }

    if(height > 0){
        //height = height * 2;    
    }
    
    g.strokeStyle = 'rgb(0, 0, 0)';
    g.fillStyle = c;

    g.beginPath();
    g.moveTo((x + (w / 2)), y + height);
    g.lineTo((x + w), (y + (h / 2)) + height);
    g.lineTo((x + (w / 2)), (y + h) + height);
    g.lineTo(x, (y + (h / 2)) + height);
    g.closePath();
    //g.stroke();
    g.fill();
    /*
    if(height > 0){
        g.strokeStyle =  'rgba(111, 183, 226, .25)'; //'white'; //getTerrainColor(0);
        
        //g.fillStyle = 'rgba(111, 183, 226, .50)';

        g.beginPath();
        g.moveTo((x + (w / 2)), y);
        g.lineTo((x + w), (y + (h / 2)));
        g.lineTo((x + (w / 2)), (y + h));
        g.lineTo(x, (y + (h / 2)));
        g.closePath();
        g.stroke();
        //g.fill();
    }    
    */
}

function canvasDrawTerrain(g, hMap){   
       
    offsetY = 0;
    offsetX = 0;

    var tilt = .5;
    
    y = offsetY+1;
    x = offsetX+1;

    while(y != offsetY){

        while(x != offsetX){

            var height = normalizeHeight(hMap[y][x]);      
            color = getTerrainColor(height);           
            
            drawDiamond(g, (x * G.tilesize) + ((y % 2 === 0) ? G.tilesize / 2 : 0), ((y * G.tilesize * tilt) / 2) + 100, G.tilesize,
            G.tilesize * tilt, -height * 50, color);
            
            /*
            g.fillStyle = color;
            g.strokeStyle = 'black';
            g.fillRect((x * G.tilesize), y * G.tilesize, G.tilesize,G.tilesize);
            g.strokeRect((x * G.tilesize), y * G.tilesize, G.tilesize,G.tilesize);
            */
            x = ((x + 1) == G.W_map) ? 0 : x + 1;
        }
                    
        x = offsetX + 1;
        y = ((y + 1) == G.H_map) ? 0 : y + 1;
    }
    
}


$(document).ready(function(){

    

    var c = document.getElementById('canvas');
    var g = c.getContext('2d');

    var seeds = {
        /*
        leftupdown:     'kdfgsadkygfr',//'eatrew2305u9tfsargrtest',
        leftright:      '45789hfu8f',//'eatrew2305u9tfsargrtest',
        rightleft:      'vcbw45ty6536use',//'eatrew2305u9tfsargrtest',
        rightupdown:    '0965rdfjru7strh',//'eatrew2305u9tfsargrtest'
        */
        /*
        leftupdown:     'eatrew2305u9tfsargrtest',
        leftright:      'eatrew2305u9tfsargrtest',
        rightleft:      'eatrew2305u9tfsargrtest',
        rightupdown:    'eatrew2305u9tfsargrtest'
        */
        leftupdown:     'bre',
        leftright:      'cfd',
        rightleft:      'as3',
        rightupdown:    'zz4'

    };

    Math.seedrandom('uhg2834562349857ssdfligh');

    var variance = {
        leftupdown:     Math.random() * 10, //.2,
        leftright:      Math.random() * 10, //1.5,
        rightleft:      Math.random() * 10, //1.5,
        rightupdown:    Math.random() * 10//.25
    }
    
    
    map = seededMap();

    G.H = 2;

    // NORTH
    Math.seedrandom(seeds.leftupdown);    
    midpoint1d(map, 0, 0, (G.W_map - 1), 0, variance.leftupdown); 
   
    // WEST
    Math.seedrandom(seeds.leftright); 
    midpoint1d(map, 0, 0, 0, (G.H_map - 1) , variance.leftright);
    
    // EAST    
    Math.seedrandom(seeds.rightleft);
    midpoint1d(map, (G.W_map - 1), 0, (G.W_map - 1), (G.H_map - 1) , variance.rightleft); 
    
    // SOUTH
    Math.seedrandom(seeds.leftupdown); 
    midpoint1d(map, 0, (G.H_map - 1), (G.W_map - 1), (G.H_map - 1) , variance.leftupdown);
    
    midpoint2d(map, 0, 0, (G.W_map - 1), (G.H_map - 1), 3);
   
    //drawTerrain(map, '#map');

    canvasDrawTerrain(g, map);

    

/*-----------------------------
    MAP 2
------------------------------*/
    
    G.H = 2;

    map = seededMap();

    // NORTH
    Math.seedrandom(seeds.rightupdown);    
    midpoint1d(map, 0, 0, G.W_map - 1, 0, variance.rightupdown); 
   
    // WEST
    Math.seedrandom(seeds.rightleft); 
    midpoint1d(map, 0, 0, 0, (G.H_map - 1), variance.rightleft);
    
    // EAST    
    Math.seedrandom(seeds.leftright);
    midpoint1d(map, (G.W_map - 1), 0, (G.W_map - 1), (G.H_map - 1) , variance.leftright); 
    
    // SOUTH
    Math.seedrandom(seeds.rightupdown); 
    midpoint1d(map, 0, (G.H_map - 1), (G.W_map - 1), (G.H_map - 1) , variance.rightupdown);
    
    midpoint2d(map, 0, 0, (G.W_map - 1), (G.H_map - 1), 3);

    //drawTerrain(map, '#map2');    

    /*
    $('.row').bind('mouseover', function(){
        drawProfile($(this).attr('id').substring(1));    
    });
    */
/*-----------------------------
    SECTOR MAP
------------------------------*/
 /*    
    sMap = emptyMap(129);

    var sek = {
        NW: {x: 0, y: 0},
        SE: {x: (map[0].length - 1) / 64, y: (map.length - 1) / 64} 
    };
        
    seedSectorMap(map, sMap, sek.NW.x, sek.NW.y, sek.SE.x, sek.SE.y, 0, 0, sMap[0].length-1, sMap.length-1);
          
    G.H = 1.8;
    //var sectionMap = mapSector(map, 0, 0, 65);

    midpoint2d(sMap, 0, 0, sMap[0].length - 1, sMap.length - 1, 1/2);
 
    drawTerrain(sMap, '#sector');
   */ 
    
});
