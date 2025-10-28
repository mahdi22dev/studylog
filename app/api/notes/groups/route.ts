import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET all note groups for a user
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await prisma.noteGroup.findMany({
      where: { userId },
      include: {
        notes: {
          orderBy: [
            { isPinned: "desc" },
            { order: "asc" },
            { createdAt: "desc" },
          ],
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching note groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch note groups" },
      { status: 500 }
    );
  }
}

// POST create a new note group
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, color, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    // Get the highest order number and increment it
    const lastGroup = await prisma.noteGroup.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });

    const group = await prisma.noteGroup.create({
      data: {
        userId,
        name,
        color: color || "#3b82f6",
        icon: icon || "📁",
        order: (lastGroup?.order || 0) + 1,
      },
      include: {
        notes: true,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating note group:", error);
    return NextResponse.json(
      { error: "Failed to create note group" },
      { status: 500 }
    );
  }
}

// PATCH update a note group
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, color, icon, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const group = await prisma.noteGroup.update({
      where: { id, userId },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
      },
      include: {
        notes: true,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error updating note group:", error);
    return NextResponse.json(
      { error: "Failed to update note group" },
      { status: 500 }
    );
  }
}

// DELETE a note group
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
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    await prisma.noteGroup.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note group:", error);
    return NextResponse.json(
      { error: "Failed to delete note group" },
      { status: 500 }
    );
  }
}
