# Workflow n8n — Gmail Pix para Supabase

Workflow de referência que monitora e-mails de notificação Pix, classifica transações enviadas ou recebidas, extrai seus campos e cria registros na tabela `pix_transactions`.

## Importante

Este workflow é opcional e não é utilizado pelo frontend demonstrativo deste repositório. O JSON está inativo e não contém credenciais, tokens ou IDs de contas.

## Fluxo

1. O Gmail Trigger procura novos e-mails a cada minuto.
2. O Switch identifica os assuntos `Pix realizado` e `Pix recebido`.
3. Expressões regulares extraem valor, pessoa e data do texto da notificação.
4. Um dos nós Supabase cria o registro como `sent` ou `received`.

O parser foi criado para o formato das notificações do banco XP. Outros bancos exigem ajustes nos assuntos e nas expressões regulares.

## Como importar

1. Crie ou acesse uma instância do n8n.
2. Importe o arquivo [`e-mail dashboard.json`](./e-mail%20dashboard.json).
3. Configure sua própria credencial Gmail OAuth2 no nó **Gmail Trigger**.
4. Configure sua própria credencial Supabase nos dois nós **Create a row**.
5. Substitua `[Coloque seu nome]` nos campos de remetente e destinatário.
6. Confirme os assuntos e o formato das mensagens enviados pelo seu banco.
7. Teste manualmente com mensagens não sensíveis antes de ativar o workflow.

## Tabela esperada

A tabela `pix_transactions` deve possuir, no mínimo:

| Coluna | Tipo sugerido |
| --- | --- |
| `type` | `text` (`sent` ou `received`) |
| `amount` | `numeric` |
| `sender_name` | `text` |
| `receiver_name` | `text` |
| `transaction_date` | `timestamptz` |

## Segurança

- Use credenciais próprias cadastradas no gerenciador de credenciais do n8n.
- Nunca insira tokens diretamente no JSON do workflow.
- Restrinja a credencial Supabase ao mínimo necessário.
- Mantenha RLS habilitada e políticas limitadas ao usuário correto.
- Evite salvar o conteúdo completo de e-mails quando os campos extraídos forem suficientes.
