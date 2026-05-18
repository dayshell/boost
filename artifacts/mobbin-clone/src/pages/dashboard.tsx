import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const isRu = lang === "ru";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        gap: 12,
        padding: "0 24px",
        textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#1a6b3c",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "#fff",
          fontFamily: "var(--app-font-sans)",
          marginBottom: 8,
        }}>
          {user?.initial ?? "U"}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
          {isRu ? `Добро пожаловать, ${user?.name ?? ""}!` : `Welcome back, ${user?.name ?? ""}!`}
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-tertiary)", margin: 0, maxWidth: 400 }}>
          {isRu
            ? "Здесь будет ваш дашборд. Скоро появятся ваши заказы и прогресс."
            : "Your dashboard is on its way. Your orders and progress will appear here soon."}
        </p>
      </div>
    </div>
  );
}
