# Pix Tracker: demonstração

Dashboard responsivo para visualização de transações Pix, desenvolvido com React, TypeScript, Vite, Tailwind CSS, shadcn/ui e Recharts.

## Versão de portfólio

O frontend deste repositório funciona inteiramente no navegador:

- login demonstrativo, sem envio de e-mail ou senha;
- sessão temporária armazenada somente na aba atual;
- dados fictícios gerados localmente para todos os meses;
- gráficos, indicadores e histórico navegáveis;
- nenhuma variável de ambiente ou conexão ativa com Supabase.

Qualquer e-mail e senha com pelo menos seis caracteres podem ser usados na tela de login. Também é possível selecionar **Explorar conta demo**.

## Automação n8n

A pasta [`N8N`](./N8N) contém, apenas como referência técnica, o workflow original que inspirou o projeto. Ele monitora notificações Pix recebidas por Gmail, extrai os dados e pode gravá-los em uma tabela Supabase.

O workflow está sanitizado, inativo por padrão e sem credenciais. Ele não é executado nem utilizado pelo frontend demonstrativo. Consulte [`N8N/README.md`](./N8N/README.md) antes de importá-lo.

## Executar localmente

```sh
npm install
npm run dev
```

## Validar

```sh
npm run test
npm run build
```

## Tecnologias

- React e TypeScript
- Vite
- Tailwind CSS e shadcn/ui
- Recharts
- Vitest
- WebGL no fundo animado da tela de login

> Todos os nomes, valores e transações exibidos na demonstração são fictícios.
