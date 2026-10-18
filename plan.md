# Contexto do Projeto: Nimbus (App de Clima)
Você é um desenvolvedor Front-end Especialista em React, TypeScript e Tailwind CSS. 
Sua missão é desenvolver a Interface de Usuário (UI) do aplicativo "Nimbus".

**IMPORTANTE:** Toda a lógica de negócio, chamadas de API, integração de dados e tipagens (interfaces/types) **JÁ ESTÃO PRONTAS** no projeto. Você deve LER o projeto, encontrar essas estruturas e trabalhar **EXCLUSIVAMENTE** na construção visual e de componentes, consumindo o que já existe sem alterar a lógica ou os contratos de dados.

## Stack e Ferramentas
- React (com Vite)
- TypeScript
- Tailwind CSS (para toda a estilização)
- Lucide React (para iconografia)

## Diretrizes de UI/UX
- **Design System:** Estilo "Liquid Glass" (Glassmorphism). Uso intensivo de `backdrop-blur`, cores translúcidas (ex: `bg-white/10`, `bg-black/20`), bordas finas semi-transparentes (`border border-white/20`) e sombras suaves.
- **Animações:** Suaves e sutis (transições de hover, fade-ins). Sem animações exageradas.
- **Responsividade:** Mobile-First. Em telas maiores (Desktop/Tablet), o aplicativo não deve esticar ocupando toda a tela; o layout principal deve permanecer centralizado no meio da tela (como um frame de celular moderno), com um background preenchendo o restante.

## Gerenciamento de Fundo Dinâmico (CSS Puro)
O fundo da tela principal deve ser dinâmico, baseado no clima atual (sol, nublado, chuva, etc.).
- Não utilize vídeos ou imagens externas. Crie os fundos utilizando **Gradients do Tailwind** (ex: tons de azul claro/amarelo para Sol; tons de cinza/azul escuro para Chuva).
- Crie animações sutis em CSS puro para os climas (ex: keyframes de partículas caindo para simular chuva, nuvens se movendo lentamente ao fundo).

## Estrutura da Tela Principal

A tela principal conterá os seguintes elementos em ordem (de cima para baixo):

### 1. Header (Cabeçalho)
- **Canto Esquerdo:** Nome da localização atual (Cidade). Deve ser clicável.
  - Ao clicar, abre um **Modal** em "liquid glass" contendo um input de busca para pesquisar e selecionar outra cidade (Atende RF 03 e RF 04).
- **Canto Direito (Menu de Opções):** Ícone que abre um menu suspenso ou modal com opções salvas em cache local:
  - **Acessibilidade:** Botões para aumentar/diminuir fonte e um toggle de "Alto Contraste" (que desativa o glassmorphism/blur e aplica cores sólidas, mantendo a harmonia visual).
  - **Tema:** Toggle para Claro / Escuro / Padrão do Sistema.
  - **Modo de Visualização:** Switch para alternar entre "Visualização Simplificada" e "Visualização Detalhada".

### 2. Clima Atual (Centro da Tela)
- Representação visual forte do clima atual.
- Temperatura em grande destaque (ex: 27°).
- Condição climática em texto (ex: "Nublado", "Chuva").
- *(Se no Modo Detalhado)*: Exibir Máxima e Mínima do dia.

### 3. Previsão Horária (Carousel)
- Um slider/carrossel horizontal (`overflow-x-auto` com scrollbar oculta) exibindo a previsão das próximas horas do dia.
- Cada item deve ter: Horário, Ícone do Clima e Temperatura.

### 4. Grade de Detalhes Meteorológicos (Visível APENAS no Modo Detalhado)
- Atendendo ao RF 01, criar um grid em cards glassmorphism para exibir:
  - Velocidade e Direção do vento.
  - Umidade relativa do ar.
  - Horário do Nascer e Pôr do sol.
  - Estação do ano vigente.

### 5. Previsão para 5 Dias (Lista Inferior)
- Atendendo ao RF 02, uma lista vertical com os próximos 5 dias.
- Cada linha deve conter: Dia da semana, Ícone dinâmico do clima, Temperatura Mínima e Máxima.
- *(Se no Modo Detalhado)*: Expandir a linha para mostrar informações resumidas sobre vento e umidade daquele dia.

---

## Plano de Ação para Execução (Passo a Passo)

Siga este plano rigorosamente e me peça aprovação/confirmação após cada passo de grupo concluído, ou se tiver dúvida de onde encontrar os dados:

**Passo 1: Mapeamento e Configuração Base**
1. Leia o diretório do projeto e identifique os hooks/contexts e types já criados para a API de clima e geolocalização.
2. Configure as variáveis CSS / Tailwind `theme` necessárias (cores globais, breakpoints, fontes) e instale o `lucide-react`.
3. Crie os estilos base no `index.css` para as animações dinâmicas de fundo (chuva, movimento de nuvens).

**Passo 2: Layout Base e Componentes Estruturais**
1. Crie o layout "Mobile-First Centralizado" (Container principal limitado em largura, centrado em telas grandes).
2. Desenvolva o componente de Background Dinâmico (`WeatherBackground.tsx`) que escuta a prop do clima atual e altera o gradiente/animação.
3. Desenvolva o componente de estado global ou hook local persistido para (Tema, Acessibilidade, Modo de Exibição).

**Passo 3: Construção dos Componentes de UI (Design Liquid Glass)**
1. Crie o `Header` com a localização atual e o botão de menu.
2. Crie o Modal de Pesquisa de Cidades (Input, Lista de Resultados). Conecte isso às funções de busca já existentes.
3. Crie o Menu de Configurações (Acessibilidade, Tema, Visão Detalhada).
4. Crie o card de `CurrentWeather` (Centro).
5. Crie o componente `HourlyCarousel`.
6. Crie o componente `DailyForecastList`.
7. Crie o grid de `WeatherDetails` (Vento, Umidade, Sol, Estação).

**Passo 4: Integração Final da UI**
1. Una todos os componentes na `Home.tsx` ou tela principal.
2. Implemente a lógica condicional do toggle de "Modo de Visualização" (ocultando/mostrando `WeatherDetails` e detalhes da lista).
3. Aplique as regras de "Alto Contraste" (removendo as classes `backdrop-blur` condicionalmente onde o modo de acessibilidade exigir).

Sempre garanta que seu código de UI está chamando as funções que JÁ EXISTEM no projeto. Não invente lógicas de fetch. Use mockups *apenas* se não encontrar os dados ou me pergunte onde eles estão.