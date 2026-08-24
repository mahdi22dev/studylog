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
  FileText,
} from "lucide-react";
import Link from "next/link";

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
    {
      icon: FileText,
      title: "Note Taking",
      description: "Organize notes into groups with a powerful editor",
      details:
        "Create groups like Math, Science, History and manage all your study notes in one place",
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
    <div className="min-h-screen bg-background bg-mesh relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-primary rounded-3xl shadow-xl">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold text-foreground tracking-tight font-sora">
              Study Log
            </h1>
          </div>

          <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your learning journey with focused study sessions,
            intelligent progress tracking, and personalized productivity
            insights
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link href="/timer">
              <Button
                size="lg"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Start Studying Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/notes">
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold border-2"
              >
                <FileText className="h-5 w-5" />
                My Notes
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Badge className="px-4 py-2 bg-success/15 text-success border-success/30">
              <CheckCircle className="h-4 w-4 mr-2" />
              Free Forever
            </Badge>
          </div>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1 font-sora">25min</div>
              <div className="text-sm text-muted-foreground">Focus Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1 font-sora">5min</div>
              <div className="text-sm text-muted-foreground">Break Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1 font-sora">∞</div>
              <div className="text-sm text-muted-foreground">Customizable</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sora">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build effective study habits and track your
              learning progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border border-border shadow-xl bg-card backdrop-blur-sm cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  hoveredFeature === index ? "shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground font-sora">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-muted-foreground">
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
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sora">
              Why Choose Study Log?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who have transformed their study habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-card backdrop-blur-sm rounded-xl shadow-lg border border-border hover:shadow-xl transition-all duration-200"
              >
                <div className="p-2 bg-success/15 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <span className="font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-sora">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and scientifically proven study method
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                <div className="relative mb-6">
                  <div className="p-4 bg-primary rounded-2xl shadow-xl mx-auto w-fit">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-sora">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border border-border shadow-2xl bg-card backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto">
            <CardContent className="relative z-10 py-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-primary rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-4xl font-bold text-foreground font-sora">
                  Ready to Start?
                </h2>
              </div>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Begin your journey to better study habits and improved focus. No
                signup required, completely free to use.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/timer">
                  <Button
                    size="lg"
                    className="flex items-center gap-3 px-10 py-5 text-xl font-semibold bg-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="h-6 w-6" />
                    Launch Study Log
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  No Registration
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Works Offline
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
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
