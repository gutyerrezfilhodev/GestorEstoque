const MIN_SETORES = 1;
const MAX_SETORES = 6;

const UNIDADES = [
  { value: 'dias', label: 'Dia(s)' },
  { value: 'semanas', label: 'Semana(s)' },
  { value: 'meses', label: 'Mês/Meses' }
];

let state = [];
let sectorToDeleteIndex = null;
let produtos = [];

const numInput = document.getElementById('numSetores');
const rowsEl = document.getElementById('rows');
const decBtn = document.getElementById('decBtn');
const incBtn = document.getElementById('incBtn');
const confirmarBtn = document.getElementById('confirmarBtn');
const incluirSetorBtn = document.getElementById('incluirSetorBtn');
const fundirSetoresBtn = document.getElementById('fundirSetoresBtn');
const initialSetupBlock = document.getElementById('initialSetupBlock');
const postSetupBlock = document.getElementById('postSetupBlock');

const homeView = document.getElementById('homeView');
const setorView = document.getElementById('setorView');
const setorTitle = document.getElementById('setorTitle');
const divisoesGrid = document.getElementById('divisoesGrid');
const topNavbar = document.getElementById('topNavbar');
const backBtn = document.getElementById('backBtn');

const secaoCadastro = document.getElementById('secaoCadastro');
const secaoConferencia = document.getElementById('secaoConferencia');
const secaoAlerta = document.getElementById('secaoAlerta');
const secaoMovimentacoes = document.getElementById('secaoMovimentacoes');
const secaoEstoque = document.getElementById('secaoEstoque');
const secaoTabelaPrecos = document.getElementById('secaoTabelaPrecos');
const secaoCompras = document.getElementById('secaoCompras');

const conferenciaList = document.getElementById('conferenciaList');
const alertaList = document.getElementById('alertaList');

const deleteModal = document.getElementById('deleteModal');
const modalDesc = document.getElementById('modalDesc');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

const TOP_BOTOES = [
  {
    id: 'cadastro',
    nome: 'Cadastro',
    icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'
  },
  {
    id: 'movimentacoes',
    nome: 'Movimentações',
    icon: '<path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/>'
  },
  {
    id: 'estoque',
    nome: 'Estoque',
    icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>'
  },
  {
    id: 'tabelaprecos',
    nome: 'Tabela de Preços',
    icon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
  },
  {
    id: 'compras',
    nome: 'Compras',
    icon: '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>'
  }
];

const SIDEBAR_DIVISOES = [
  {
    id: 'conferencia',
    nome: 'Conferência de Estoque',
    sub: 'Validação rápida de itens',
    icon: '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>'
  },
  {
    id: 'alerta',
    nome: 'Alerta de Vencimento',
    sub: 'Controle de prazos e validades',
    icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
  }
];

function clamp(v) {
  if (isNaN(v)) return MIN_SETORES;
  return Math.min(MAX_SETORES, Math.max(MIN_SETORES, v));
}

function arrowIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
}

function editIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
}

function trashIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
}

function updateStepperButtons(n) {
  decBtn.disabled = n <= MIN_SETORES;
  incBtn.disabled = n >= MAX_SETORES;
}

function trocarSecao(id) {
  secaoCadastro.hidden = (id !== 'cadastro');
  secaoConferencia.hidden = (id !== 'conferencia');
  secaoAlerta.hidden = (id !== 'alerta');
  secaoMovimentacoes.hidden = (id !== 'movimentacoes');
  secaoEstoque.hidden = (id !== 'estoque');
  secaoTabelaPrecos.hidden = (id !== 'tabelaprecos');
  secaoCompras.hidden = (id !== 'compras');

  if (id === 'conferencia') renderConferencia();
  if (id === 'alerta') renderAlerta();
}

function openSetor(i) {
  const nomeFinal = state[i].nome || ('Setor ' + (i + 1));
  setorTitle.textContent = nomeFinal;

  // Renderiza barra superior (agora com o Cadastro incluso)
  topNavbar.innerHTML = '';
  TOP_BOTOES.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'top-nav-btn';
    if (b.id === 'cadastro') btn.classList.add('active'); // Deixa o Cadastro selecionado por padrão ao entrar
    btn.innerHTML = `
      <div class="top-nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${b.icon}</svg></div>
      <p class="top-nav-title">${b.nome}</p>
    `;
    btn.addEventListener('click', () => {
      topNavbar.querySelectorAll('.top-nav-btn').forEach(c => c.classList.remove('active'));
      divisoesGrid.querySelectorAll('.divisao-card').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      trocarSecao(b.id);
    });
    topNavbar.appendChild(btn);
  });

  // Renderiza barra lateral direita (Conferência e Alerta)
  divisoesGrid.innerHTML = '';
  SIDEBAR_DIVISOES.forEach((d) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'divisao-card';
    card.innerHTML = `
      <div class="divisao-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d.icon}</svg></div>
      <div class="divisao-info">
        <p class="divisao-title">${d.nome}</p>
        <p class="divisao-sub">${d.sub}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      topNavbar.querySelectorAll('.top-nav-btn').forEach(c => c.classList.remove('active'));
      divisoesGrid.querySelectorAll('.divisao-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      trocarSecao(d.id);
    });
    divisoesGrid.appendChild(card);
  });

  trocarSecao('cadastro');
  homeView.hidden = true;
  setorView.hidden = false;
}

function promptDeleteSetor(index) {
  sectorToDeleteIndex = index;
  const nomeSetor = state[index].nome || ('Setor ' + (index + 1));
  modalDesc.textContent = `Tem certeza de que deseja excluir o "${nomeSetor}"?`;
  deleteModal.hidden = false;
}

function confirmDeleteSetor() {
  if (sectorToDeleteIndex !== null) {
    state.splice(sectorToDeleteIndex, 1);
    sectorToDeleteIndex = null;
    deleteModal.hidden = true;

    if (state.length === 0) {
      initialSetupBlock.hidden = false;
      postSetupBlock.hidden = true;
      rowsEl.hidden = true;
      numInput.value = 1;
      updateStepperButtons(1);
    } else {
      renderRows();
    }
  }
}

cancelDeleteBtn.addEventListener('click', () => { deleteModal.hidden = true; });
confirmDeleteBtn.addEventListener('click', confirmDeleteSetor);

function renderRows() {
  rowsEl.innerHTML = '';
  state.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'row-sector';

    const selectOptions = UNIDADES.map((u) => {
      const isSelected = u.value === s.unidade ? 'selected' : '';
      return `<option value="${u.value}" ${isSelected}>${u.label}</option>`;
    }).join('');

    const inputNomeHTML = s.editando ? `
      <div class="field">
        <label for="nome-${i}">Nome do setor ${i + 1}</label>
        <div class="name-edit-group">
          <input type="text" id="nome-${i}" placeholder="Ex.: Odontologia" value="${s.nome}">
          <button type="button" class="confirm-name-btn" id="confirm-name-${i}">OK</button>
        </div>
      </div>
    ` : `<div class="field"></div>`;

    row.innerHTML = `
      <button type="button" class="go-btn" id="btn-${i}">
        <span>${s.nome || ('Setor ' + (i + 1))}</span>
        ${arrowIcon()}
      </button>
      ${inputNomeHTML}
      <div class="field">
        <label>Periodicidade de compra</label>
        <div class="periodicidade-group">
          <select id="unidade-${i}">
            <option value="" disabled ${s.unidade === '' ? 'selected' : ''}>Selecione...</option>
            ${selectOptions}
          </select>
          <div class="num-wrapper">
            <input type="number" id="valor-${i}" min="1" value="${s.valor}" ${s.unidade === '' ? 'disabled' : ''}>
          </div>
        </div>
      </div>
      <div class="row-actions">
        ${!s.editando ? `<button type="button" class="icon-btn edit-btn" id="edit-${i}" title="Editar nome">${editIcon()}</button>` : ''}
        <button type="button" class="icon-btn delete-btn" id="del-${i}" title="Excluir">${trashIcon()}</button>
      </div>
    `;

    rowsEl.appendChild(row);

    const valorInput = row.querySelector(`#valor-${i}`);
    const unidadeSelect = row.querySelector(`#unidade-${i}`);
    const btn = row.querySelector(`#btn-${i}`);
    const delBtn = row.querySelector(`#del-${i}`);

    if (s.editando) {
      const nomeInput = row.querySelector(`#nome-${i}`);
      const confirmNameBtn = row.querySelector(`#confirm-name-${i}`);
      nomeInput.addEventListener('input', (e) => { state[i].nome = e.target.value; });
      confirmNameBtn.addEventListener('click', () => { state[i].editando = false; renderRows(); });
    } else {
      row.querySelector(`#edit-${i}`).addEventListener('click', () => { state[i].editando = true; renderRows(); });
    }

    unidadeSelect.addEventListener('change', (e) => {
      state[i].unidade = e.target.value;
      valorInput.disabled = false;
    });

    valorInput.addEventListener('input', (e) => {
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      state[i].valor = v;
    });

    btn.addEventListener('click', () => openSetor(i));
    delBtn.addEventListener('click', () => promptDeleteSetor(i));
  });

  incluirSetorBtn.disabled = state.length >= MAX_SETORES;
  fundirSetoresBtn.disabled = state.length < 2;
  rowsEl.hidden = false;
}

confirmarBtn.addEventListener('click', () => {
  const n = clamp(parseInt(numInput.value, 10));
  state = Array.from({ length: n }, () => ({ nome: '', valor: 1, unidade: '', editando: true }));
  initialSetupBlock.hidden = true;
  postSetupBlock.hidden = false;
  renderRows();
});

incluirSetorBtn.addEventListener('click', () => {
  if (state.length < MAX_SETORES) {
    state.push({ nome: '', valor: 1, unidade: '', editando: true });
    renderRows();
  }
});

fundirSetoresBtn.addEventListener('click', () => {
  if (state.length < 2) return;
  const nomes = state.map(s => s.nome.trim()).filter(Boolean);
  const nomeFundido = nomes.length > 0 ? nomes.join(' + ') : 'Setor Fundido';
  state = [{ nome: nomeFundido, valor: state[0].valor, unidade: state[0].unidade, editando: false }];
  renderRows();
});

numInput.addEventListener('input', (e) => {
  const v = clamp(parseInt(e.target.value, 10));
  e.target.value = v;
  updateStepperButtons(v);
});

decBtn.addEventListener('click', () => {
  const v = clamp(parseInt(numInput.value, 10) - 1);
  numInput.value = v;
  updateStepperButtons(v);
});

incBtn.addEventListener('click', () => {
  const v = clamp(parseInt(numInput.value, 10) + 1);
  numInput.value = v;
  updateStepperButtons(v);
});

backBtn.addEventListener('click', () => {
  setorView.hidden = true;
  homeView.hidden = false;
});

updateStepperButtons(clamp(parseInt(numInput.value, 10)));

// Lógica de Produtos
const form = document.getElementById('productForm');
const feedback = document.getElementById('feedback');
const list = document.getElementById('list');
const listWrap = document.getElementById('listWrap');

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
}

function renderProdutos() {
  list.innerHTML = '';
  if (produtos.length === 0) {
    listWrap.style.display = 'none';
    return;
  }
  listWrap.style.display = 'block';
  produtos.slice().reverse().forEach((p, idxRev) => {
    const idx = produtos.length - 1 - idxRev;
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div class="info">
        <p class="name">${p.produto} <span>(${p.marca})</span></p>
        <p class="meta">Código ${p.codigo} · Lote ${p.lote} · Val. ${formatDate(p.validade)} · ${p.unidade}</p>
        <p class="meta">${p.preco ? 'Preço R$ ' + parseFloat(p.preco).toFixed(2) + ' · ' : ''}${p.consumoMensal ? 'Consumo mensal ' + p.consumoMensal + ' · ' : ''}Estoque ${p.entradaQtd || 0}${p.dental ? ' · Dental: ' + p.dental : ''}</p>
      </div>
      <button type="button" data-idx="${idx}" class="del-btn" aria-label="Remover produto">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      produtos.splice(parseInt(btn.dataset.idx), 1);
      renderProdutos();
      checarCodigo();
    });
  });
}

function renderConferencia() {
  conferenciaList.innerHTML = '';
  if (produtos.length === 0) {
    conferenciaList.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); margin: 0;">Nenhum produto cadastrado para conferência.</p>';
    return;
  }
  produtos.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div class="info">
        <p class="name">${p.produto} <span>(${p.marca})</span></p>
        <p class="meta">Cód: ${p.codigo} · Lote: ${p.lote} · Qtd Atual: <strong>${p.entradaQtd || 0} ${p.unidade}</strong></p>
      </div>
    `;
    conferenciaList.appendChild(row);
  });
}

function renderAlerta() {
  alertaList.innerHTML = '';
  if (produtos.length === 0) {
    alertaList.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); margin: 0;">Nenhum produto cadastrado para alertas.</p>';
    return;
  }
  const ordenados = [...produtos].sort((a, b) => new Date(a.validade) - new Date(b.validade));
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  ordenados.forEach((p) => {
    const valDate = new Date(p.validade + 'T00:00:00');
    const diffDays = Math.ceil((valDate - hoje) / (1000 * 60 * 60 * 24));

    let statusText = `Validade: ${formatDate(p.validade)}`;
    let statusColor = 'var(--text-secondary)';
    if (diffDays < 0) {
      statusText = `VENCIDO em ${formatDate(p.validade)}`;
      statusColor = 'var(--danger)';
    } else if (diffDays <= 30) {
      statusText = `Vence em ${diffDays} dia(s) (${formatDate(p.validade)})`;
      statusColor = '#D97706';
    }

    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div class="info">
        <p class="name">${p.produto} <span>(${p.marca})</span></p>
        <p class="meta" style="color: ${statusColor}; font-weight: 500;">${statusText}</p>
        <p class="meta">Lote: ${p.lote} · Cód: ${p.codigo}</p>
      </div>
    `;
    alertaList.appendChild(row);
  });
}

const codigoInput = document.getElementById('codigo');
const pillYes = document.getElementById('pillYes');
const pillNo = document.getElementById('pillNo');
const statusHint = document.getElementById('statusHint');
const fieldsYes = document.getElementById('fieldsYes');
const fieldsNo = document.getElementById('fieldsNo');
let jaCadastrado = false;

function checarCodigo() {
  const codigo = codigoInput.value.trim().toLowerCase();
  pillYes.classList.remove('active');
  pillNo.classList.remove('active');
  pillYes.classList.add('idle');
  pillNo.classList.add('idle');
  fieldsYes.classList.remove('visible');
  fieldsNo.classList.remove('visible');

  if (!codigo) {
    jaCadastrado = false;
    statusHint.textContent = 'Digite o código para verificar automaticamente.';
    return;
  }

  jaCadastrado = produtos.some(p => p.codigo.toLowerCase() === codigo);

  if (jaCadastrado) {
    pillYes.classList.add('active');
    pillYes.classList.remove('idle');
    fieldsYes.classList.add('visible');
    statusHint.textContent = 'Produto já existe. Informe a entrada para atualizar o estoque.';
  } else {
    pillNo.classList.add('active');
    pillNo.classList.remove('idle');
    fieldsNo.classList.add('visible');
    statusHint.textContent = 'Código disponível para cadastro.';
  }
}

codigoInput.addEventListener('input', checarCodigo);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (jaCadastrado) {
    const codigo = codigoInput.value.trim();
    const existente = produtos.find(p => p.codigo.toLowerCase() === codigo.toLowerCase());
    const entrada = parseFloat(document.getElementById('entradaQtdSim').value) || 0;
    const dental = document.getElementById('dentalSim').value.trim();

    existente.entradaQtd = (parseFloat(existente.entradaQtd) || 0) + entrada;
    if (dental) existente.dental = dental;

    renderProdutos();
    feedback.style.display = 'block';
    feedback.textContent = 'Entrada de ' + entrada + ' registrada para "' + existente.produto + '".';
    form.reset();
    checarCodigo();
    setTimeout(() => { feedback.style.display = 'none'; }, 2500);
    return;
  }

  const novo = {
    codigo: document.getElementById('codigo').value.trim(),
    produto: document.getElementById('produto').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    lote: document.getElementById('lote').value.trim(),
    validade: document.getElementById('validade').value,
    unidade: document.getElementById('unidade').value,
    consumoMensal: document.getElementById('consumoMensal').value,
    preco: document.getElementById('preco').value,
    dental: document.getElementById('dentalNao').value.trim(),
    entradaQtd: document.getElementById('entradaQtdNao').value
  };
  produtos.push(novo);
  renderProdutos();
  feedback.style.display = 'block';
  feedback.textContent = 'Produto "' + novo.produto + '" cadastrado.';
  form.reset();
  checarCodigo();
  setTimeout(() => { feedback.style.display = 'none'; }, 2500);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  form.reset();
  feedback.style.display = 'none';
  checarCodigo();
});
