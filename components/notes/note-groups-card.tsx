"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Folder, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface NoteGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  notes: Note[];
}

interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export default function NoteGroupsCard() {
  const [groups, setGroups] = useState<NoteGroup[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#3b82f6");
  const [newGroupIcon, setNewGroupIcon] = useState("📁");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/notes/groups");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notes/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          color: newGroupColor,
          icon: newGroupIcon,
        }),
      });

      if (response.ok) {
        await fetchGroups();
        setNewGroupName("");
        setNewGroupColor("#3b82f6");
        setNewGroupIcon("📁");
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/notes/groups?id=${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchGroups();
        setDeleteDialogOpen(false);
        setGroupToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const popularIcons = [
    "📁",
    "📚",
    "📝",
    "🎓",
    "💡",
    "🔬",
    "🎨",
    "💻",
    "🌟",
    "📊",
  ];
  const popularColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Folder className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle>Note Groups</CardTitle>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note Group</DialogTitle>
                <DialogDescription>
                  Organize your notes into groups like "Math", "Science",
                  "History", etc.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., Math, Science, History"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createGroup()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {popularIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewGroupIcon(icon)}
                        className={`text-2xl p-2 rounded-lg hover:bg-muted transition-colors ${
                          newGroupIcon === icon
                            ? "bg-muted ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {popularColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewGroupColor(color)}
                        className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                          newGroupColor === color
                            ? "ring-2 ring-offset-2 ring-primary scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createGroup}
                  disabled={loading || !newGroupName.trim()}
                >
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2">No note groups yet</p>
            <p className="text-sm">
              Create your first group to start organizing notes
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                style={{ borderColor: group.color + "33" }}
                onClick={() =>
                  router.push(`/notes?tab=notes&group=${group.id}`)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {group.notes.length}{" "}
                          {group.notes.length === 1 ? "note" : "notes"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupToDelete(group.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  {group.notes.length > 0 && (
                    <div className="space-y-1">
                      {group.notes.slice(0, 3).map((note) => (
                        <div
                          key={note.id}
                          className="text-xs text-muted-foreground truncate flex items-center gap-1"
                        >
                          <span>•</span>
                          <span className="truncate">{note.title}</span>
                        </div>
                      ))}
                      {group.notes.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{group.notes.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group and all its notes? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGroupToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => groupToDelete && deleteGroup(groupToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
