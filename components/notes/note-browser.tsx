"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Star,
  Save,
  X,
  FolderOpen,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NoteGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Note {
  id: string;
  groupId: string;
  title: string;
  content: string;
  format: string;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  group: NoteGroup;
}

interface NoteBrowserProps {
  initialGroupId?: string | null;
}

export default function NoteBrowser({ initialGroupId }: NoteBrowserProps) {
  const [groups, setGroups] = useState<NoteGroup[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    initialGroupId || null
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    fetchGroups();
    fetchNotes();
  }, []);

  // Update selected group when initialGroupId changes
  useEffect(() => {
    if (initialGroupId) {
      setSelectedGroup(initialGroupId);
    }
  }, [initialGroupId]);

  useEffect(() => {
    if (selectedGroup) {
      fetchNotes(selectedGroup);
    } else {
      fetchNotes();
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const response = await fetch("/api/notes/groups");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const fetchNotes = async (groupId?: string) => {
    setIsLoadingNotes(true);
    try {
      const url = groupId ? `/api/notes?groupId=${groupId}` : "/api/notes";
      const response = await fetch(url);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const createNote = async () => {
    if (!newNoteTitle.trim() || !selectedGroup) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroup,
          title: newNoteTitle,
          content: "",
          format: "markdown",
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        await fetchNotes(selectedGroup);
        setSelectedNote(newNote);
        setNewNoteTitle("");
        setIsCreateDialogOpen(false);
        setIsEditing(true);
        setEditedTitle(newNote.title);
        setEditedContent(newNote.content);
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedNote.id,
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (response.ok) {
        await fetchNotes(selectedGroup || undefined);
        const updatedNote = await response.json();
        setSelectedNote(updatedNote);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchNotes(selectedGroup || undefined);
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const togglePin = async (note: Note) => {
    try {
      const response = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: note.id,
          isPinned: !note.isPinned,
        }),
      });

      if (response.ok) {
        await fetchNotes(selectedGroup || undefined);
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(false);
  };

  const filteredNotes = selectedGroup
    ? notes.filter((note) => note.groupId === selectedGroup)
    : notes;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      {/* Left sidebar - Group selector and notes list */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notes</CardTitle>
            <Button
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={!selectedGroup}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="pt-2">
            <Select
              value={selectedGroup || "all"}
              onValueChange={(value) =>
                setSelectedGroup(value === "all" ? null : value)
              }
              disabled={isLoadingGroups}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingGroups ? "Loading groups..." : "Select a group"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notes</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <span className="flex items-center gap-2">
                      <span>{group.icon}</span>
                      <span>{group.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-350px)]">
            {isLoadingNotes ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-20 h-20">
                  {/* Pencil/pen writing pattern */}
                  <div className="absolute inset-0 animate-spin [animation-duration:4s]">
                    <div className="absolute top-0 left-1/2 w-1 h-6 bg-primary rounded-full -translate-x-1/2"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin [animation-duration:3s] [animation-direction:reverse]">
                    <div className="absolute top-0 left-1/2 w-1 h-5 bg-primary/70 rounded-full -translate-x-1/2 rotate-45"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin [animation-duration:2.5s]">
                    <div className="absolute top-0 left-1/2 w-1 h-4 bg-primary/50 rounded-full -translate-x-1/2 rotate-90"></div>
                  </div>
                  {/* Floating study dots */}
                  <div className="absolute inset-2 animate-pulse [animation-duration:2s]">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-primary/30"></div>
                  </div>
                  {/* Center notebook */}
                  <div className="absolute inset-6 bg-primary/20 rounded animate-pulse"></div>
                  <div className="absolute inset-7 flex flex-col gap-0.5 items-center justify-center">
                    <div className="w-2 h-0.5 bg-primary/60 rounded"></div>
                    <div className="w-2 h-0.5 bg-primary/60 rounded"></div>
                    <div className="w-2 h-0.5 bg-primary/60 rounded"></div>
                  </div>
                </div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {selectedGroup ? "No notes in this group" : "No notes yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {filteredNotes.map((note, index) => (
                  <button
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={cn(
                      "group w-full text-left p-3 rounded-lg transition-all duration-200",
                      "hover:bg-muted hover:shadow-md hover:scale-[1.02]",
                      "border border-transparent hover:border-primary/20",
                      selectedNote?.id === note.id &&
                        "bg-muted shadow-md border-primary/30 scale-[1.01]"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {note.isPinned && (
                            <Pin className="h-3 w-3 text-primary flex-shrink-0 animate-pulse" />
                          )}
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {note.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {note.content || "Empty note"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs transition-all group-hover:scale-105"
                            style={{
                              borderColor: note.group.color,
                              color: note.group.color,
                            }}
                          >
                            {note.group.icon} {note.group.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right side - Note editor */}
      <Card className="lg:col-span-2">
        {isLoadingNotes && !selectedNote ? (
          <div className="flex items-center justify-center h-full min-h-[500px]">
            <div className="relative w-28 h-28">
              {/* Book stack effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-20 h-16 bg-primary/10 rounded-lg rotate-[-5deg] animate-pulse"></div>
                <div className="absolute w-20 h-16 bg-primary/15 rounded-lg rotate-[0deg] animate-pulse [animation-delay:-0.2s]"></div>
                <div className="absolute w-20 h-16 bg-primary/20 rounded-lg rotate-[5deg] animate-pulse [animation-delay:-0.4s]"></div>
              </div>
              {/* Floating study elements in circular pattern */}
              <div className="absolute inset-0 animate-spin [animation-duration:8s]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary/80"></div>
                <div className="absolute top-[15%] right-[15%] w-2 h-2 rounded-sm bg-primary/60"></div>
              </div>
              <div className="absolute inset-0 animate-spin [animation-duration:6s] [animation-direction:reverse]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary/70"></div>
                <div className="absolute bottom-[15%] left-[15%] w-2 h-2 rounded-sm bg-primary/50"></div>
              </div>
              <div className="absolute inset-0 animate-spin [animation-duration:10s]">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/60"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/60"></div>
              </div>
            </div>
          </div>
        ) : selectedNote ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                      placeholder="Note title"
                    />
                  ) : (
                    <CardTitle>{selectedNote.title}</CardTitle>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated:{" "}
                    {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePin(selectedNote)}
                  >
                    <Pin
                      className={cn(
                        "h-4 w-4",
                        selectedNote.isPinned && "fill-current text-primary"
                      )}
                    />
                  </Button>
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedTitle(selectedNote.title);
                          setEditedContent(selectedNote.content);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={updateNote}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNoteToDelete(selectedNote.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Write your notes here... (supports markdown)"
                    className="min-h-[500px] resize-none border-0 focus-visible:ring-0"
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedNote.content ? (
                      <pre className="whitespace-pre-wrap font-sans">
                        {selectedNote.content}
                      </pre>
                    ) : (
                      <p className="text-muted-foreground italic">
                        This note is empty. Click edit to add content.
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a note to view or edit</p>
              <p className="text-sm mt-2">
                Or create a new note to get started
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Create note dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to{" "}
              {groups.find((g) => g.id === selectedGroup)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Note title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createNote()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={createNote}
              disabled={loading || !newNoteTitle.trim()}
            >
              Create & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => noteToDelete && deleteNote(noteToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
