import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Note, saveNotes, loadNotes } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewNoteDialog = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setIsDialogOpen(true);
  };

  const openEditNoteDialog = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsDialogOpen(true);
  };

  const saveNote = () => {
    if (!noteTitle.trim()) {
      toast({ title: "Please enter a note title" });
      return;
    }

    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              title: noteTitle.trim(),
              content: noteContent.trim(),
              updatedAt: new Date(),
            }
          : note
      ));
      toast({ title: "Note updated!" });
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle.trim(),
        content: noteContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
      toast({ title: "Note created!" });
    }

    setIsDialogOpen(false);
    setNoteTitle("");
    setNoteContent("");
    setEditingNote(null);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({ title: "Note deleted!" });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MobileLayout title="Notes">
      <div className="space-y-6">
        {/* Search and Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewNoteDialog}>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Edit Note" : "Create New Note"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="noteTitle">Title</Label>
                  <Input
                    id="noteTitle"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <Label htmlFor="noteContent">Content</Label>
                  <Textarea
                    id="noteContent"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={8}
                  />
                </div>
                <Button onClick={saveNote} className="w-full">
                  {editingNote ? "Update Note" : "Create Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No notes found matching your search." : "No notes yet. Create your first note!"}
                </p>
                {!searchQuery && (
                  <Button onClick={openNewNoteDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-1">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(note.updatedAt)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditNoteDialog(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || "No content"}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}