"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, FileText } from "lucide-react";
import NoteGroupsCard from "@/components/notes/note-groups-card";
import NoteBrowser from "@/components/notes/note-browser";

function NotesPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const group = searchParams.get("group");

    if (tab) {
      setActiveTab(tab);
    }
    if (group) {
      setSelectedGroupId(group);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes</h1>
          <p className="text-muted-foreground">
            Organize and manage your study notes efficiently
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="groups" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Browse Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-6">
          <NoteGroupsCard />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NoteBrowser initialGroupId={selectedGroupId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notes</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <NotesPageContent />
    </Suspense>
  );
}
