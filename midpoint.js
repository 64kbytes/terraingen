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

function normalizeHeight(height){
	return (height);
}

function getTerrainColor(height){
	var water = 0;

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

function seededMap(){
	
	matrix = [];
	
	for(y = 0; y < G.mapHeight; y++)   
		matrix[y] = [];
	   
	matrix[0][0]                            = Math.random(); 
	matrix[0][G.mapWidth - 1]               = Math.random();
	matrix[G.mapHeight - 1][G.mapWidth - 1] = Math.random();
	matrix[G.mapHeight - 1][0]              = Math.random();
	
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
	} 

	g.strokeStyle = 'rgb(0, 0, 0)';
	g.fillStyle = c;

	g.beginPath();
	g.moveTo((x + (w / 2)), y + height);
	g.lineTo((x + w), (y + (h / 2)) + height);
	g.lineTo((x + (w / 2)), (y + h) + height);
	g.lineTo(x, (y + (h / 2)) + height);
	g.closePath();
	g.fill();
	
	// water surface
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
	}    
	
}

function projection3D(g, G, x, y, tilt, height, color){

	// small offset patch
	y = y+(0);
	x = x+(-1);

	drawDiamond(g, (x * G.tilesize) + ((y % 2 === 0) ? G.tilesize / 2 : 0), ((y * G.tilesize * tilt) / 2) + 100, G.tilesize,
	G.tilesize * tilt, -height * 50, color);
}

function projection2D(g, G, x, y, color){
	g.fillStyle = color;
	g.strokeStyle = 'black';
	g.lineWidth = .1;

	// small offset patch
	y = y+(-1);
	x = x+(0);

	g.fillRect((x * G.tilesize), y * G.tilesize, G.tilesize,G.tilesize);
	g.strokeRect((x * G.tilesize), y * G.tilesize, G.tilesize,G.tilesize);
}

function canvasDrawTerrain(g, G, hMap, projection){   
	   
	offsetY = 0;
	offsetX = 0;

	y = offsetY+1;
	x = offsetX+1;

	while(y != offsetY){

		while(x != offsetX){

			var height = normalizeHeight(hMap[y][x]);      
			color = getTerrainColor(height);      

			if(projection == '2D')     
				projection2D(g, G, x, y, color);
			else
				projection3D(g, G, x, y, G.tilt, height, color);
			
			x = ((x + 1) == G.mapWidth) ? 0 : x + 1;
		}
					
		x = offsetX + 1;
		y = ((y + 1) == G.mapHeight) ? 0 : y + 1;
	}
	
}

function initMap(){

	G = {
		mapWidth:   513, //257,
		mapHeight:  513, //257,
		tilesize:   4,
		H:          2,
		tilt: 		.25
	}

	var c 		= document.getElementById('canvas');
	c.width 	= G.mapWidth * G.tilesize;
	c.height 	= G.mapHeight * G.tilesize * G.tilt;
	var g 		= c.getContext('2d');

	//Math.seedrandom('uhg2834562349857ssdfligh');

	var seeds = {
		leftupdown:     'bre',
		leftright:      'cfd',
		rightleft:      'as3',
		rightupdown:    'zz4'
	};

	var variance = {
		leftupdown:     Math.random() * 10, //.2,
		leftright:      Math.random() * 10, //1.5,
		rightleft:      Math.random() * 10, //1.5,
		rightupdown:    Math.random() * 10//.25
	}
	
	map = seededMap();

	// NORTH
	Math.seedrandom(seeds.leftupdown);    
	midpoint1d(map, 0, 0, (G.mapWidth - 1), 0, variance.leftupdown); 
   
	// WEST
	Math.seedrandom(seeds.leftright); 
	midpoint1d(map, 0, 0, 0, (G.mapHeight - 1) , variance.leftright);
	
	// EAST    
	Math.seedrandom(seeds.rightleft);
	midpoint1d(map, (G.mapWidth - 1), 0, (G.mapWidth - 1), (G.mapHeight - 1) , variance.rightleft); 
	
	// SOUTH
	Math.seedrandom(seeds.leftupdown); 
	midpoint1d(map, 0, (G.mapHeight - 1), (G.mapWidth - 1), (G.mapHeight - 1) , variance.leftupdown);
	
	midpoint2d(map, 0, 0, (G.mapWidth - 1), (G.mapHeight - 1), 3);

	return {context: g, settings: G, matrix: map};
}

$(document).ready(function(){
	cfg = initMap();
	canvasDrawTerrain(cfg.context, cfg.settings, cfg.matrix);
});



