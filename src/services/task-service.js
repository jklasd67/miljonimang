const fs = require("fs/promises");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "..", "..", "input");
const MAX_FILE_SIZE = 120 * 1024;
const IGNORED_DIRS = new Set(["node_modules", ".git", "vendor", "dist", "build"]);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureInputFolder() {
  if (!(await exists(INPUT_DIR))) {
    await fs.mkdir(INPUT_DIR, { recursive: true });
  }
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

async function safeReadFile(filePath) {
  const stats = await fs.stat(filePath);
  if (stats.size > MAX_FILE_SIZE) {
    return `[[SKIPPED: Liiga suur fail (${Math.round(stats.size / 1024)}KB)]]`;
  }
  return fs.readFile(filePath, "utf8");
}

async function walkFiles(baseDir, currentDir = baseDir, bag = []) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      await walkFiles(baseDir, fullPath, bag);
      continue;
    }

    if (entry.isFile() && entry.name !== "assignment.md") {
      const content = await safeReadFile(fullPath);
      bag.push({
        path: relativePath,
        content,
      });
    }
  }

  return bag;
}

function buildTaskPath(taskId) {
  if (!/^\d+$/.test(taskId)) {
    const error = new Error("Vigane taskId. Lubatud on ainult numbrilised ID-d.");
    error.statusCode = 400;
    throw error;
  }

  return path.join(INPUT_DIR, taskId);
}

async function listTasks() {
  await ensureInputFolder();

  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });
  const numericDirs = entries
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a) - Number(b));

  const tasks = [];

  for (const id of numericDirs) {
    const assignmentPath = path.join(INPUT_DIR, id, "assignment.md");
    let title = `Ulesanne ${id}`;

    if (await exists(assignmentPath)) {
      const assignment = await fs.readFile(assignmentPath, "utf8");
      title = extractTitle(assignment, title);
    }

    tasks.push({ id, title });
  }

  return tasks;
}

async function loadTaskDetails(taskId) {
  await ensureInputFolder();

  const taskPath = buildTaskPath(taskId);
  if (!(await exists(taskPath))) {
    const error = new Error(`Ulesannet ID-ga ${taskId} ei leitud`);
    error.statusCode = 404;
    throw error;
  }

  const assignmentPath = path.join(taskPath, "assignment.md");
  if (!(await exists(assignmentPath))) {
    const error = new Error(`Ulesande ${taskId} kaustas puudub assignment.md`);
    error.statusCode = 400;
    throw error;
  }

  const assignment = await fs.readFile(assignmentPath, "utf8");
  const title = extractTitle(assignment, `Ulesanne ${taskId}`);
  const solutionFiles = await walkFiles(taskPath);

  return {
    id: taskId,
    title,
    assignment,
    solutionFiles,
  };
}

module.exports = {
  listTasks,
  loadTaskDetails,
};
