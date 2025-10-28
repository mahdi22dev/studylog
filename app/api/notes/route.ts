import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET notes (optionally filtered by groupId)
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    const notes = await prisma.note.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
      },
      include: {
        group: true,
      },
      orderBy: [{ isPinned: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST create a new note
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, title, content = "", format = "markdown" } = body;

    if (!groupId || !title) {
      return NextResponse.json(
        { error: "Group ID and title are required" },
        { status: 400 }
      );
    }

    // Get the highest order number in this group and increment it
    const lastNote = await prisma.note.findFirst({
      where: { userId, groupId },
      orderBy: { order: "desc" },
    });

    const note = await prisma.note.create({
      data: {
        userId,
        groupId,
        title,
        content,
        format,
        order: (lastNote?.order || 0) + 1,
      },
      include: {
        group: true,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// PATCH update a note
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, title, content, format, isPinned, isFavorite, order, groupId } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.update({
      where: { id, userId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(format !== undefined && { format }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(order !== undefined && { order }),
        ...(groupId !== undefined && { groupId }),
      },
      include: {
        group: true,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    await prisma.note.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
