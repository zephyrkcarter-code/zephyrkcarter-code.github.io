// 16x16 pixel sprites. '.' = transparent, letters map to palette colors.
export const KING = [
'...yyyyyyyyyy...',
'...yyyyyyyyyy...',
'....k.y..y.k....',
'.....kkkkkk.....',
'....kssssssk....',
'....ksdssdsk....',
'.....ssssss.....',
'.....sskkss.....',
'...yyyykkyyyy...',
'..yyyrrrrrryyy..',
'..yyyryggyryyy..',
'..ss.ryyyyr.ss..',
'..yyyrrrrrryyy..',
'...yyyyyyyyyy...',
'...dd......dd...',
'................'];
export const KING_PAL = {y:'#e8b030',k:'#1a1010',s:'#f0c090',d:'#3a1a10',r:'#b02020',g:'#40a060'};

export const CIT = [
'......hhhh......',
'.....hhhhhh.....',
'......kkkk......',
'.....kkkkkk.....',
'.....kkkkkk.....',
'......kkkk......',
'....cccssccc....',
'...cccccccccc...',
'...cccccccccc...',
'..scccbbbbcccs..',
'...cccccccccc...',
'...cccccccccc...',
'...cccccccccc...',
'....cccccccc....',
'....dd....dd....',
'................'];

export const GUARD = [
'.......w........',
'......www.......',
'.......w...hh...',
'.......w..hhhh..',
'.......w..ssss..',
'.......w..sdds..',
'.......w..ssss..',
'.......waaaaaa..',
'.......aarrrraa.',
'.......warrrra..',
'.......waaaaaa..',
'.......warrrra..',
'.......warrrra..',
'.......w.aaaa...',
'.......w.d..d...',
'................'];
export const GUARD_PAL = {w:'#c0c0c0',h:'#202020',s:'#f0c090',d:'#1a1010',a:'#606070',r:'#b02020'};

export function drawSprite(ctx, rows, pal, x, y, flip=false) {
  for (let j = 0; j < rows.length; j++) for (let i = 0; i < 16; i++) {
    const c = rows[j][flip ? 15 - i : i];
    if (!c || c === '.') continue;
    ctx.fillStyle = pal[c]; ctx.fillRect(Math.round(x + i), Math.round(y + j), 1, 1);
  }
}
