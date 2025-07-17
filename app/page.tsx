"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  BarChart3,
  Target,
  Coffee,
  Settings,
  Sparkles,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ThemeChanger } from "@/components/use-themes";

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Timer,
      title: "Pomodoro Timer",
      description: "Customizable focus sessions with automatic break reminders",
      details:
        "25-minute work sessions, 5-minute breaks, and long breaks after every 4 sessions",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Real-time study time tracking with detailed statistics",
      details:
        "Track every minute studied, view weekly goals, and monitor your learning streaks",
    },
    {
      icon: Settings,
      title: "Full Customization",
      description: "Personalize timer durations to match your study style",
      details:
        "Adjust work sessions, break times, and long break intervals to your preference",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set weekly study targets and track your progress",
      details:
        "10-hour weekly goals with visual progress indicators and achievement tracking",
    },
  ];

  const benefits = [
    "Improve focus and concentration",
    "Build consistent study habits",
    "Track learning progress over time",
    "Reduce study burnout with regular breaks",
    "Customize to your learning style",
    "Stay motivated with visual progress",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-muted rounded-2xl">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Study Log</h1>
          </div>

          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-8">
            Transform your learning journey with focused study sessions,
            intelligent progress tracking, and personalized productivity
            insights.
          </p>

          <div className="flex items-center justify-center gap-4 mb-10">
            <Link href="/timer">
              <Button size="lg" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Studying Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Badge>
              <CheckCircle className="h-4 w-4 mr-2" />
              Free Forever
            </Badge>
          </div>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">25min</div>
              <div className="text-sm text-muted-foreground">
                Focus Sessions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">5min</div>
              <div className="text-sm text-muted-foreground">Break Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">∞</div>
              <div className="text-sm text-muted-foreground">Customizable</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to build effective study habits and track your
              learning progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`transition-all duration-300 ${
                  hoveredFeature === index ? "shadow-lg" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {hoveredFeature === index
                      ? feature.details
                      : feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Why Choose Study Log?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of students who have transformed their study
              habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border"
              >
                <div className="p-2 bg-muted rounded">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Simple, effective, and scientifically proven study method.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Play,
                title: "Start Timer",
                description: "Begin a 25-minute focused study session",
              },
              {
                icon: Zap,
                title: "Stay Focused",
                description: "Concentrate on your studies without distractions",
              },
              {
                icon: Coffee,
                title: "Take Breaks",
                description: "Enjoy 5-minute breaks between sessions",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Watch your study time accumulate and grow",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className="p-3 bg-muted rounded-xl mx-auto w-fit">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-10">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="p-3 bg-muted rounded-xl">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Ready to Start?</h2>
              </div>

              <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                Begin your journey to better study habits and improved focus.
                Completely free to use.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/timer">
                  <Button size="lg" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Launch Study Log
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Privacy First
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
