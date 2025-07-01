import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="glass-effect rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-md flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2 text-center gradient-text">
          Create Your Account
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Join us and start your journey today.
        </p>
        <div className="w-full flex justify-center">
          <SignUp
            appearance={{
              elements: {
                card: "w-full bg-transparent shadow-none", // force full width and remove Clerk's own shadow
                rootBox: "w-full", // ensure root container doesn't collapse
                formButtonPrimary:
                  "bg-purple-600 hover:bg-purple-700 text-white w-full",
                headerTitle: "text-xl font-semibold text-center gradient-text",
                headerSubtitle: "text-sm text-gray-500 text-center mb-4",
                socialButtonsBlockButton: "bg-muted hover:bg-muted/80 w-full",
                dividerText: "text-muted-foreground text-xs",
                formFieldInput:
                  "bg-white/20 border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
