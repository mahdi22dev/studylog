"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Crown,
  Shield,
  Sparkles,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: number;
  lastActiveAt: number;
  totalMinutes: number;
  completedSessions: number;
  totalSessions: number;
  recentSessions: {
    id: string;
    startTime: string;
    endTime: string | null;
    durationMin: number;
    type: string;
    completed: boolean;
  }[];
}

function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDate(date: string | number) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: string | number) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`);
        const data = await res.json();
        if (!data.success) {
          setError(data.error || "User not found");
          return;
        }
        setUser(data.data);
      } catch {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <Card>
          <CardContent className="p-6 text-center text-destructive">
            {error || "User not found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            {user.role === "admin" ? (
              <Badge className="gap-1 bg-purple-600 hover:bg-purple-700">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            ) : user.role === "premium" ? (
              <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Free User
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" />
              Total Study Time
            </div>
            <div className="text-2xl font-bold">
              {formatMinutes(user.totalMinutes)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed Sessions
            </div>
            <div className="text-2xl font-bold">{user.completedSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Calendar className="h-4 w-4" />
              Total Sessions
            </div>
            <div className="text-2xl font-bold">{user.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" />
              Last Active
            </div>
            <div className="text-2xl font-bold">
              {user.lastActiveAt ? formatDate(user.lastActiveAt) : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <div className="flex items-center gap-2">
                {user.role === "admin" ? (
                  <Badge className="gap-1 bg-purple-600 hover:bg-purple-700 text-base py-1 px-3">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Badge>
                ) : user.role === "premium" ? (
                  <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white text-base py-1 px-3">
                    <Crown className="h-4 w-4" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-base py-1 px-3">
                    <Sparkles className="h-4 w-4" />
                    Free User
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground space-y-1">
              <p>
                {user.role === "premium" || user.role === "admin"
                  ? "Unlimited sessions, advanced analytics, priority support"
                  : "Basic timer, limited history, standard support"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {user.recentSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No study sessions yet
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{formatDate(session.startTime)}</TableCell>
                      <TableCell>{formatTime(session.startTime)}</TableCell>
                      <TableCell>
                        {session.endTime ? formatTime(session.endTime) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.type === "WORK"
                              ? "default"
                              : session.type === "BREAK"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {session.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {session.durationMin}m
                      </TableCell>
                      <TableCell className="text-center">
                        {session.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
