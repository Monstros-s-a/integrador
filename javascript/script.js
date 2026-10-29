const carrossel = document.getElementById('sliderOfertas');
const btnVoltar = document.getElementById('btnVoltar');
const btnAvancar = document.getElementById('btnAvancar');
const btnTema = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');
const campoBusca = document.getElementById('campoBusca');

let arrastando = false, inicioX, scrollInicial, tempo;

function mover(distancia) {
  if (!carrossel) return;
  const fim = carrossel.scrollWidth - carrossel.clientWidth;

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

function trocarImagemTema(escuro) {
  if (!iconeTema) return;
  const src = iconeTema.getAttribute('src') || '';
  const pasta = src.startsWith('./') ? '../assets/icons/' : 'assets/icons';
  iconeTema.src = pasta + (escuro ? 'sol.svg' : 'lua.svg');
}

if (btnTema) {
  const temaSalvo = localStorage.getItem('tema') === 'escuro';
  if (temaSalvo) {
    document.body.classList.add('modo-escuro');
  }
  trocarImagemTema(temaSalvo);

  btnTema.addEventListener('click', () => {
    const escuro = document.body.classList.toggle('modo-escuro');
    localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    trocarImagemTema(escuro);
  });
}

if (campoBusca) {
  campoBusca.addEventListener('input', () => {
    const termo = campoBusca.value.toLowerCase();
    document.querySelectorAll('.comidas-item').forEach((card) => {
      const achou = card.textContent.toLowerCase().includes(termo);
      card.style.display = achou ? '' : 'none';
    });
  });
}

const caminho = window.location.pathname;
document.querySelectorAll('.menu a').forEach((link) => {
  const href = link.getAttribute('href');
  if (href && href !== '#' && href !== '#inicio' && caminho.includes(href)) {
    link.classList.add('ativo');
  }
});