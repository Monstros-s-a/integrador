document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.getElementById("sliderOfertas");
  const btnVoltar = document.getElementById("btnVoltar");
  const btnAvancar = document.getElementById("btnAvancar");
  const btnTema = document.getElementById("btnTema");
  const iconeTema = document.getElementById("iconeTema");
  const btnMenu = document.getElementById("btnMenu");
  const linksMenu = document.getElementById("linksMenu");
  const campoBusca = document.getElementById("campoBusca");
  const resultadosBusca = document.getElementById("resultadosBusca");
  const modal = document.getElementById("modalReserva");
  const fecharModal = document.getElementById("fecharModal");
  const btnConfirmar = document.getElementById("btnConfirmarReserva");
  const formCadastro = document.getElementById("formCadastro");
  const validadeAlimento = document.getElementById("validadeAlimento");

  let arrastando = false, inicioX, scrollInicial, tempo;

  if (validadeAlimento) {
    const hoje = new Date().toISOString().split("T")[0];
    validadeAlimento.setAttribute("min", hoje);
  }

  function exibirToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("visivel");
    setTimeout(() => toast.classList.remove("visivel"), 3500);
  }

  function mostrarErro(input, mensagem) {
    limparErro(input);
    input.classList.add("campo-invalido");
    const msg = document.createElement("span");
    msg.className = "msg-erro";
    msg.textContent = mensagem;
    input.parentNode.appendChild(msg);
  }

  function limparErro(input) {
    input.classList.remove("campo-invalido");
    const msgExistente = input.parentNode.querySelector(".msg-erro");
    if (msgExistente) msgExistente.remove();
  }

  if (formCadastro) {
    const inputs = formCadastro.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener("input", () => limparErro(input));
    });

    formCadastro.addEventListener("submit", (e) => {
      e.preventDefault();
      let formularioValido = true;

      inputs.forEach((input) => {
        const valor = input.value.trim();

        if (!valor) {
          mostrarErro(input, "Este campo é obrigatório.");
          formularioValido = false;
        } else if (input.type === "number" && Number(valor) <= 0) {
          mostrarErro(input, "Informe uma quantidade válida maior que zero.");
          formularioValido = false;
        } else if (input.type === "tel") {
          const apenasNumeros = valor.replace(/\D/g, "");
          if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
            mostrarErro(input, "Informe um número de WhatsApp válido com DDD.");
            formularioValido = false;
          }
        }
      });

      if (formularioValido) {
        exibirToast("Doação publicada com sucesso! O item já está visível.");
        formCadastro.reset();
      }
    });
  }

  function atualizarVisibilidadeSecoes() {
    document.querySelectorAll(".secao-comidas").forEach((secao) => {
      const temCardVisivel = Array.from(secao.querySelectorAll(".comidas-item"))
        .some((card) => card.style.display !== "none");
      
      secao.style.display = temCardVisivel ? "" : "none";
    });
  }

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
    if (btnAvancar) btnAvancar.addEventListener("click", () => mover(carrossel.clientWidth));
    if (btnVoltar) btnVoltar.addEventListener("click", () => mover(-carrossel.clientWidth));

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

  function trocarImagemTema(escuro) {
    if (!iconeTema) return;
    const srcAtual = iconeTema.getAttribute("src");
    if (srcAtual) {
      iconeTema.src = escuro ? srcAtual.replace("lua.svg", "sol.svg") : srcAtual.replace("sol.svg", "lua.svg");
    }
  }

  if (btnTema) {
    const temaSalvo = localStorage.getItem("tema") === "escuro";
    if (temaSalvo) document.body.classList.add("modo-escuro");
    trocarImagemTema(temaSalvo);

    btnTema.addEventListener("click", () => {
      const escuro = document.body.classList.toggle("modo-escuro");
      localStorage.setItem("tema", escuro ? "escuro" : "claro");
      trocarImagemTema(escuro);
    });
  }

  if (btnMenu && linksMenu) {
    btnMenu.addEventListener("click", () => linksMenu.classList.toggle("ativo"));
  }

  const caminho = window.location.pathname;
  document.querySelectorAll(".menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#" && href !== "#inicio" && caminho.includes(href)) {
      link.classList.add("ativo");
    }
  });

  function formatarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();
  }

  if (campoBusca && resultadosBusca) {
    const estaNaPaginaOfertas = caminho.includes("ofertas.html");
    let listaProdutosBusca = [];

    function coletarProdutosLocais() {
      document.querySelectorAll(".comidas-item h2").forEach((h2) => {
        const titulo = h2.textContent.trim();
        if (!listaProdutosBusca.some((item) => item.titulo === titulo)) {
          listaProdutosBusca.push({
            titulo: titulo,
            card: h2.closest(".comidas-item")
          });
        }
      });
    }

    coletarProdutosLocais();

    if (!estaNaPaginaOfertas) {
      const caminhoOfertas = caminho.includes("/html/") ? "ofertas.html" : "html/ofertas.html";
      fetch(caminhoOfertas)
        .then((res) => res.text())
        .then((htmlText) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
          doc.querySelectorAll(".comidas-item h2").forEach((h2) => {
            const titulo = h2.textContent.trim();
            if (!listaProdutosBusca.some((item) => item.titulo === titulo)) {
              listaProdutosBusca.push({
                titulo: titulo,
                card: null
              });
            }
          });
        })
        .catch(() => {});
    }

    function aplicarFiltro(termo) {
      document.querySelectorAll(".comidas-item").forEach((card) => {
        const titulo = card.querySelector("h2") ? card.querySelector("h2").textContent : "";
        const visivel = formatarTexto(titulo).includes(termo);
        card.style.display = visivel ? "" : "none";
      });
      atualizarVisibilidadeSecoes();
    }

    campoBusca.addEventListener("input", (e) => {
      const termo = formatarTexto(e.target.value);
      resultadosBusca.innerHTML = "";

      if (termo.length === 0) {
        resultadosBusca.classList.remove("ativo");
        if (estaNaPaginaOfertas) aplicarFiltro("");
        return;
      }

      let encontrou = false;

      listaProdutosBusca.forEach((item) => {
        if (formatarTexto(item.titulo).includes(termo)) {
          encontrou = true;
          const opcao = document.createElement("div");
          opcao.className = "item-busca";
          opcao.textContent = item.titulo;

          opcao.addEventListener("click", () => {
            campoBusca.value = item.titulo;
            resultadosBusca.classList.remove("ativo");

            if (estaNaPaginaOfertas) {
              aplicarFiltro(formatarTexto(item.titulo));
              if (item.card) {
                item.card.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            } else {
              const proximoCaminho = caminho.includes("/html/") ? "ofertas.html" : "html/ofertas.html";
              window.location.href = `${proximoCaminho}?busca=${encodeURIComponent(item.titulo)}`;
            }
          });

          resultadosBusca.appendChild(opcao);
        }
      });

      if (encontrou) {
        resultadosBusca.classList.add("ativo");
      } else {
        const semResultado = document.createElement("div");
        semResultado.className = "item-busca item-sem-resultado";
        semResultado.textContent = "Nenhuma oferta encontrada 🔍";
        resultadosBusca.appendChild(semResultado);
        resultadosBusca.classList.add("ativo");
      }
    });

    campoBusca.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && campoBusca.value.trim() !== "") {
        const termo = campoBusca.value.trim();
        if (!estaNaPaginaOfertas) {
          const proximoCaminho = caminho.includes("/html/") ? "ofertas.html" : "html/ofertas.html";
          window.location.href = `${proximoCaminho}?busca=${encodeURIComponent(termo)}`;
        } else {
          aplicarFiltro(formatarTexto(termo));
          resultadosBusca.classList.remove("ativo");
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (!campoBusca.contains(e.target) && !resultadosBusca.contains(e.target)) {
        resultadosBusca.classList.remove("ativo");
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const termoUrl = urlParams.get("busca");

    if (termoUrl && estaNaPaginaOfertas) {
      campoBusca.value = termoUrl;
      aplicarFiltro(formatarTexto(termoUrl));
    }
  }

  if (modal) {
    document.querySelectorAll(".comidas-item").forEach((card) => {
      card.style.cursor = "pointer";

      card.addEventListener("click", () => {
        const titulo = card.querySelector("h2").textContent;
        const img = card.querySelector("img").src;
        const paragrafo = card.querySelector("p");
        const desc = paragrafo ? paragrafo.textContent : "Retirada no local.";

        document.getElementById("modalTitulo").textContent = titulo;
        document.getElementById("modalImg").src = img;
        document.getElementById("modalDesc").textContent = desc;

        modal.classList.add("ativo");
      });
    });

    if (fecharModal) fecharModal.addEventListener("click", () => modal.classList.remove("ativo"));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("ativo");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("ativo")) {
        modal.classList.remove("ativo");
      }
    });

    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", () => {
        exibirToast("Reserva confirmada com sucesso! O estabelecimento foi notificado.");
        modal.classList.remove("ativo");
      });
    }
  }
});