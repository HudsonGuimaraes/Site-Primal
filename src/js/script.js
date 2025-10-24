  // MENU RESPONSIVO
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');

    // Trocar ícone (hambúrguer ↔ X)
    const icon = menuToggle.querySelector('i');
    if (menuToggle.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('open');
      menuToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
    });
  });

  // EFEITO FADE-IN AO ROLAR
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (!themeToggle) {
    console.error("❌ Botão de tema não encontrado!");
    return;
  }

  // Verifica tema salvo
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  // Alterna tema ao clicar
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    themeToggle.classList.add("active"); // animação

    if (body.classList.contains("dark-mode")) {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", "light");
    }

    // remove animação após término
    setTimeout(() => themeToggle.classList.remove("active"), 600);
  });
});
