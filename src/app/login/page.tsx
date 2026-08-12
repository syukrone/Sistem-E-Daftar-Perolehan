import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-mesh-pattern opacity-30 mix-blend-multiply" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 blur-[120px] mix-blend-screen animate-blob" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/30 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/30 blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      
      <LoginForm />
    </main>
  );
}
