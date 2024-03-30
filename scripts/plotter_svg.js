window.main_screen = document.querySelector('#fractal_renderer');
window.templine = main_screen.firstElementChild.cloneNode();
window.fvars = {};
window.fvars.angle = 0;
window.fvars.buffer = [];
window.fvars.color = "#fff";
window.fvars.lineLength = 2;
window.fvars.lineWidth = 2;
window.fvars.lastpos = {x: main_screen.clientWidth/2, y: main_screen.clientHeight/2};

window.drawLine = function(dist, width, color) {
  const line = templine.cloneNode();
  if(dist == undefined) dist=fvars.lineLength;
  if(width == undefined) width=fvars.lineWidth;
  if(color == undefined) color=fvars.color;
  dist = Math.abs(dist);
  width = Math.abs(width);
  endpoint = {
    x: fvars.lastpos.x + Math.sin(fvars.angle * Math.PI / 180) * dist,
    y: fvars.lastpos.y - Math.cos(fvars.angle * Math.PI / 180) * dist
  };
  line.setAttribute("x1", fvars.lastpos.x + "px");
  line.setAttribute("y1", fvars.lastpos.y + "px");
  line.setAttribute("x2", endpoint.x+ "px");
  line.setAttribute("y2", endpoint.y+ "px");
  line.setAttribute("style", `stroke:${color}; stroke-width:${width}`);
  fvars.lastpos = endpoint;
  if(!fvars.penup) main_screen.appendChild(line);
}
window.turn = function(angle) {
  if(angle == undefined) angle=fvars.angle;
  fvars.angle += Number(angle);
}
window.saveData = function() {
  fvars.buffer.push([fvars.lastpos, fvars.angle]);
}
window.loadData = function() {
  curr = fvars.buffer.pop();
  fvars.lastpos = curr[0];
  fvars.angle = curr[1];
}
window.goto = function(x, y) {
  fvars.lastpos = { x: x, y: y };
}
window.clear_svg = function() {
  main_screen.replaceChildren();
  fvars.angle = 0;
  fvars.lastpos = {x: main_screen.clientWidth/2, y: main_screen.clientHeight/2};
}