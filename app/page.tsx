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

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Timer,
      title: "Pomodoro Timer",
      description: "Customizable focus sessions with automatic break reminders",
      details:
        "25-minute work sessions, 5-minute breaks, and long breaks after every 4 sessions",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Real-time study time tracking with detailed statistics",
      details:
        "Track every minute studied, view weekly goals, and monitor your learning streaks",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: Settings,
      title: "Full Customization",
      description: "Personalize timer durations to match your study style",
      details:
        "Adjust work sessions, break times, and long break intervals to your preference",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set weekly study targets and track your progress",
      details:
        "10-hour weekly goals with visual progress indicators and achievement tracking",
      color: "from-purple-600 to-indigo-600",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 bg-mesh relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl shadow-xl">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold gradient-text tracking-tight">
              Study Log
            </h1>
          </div>

          <p className="text-2xl text-study-text-secondary font-medium max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your learning journey with focused study sessions,
            intelligent progress tracking, and personalized productivity
            insights
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link href="/timer">
              <Button
                size="lg"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Start Studying Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Badge className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Free Forever
            </Badge>
          </div>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">25min</div>
              <div className="text-sm text-study-text-muted">
                Focus Sessions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">5min</div>
              <div className="text-sm text-study-text-muted">Break Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">∞</div>
              <div className="text-sm text-study-text-muted">Customizable</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-study-text-secondary max-w-2xl mx-auto">
              Everything you need to build effective study habits and track your
              learning progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  hoveredFeature === index ? "shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5"></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold gradient-text">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg font-medium text-study-text-secondary">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-study-text-muted">
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
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Why Choose Study Log?
            </h2>
            <p className="text-xl text-study-text-secondary max-w-2xl mx-auto">
              Join thousands of students who have transformed their study habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg shadow-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-study-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-study-text-secondary max-w-2xl mx-auto">
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
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-xl mx-auto w-fit">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold gradient-text mb-2">
                  {step.title}
                </h3>
                <p className="text-study-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-purple-50/50 to-violet-50/50 backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-violet-500/10"></div>

            <CardContent className="relative z-10 py-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold gradient-text">
                  Ready to Start?
                </h2>
              </div>

              <p className="text-xl text-study-text-secondary mb-8 max-w-2xl mx-auto">
                Begin your journey to better study habits and improved focus.
                Completely free to use.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/timer">
                  <Button
                    size="lg"
                    className="flex items-center gap-3 px-10 py-5 text-xl font-semibold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="h-6 w-6" />
                    Launch Study Log
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-study-text-muted">
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
