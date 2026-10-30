function trocarImagemTema(escuro) {
  if (escuro) iconeTema.src = "../assets/icons/sol.svg";
  else iconeTema.src = "../assets/icons/lua.svg";
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