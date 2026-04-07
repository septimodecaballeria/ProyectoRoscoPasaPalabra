// ===== Configuración inicial =====
let preguntas = [];
let aciertos = 0;
let fallos = 0;
let indice = 0;
let tiempo = 120; // Cambiar este valor para ajustar tiempo

// ===== Cargar preguntas desde JSON =====
fetch("preguntas.json")
  .then(r => r.json())
  .then(data => {
    preguntas = data.map(p => ({...p, estado:0}));
    crearRosco();
    mostrar();
    mostrarContador();
    reloj();
  });

// ===== Crear rosco =====
function crearRosco(){
  const r = 200;
  preguntas.forEach((p,i) => {
    const ang = (i / preguntas.length) * 2 * Math.PI;
    const x = r * Math.cos(ang) + 220;
    const y = r * Math.sin(ang) + 220;

    const div = document.createElement("div");
    div.className = "letra";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.textContent = p.letra;

    document.getElementById("rosco").appendChild(div);
  });
}

// ===== Mostrar pregunta actual =====
function mostrar(){
  let vueltas = 0;
  while(preguntas[indice].estado !== 0){
    indice = (indice + 1) % preguntas.length;
    vueltas++;
    if(vueltas > preguntas.length) return terminar();
  }

  document.querySelectorAll(".letra").forEach(l => l.classList.remove("activa"));
  document.querySelectorAll(".letra")[indice].classList.add("activa");

  const p = document.getElementById("pregunta");
  p.style.opacity = 0;
  setTimeout(() => {
    p.textContent = preguntas[indice].pregunta;
    p.style.opacity = 1;
  }, 200);
}

// ===== Responder =====
function responder(){
  const val = document.getElementById("respuesta").value.toLowerCase().trim();
  const correcta = preguntas[indice].respuesta;
  const div = document.querySelectorAll(".letra")[indice];

  if(val === correcta){
    preguntas[indice].estado = 1;
    div.classList.add("correcta");
    aciertos++;
    document.getElementById("ok").play();
  } else {
    preguntas[indice].estado = 2;
    div.classList.add("incorrecta");
    fallos++;
    document.getElementById("fail").play();
  }

  document.getElementById("respuesta").value = "";
  indice = (indice + 1) % preguntas.length;
  mostrarContador();
  mostrar();
}

// ===== Pasapalabra =====
function pasar(){
  indice = (indice + 1) % preguntas.length;
  mostrar();
}

// ===== Botones profesor =====
function verRespuestas(){
  alert("Respuesta correcta: " + preguntas[indice].respuesta);
}

function saltar(){
  indice = (indice + 1) % preguntas.length;
  mostrar();
}

// ===== Temporizador =====
function reloj(){
  const t = setInterval(() => {
    tiempo--;
    document.getElementById("tiempo").textContent = tiempo;
    if(tiempo <= 0){
      clearInterval(t);
      terminar();
    }
  }, 1000);
}

// ===== Final del juego =====
function terminar(){
  alert(`⏱ Fin del juego! Aciertos: ${aciertos} | Fallos: ${fallos}`);
}

// ===== Mostrar contador en tiempo real =====
function mostrarContador(){
  document.getElementById("aciertos").textContent = aciertos;
  document.getElementById("fallos").textContent = fallos;
}
