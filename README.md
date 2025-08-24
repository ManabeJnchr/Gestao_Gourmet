# 🍽️ Gestão Gourmet

Sistema completo de gerenciamento para restaurantes desenvolvido com **TypeScript**, **Express.js** e **PostgreSQL**. Oferece controle total sobre pedidos, cardápios, funcionários, mesas e pagamentos com interface responsiva e moderna.

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Instalação e Configuração](#-instalação-e-configuração)
- [💻 Como Usar](#-como-usar)
- [📊 Módulos do Sistema](#-módulos-do-sistema)
- [🔒 Autenticação e Segurança](#-autenticação-e-segurança)
- [📈 Relatórios](#-relatórios)
- [🤝 Contribuição](#-contribuição)

## ✨ Funcionalidades

### 👥 Gestão de Funcionários
- Cadastro e gerenciamento de funcionários
- Controle de cargos (Administrador, Gerente, Operacional)
- Upload de fotos de perfil
- Autenticação por cargo

### 🍴 Gestão de Cardápio
- Cadastro de itens com imagens
- Categorização de produtos
- Adicionais para itens
- Controle de preços e descrições

### 🪑 Gestão de Mesas
- Cadastro de mesas com número e capacidade
- Controle de status (Livre, Ocupada, Reservada)
- Vinculação de pedidos às mesas

### 📝 Gestão de Pedidos
- Criação de pedidos por mesa
- Adição/remoção de itens
- Controle de quantidades e adicionais
- Status de pedidos (Aberto, Fechado, Cancelado)

### 💳 Sistema de Pagamentos
- Múltiplas formas de pagamento
- Controle de valores pagos e restantes
- Histórico de pagamentos por pedido

### 📊 Relatórios Detalhados
- Relatório de pedidos com filtros por data/mesa
- Relatório de cardápio mais vendido
- Relatório de funcionários
- Gráficos interativos com ApexCharts

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Multer** - Upload de arquivos
- **Cookie-Parser** - Gerenciamento de cookies
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5/CSS3** - Estrutura e estilo
- **Alpine.js** - Framework JavaScript reativo
- **Bootstrap 5** - Framework CSS responsivo
- **ApexCharts** - Biblioteca de gráficos
- **Axios** - Cliente HTTP

### Ferramentas de Desenvolvimento
- **Vite** - Build tool para frontend
- **Nodemon** - Auto-restart do servidor
- **ts-node** - Execução direta de TypeScript

## 📁 Estrutura do Projeto

```
Gestao_Gourmet/
├── src/
│   ├── controllers/          # Controladores da aplicação
│   │   ├── authenticationController.ts
│   │   ├── funcionarioController.ts
│   │   ├── itemCardapioController.ts
│   │   ├── mesaController.ts
│   │   ├── pedidoController.ts
│   │   ├── pagamentoController.ts
│   │   └── relatorioController.ts
│   │
│   ├── models/               # Modelos de dados
│   │   ├── FuncionarioModel.ts
│   │   ├── ItemCardapioModel.ts
│   │   ├── MesaModel.ts
│   │   ├── PedidoModel.ts
│   │   └── ...
│   │
│   ├── services/             # Lógica de negócio
│   │   ├── FuncionarioService.ts
│   │   ├── ItemCardapioService.ts
│   │   ├── PedidoService.ts
│   │   └── ...
│   │
│   ├── routes/               # Definição de rotas
│   │   ├── authRoutes.ts
│   │   ├── funcionarioRoutes.ts
│   │   ├── pedidoRoutes.ts
│   │   └── index.ts
│   │
│   ├── database/             # Configuração do banco
│   │   ├── index.ts
│   │   ├── dbinit.ts
│   │   └── resetdb.ts
│   │
│   ├── js/                   # Scripts do frontend
│   │   ├── auth.js
│   │   ├── administrativo.js
│   │   ├── operacional.js
│   │   └── funcoes.js
│   │
│   └── server.ts             # Servidor principal
│
├── public/                   # Arquivos estáticos
│   ├── html/                 # Páginas HTML
│   ├── css/                  # Estilos CSS
│   ├── js/                   # Scripts públicos
│   └── src/img/              # Imagens do sistema
│
├── uploads/                  # Arquivos enviados pelos usuários
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
└── vite.config.js            # Configuração Vite
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gestao-gourmet.git
cd gestao-gourmet
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
1. Crie um banco PostgreSQL
2. Configure as variáveis de ambiente no arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestao_gourmet
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### 4. Inicialize o banco de dados
```bash
npm run resetdb
```

### 5. Execute o projeto
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

O sistema estará disponível em `http://localhost:3001`

## 💻 Como Usar

### Primeiro Acesso
1. Acesse `http://localhost:3001`
2. Faça login com as credenciais padrão do administrador
3. Configure funcionários, mesas e cardápio
4. Comece a gerenciar pedidos

### Fluxo Operacional
1. **Funcionário Operacional**: Cria pedidos e adiciona itens
2. **Caixa**: Processa pagamentos dos pedidos fechados
3. **Gerente/Admin**: Monitora relatórios e gerencia configurações

## 📊 Módulos do Sistema

### 🏠 Dashboard Principal
- Visão geral do sistema
- Acesso rápido aos módulos
- Indicadores principais

### 👤 Gestão de Funcionários
- **Rota**: `/funcionarios`
- Cadastro, edição e exclusão
- Upload de foto de perfil
- Controle de cargos e permissões

### 🍽️ Gestão de Cardápio
- **Rota**: `/cardapio`
- Itens organizados por categoria
- Upload de imagens dos pratos
- Gestão de adicionais e preços

### 🪑 Gestão de Mesas
- **Rota**: `/mesas`
- Controle de disponibilidade
- Vinculação com pedidos
- Status em tempo real

### 📝 Pedidos
- **Rota**: `/pedidos`
- Interface intuitiva para criação
- Adição de itens e adicionais
- Observações personalizadas

### 💰 Caixa/Pagamentos
- **Rota**: `/pagamento`
- Múltiplas formas de pagamento
- Cálculo automático de valores
- Controle de troco

### 📈 Relatórios
- **Rota**: `/relatorios`
- Filtros por período e mesa
- Gráficos interativos
- Dados de vendas e desempenho

## 🔒 Autenticação e Segurança

### Níveis de Acesso
- **Administrador**: Acesso total ao sistema
- **Gerente**: Acesso a relatórios e configurações básicas
- **Operacional**: Acesso a pedidos e caixa

### Funcionalidades de Segurança
- Sistema de login com cookies
- Controle de permissões por cargo
- Redefinição de senha com aprovação
- Logout automático

### Reset de Senha
- Funcionários podem solicitar reset
- Administradores aprovam/rejeitam solicitações
- Processo seguro de redefinição

## 📈 Relatórios

### Tipos de Relatórios
1. **Pedidos**: Análise de vendas por período/mesa
2. **Cardápio**: Itens mais vendidos
3. **Funcionários**: Desempenho da equipe
4. **Pagamentos**: Formas de pagamento utilizadas

### Recursos dos Relatórios
- **Filtros avançados**: Data, mesa, funcionário
- **Gráficos interativos**: Barras, pizza, linhas
- **Exportação**: Dados formatados
- **Período customizável**: Dia, semana, mês

## 🛡️ API Endpoints

### Autenticação
```
POST /login              # Login de usuário
GET  /identity           # Dados do usuário logado
GET  /logout             # Logout
POST /trocarSenha        # Alterar senha
```

### Funcionários
```
GET  /listarFuncionarios     # Listar funcionários
POST /salvarFuncionario      # Criar/atualizar funcionário
POST /deletarFuncionario     # Excluir funcionário
```

### Cardápio
```
GET  /listarCardapio         # Listar itens do cardápio
POST /salvarItemCardapio     # Criar/atualizar item
POST /deletarItemCardapio    # Excluir item
```

### Pedidos
```
GET  /listarPedidos          # Listar pedidos abertos
GET  /listarPedidosFechados  # Listar pedidos fechados
POST /novoPedido             # Criar novo pedido
POST /fecharPedido           # Finalizar pedido
```

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Desenvolvimento
- Use **TypeScript** para tipagem forte
- Siga o padrão **MVC** (Model-View-Controller)
- Mantenha a arquitetura de **Services** para lógica de negócio
- Implemente tratamento de erros adequado
- Documente novas funcionalidades

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- **Email**: seu-email@exemplo.com
- **GitHub Issues**: [Criar issue](https://github.com/seu-usuario/gestao-gourmet/issues)

---

**Desenvolvido com ❤️ para facilitar a gestão de restaurantes**
