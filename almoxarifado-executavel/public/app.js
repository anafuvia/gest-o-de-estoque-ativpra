async function api(url, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options
  };

  const resposta = await fetch(url, config);

  if (resposta.status === 401 && !location.pathname.endsWith("login.html")) {
    location.href = "/login.html";
    throw new Error("Sessão expirada.");
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao processar a solicitação.");
  }

  return dados;
}

function mostrarMensagem(elemento, texto, tipo = "success") {
  elemento.textContent = texto;
  elemento.className = `message show ${tipo}`;
}

async function carregarUsuario() {
  const el = document.querySelector("[data-user]");
  if (!el) return;

  try {
    const usuario = await api("/api/me");
    el.textContent = usuario.nome;
  } catch (_) {}
}

async function sair() {
  await api("/api/logout", { method: "POST" });
  location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  const logout = document.querySelector("[data-logout]");
  if (logout) logout.addEventListener("click", sair);
});
