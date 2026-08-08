"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Save, Crown, Shield, Sparkles } from "lucide-react";
import type { AdminUser } from "@/app/admin/page";

interface RolesTabProps {
  users: AdminUser[];
  loading: boolean;
  onRoleChange: () => void;
}

function roleBadge(role: string) {
  switch (role) {
    case "admin":
      return (
        <Badge className="gap-1 bg-purple-600 hover:bg-purple-700">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    case "premium":
      return (
        <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
          <Crown className="h-3 w-3" />
          Premium
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Free User
        </Badge>
      );
  }
}

export function RolesTab({ users, loading, onRoleChange }: RolesTabProps) {
  const [changes, setChanges] = useState<Map<string, string>>(new Map());
  const [saving, setSaving] = useState(false);

  function handleRoleChange(userId: string, newRole: string) {
    setChanges((prev) => {
      const next = new Map(prev);
      next.set(userId, newRole);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    let successCount = 0;
    let failCount = 0;

    for (const [userId, role] of changes) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    if (failCount > 0) {
      toast.error(`Failed to update ${failCount} role(s)`);
    }
    if (successCount > 0) {
      toast.success(`Updated ${successCount} role(s)`);
    }

    setChanges(new Map());
    setSaving(false);
    onRoleChange();
  }

  function getCurrentRole(user: AdminUser): string {
    return changes.get(user.id) ?? user.role;
  }

  function hasChanges(): boolean {
    for (const [userId, role] of changes) {
      const user = users.find((u) => u.id === userId);
      if (user && user.role !== role) return true;
    }
    return false;
  }

  return (
    <Card>
      <CardContent className="p-6">
        {hasChanges() && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-sm text-muted-foreground">
              {changes.size} unsaved change(s)
            </span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-[120px]" />
                      </TableCell>
                    </TableRow>
                  ))
                : users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>{roleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Select
                          value={getCurrentRole(user)}
                          onValueChange={(v) => handleRoleChange(user.id, v)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free User</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
