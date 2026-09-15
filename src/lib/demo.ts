export const DEMO_MODE_KEY = "pix-dashboard-demo-mode";
export const DEMO_AUTH_KEY = "pix-dashboard-demo-authenticated";

export interface PixTransaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  sender_name: string | null;
  receiver_name: string | null;
  transaction_date: string;
  email_subject: string | null;
  email_from: string | null;
  email_snippet: string | null;
  email_id: string | null;
  created_at: string;
}

export const isDemoMode = () => localStorage.getItem(DEMO_MODE_KEY) === "true";
export const startDemoMode = () => localStorage.setItem(DEMO_MODE_KEY, "true");
export const stopDemoMode = () => localStorage.removeItem(DEMO_MODE_KEY);
export const isDemoAuthenticated = () => sessionStorage.getItem(DEMO_AUTH_KEY) === "true";
export const signInDemo = () => sessionStorage.setItem(DEMO_AUTH_KEY, "true");
export const signOutDemo = () => sessionStorage.removeItem(DEMO_AUTH_KEY);

const received = [
  ["Marina Oliveira", "Projeto de identidade visual"],
  ["Studio Horizonte", "Consultoria mensal"],
  ["Agência Aurora", "Desenvolvimento de landing page"],
  ["Clínica Viver Bem", "Gestão de redes sociais"],
  ["Comercial Nova Era", "Manutenção do e-commerce"],
];

const sent = [
  ["WebCloud Tecnologia", "Hospedagem e domínio"],
  ["Mercado Boa Praça", "Compras da semana"],
  ["Camila Ribeiro", "Fotografia de produto"],
  ["Software Fácil Ltda.", "Assinatura de ferramentas"],
  ["Contabilidade Central", "Honorários contábeis"],
];

export const createDemoTransactionsForMonth = (year: number, month: number): PixTransaction[] => {
  const transactions: PixTransaction[] = [];
  const monthKey = year * 12 + month;

  for (let index = 0; index < 10; index += 1) {
    const type: "received" | "sent" = index % 3 === 1 ? "sent" : "received";
    const people = type === "received" ? received : sent;
    const [person, description] = people[Math.abs(index + monthKey) % people.length];
    const base = type === "received" ? 420 : 65;
    const variation = Math.abs(monthKey * 137 + index * 193) % (type === "received" ? 2200 : 480);
    const amount = Number((base + variation + index * 0.9).toFixed(2));
    const date = new Date(year, month, 2 + index * 2, 8 + (index % 10), (index * 13) % 60);
    const id = `demo-${date.getFullYear()}-${date.getMonth() + 1}-${index}`;

    transactions.push({
      id, type, amount, description,
      sender_name: type === "received" ? person : "Conta Demo",
      receiver_name: type === "received" ? "Conta Demo" : person,
      transaction_date: date.toISOString(),
      email_subject: type === "received" ? `Pix recebido de ${person}` : `Pix enviado para ${person}`,
      email_from: "notificacoes@banco.demo",
      email_snippet: `${description} — R$ ${amount.toFixed(2)}`,
      email_id: `email-${id}`,
      created_at: date.toISOString(),
    });
  }

  return transactions.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
};

/** Histórico inicial amplo; meses fora dele são gerados sob demanda pela tela. */
export const createDemoTransactions = (now = new Date()): PixTransaction[] => {
  const transactions: PixTransaction[] = [];
  for (let offset = -24; offset <= 11; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    transactions.push(...createDemoTransactionsForMonth(date.getFullYear(), date.getMonth()));
  }
  return transactions.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
};
