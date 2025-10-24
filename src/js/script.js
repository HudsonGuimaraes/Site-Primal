  document.addEventListener("DOMContentLoaded", () => {
  // ====== ELEMENTOS
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");

  // ====== MENU MOBILE
  if (menuToggle && navMenu) {
    const setIcon = (open) => {
      const icon = menuToggle.querySelector("i");
      if (!icon) return;
      icon.classList.toggle("fa-bars", !open);
      icon.classList.toggle("fa-xmark", open);
    };

    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      setIcon(navMenu.classList.contains("active"));
    });

    // Fecha ao clicar em link
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("active");
        setIcon(false);
      });
    });

    // Fecha se voltar ao desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        setIcon(false);
      }
    });
  }

  // ====== DARK MODE (com persistência)
  if (themeToggle) {
    const applySavedTheme = () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        body.classList.remove("dark-mode");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
    };

    applySavedTheme();

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      // animação premium
      themeToggle.classList.add("active");
      setTimeout(() => themeToggle.classList.remove("active"), 600);
    });
  }

  // ====== FADE-IN AO ROLAR
  const fadeEls = document.querySelectorAll(".fade-in");
  const onScroll = () => {
    fadeEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 100) el.classList.add("visible");
    });
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
});

// ====== INDICADORES DO PROJETO REFLORESCER (edite aqui)
const REFLORESCER = {
  mudas: 3250,       // total de mudas plantadas
  area: 2.1,         // hectares restaurados
  carbono: 10.5,     // tCO2e estimadas (ver metodologia abaixo)
  projetos: 4        // núcleos/projetos ativos
};

function atualizaIndicadores() {
  const m = document.getElementById('indicador-mudas');
  const a = document.getElementById('indicador-area');
  const c = document.getElementById('indicador-carbono');
  const p = document.getElementById('indicador-projetos');
  if (m) m.textContent = REFLORESCER.mudas.toLocaleString('pt-BR');
  if (a) a.textContent = REFLORESCER.area.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  if (c) c.textContent = REFLORESCER.carbono.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  if (p) p.textContent = REFLORESCER.projetos.toLocaleString('pt-BR');
}
document.addEventListener('DOMContentLoaded', atualizaIndicadores);

/* ====== REFLORESCER: Série mensal (edite os números) ======
   label: 'AAAA-MM'  /  value: mudas plantadas no mês
*/
const REFLORESCER_SERIE = [
  { label: '2025-01', value: 120 },
  { label: '2025-02', value: 180 },
  { label: '2025-03', value: 260 },
  { label: '2025-04', value: 220 },
  { label: '2025-05', value: 310 },
  { label: '2025-06', value: 280 }
];

/* ====== Helper: formata rótulo mês/ano para 'MMM/AA' ====== */
function fmtMes(label) {
  const [y, m] = label.split('-').map(Number);
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') + '/' + String(y).slice(-2);
}

/* ====== Cores base (mudam conforme o tema) ====== */
function chartColors() {
  const dark = document.body.classList.contains('dark-mode');
  return {
    bg: dark ? '#111' : '#fff',
    grid: dark ? '#2a2a2a' : '#e9ecef',
    axis: dark ? '#b7e4c7' : '#1b4332',
    bar: dark ? '#95d5b2' : '#2d6a4f',
    barShadow: dark ? 'rgba(149,213,178,.25)' : 'rgba(45,106,79,.18)'
  };
}

/* ====== Renderiza gráfico de barras em canvas (JS puro) ====== */
function renderMudasChart(canvasId, serie) {
  const cvs = document.getElementById(canvasId);
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  // tornar responsivo (largura do container)
  const parent = cvs.parentElement;
  const DPR = window.devicePixelRatio || 1;
  const W = parent.clientWidth;         // CSS pixels
  const H = 360;                        // altura fixa amigável
  cvs.style.width = W + 'px';
  cvs.style.height = H + 'px';
  cvs.width = W * DPR;
  cvs.height = H * DPR;
  ctx.scale(DPR, DPR);

  // áreas e espaçamentos
  const PAD_L = 48, PAD_R = 20, PAD_T = 18, PAD_B = 40;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // dados
  const values = serie.map(d => d.value);
  const maxV = Math.max(...values, 10);
  const yMax = Math.ceil(maxV / 50) * 50;               // arredonda p/ cima
  const step = Math.max(1, Math.floor(values.length));  // nº barras
  const bw = Math.max(22, Math.floor(plotW / (values.length * 1.6))); // largura barra
  const gap = Math.min(24, Math.floor((plotW - bw * values.length) / Math.max(values.length - 1, 1)));

  // cores
  const C = chartColors();

  // fundo
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0,0,W,H);

  // grade horizontal (4 linhas)
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 4; i++) {
    const y = PAD_T + plotH - (i * plotH / 4);
    ctx.moveTo(PAD_L, y + .5);
    ctx.lineTo(PAD_L + plotW, y + .5);
  }
  ctx.stroke();

  // eixos (esquerda e base)
  ctx.strokeStyle = C.axis;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(PAD_L, PAD_T);
  ctx.lineTo(PAD_L, PAD_T + plotH);
  ctx.lineTo(PAD_L + plotW, PAD_T + plotH);
  ctx.stroke();

  // rótulos eixo Y (0, 25%, 50%, 75%, 100%)
  ctx.fillStyle = C.axis;
  ctx.font = '12px Poppins, Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((yMax * i) / 4);
    const y = PAD_T + plotH - (i * plotH / 4);
    ctx.fillText(String(val), PAD_L - 8, y);
  }

  // barras
  let x = PAD_L;
  ctx.fillStyle = C.bar;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const h = (v / yMax) * plotH;
    const bx = x + i * (bw + gap);
    const by = PAD_T + plotH - h;

    // sombra
    ctx.fillStyle = C.barShadow;
    ctx.fillRect(bx, by - 3, bw, h + 3);

    // barra
    ctx.fillStyle = C.bar;
    ctx.beginPath();
    const r = 6; // canto arredondado
    // retângulo com raio no topo
    ctx.moveTo(bx, by + h);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + h);
    ctx.closePath();
    ctx.fill();

    // rótulo X
    ctx.fillStyle = C.axis;
    ctx.font = '11px Poppins, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(fmtMes(serie[i].label), bx + bw / 2, PAD_T + plotH + 8);

    // valor acima da barra
    ctx.textBaseline = 'bottom';
    ctx.fillText(values[i].toLocaleString('pt-BR'), bx + bw / 2, by - 4);
  }
}

/* ====== Inicializa gráfico e re-render no resize/tema ====== */
function initReflorescerChart() {
  renderMudasChart('grafico-mudas', REFLORESCER_SERIE);
}
window.addEventListener('resize', initReflorescerChart);
document.addEventListener('DOMContentLoaded', initReflorescerChart);

// quando trocar o tema, redesenha com novas cores
window.addEventListener('themechange', initReflorescerChart);

if (!window._themeHookInstalled) {
  window._themeHookInstalled = true;
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTimeout(() => window.dispatchEvent(new Event('themechange')), 0);
    });
  }
}
