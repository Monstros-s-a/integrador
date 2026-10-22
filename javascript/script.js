const carrossel = document.getElementById('sliderOfertas');
const btnVoltar = document.getElementById('btnVoltar');
const btnAvancar = document.getElementById('btnAvancar');
const btnTema = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');

let arrastando = false, inicioX, scrollInicial, tempo;

function mover(distancia) {
  if (!carrossel) return;
  const tamanho = carrossel.clientWidth;
  const fim = carrossel.scrollWidth - tamanho;

  if (distancia > 0 && carrossel.scrollLeft >= fim - 10) {
    carrossel.scrollTo({ left: 0, behavior: 'smooth' });
  } else if (distancia < 0 && carrossel.scrollLeft === 0) {
    carrossel.scrollTo({ left: carrossel.scrollWidth, behavior: 'smooth' });
  } else {
    carrossel.scrollBy({ left: distancia, behavior: 'smooth' });
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
  carrossel.classList.remove('arrastando');
  reiniciarTempo();
}

if (carrossel) {
  if (btnAvancar) btnAvancar.addEventListener('click', () => mover(carrossel.clientWidth));
  if (btnVoltar) btnVoltar.addEventListener('click', () => mover(-carrossel.clientWidth));

  carrossel.addEventListener('mousedown', (e) => {
    arrastando = true;
    carrossel.classList.add('arrastando');
    inicioX = e.pageX - carrossel.offsetLeft;
    scrollInicial = carrossel.scrollLeft;
    clearInterval(tempo);
  });

  carrossel.addEventListener('mousemove', (e) => {
    if (!arrastando) return;
    e.preventDefault();
    const movimento = (e.pageX - carrossel.offsetLeft - inicioX) * 2;
    carrossel.scrollLeft = scrollInicial - movimento;
  });

  carrossel.addEventListener('mouseup', pararArrasto);
  carrossel.addEventListener('mouseleave', pararArrasto);
  carrossel.addEventListener('touchstart', () => clearInterval(tempo));
  carrossel.addEventListener('touchend', reiniciarTempo);

  reiniciarTempo();
}

if (btnTema) {
  btnTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');

    if (iconeTema) {
      if (document.body.classList.contains('modo-escuro')) {
        iconeTema.setAttribute('src', '../assets/sol.svg');
      } else {
        iconeTema.setAttribute('src', '../assets/lua svg.svg');
      }
    }
  });
}