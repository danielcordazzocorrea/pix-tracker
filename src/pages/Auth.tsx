import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandMark from "@/components/BrandMark";
import Velaris from "@/components/ui/velaris";
import { isDemoAuthenticated, signInDemo } from "@/lib/demo";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isDemoAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    signInDemo();
    navigate("/", { replace: true });
  };

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Velaris bg="#07110e" colors={["#12372b", "#22c98a", "#66e3b4", "#07110e"]} speed={1.35} grain={0.2} className="auth-velaris">
          <div className="auth-story-content">
            <BrandMark />
            <div className="story-copy"><h1>Suas movimentações,<br /><em>em um só lugar.</em></h1><p>Acompanhe entradas e saídas Pix<br />com clareza.</p></div>
            <p className="story-footer">Mais controle para o seu dinheiro.</p>
          </div>
        </Velaris>
      </section>

      <section className="auth-form-side">
        <div className="auth-mobile-brand"><BrandMark /></div>
        <form className="auth-form" onSubmit={submit}>
          <header><h2>Bem-vindo de volta</h2><p>Acesse sua conta para continuar.</p></header>
          <label>E-mail<div className="input-wrap"><Mail size={18} /><input type="email" required autoComplete="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
          <label>Senha<div className="input-wrap"><Lock size={18} /><input type={showPassword ? "text" : "password"} required minLength={6} autoComplete="current-password" placeholder="Sua senha" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <button className="signin-button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}<ArrowRight size={19} /></button>
          <div className="auth-divider"><span />ou<span /></div>
          <button className="demo-button" type="button" onClick={() => { signInDemo(); navigate("/", { replace: true }); }}>Explorar conta demo</button>
          <p className="demo-caption">Acesso instantâneo com dados fictícios.</p>
        </form>
      </section>
    </main>
  );
};

export default Auth;
