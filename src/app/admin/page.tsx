"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, writeBatch, query, orderBy } from "firebase/firestore";
import { ADMIN_CREDENTIALS } from "./credentials";
import { useRef } from "react";

interface Project {
  id: string;
  url: string;
  title?: string;
  description?: string;
  order?: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (!user || !db) return;
    const q = query(collection(db, "projects"));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }))
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      );
    });
    return () => unsub();
  }, [user, db]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ email } as any); // fake user object
    } else {
      setError("Chybné přihlašovací údaje");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setUser(null);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !db) return;
    const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order ?? 0)) : 0;
    await addDoc(collection(db, "projects"), {
      url: newUrl,
      title: newTitle,
      description: newDescription,
      order: maxOrder + 1,
    });
    setNewUrl("");
    setNewTitle("");
    setNewDescription("");
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "projects", id));
  };

  // Drag and drop pořadí
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || !db) return;
    const items = [...projects];
    const dragged = items.splice(dragItem.current, 1)[0];
    items.splice(dragOverItem.current, 0, dragged);
    // Ulož nové pořadí do Firestore
    const batch = writeBatch(db!);
    items.forEach((item, idx) => {
      batch.update(doc(db!, "projects", item.id), { order: idx + 1 });
    });
    await batch.commit();
    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow flex flex-col gap-4 min-w-[300px]">
          <h2 className="text-2xl font-bold mb-2 text-black">Přihlášení admin</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded text-black placeholder-black" required />
          <input type="password" placeholder="Heslo" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded text-black placeholder-black" required />
          <button type="submit" className="bg-fuchsia-600 text-white py-2 rounded font-semibold" disabled={loading}>{loading ? "Přihlašuji..." : "Přihlásit se"}</button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Admin dashboard</h1>
        <button onClick={handleLogout} className="bg-gray-300 px-4 py-2 rounded text-black">Odhlásit se</button>
      </div>
      <form onSubmit={handleAddProject} className="flex flex-col md:flex-row gap-2 mb-6">
        <input type="url" placeholder="Odkaz na nový projekt" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="border p-2 rounded flex-1 text-black placeholder-black" required />
        <input type="text" placeholder="Název projektu" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="border p-2 rounded flex-1 text-black placeholder-black" required />
        <input type="text" placeholder="Popis projektu" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="border p-2 rounded flex-1 text-black placeholder-black" />
        <button type="submit" className="bg-fuchsia-600 text-white px-4 py-2 rounded">Přidat</button>
      </form>
      <ul className="space-y-4">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center cursor-move"
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
          >
            <div>
              <div className="font-bold text-lg text-black">{p.title || p.url}</div>
              <div className="text-black text-sm">{p.description}</div>
              <div className="text-black text-xs">{p.url}</div>
            </div>
            <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Smazat</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 