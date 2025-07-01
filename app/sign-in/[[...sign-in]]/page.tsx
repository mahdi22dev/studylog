import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="glass-effect rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center gradient-text">
          Welcome Back
        </h1>
        <SignIn
          appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
              headerTitle: "text-xl font-semibold text-center gradient-text",
              headerSubtitle: "text-sm text-gray-500 text-center",
              socialButtonsBlockButton: "bg-muted hover:bg-muted/80",
              dividerText: "text-muted-foreground text-xs",
              formFieldInput:
                "bg-white/20 border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500",
            },
          }}
        />
      </div>
    </main>
  );
}
