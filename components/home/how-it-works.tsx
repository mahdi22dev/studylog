import { Sparkles, Play, Brain, Coffee, BarChart3 } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-[1200px] mx-auto px-6 pt-6 pb-16">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272a32] border border-white/5 mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#c9beff]" />
          <span className="text-xs font-bold text-[#c9beff] uppercase tracking-widest">
            How It Works
          </span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          The Focurio Method
        </h2>
        <p className="text-base text-[#c9c3d9] max-w-2xl mx-auto">
          Master your focus in four steps with intentional work sprints and recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
        {/* Step 1 */}
        <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-[#6c47ff]/50 hover:shadow-2xl hover:shadow-[#6c47ff]/10 transition-all duration-300">
          <div className="absolute top-6 right-6 font-heading text-5xl font-black text-[#6c47ff] opacity-40 group-hover:opacity-80 transition-opacity">
            01
          </div>
          <div className="w-16 h-16 rounded-full bg-[#272a32] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#6c47ff] transition-colors shadow-inner">
            <Play className="h-7 w-7 text-[#c9beff] fill-[#c9beff]/30" />
          </div>
          <h3 className="font-heading text-xl font-bold mb-3 text-white">
            Start a session
          </h3>
          <p className="text-[#c9c3d9] text-base leading-relaxed">
            Pick a subject and set your focus duration. The interface dims, leaving only what matters.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-[#38dfab]/50 hover:shadow-2xl hover:shadow-[#38dfab]/10 transition-all duration-300">
          <div className="absolute top-6 right-6 font-heading text-5xl font-black text-[#38dfab] opacity-40 group-hover:opacity-80 transition-opacity">
            02
          </div>
          <div className="w-16 h-16 rounded-full bg-[#272a32] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#38dfab] transition-colors shadow-inner">
            <Brain className="h-7 w-7 text-[#38dfab]" />
          </div>
          <h3 className="font-heading text-xl font-bold mb-3 text-white">
            Stay in flow
          </h3>
          <p className="text-[#c9c3d9] text-base leading-relaxed">
            Focurio runs quietly — no distractions, just your timer. Gentle ambient soundscapes keep you immersed.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-[#cebdff]/50 hover:shadow-2xl hover:shadow-[#cebdff]/10 transition-all duration-300">
          <div className="absolute top-6 right-6 font-heading text-5xl font-black text-[#cebdff] opacity-40 group-hover:opacity-80 transition-opacity">
            03
          </div>
          <div className="w-16 h-16 rounded-full bg-[#272a32] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#cebdff] transition-colors shadow-inner">
            <Coffee className="h-7 w-7 text-[#cebdff]" />
          </div>
          <h3 className="font-heading text-xl font-bold mb-3 text-white">
            Take a real break
          </h3>
          <p className="text-[#c9c3d9] text-base leading-relaxed">
            Short breaks between sessions restore concentration. We guide you through micro-recoveries to prevent burnout.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-[#5ffcc6]/50 hover:shadow-2xl hover:shadow-[#5ffcc6]/10 transition-all duration-300">
          <div className="absolute top-6 right-6 font-heading text-5xl font-black text-[#5ffcc6] opacity-40 group-hover:opacity-80 transition-opacity">
            04
          </div>
          <div className="w-16 h-16 rounded-full bg-[#272a32] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#5ffcc6] transition-colors shadow-inner">
            <BarChart3 className="h-7 w-7 text-[#5ffcc6]" />
          </div>
          <h3 className="font-heading text-xl font-bold mb-3 text-white">
            Review your week
          </h3>
          <p className="text-[#c9c3d9] text-base leading-relaxed">
            See where your time went and adjust your targets. Minimalist analytics help you understand your peak performance windows.
          </p>
        </div>
      </div>
    </section>
  );
}
