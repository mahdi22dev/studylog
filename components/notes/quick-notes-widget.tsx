"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NoteGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  notes: Note[];
}

interface Note {
  id: string;
  title: string;
  isPinned: boolean;
}

export default function QuickNotesWidget() {
  const [groups, setGroups] = useState<NoteGroup[]>([]);
  const [recentNotes, setRecentNotes] = useState<
    (Note & { group: NoteGroup })[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch groups
      const groupsResponse = await fetch("/api/notes/groups");
      const groupsData = await groupsResponse.json();
      setGroups(groupsData);

      // Fetch recent notes
      const notesResponse = await fetch("/api/notes");
      const notesData = await notesResponse.json();
      setRecentNotes(notesData.slice(0, 5)); // Get 5 most recent
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle>Quick Notes</CardTitle>
          </div>
          <Link href="/notes">
            <Button size="sm" variant="outline" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Groups Summary */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your Groups</p>
          <div className="flex flex-wrap gap-2">
            {groups.length === 0 ? (
              <p className="text-xs text-muted-foreground">No groups yet</p>
            ) : (
              groups.slice(0, 4).map((group) => (
                <Link key={group.id} href="/notes">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors"
                    style={{
                      borderColor: group.color,
                      color: group.color,
                    }}
                  >
                    <span className="mr-1">{group.icon}</span>
                    {group.name}
                    <span className="ml-1 text-xs opacity-70">
                      ({group.notes.length})
                    </span>
                  </Badge>
                </Link>
              ))
            )}
            {groups.length > 4 && (
              <Link href="/notes">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  +{groups.length - 4} more
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Notes */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Recent Notes</p>
          {recentNotes.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-3">No notes yet</p>
              <Link href="/notes">
                <Button size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Create First Note
                </Button>
              </Link>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {recentNotes.map((note) => (
                  <Link key={note.id} href="/notes">
                    <div className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {note.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: note.group.color + "20",
                                color: note.group.color,
                              }}
                            >
                              {note.group.icon} {note.group.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Quick Action */}
        <Link href="/notes" className="block">
          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
