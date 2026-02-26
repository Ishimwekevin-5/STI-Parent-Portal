import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Database setup
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/school.db' : 'school.db';
const db = new Database(dbPath);

// Initialize Database
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      grade_level TEXT,
      student_id TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      subject TEXT,
      score INTEGER,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      date TEXT,
      status TEXT, -- 'present', 'absent', 'late'
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      total_amount REAL,
      paid_amount REAL,
      status TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fee_id INTEGER,
      amount REAL,
      date TEXT,
      method TEXT,
      FOREIGN KEY(fee_id) REFERENCES fees(id)
    );
  `);

  // Seed Data if empty
  const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
  if (studentCount.count === 0) {
    const insertStudent = db.prepare("INSERT INTO students (name, grade_level, student_id) VALUES (?, ?, ?)");
    const student = insertStudent.run("Alex Johnson", "10th Grade", "STU1001");
    const sId = student.lastInsertRowid;

    const insertGrade = db.prepare("INSERT INTO grades (student_id, subject, score) VALUES (?, ?, ?)");
    insertGrade.run(sId, "Mathematics", 92);
    insertGrade.run(sId, "Science", 88);
    insertGrade.run(sId, "History", 75);
    insertGrade.run(sId, "English", 85);
    insertGrade.run(sId, "Art", 95);

    const insertAttendance = db.prepare("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)");
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const status = Math.random() > 0.1 ? "present" : (Math.random() > 0.5 ? "absent" : "late");
      insertAttendance.run(sId, d.toISOString().split('T')[0], status);
    }

    const insertAnnouncement = db.prepare("INSERT INTO announcements (title, content, date, category) VALUES (?, ?, ?, ?)");
    insertAnnouncement.run("Parent-Teacher Meeting", "Join us this Friday for the annual meeting.", "2024-03-01", "Event");
    insertAnnouncement.run("Spring Break Schedule", "School will be closed from March 15th to March 22nd.", "2024-02-25", "Holiday");
    insertAnnouncement.run("New Sports Equipment", "We have received new basketballs and soccer balls.", "2024-02-20", "Update");

    const insertFee = db.prepare("INSERT INTO fees (student_id, total_amount, paid_amount, status) VALUES (?, ?, ?, ?)");
    const fee = insertFee.run(sId, 2500, 1800, "Partial");
    const fId = fee.lastInsertRowid;

    const insertPayment = db.prepare("INSERT INTO payments (fee_id, amount, date, method) VALUES (?, ?, ?, ?)");
    insertPayment.run(fId, 1000, "2024-01-15", "Credit Card");
    insertPayment.run(fId, 800, "2024-02-10", "Bank Transfer");
  }
}

initDb();

app.use(express.json());

// API Routes
app.get("/api/parent/student/:id", (req, res) => {
  const student = db.prepare("SELECT * FROM students WHERE student_id = ?").get(req.params.id) as any;
  if (!student) return res.status(404).json({ error: "Student not found" });

  const grades = db.prepare("SELECT subject, score FROM grades WHERE student_id = ?").all(student.id);
  const attendance = db.prepare("SELECT date, status FROM attendance WHERE student_id = ?").all(student.id);

  res.json({
    profile: student,
    academic: grades,
    attendance: attendance
  });
});

app.get("/api/parent/announcements", (req, res) => {
  const announcements = db.prepare("SELECT * FROM announcements ORDER BY date DESC").all();
  res.json(announcements);
});

app.get("/api/parent/student/:id/fees", (req, res) => {
  const student = db.prepare("SELECT id FROM students WHERE student_id = ?").get(req.params.id) as any;
  if (!student) return res.status(404).json({ error: "Student not found" });

  const fee = db.prepare("SELECT * FROM fees WHERE student_id = ?").get(student.id) as any;
  if (!fee) return res.json({ fees: null, history: [] });

  const history = db.prepare("SELECT * FROM payments WHERE fee_id = ? ORDER BY date DESC").all(fee.id);

  res.json({
    fees: fee,
    history: history
  });
});

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
}

// Only listen if not running as a serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // In production on Vercel, static files are served by Vercel's routing
  // but we still need to setup the app for the API routes
}

export default app;

