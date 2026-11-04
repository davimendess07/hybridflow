# HybridFlow

Aplicação web para registrar e acompanhar treinos de quem pratica boxe, jiu-jitsu, corrida e musculação em um só lugar.

Projeto desenvolvido durante a **Imersão Engenharia de Software: Dev na Era da IA**, da Alura (novembro de 2026), com o **Google AI Studio**.

## Por que fiz

Treino boxe, jiu-jitsu, corrida e musculação durante a semana. Cada app que existe cuida de uma modalidade só: o de corrida não entende rounds, o de musculação não tem campo para posição de jiu-jitsu. Eu queria ver a semana inteira num lugar só e saber quanto tempo dediquei a cada modalidade.

O objetivo do projeto também era praticar o fluxo apresentado na imersão: usar IA para construir, mas com especificação, revisão e testes feitos por mim.

## O que a aplicação faz

- Cadastrar, listar, editar e excluir treinos (CRUD)
- Campos comuns: modalidade, data, duração, intensidade percebida (1 a 10) e observações
- Campos específicos por modalidade:
  - **Boxe:** tipo de sessão e número de rounds
  - **Jiu-jitsu:** tipo de sessão, Gi ou No-Gi, rounds, posições trabalhadas (tags) e técnica do dia
  - **Corrida:** tipo de corrida e distância
  - **Musculação:** objetivo e grupos musculares
- Filtro por modalidade
- Resumo da semana atual (segunda a domingo): total de treinos, minutos e distribuição por modalidade
- Exclusão somente após confirmação
- Dados salvos no navegador (localStorage), mantidos após atualizar a página

## Como fiz

O desenvolvimento seguiu 3 etapas, cada uma com um prompt.

| Etapa | Onde | Objetivo |
|---|---|---|
| 1. Ideia | Playground do AI Studio | Gerar e refinar a ideia do app |
| 2. Especificação | Build do AI Studio | Definir problema, público, requisitos funcionais e não funcionais, regras de negócio e casos de teste, sem gerar código |
| 3. Construção | Build do AI Studio | Aprovar a especificação com ajustes e gerar o app |

### Decisões de escopo

A ideia gerada na etapa 1 era grande demais para uma primeira versão. Cortei:

- Integração com Strava, Garmin e relógios: exige API externa, autenticação e backend
- Mapa de fadiga muscular, alertas de conflito e score de prontidão: a IA propôs a lógica sem base definida, e eu não teria como validar

### Revisão da especificação

Antes de aprovar a especificação gerada na etapa 2, fiz estes ajustes:

| Ponto | Problema | Ajuste |
|---|---|---|
| Data | "Data futura irrealista" era ambíguo e não testável | Data não pode ser futura |
| Grupos musculares | Lista aberta | Lista fechada: Peito, Costas, Pernas, Ombros, Braços, Core |
| Jiu-jitsu | Faltava o campo para registrar a técnica do dia | Campo opcional "técnica trabalhada" (até 100 caracteres) |
| Requisito de desempenho | Pedia resposta abaixo de 50ms, sem como medir | Trocado por "sem travamentos perceptíveis" |
| Testes | Faltavam casos de limite | Adicionados CT09 (data futura) e CT10 (duração 0 e 721) |

### Prompts usados

<details>
<summary>Etapa 1: ideia</summary>

```
Dê uma ideia de aplicação para organizar e acompanhar meus treinos semanais de boxe, corrida, academia e jiu-jitsu.
```
</details>

<details>
<summary>Etapa 2: especificação</summary>

```
Você é uma pessoa especialista em produtos digitais de esporte.

Queremos criar o HybridFlow, uma aplicação simples para quem treina boxe, jiu-jitsu, corrida e musculação registrar e acompanhar os treinos em um só lugar.

A primeira versão deve permitir que a pessoa:
* cadastre um treino;
* visualize os treinos cadastrados;
* edite um treino;
* exclua um treino;
* filtre treinos por modalidade;
* veja um resumo da semana atual (quantidade de treinos e minutos por modalidade);
* mantenha seus dados após atualizar a página.

Campos comuns a todo treino: modalidade, data, duração em minutos, intensidade percebida (1 a 10), observações.

Campos específicos:
* Boxe: tipo de sessão (técnica/manopla, saco, sparring leve, sparring duro), número de rounds;
* Jiu-jitsu: tipo de sessão (drill, rola livre), Gi ou No-Gi, número de rounds, posição trabalhada com tags (guarda, passagem, costas, finalização);
* Corrida: tipo (regenerativo, intervalado, longão), distância em km;
* Musculação: objetivo (hipertrofia, força, potência, mobilidade), grupos musculares.

Fora do escopo desta versão: integração com Strava, Garmin ou relógios, mapa de fadiga, alertas automáticos, backend.

Organize a resposta em:
1. problema que o aplicativo resolve;
2. público principal;
3. requisitos funcionais;
4. requisitos não funcionais;
5. regras de negócio e validações;
6. critérios que podemos utilizar para testar a primeira versão.

Não escreva código ainda.
```
</details>

<details>
<summary>Etapa 3: construção</summary>

```
Aprovo a especificação com os seguintes ajustes:

1. Data: obrigatória e não pode ser futura.
2. Grupos musculares: lista fechada com Peito, Costas, Pernas, Ombros, Braços e Core.
3. Jiu-jitsu: adicionar campo opcional "técnica trabalhada", texto livre de até 100 caracteres.
4. Remover o RNF02. Substituir por: a interface não deve apresentar travamentos perceptíveis.
5. Adicionar os testes:
   * CT09: tentar salvar treino com data futura; o sistema bloqueia e mostra erro no campo de data.
   * CT10: tentar salvar treino com duração 0 e depois 721; o sistema bloqueia nos dois casos.

Agora implemente a aplicação web HybridFlow conforme a especificação aprovada.

Requisitos técnicos:
* usar React, TypeScript e Tailwind CSS;
* separar a interface em componentes;
* separar os tipos de dados em arquivo próprio;
* criar um serviço para o armazenamento no localStorage;
* separar as regras de validação em um módulo próprio;
* não utilizar backend nesta versão;
* textos em português do Brasil.

Antes de finalizar, confira se todos os requisitos funcionais, regras de negócio e os testes CT01 a CT10 são atendidos pela implementação.
```
</details>

## Arquitetura

```
src/
├── types/workout.ts       # tipos de dados das modalidades e do resumo semanal
├── utils/validation.ts    # regras de negócio e validações
├── utils/dates.ts         # cálculo da semana atual e formatação de datas
├── services/storage.ts    # leitura e gravação no localStorage
└── components/            # componentes de interface
    ├── Header
    ├── WeeklySummary
    ├── WorkoutFilter
    ├── WorkoutCard
    ├── WorkoutFormModal
    ├── DeleteConfirmModal
    └── VerificationTestModal
```
**Componentização:** a interface foi dividida em componentes independentes dentro de `components/`. Cada componente cuida de uma parte da tela. O `WorkoutCard`, por exemplo, é escrito uma vez e reutilizado para exibir cada treino da lista.

**Separação de responsabilidades:** além da interface, cada parte do código fica em um arquivo próprio: tipos de dados, regras de negócio, cálculo de datas e armazenamento. Assim dá para trocar o armazenamento (por exemplo, o localStorage por uma API) sem mexer nos componentes.

O `VerificationTestModal`, os dados de demonstração e o botão de limpar dados existem para facilitar os testes. Não são funcionalidades para o usuário final.

## Testes

Testes manuais executados por mim, a partir dos casos definidos na especificação:

| ID | Cenário | Resultado |
|---|---|---|
| CT01 | Cadastro de treino de boxe | [ ] |
| CT02 | Validação de campos condicionais (jiu-jitsu sem rounds) | [ ] |
| CT03 | Persistência após recarregar a página | [ ] |
| CT04 | Edição de treino e recálculo do resumo | [ ] |
| CT05 | Exclusão com confirmação (cancelar e confirmar) | [ ] |
| CT06 | Filtro por modalidade | [ ] |
| CT07 | Resumo considera só a semana atual | [ ] |
| CT08 | Tela vazia sem treinos | [ ] |
| CT09 | Bloqueio de data futura | [ ] |
| CT10 | Bloqueio de duração 0 e 721 minutos | [ ] |

## Tecnologias

- React
- TypeScript
- Tailwind CSS
- Vite
- localStorage
- Google AI Studio

## Como rodar

Requisito: Node.js instalado.

```bash
git clone https://github.com/davimendess07/hybridflow.git
cd hybridflow
npm install
npm run dev
```

## Limitações

- Os dados ficam só no navegador usado. Limpar o cache ou trocar de aparelho apaga os registros.
- Sem login, sem backend e sem sincronização entre dispositivos.

## Próximos passos

- Exportar e importar os treinos em arquivo
- Gráfico de evolução semanal
- Backend com banco de dados para salvar os treinos fora do navegador

## O que aprendi

- Especificar antes de construir reduz retrabalho e gasto de tokens
- A IA gera a especificação e o código, mas quem decide o escopo, revisa e testa sou eu
- A IA não testa a aplicação: ela descreve como os testes passariam lendo o próprio código. O teste real foi manual
- Componentização e separação de responsabilidades: interface dividida em componentes reutilizáveis, e tipos, regras de negócio e armazenamento em arquivos separados, deixando o código mais fácil de entender e alterar

## Autor

Davi Ramos Mendes  
[GitHub](https://github.com/davimendess07)
