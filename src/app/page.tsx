'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import FlowerScrollEffect from "./FlowerScrollEffect";

interface Project {
  id: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  order?: number;
}

export default function Home() {
  const offerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Projekty z Firestore
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    if (!db) return;
    const q = collection(db, "projects");
    const unsub = onSnapshot(q, (snap) => {
      setProjects(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }))
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      );
    });
    return () => unsub();
  }, [db]);

  // Automatické zmizení úspěšné zprávy po 5 sekundách
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 4500); // Zkrátím na 4.5s aby se exit animace stihla
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleProjectClick = (url: string) => {
    setIsLoading(true);
    setSelectedProject(url);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-purple-50">
      <FlowerScrollEffect />
      {/* Modální okno pro projekty */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold text-fuchsia-800">
                  {projects.find(p => p.url === selectedProject)?.title}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(80vh-4rem)] relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin"></div>
                      <p className="text-fuchsia-800 font-medium">Načítání projektu...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={selectedProject}
                  className="w-full h-full"
                  title="Project Preview"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                  onLoad={() => {
                    console.log('iframe loaded');
                    setIsLoading(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO sekce - kompaktnější */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] relative z-10 text-center px-4">
        <div className="relative">
          {/* Dekorativní květy */}
          <motion.img
            src="/flower.svg"
            alt="květ"
            className="absolute -left-16 -top-12 w-24 opacity-40"
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [-15, 0, -15]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.img
            src="/flower.svg"
            alt="květ"
            className="absolute -right-16 -top-8 w-20 opacity-40"
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [15, 0, 15]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.img
            src="/flower.svg"
            alt="květ"
            className="absolute -left-12 bottom-4 w-16 opacity-40"
            initial={{ opacity: 0, scale: 0.8, rotate: 30 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [30, 0, 30]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.img
            src="/flower.svg"
            alt="květ"
            className="absolute -right-12 bottom-2 w-20 opacity-40"
            initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [-30, 0, -30]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Wloom
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 font-medium mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            u nás Váš business vzkvétá
          </motion.p>
        </div>
        <motion.div
          className="inline-block"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1.2,
            delay: 0.7,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <motion.button
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-500 text-lg md:text-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={e => {
              e.preventDefault();
              offerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Zjistit více
          </motion.button>
        </motion.div>
      </section>

      {/* Co nabízíme - nový layout */}
      <section id="nabizime" ref={offerRef} className="py-24 max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-fuchsia-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Vaše vize. Váš web. Váš rozkvět.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-20 h-20 text-fuchsia-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              ),
              title: 'Návrh & Struktura',
              desc: 'Intuitivní a přehledná struktura, která zajišťuje snadnou navigaci a přístupnost pro vaše uživatele.'
            },
            {
              icon: (
                <svg className="w-20 h-20 text-fuchsia-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ),
              title: 'Grafika & Animace',
              desc: 'Moderní grafika a plynulé animace pro jedinečný uživatelský zážitek.'
            },
            {
              icon: (
                <svg className="w-20 h-20 text-fuchsia-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ),
              title: 'SEO & Responzivita',
              desc: 'Optimalizace pro vyhledávače a perfektní zobrazení na všech zařízeních.'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-500 group"
            >
              <motion.div 
                className="mb-6 group-hover:scale-110 transition-transform duration-500"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold mb-4 text-fuchsia-800">{item.title}</h3>
              <p className="text-gray-600 text-center text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-24 text-center text-xl text-gray-500 font-semibold max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Od semínka nápadu až po digitální květ – tak roste váš web s Wloom.
        </motion.p>
      </section>

      {/* Ukázky práce - nový design */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-fuchsia-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Stránky, které jsou již v rozkvětu
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                className="relative bg-white rounded-3xl shadow-xl overflow-hidden group hover:scale-105 hover:shadow-2xl transition-all duration-500"
              >
                <div className="overflow-hidden h-56 relative">
                  <iframe
                    src={project.url}
                    className="w-[250%] h-[250%] scale-[0.4] origin-top-left pointer-events-none"
                    title={`Náhled ${project.title || project.url}`}
                    sandbox="allow-same-origin allow-scripts"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-fuchsia-800">{project.title || project.url}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{project.description || ''}</p>
                  <motion.button
                    className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-semibold shadow hover:scale-105 transition-all duration-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
                  >
                    Zobrazit projekt
                  </motion.button>
                </div>
                <img
                  src={project.image || "/flower.svg"}
                  alt="květ dekorace"
                  className="absolute right-4 bottom-4 w-16 opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt - nový design */}
      <section className="py-24 max-w-4xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-fuchsia-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Pošlete nám poptávku
        </motion.h2>
        <div className="relative">
          <motion.form
            className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={async e => {
              e.preventDefault();
              setStatus('sending');
              setError('');
              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form),
                });
                if (res.ok) {
                  setStatus('success');
                  setForm({ name: '', email: '', message: '' });
                } else {
                  const data = await res.json();
                  setError(data.error || 'Chyba při odesílání.');
                  setStatus('error');
                }
              } catch {
                setError('Chyba při odesílání.');
                setStatus('error');
              }
            }}
          >
            <input
              type="text"
              placeholder="Vaše jméno"
              className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 text-gray-800 text-lg"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Váš email"
              className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 text-gray-800 text-lg"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <textarea
              placeholder="Vaše zpráva"
              rows={4}
              className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 text-gray-800 text-lg"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
            ></textarea>
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Odesílám...' : 'Odeslat zprávu'}
            </motion.button>
            {status === 'success' && (
              <motion.div 
                className="text-fuchsia-700 text-center mt-2 text-lg font-bold"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                Požadavek byl přijat, brzy Vás kontaktujeme.
              </motion.div>
            )}
            {status === 'error' && (
              <div className="text-red-600 text-center mt-2 text-lg">{error}</div>
            )}
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-fuchsia-800 mb-4">Kontakt</h3>
              <p className="text-gray-600">
                <a href="mailto:info@wloom.eu" className="hover:text-fuchsia-600 transition-colors">
                  info@wloom.eu
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-fuchsia-800 mb-4">Sociální sítě</h3>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://www.instagram.com/wloom.eu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-fuchsia-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="text-gray-500 text-lg border-t border-gray-200 pt-8">
            &copy; {new Date().getFullYear()} Wloom.
          </div>
        </div>
      </footer>
    </main>
  );
}
