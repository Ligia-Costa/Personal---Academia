const ENDPOINT_ALUNOS = 'https://aplica-o-2-api-bd.vercel.app/alunos/lista';
const ENDPOINT_INFERIOR = 'https://aplica-o-2-api-bd.vercel.app/inferior/lista';
const ENDPOINT_SUPERIOR = 'https://aplica-o-2-api-bd.vercel.app/superior/lista';

// Carregar alunos
async function carregarAlunos() {
  try {
    const resposta = await fetch(ENDPOINT_ALUNOS);
    const alunos = await resposta.json();
    const select = document.getElementById('select-aluno');
    select.innerHTML = '<option value="">Selecione um aluno</option>';

    alunos.forEach(aluno => {
      if (aluno.status === "Ativo") {
        const option = document.createElement('option');
        option.value = aluno.id;
        option.textContent = aluno.nome;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
    document.getElementById('select-aluno').innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

// Carregar exercícios
async function carregarExercicios() {
  const container = document.getElementById('lista-exercicios');
  container.innerHTML = '';

  try {
    const respostaInferior = await fetch(ENDPOINT_INFERIOR);
    const inferior = await respostaInferior.json();

    const respostaSuperior = await fetch(ENDPOINT_SUPERIOR);
    const superior = await respostaSuperior.json();

    container.innerHTML += `<h2 class="text-lg font-semibold text-purple-700 mb-2">Treinos Inferiores</h2>`;
    inferior.forEach(exercicio => {
      container.innerHTML += `
        <div class="flex items-center gap-2">
          <input type="checkbox" id="inferior-${exercicio.id}" data-nome="${exercicio.nome}" class="accent-purple-600">
          <label for="inferior-${exercicio.id}" class="flex-1">${exercicio.nome}</label>
          <input type="text" id="qtd-inferior-${exercicio.id}" placeholder="Qtd (ex: 3x12)" class="border rounded px-2 py-1 text-sm w-24">
        </div>
      `;
    });

    container.innerHTML += `<h2 class="text-lg font-semibold text-purple-700 mt-6 mb-2">Treinos Superiores</h2>`;
    superior.forEach(exercicio => {
      container.innerHTML += `
        <div class="flex items-center gap-2">
          <input type="checkbox" id="superior-${exercicio.id}" data-nome="${exercicio.nome}" class="accent-purple-600">
          <label for="superior-${exercicio.id}" class="flex-1">${exercicio.nome}</label>
          <input type="text" id="qtd-superior-${exercicio.id}" placeholder="Qtd (ex: 3x12)" class="border rounded px-2 py-1 text-sm w-24">
        </div>
      `;
    });

  } catch (error) {
    console.error("Erro ao carregar exercícios:", error);
    container.innerHTML = '<p class="text-red-500">Erro ao carregar exercícios.</p>';
  }
}

// Salvar treino dentro do ID do aluno
async function salvarTreino() {
  const alunoId = document.getElementById('select-aluno').value;
  if (!alunoId) {
    alert("Selecione um aluno!");
    return;
  }

  const selecionados = document.querySelectorAll('input[type="checkbox"]:checked');
  if (selecionados.length < 4) {
    alert('Selecione pelo menos 4 exercícios!');
    return;
  }

  const exerciciosSelecionados = [];

  for (const item of selecionados) {
    const nome = item.getAttribute('data-nome');
    const quantidadeInput = document.getElementById(`qtd-${item.id}`);
    const quantidade = quantidadeInput ? quantidadeInput.value.trim() : "";

    if (!quantidade) {
      alert(`Preencha a quantidade para o exercício: ${nome}`);
      return;
    }

    exerciciosSelecionados.push({
      nome: nome,
      quantidade: quantidade
    });
  }

  const treino = {
    exercicios: exerciciosSelecionados
  };

  const ENDPOINT_SALVAR_TREINO = `https://aplica-o-2-api-bd.vercel.app/alunos/${alunoId}/treinos`;

  try {
    const resposta = await fetch(ENDPOINT_SALVAR_TREINO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(treino)
    });

    if (resposta.ok) {
      alert("Treino salvo com sucesso!");
      document.getElementById('select-aluno').value = '';
      document.getElementById('lista-exercicios').innerHTML = '';
      carregarExercicios(); // Recarrega a lista
    } else {
      alert("Erro ao salvar treino.");
    }
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    alert("Erro ao salvar treino.");
  }
}

// Inicializar
carregarAlunos();
carregarExercicios();