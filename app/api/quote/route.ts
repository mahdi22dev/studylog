import { NextResponse } from "next/server";

// Fallback quotes in case API fails
const fallbackQuotes = [
  "Focus deeply on your studies without distractions",
  "Every minute of focused study brings you closer to your goals",
  "Success is the sum of small efforts repeated day in and day out",
  "The expert in anything was once a beginner",
  "Learning is not attained by chance, it must be sought with dedication",
  "Your future is created by what you do today, not tomorrow",
  "The beautiful thing about learning is that no one can take it away from you",
  "Education is the passport to the future",
  "Stay focused, stay determined, stay unstoppable",
];

export async function GET() {
  try {
    // Fetch quote from ZenQuotes API
    const response = await fetch("https://zenquotes.io/api/random", {
      next: { revalidate: 0 }, // Don't cache, get fresh quote each time
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from ZenQuotes API");
    }

    const data = await response.json();

    // ZenQuotes returns an array with one quote object
    if (data && data[0]) {
      const quoteText = data[0].q; // q = quote text
      const author = data[0].a; // a = author

      return NextResponse.json({
        success: true,
        quote: quoteText,
        author: author,
        source: "ZenQuotes API",
      });
    }

    throw new Error("Invalid response from ZenQuotes API");
  } catch (error) {
    console.error("Error fetching quote from API, using fallback:", error);

    // Use fallback quote if API fails
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    const quote = fallbackQuotes[randomIndex];

    return NextResponse.json({
      success: true,
      quote: quote,
      author: "Study Log",
      source: "Fallback",
    });
  }
}
