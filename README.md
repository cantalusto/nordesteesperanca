# Esperança Nordeste - Sistema de Gestão Comercial

Sistema CRM desenvolvido para gerenciamento de ligações comerciais, cotações e pedidos da Esperança Nordeste.

## Funcionalidades

- **Gestão de Ligações**: Registro e acompanhamento de ligações comerciais
- **Cotações**: Geração e controle de cotações com status
- **Pedidos**: Registro de pedidos e controle de fechamento
- **Gestão de Funcionários**: Administração de usuários e permissões (Admin)
- **Relatórios**: Dashboards e relatórios analíticos (Admin)
- **Busca e Filtros**: Sistema de busca por empresa, código cliente e funcionário

## Requisitos

- Node.js (versão 16 ou superior)
- Navegador web moderno

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd esperança-nordeste-crm
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse o sistema em seu navegador:
   ```
   http://localhost:5173
   ```

## Credenciais Padrão

### Administrador
- **Email**: admin@esperanca.com
- **Senha**: admin

### Funcionário
- **Email**: joao@esperanca.com
- **Senha**: 123

## Tecnologias Utilizadas

- **React**: Framework frontend
- **TypeScript**: Linguagem de programação
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **Recharts**: Gráficos e visualizações
- **LocalStorage**: Armazenamento de dados

## Estrutura do Projeto

```
esperança-nordeste-crm/
├── components/          # Componentes React
│   ├── Login.tsx       # Tela de login
│   ├── Layout.tsx      # Layout principal
│   ├── Dashboard.tsx   # Dashboard administrativo
│   ├── CallManagement.tsx    # Gestão de ligações
│   ├── EmployeeManagement.tsx # Gestão de funcionários
│   └── Reports.tsx     # Relatórios
├── services/           # Serviços e lógica de negócio
│   └── storage.ts      # Gerenciamento de dados
├── types.ts            # Definições de tipos TypeScript
├── App.tsx             # Componente principal
├── index.tsx           # Ponto de entrada
└── public/             # Arquivos estáticos
    ├── logomarcaesperanca.png
    └── logoesperanca-removebg-preview.png
```

## Funcionalidades por Perfil

### Administrador
- Visualizar dashboard com estatísticas
- Gerenciar todas as ligações
- Criar e editar funcionários
- Acessar relatórios completos
- Gerar cotações e registrar pedidos

### Funcionário
- Registrar suas próprias ligações
- Visualizar histórico de ligações
- Gerar cotações
- Registrar pedidos

## Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.
