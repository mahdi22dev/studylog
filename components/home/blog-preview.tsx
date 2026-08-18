import { Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function BlogPreview() {
  const posts = [
    {
      category: "Deep Work",
      categoryColor: "bg-[#272a32] text-[#c9beff]",
      date: "Oct 12",
      readTime: "5 min read",
      title: "Why 25 minutes is the sweet spot for deep focus",
      excerpt:
        "Exploring the Pomodoro technique's neurological basis and why pushing beyond cognitive limits backfires.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Research",
      categoryColor: "bg-[#38dfab]/20 text-[#38dfab]",
      date: "Oct 08",
      readTime: "6 min read",
      title: "The spacing effect: why studying daily beats cramming",
      excerpt:
        "How to leverage algorithmic repetition to move information from short-term to robust long-term memory.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Student Life",
      categoryColor: "bg-[#cebdff]/20 text-[#cebdff]",
      date: "Oct 01",
      readTime: "4 min read",
      title: "How to build a study habit that actually sticks",
      excerpt:
        "Actionable frameworks to reduce the friction of starting and transform studying into an automatic behavior.",
      image:
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section id="blog-preview" className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272a32] border border-white/5 mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c9beff]" />
            <span className="text-xs font-bold text-[#c9beff] uppercase tracking-widest">
              Study Science Blog
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Latest Research & Insights
          </h2>
          <p className="text-base text-[#c9c3d9] max-w-xl">
            Explore the science behind focus, habit formation, and peak cognitive performance.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-[#1d1f27] hover:bg-[#272a32] text-[#c9beff] border border-white/10 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group"
        >
          View All Articles
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Link
            key={i}
            href="/blog"
            className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1.5 hover:border-[#6c47ff]/50 hover:shadow-2xl hover:shadow-[#6c47ff]/15 transition-all duration-300"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${post.categoryColor}`}
                >
                  {post.category}
                </span>
                <span className="text-xs text-[#c9c3d9]">{post.date}</span>
              </div>
              <h3 className="font-heading text-base font-bold text-white mb-2 group-hover:text-[#c9beff] transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-[#c9c3d9] leading-relaxed line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-[#c9c3d9] mt-auto pt-3 border-t border-white/5 font-medium">
                <span className="group-hover:text-[#c9beff] transition-colors flex items-center gap-1">
                  Read Article →
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
