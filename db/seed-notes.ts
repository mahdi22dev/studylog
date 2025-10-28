import prisma from "../lib/prisma";

async function seedNotes() {
  const userId = "default-user";

  // Create sample note groups
  const mathGroup = await prisma.noteGroup.create({
    data: {
      userId,
      name: "Math",
      color: "#3b82f6",
      icon: "📐",
      order: 1,
    },
  });

  const scienceGroup = await prisma.noteGroup.create({
    data: {
      userId,
      name: "Science",
      color: "#10b981",
      icon: "🔬",
      order: 2,
    },
  });

  const historyGroup = await prisma.noteGroup.create({
    data: {
      userId,
      name: "History",
      color: "#f59e0b",
      icon: "📚",
      order: 3,
    },
  });

  // Create sample notes for Math
  await prisma.note.create({
    data: {
      userId,
      groupId: mathGroup.id,
      title: "Algebra Basics",
      content: `# Algebra Fundamentals

## Variables and Constants
- Variables: Letters that represent unknown values (x, y, z)
- Constants: Fixed numerical values

## Basic Operations
1. Addition: a + b
2. Subtraction: a - b
3. Multiplication: a × b or ab
4. Division: a ÷ b or a/b

## Important Formulas
- Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a
- Slope Formula: m = (y₂-y₁) / (x₂-x₁)`,
      format: "markdown",
      isPinned: true,
      order: 1,
    },
  });

  await prisma.note.create({
    data: {
      userId,
      groupId: mathGroup.id,
      title: "Calculus - Derivatives",
      content: `# Derivatives

## Definition
The derivative measures the rate of change of a function.

## Power Rule
If f(x) = x^n, then f'(x) = nx^(n-1)

## Chain Rule
If f(x) = g(h(x)), then f'(x) = g'(h(x)) · h'(x)

## Product Rule
(fg)' = f'g + fg'

## Quotient Rule
(f/g)' = (f'g - fg') / g²`,
      format: "markdown",
      order: 2,
    },
  });

  // Create sample notes for Science
  await prisma.note.create({
    data: {
      userId,
      groupId: scienceGroup.id,
      title: "Cell Biology",
      content: `# Cell Structure

## Eukaryotic Cells
- Nucleus: Contains genetic material (DNA)
- Mitochondria: Powerhouse of the cell (ATP production)
- Ribosomes: Protein synthesis
- Endoplasmic Reticulum: Protein and lipid transport
- Golgi Apparatus: Packaging and distribution

## Prokaryotic Cells
- No nucleus
- DNA in nucleoid region
- Simpler structure
- Examples: Bacteria`,
      format: "markdown",
      isPinned: true,
      order: 1,
    },
  });

  await prisma.note.create({
    data: {
      userId,
      groupId: scienceGroup.id,
      title: "Periodic Table Trends",
      content: `# Periodic Table Trends

## Atomic Radius
- Increases DOWN a group
- Decreases ACROSS a period (left to right)

## Ionization Energy
- Decreases DOWN a group
- Increases ACROSS a period

## Electronegativity
- Decreases DOWN a group
- Increases ACROSS a period
- Fluorine is most electronegative`,
      format: "markdown",
      order: 2,
    },
  });

  // Create sample notes for History
  await prisma.note.create({
    data: {
      userId,
      groupId: historyGroup.id,
      title: "World War II Timeline",
      content: `# World War II Key Events

## 1939
- September 1: Germany invades Poland
- September 3: Britain and France declare war

## 1941
- June: Operation Barbarossa (Germany invades USSR)
- December 7: Pearl Harbor attack
- USA enters the war

## 1944
- June 6: D-Day - Allied invasion of Normandy

## 1945
- May 8: V-E Day (Victory in Europe)
- August 6 & 9: Atomic bombs on Hiroshima and Nagasaki
- September 2: V-J Day (Victory over Japan)`,
      format: "markdown",
      order: 1,
    },
  });

  console.log("✅ Sample notes seeded successfully!");
}

seedNotes()
  .catch((e) => {
    console.error("❌ Error seeding notes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
