// ===== Menu mobile =====
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('is-open'))
);

// ===== Faíscas subindo no hero =====
const sparks = document.querySelector('.sparks');
for (let i = 0; i < 28; i++) {
  const s = document.createElement('i');
  s.style.left = Math.random() * 100 + '%';
  s.style.animationDuration = 6 + Math.random() * 8 + 's';
  s.style.animationDelay = -Math.random() * 14 + 's';
  const size = 2 + Math.random() * 3;
  s.style.width = s.style.height = size + 'px';
  sparks.appendChild(s);
}

// ===== Modelo 3D do painel solar (gira sozinho, volta ao lugar após interação) =====
const painelModel = document.querySelector('.painel__model');
if (painelModel) {
  const homeOrbit = painelModel.getAttribute('camera-orbit');
  let voltarTimer = null;

  painelModel.addEventListener('camera-change', (e) => {
    if (e.detail.source !== 'user-interaction') return;
    painelModel.autoRotate = false;
    clearTimeout(voltarTimer);
    voltarTimer = setTimeout(() => {
      painelModel.cameraOrbit = homeOrbit;
      painelModel.autoRotate = true;
    }, 1200);
  });
}

// ===== Simulador de economia (estimativa) =====
// Premissas: tarifa média R$ 0,95/kWh, geração ≈ 115 kWh/mês por kWp,
// painel de 550 W, economia de 90% da conta (taxa mínima permanece).
const TARIFA = 0.95, GERACAO_KWP = 115, PAINEL_KW = 0.55, ECONOMIA = 0.9;
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const bill = document.getElementById('bill');

function simular() {
  const conta = Number(bill.value);
  const kwh = conta / TARIFA;
  const kwp = kwh / GERACAO_KWP;
  const mensal = conta * ECONOMIA;
  const total = mensal * 12 * 25;

  document.getElementById('billOut').textContent = conta.toLocaleString('pt-BR');
  document.getElementById('rMonth').textContent = brl(mensal);
  document.getElementById('rLife').textContent =
    total >= 1e6 ? 'R$ ' + (total / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi'
                 : 'R$ ' + Math.round(total / 1000).toLocaleString('pt-BR') + ' mil';
  document.getElementById('rKwp').textContent = kwp.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' kWp';
  document.getElementById('rPanels').textContent = Math.max(1, Math.ceil(kwp / PAINEL_KW));
}
bill.addEventListener('input', simular);
simular();

// ===== Animação de entrada ao rolar =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.section__head, .card, .node, .gallery__item, .sim__box, .cta').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ===== Formulário -> abre WhatsApp com os dados preenchidos =====
document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.trim();
  const servico = form.servico.value;
  const mensagem = form.mensagem.value.trim();

  const texto = `Olá! Quero um orçamento.\n\nNome: ${nome}\nTelefone: ${telefone}\nServiço: ${servico}` +
    (mensagem ? `\nMensagem: ${mensagem}` : '');

  window.open(`https://wa.me/5517991301698?text=${encodeURIComponent(texto)}`, '_blank');
});

document.getElementById('year').textContent = new Date().getFullYear();
