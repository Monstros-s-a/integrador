document.addEventListener("DOMContentLoaded", (event) => {
  console.log("HTML fully loaded!");
});

const carrossel = document.getElementById("sliderOfertas");
const btnVoltar = document.getElementById("btnVoltar");
const btnAvancar = document.getElementById("btnAvancar");
const btnTema = document.getElementById("btnTema");
const iconeTema = document.getElementById("iconeTema");
const campoBusca = document.getElementById("campoBusca");
const resultadosBusca = document.getElementById("resultadosBusca");

let arrastando = false,
  inicioX,
  scrollInicial,
  tempo;

function mover(distancia) {
  if (!carrossel) return;
  const fim = carrossel.scrollWidth - carrossel.clientWidth;

  if (distancia > 0 && carrossel.scrollLeft >= fim - 10) {
    carrossel.scrollTo({ left: 0, behavior: "smooth" });
  } else if (distancia < 0 && carrossel.scrollLeft === 0) {
    carrossel.scrollTo({ left: carrossel.scrollWidth, behavior: "smooth" });
  } else {
    carrossel.scrollBy({ left: distancia, behavior: "smooth" });
  }
  reiniciarTempo();
}

function reiniciarTempo() {
  if (!carrossel) return;
  clearInterval(tempo);
  tempo = setInterval(() => mover(carrossel.clientWidth), 5000);
}

function pararArrasto() {
  if (!carrossel) return;
  arrastando = false;
  carrossel.classList.remove("arrastando");
  reiniciarTempo();
}

if (carrossel) {
  if (btnAvancar)
    btnAvancar.addEventListener("click", () => mover(carrossel.clientWidth));
  if (btnVoltar)
    btnVoltar.addEventListener("click", () => mover(-carrossel.clientWidth));

  carrossel.addEventListener("mousedown", (e) => {
    arrastando = true;
    carrossel.classList.add("arrastando");
    inicioX = e.pageX - carrossel.offsetLeft;
    scrollInicial = carrossel.scrollLeft;
    clearInterval(tempo);
  });

  carrossel.addEventListener("mousemove", (e) => {
    if (!arrastando) return;
    e.preventDefault();
    const movimento = (e.pageX - carrossel.offsetLeft - inicioX) * 2;
    carrossel.scrollLeft = scrollInicial - movimento;
  });

  carrossel.addEventListener("mouseup", pararArrasto);
  carrossel.addEventListener("mouseleave", pararArrasto);
  carrossel.addEventListener("touchstart", () => clearInterval(tempo));
  carrossel.addEventListener("touchend", reiniciarTempo);

  reiniciarTempo();
}

// Essa bomba aqui q não funciona né?
function trocarImagemTema(escuro) {
  if (escuro) iconeTema.src = "./assets/icons/sol.svg";
  else iconeTema.src = "./assets/icons/lua.svg";
}

if (btnTema) {
  const temaSalvo = localStorage.getItem("tema") === "escuro";
  if (temaSalvo) {
    document.body.classList.add("modo-escuro");
  }
  trocarImagemTema(temaSalvo);

  btnTema.addEventListener("click", () => {
    const escuro = document.body.classList.toggle("modo-escuro");
    localStorage.setItem("tema", escuro ? "escuro" : "claro");
    trocarImagemTema(escuro);
  });
}

function formatarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();
}

if (campoBusca && resultadosBusca) {
  const itensComida = document.querySelectorAll(".comidas-item");

  campoBusca.addEventListener("input", (e) => {
    const termo = formatarTexto(e.target.value);
    resultadosBusca.innerHTML = "";

    if (termo.length === 0) {
      resultadosBusca.classList.remove("ativo");
      itensComida.forEach(card => card.style.display = "");
      return;
    }

    let encontrou = false;

    itensComida.forEach((card) => {
      const tituloElemento = card.querySelector("h2");
      if (!tituloElemento) return;
      
      const titulo = tituloElemento.textContent;
      const tituloFormatado = formatarTexto(titulo);

      if (tituloFormatado.includes(termo)) {
        encontrou = true;
        const opcao = document.createElement("div");
        opcao.className = "item-busca";
        opcao.textContent = titulo;

        opcao.addEventListener("click", () => {
          campoBusca.value = titulo;
          resultadosBusca.classList.remove("ativo");
          
          itensComida.forEach(c => {
            c.style.display = c === card ? "" : "none";
          });
          
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        });

        resultadosBusca.appendChild(opcao);
      }
    });

    if (encontrou) {
      resultadosBusca.classList.add("ativo");
    } else {
      resultadosBusca.classList.remove("ativo");
    }
  });

  document.addEventListener("click", (e) => {
    if (!campoBusca.contains(e.target) && !resultadosBusca.contains(e.target)) {
      resultadosBusca.classList.remove("ativo");
    }
  });
}

const caminho = window.location.pathname;
document.querySelectorAll(".menu a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href !== "#" && href !== "#inicio" && caminho.includes(href)) {
    link.classList.add("ativo");
  }
});

document.getElementById('btnMenu').addEventListener('click', function() {
  document.getElementById('linksMenu').classList.toggle('ativo');
});