const axiom = document.querySelector('#axiom'),
color = document.querySelector('#fractal_color'),
color_res = document.querySelector('#fractal_color_res'),
bg_color = document.querySelector('#bg_color'),
bg_color_res = document.querySelector('#bg_color_res'),
angle = document.querySelector('#angle'),
lineWidth = document.querySelector('#lineWidth'),
lineLength = document.querySelector('#lineLength'),
iters = document.querySelector('#iters');


const generate_btn = document.querySelector('#btn_generate'),
generate_text_1 = document.querySelector('#btn_generate_text_1'),
generate_text_2 = document.querySelector('#btn_generate_text_2'),
generate_spinner = document.querySelector('#btn_generate_spinner'),
modal_cmd_content = document.querySelector('#modalErrorCmdContent'),
add_rule_btn = document.querySelector('#add_rule'),
add_cmd_btn = document.querySelector('#add_cmd'),
del_rule_btn = document.querySelector('#del_rule'),
del_cmd_btn = document.querySelector('#del_cmd'),
help_cmd_btn = document.querySelector('#hlp_cmd'),
help_rule_btn = document.querySelector('#hlp_rule'),
presets = document.querySelector('#presets'),
rules = document.querySelector('#rules'),
cmds = document.querySelector('#cmds');

const empty_textbox = document.createElement("input");
empty_textbox.setAttribute("class", "form-control mb-1");
empty_textbox.setAttribute("style", "height: 2rem;");
empty_textbox.setAttribute("type", "text");

var modalError = new bootstrap.Modal(document.querySelector('#modalErrorCmd'), {
  keyboard: true
});

configs = {
  "fractal_1": {
    "commands": [
      "F: DrawLine(D, D, D)",
      "+: Turn(D)",
      "-: Turn(-D)",
      "R: Turn(90)"
    ],
    "rules": [
      "X: --FXF++FXF++FXF--",
      "F: FF"
    ],
    "axiom": "RFXF--FF--FF",
    "angle": 60,
    "lineWidth": 2,
    "lineLength": 6,
    "iterations": 5,
    "color": "#3F7FFF",
    "bg_color": "#37d0d5"
  },
  "fractal_2": {
    "commands": [
      "F: DrawLine(D, D, D)",
      "+: Turn(D)",
      "-: Turn(-D)",
      "R: Turn(90)"
    ],
    "rules": [
      "F: F+F--F+F"
    ],
    "axiom": "RF--F--F",
    "angle": 60,
    "lineWidth": 2,
    "lineLength": 5,
    "iterations": 4,
    "color": "#3F7FFF",
    "bg_color": "#37d0d5"
  },
  "fractal_3": {
    "commands": [
      "F: DrawLine(D, D, D)",
      "+: Turn(D)",
      "-: Turn(-D)"
    ],
    "rules": [
      "X: X+YF+",
      "Y: -FX-Y"
    ],
    "axiom": "FX",
    "angle": 90,
    "lineWidth": 2,
    "lineLength": 5,
    "iterations": 13,
    "color": "#3F7FFF",
    "bg_color": "#37d0d5"
  }
}

let doc_cmd = "\n\n  DrawLine(h, w, color) - рисует линию указанной длины h, ширины w и цвета color формата rgb(r, g, b).\n    Пример команды:\n      F: DrawLine(D, 2, rgb(255, 128, 64)\n\n  Turn(x) - поворачивает на указанный угол x, может быть отрицательным.\n    Пример команды:\n      R: Turn(90)\n\n  Save() - сохраняет позицию и угол в буффер, не принемает ни каких параметров.\n    Пример команды:\n      [: Save()\n\n  Load() - загружает и применяет позицию с уголом в буффера, не принемает ни каких параметров.\n    Пример команды:\n      ]: Load()\n\n    Все параметры всех команд могут обращаться к соответствующим значением по умолчанию, чтобы это использовать достаточно написать 'D' или '-D' для команды Turn.",
doc_rule = "\n\n  Сначала пишется имя переменной ввиде одного любого символа, потом двоеточие и само содержимое.\n  Содержимое это - то что хранит переменная, а хранит она только другие переменные или команды.\n  Пример правила:\n    X: F+Y+";

function cmd_warn(i, curr_node){
  modal_cmd_content.innerHTML = `Некорректное написание условия ${i+1} с содержимым ${curr_node.value} \nГенератор поддерживает следующие команды:${doc_cmd}`;
  return modalError.show();
  //alert()
}

function create_cmds() {
  var empty = {}, spl = '', value = 0;
  for (var i = 0; i < cmds.childNodes.length; i++) {
    spl = '', value = 0;
    curr_node = cmds.childNodes[i];
    if(curr_node.nodeType == 1){
      spl = curr_node.value.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '').split(":");
      if(spl[1].indexOf('DrawLine(') != -1){
        value = (spl[1].split('DrawLine(')[1].replaceAll(')', '')).split(',');
        value[0] = (value[0] != '' && Number(value[0]) == value[0]) ? value[0] : (value[0] == 'D') ? lineLength.value : undefined;

        value[1] = (value[1] != undefined && value[1] != '' && Number(value[1]) == value[1]) ? value[1] : (value[1] == 'D') ? lineWidth.value : undefined;

        value[2] = ((value[2] != undefined && value[2] != '' && value[3] != undefined && value[3] != '' && value[4] != undefined && value[4] != '') && value[2].indexOf('rgb(') != -1) ? value[2]+','+value[3]+','+value[4]+')' : (value[2] == 'D') ? color.value : undefined;
        if(value[0] == undefined ||value[1] == undefined ||value[2] == undefined) cmd_warn(cmds.childNodes.length-i, curr_node);
        empty[spl[0]] = ['DL', [value[0], value[1], value[2]]];
      }else if(spl[1].indexOf('Turn(') != -1){
        value = spl[1].split('Turn(')[1].replaceAll(')', '');
        value = (value != '' && Number(value) == value) ? value : (value == 'D') ? angle.value : (value == '-D') ? -angle.value : undefined;
        if(value == undefined) cmd_warn(cmds.childNodes.length-i, curr_node);
        empty[spl[0]] = ['T', [value]];
      }else if(spl[1].indexOf('Save(') != -1){
        empty[spl[0]] = ['S'];
      }else if(spl[1].indexOf('Load(') != -1){
        empty[spl[0]] = ['L'];
      }else{
        cmd_warn(cmds.childNodes.length-i, curr_node);
      }
    }
  }
  return empty;
}

function create_rules() {
  empty = {};
  for (var i = 0; i < rules.childNodes.length; i++) {
    curr_node = rules.childNodes[i];
    if(curr_node.nodeType == 1){
      spl = curr_node.value.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '').split(":");
      if(spl.length<2) alert("Некорректное написание правила\nПока генератор поддерживает следующий синтаксис:\n 'имя переменной': 'содержимое'");
      empty[spl[0]] = spl[1];
    }
  }
  return empty;
}

function dragElement(elem, input_panel, ren) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, scale = 1,
  screen_size = {x: ren.clientWidth*scale, y: ren.clientHeight*scale};
  input_panel.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    // получить положение курсора мыши при запуске:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = () => {
      document.onmousemove = null;
    };
    // вызов функции при каждом перемещении курсора:
    document.onmousemove = elementDrag;
    e.preventDefault();
  }

  function elementDrag(e) {
    // вычислить новую позицию курсора:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    top_cord = elem.offsetTop - pos2;
    left_cord = elem.offsetLeft - pos1;

    elem.style.top = (((screen_size.y/2) > Math.abs(top_cord)) ? top_cord : top_cord/Math.abs(top_cord)*(screen_size.y/2)) + "px";
    elem.style.left = (((screen_size.x/2) > Math.abs(left_cord)) ? left_cord : left_cord/Math.abs(left_cord)*(screen_size.x/2)) + "px";
    e.preventDefault();
  }

  function addOnWheel(elem, handler) {
    if (elem.addEventListener) {
      if ('onwheel' in document) {// IE9+, FF17+
        elem.addEventListener("wheel", handler);
      }
      else if ('onmousewheel' in document) { // устаревший вариант события
        elem.addEventListener("mousewheel", handler);
      }
      else { // 3.5 <= Firefox < 17
        elem.addEventListener("MozMousePixelScroll", handler);
      }
    }
    else { // IE8-
      elem.attachEvent("onmousewheel", handler);
    }
  }

  function scaler(event) {
    var delta = event.deltaY || event.detail || event.wheelDelta;
    if (delta > 0 && scale > 0.2) scale -= 0.1;
    else if(scale <= 4.0) scale += 0.1;
    if (scale > 0.2 && scale <= 4.0){
      elem.style.transform = elem.style.WebkitTransform = elem.style.MsTransform = 'scale(' + scale + ')';
      screen_size = {x: ren.clientWidth*scale, y: ren.clientHeight*scale};
    }
    event.preventDefault();
  }

  addOnWheel(input_panel, function(event) { scaler(event); });
}

function loadConfig(config) {
  cmds.innerHTML = "";
  for (var i = 0; i < config.commands.length; i++) {
    curr_node = empty_textbox.cloneNode();
    curr_node.setAttribute("value", config.commands[i]);
    cmds.appendChild(curr_node);
  }
  rules.innerHTML = "";
  for (var i = 0; i < config.rules.length; i++) {
    curr_node = empty_textbox.cloneNode();
    curr_node.setAttribute("value", config.rules[i]);
    rules.appendChild(curr_node);
  }

  axiom.value = config.axiom;
  angle.value = config.angle;
  lineWidth.value = config.lineWidth;
  lineLength.value = config.lineLength;
  iters.value = config.iterations;
  color.value = config.color;
  bg_color.value = config.bg_color;
  generateFractal();
}

async function generateFractal() {
  clear_svg();
  color_res.value = color.value;
  bg_color_res.value = bg_color.value;
  if(iters.value > 17) iters.value = 17;
  fvars.lineWidth = lineWidth.value;
  fvars.lineLength = lineLength.value;
  fvars.color = color.value;
  r = (255 - parseInt(bg_color.value[1]+bg_color.value[2], 16)).toString(16);
  g = (255 - parseInt(bg_color.value[3]+bg_color.value[4], 16)).toString(16);
  b = (255 - parseInt(bg_color.value[5]+bg_color.value[6], 16)).toString(16);
  invert_color = r+g+b;
  document.querySelector('main').setAttribute("style", `background-color: ${bg_color.value};`);
  main_screen.setAttribute("style", `border: 8px solid #${invert_color}; background-color: ${bg_color.value}; stroke:${color.value};stroke-width:${lineWidth.value};`);
  function create_l_system(axiom, rules) {
    for (var i = 0; i < Number(iters.value); i++) {
      var empty_axiom = '';
      for (var k of axiom) {
        if (rules[k] != undefined) empty_axiom += rules[k];
        else empty_axiom += k;
      }
      axiom = empty_axiom;
    }
    return axiom;
  }
  rule_list = create_rules();
  cmd_list = create_cmds();
  for (var i of create_l_system(axiom.value.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", ''), rule_list)) {
    cmd = cmd_list[i];
    if(cmd != undefined){
      if(cmd[0] == 'DL'){
        drawLine(cmd[1][0], cmd[1][1], cmd[1][2]);
      }else if(cmd[0] == 'T'){
        turn(cmd[1][0])
      }else if(cmd[0] == 'S'){
        saveData()
      }else if(cmd[0] == 'L'){
        loadData()
      }
    }
  }
}

function initPresets(){
  var btn_list = [], spl = '', value = 0;
  for (var i = 0; i < presets.childNodes.length; i++) {
    curr_node = presets.childNodes[i];
    if(curr_node.nodeName == "DIV"){
      btn_list.push(curr_node.childNodes[1].childNodes[3].childNodes[3]);
    }
  }
  btn_list[0].addEventListener("click", () => {
    loadConfig(configs[btn_list[0].id]);
  });
  btn_list[1].addEventListener("click", () => {
    loadConfig(configs[btn_list[1].id]);
  });
  btn_list[2].addEventListener("click", () => {
    loadConfig(configs[btn_list[2].id]);
  });
  //btn_list[3].addEventListener("click", () => {
  //  loadConfig(configs[btn_list[3].id]);
  //});
  //btn_list[4].addEventListener("click", () => {
  //  loadConfig(configs[btn_list[4].id]);
  //});
  console.log(btn_list);
  return btn_list;
}

window.addEventListener('load', function(event) {
  loadConfig(config);
  help_cmd_btn.addEventListener("click", () => {
    alert(`Сначала пишется имя переменной ввиде одного любого символа, потом двоеточие и сама команда.\n\nОписание команд генератора:${doc_cmd}`);
  });
  help_rule_btn.addEventListener("click", () => {
    alert(`Описание правил или присвоение значений переменной генератора:${doc_rule}`);
  });
  add_cmd_btn.addEventListener("click", () => {
    cmds.appendChild(cmds.lastElementChild.cloneNode());
  });
  del_cmd_btn.addEventListener("click", () => {
    console.log(cmds.childNodes.length);
    if(cmds.childNodes.length-1 > 1) cmds.removeChild(cmds.lastElementChild);
  });
  add_rule_btn.addEventListener("click", () => {
    rules.appendChild(rules.lastElementChild.cloneNode());
  });
  del_rule_btn.addEventListener("click", () => {
    if(rules.childNodes.length > 1) rules.removeChild(rules.lastElementChild);
  });
  // stroke:${color.value};stroke-width:${lineWidth.value};
  bg_color.addEventListener("change", () => {
    bg_color_res.value = bg_color.value;
    document.querySelector('main').setAttribute("style", `background-color: ${bg_color.value};`)
    main_screen.setAttribute("style", `border: 8px solid #${invert_color}; background-color: ${bg_color.value};`);
  });
  generate_btn.addEventListener("click", function(){
    generate_spinner.style.display = "";
    generate_text_1.style.display = "";
    generate_text_2.style.display = "none";
    generateFractal();
    setTimeout(() => {
      generate_spinner.style.display = "none";
      generate_text_1.style.display = "none";
      generate_text_2.style.display = "";
    }, 200);
  });
  initPresets();
  dragElement(document.querySelector('#main_screen'), document.querySelector('main'), document.querySelector('#fractal_renderer'));
});