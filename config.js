config = {
  "commands": [
    "F: DrawLine(D, D, D)",
    "+: Turn(D)",
    "R: Turn(90)",
    "-: Turn(-D)",
    "[: Save()",
    "]: Load()"
  ],
  "rules": [
    //"X: X+YF+",
    //"Y: -FX-Y"
    //"X: F[+X]F[-X]+X",
    "X: --FXF++FXF++FXF--",
    "F: FF"
  ],
  "axiom": "RFXF--FF--FF",
  "angle": 60,
  //"axiom": "FX",
  //"angle": 90,
  //"axiom": "X",
  //"angle": 22.5,(190, 128, 255)rgb(63, 127, 255)
  "lineWidth": 2,
  "lineLength": 5,
  "iterations": 5,
  "color": "#3F7FFF",
  "bg_color": "#37d0d5"
}