import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
const portraitAsset = "/20260402_124608.jpg";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

const NAV = [
  { label: "Home", id: "home" },
  { label: "Showreel", id: "showreel" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const EMAIL = "hassan876627@gmail.com";
const PHONE_DISPLAY = "+92 336 735 9268";
const PHONE_HREF = "tel:+923367359268";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Project Inquiry")}`;

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function Portfolio() {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Showreel />
      <About />
      <Quote />
      <Contact />
      <Footer />
    </main>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true); // hero is dark

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section the top of the viewport is in to invert nav colors
  useEffect(() => {
    const sections = ["home", "showreel", "about", "quote", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const darkIds = new Set(["home", "about", "contact"]);
    const update = () => {
      const probe = 80;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setOnDark(darkIds.has(s.id));
          return;
        }
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  const textColor = onDark ? "text-white" : "text-black";
  const mutedColor = onDark ? "text-white/70" : "text-black/70";
  const borderCol = onDark ? "border-white/20" : "border-black/15";
  const pillBg = onDark ? "bg-white/8" : "bg-white/70";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      } ${textColor}`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10 transition-all duration-500 ${
          scrolled
            ? `rounded-full border ${borderCol} ${pillBg} backdrop-blur-xl py-3 shadow-[0_1px_30px_-12px_rgba(0,0,0,0.25)]`
            : ""
        }`}
        style={scrolled ? { maxWidth: 1100 } : undefined}
      >
        <a
          href="#home"
          onClick={(e) => go(e, "home")}
          className="text-display text-[15px] tracking-[0.02em] font-semibold"
        >
          HASSAN <span className="text-serif-italic font-normal">Imran</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => go(e, n.id)}
              className={`group relative px-4 py-2 text-sm ${mutedColor} hover:${textColor} transition-colors`}
            >
              {n.label}
              <span className={`absolute left-4 right-4 -bottom-0.5 h-px origin-left scale-x-0 ${onDark ? "bg-white" : "bg-black"} transition-transform duration-500 ease-out group-hover:scale-x-100`} />
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton onClick={() => scrollToId("contact")}>
            <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium ${onDark ? "bg-white text-black" : "bg-black text-white"}`}>
              Get in touch
              <Arrow />
            </span>
          </MagneticButton>
        </div>

        <button
          className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border ${borderCol}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <div className="relative w-4 h-3">
            <span
              className={`absolute left-0 right-0 h-px ${onDark ? "bg-white" : "bg-black"} transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-px ${onDark ? "bg-white" : "bg-black"} transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </div>
        </button>
      </div>

      {/* mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`mx-6 mt-3 rounded-3xl border ${borderCol} ${onDark ? "bg-black/80" : "bg-white/90"} backdrop-blur-xl p-6`}>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => go(e, n.id)}
              className="block py-3 text-2xl text-display"
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO (DARK) ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] w-full grain overflow-hidden pt-28 md:pt-32 bg-black text-white"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-12 gap-10 px-6 md:px-10 pb-24">
        <motion.div style={{ opacity: fade }} className="md:col-span-7 flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow text-white/60 mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-white/50" />
              Portfolio — 2026
            </p>
          </Reveal>

          <h1 className="text-display text-[16vw] md:text-[9.5vw] leading-[0.88]">
            <MaskLine delay={0.05}>Hassan</MaskLine>
            <MaskLine delay={0.15}>
              <span className="text-serif-italic">Imran.</span>
            </MaskLine>
          </h1>

          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start">
            <Reveal delay={0.35}>
              <div className="text-[13px] leading-relaxed">
                <p className="eyebrow text-white/50">Discipline</p>
                <p className="mt-2 font-medium">Video Editor</p>
                <p className="font-medium">Motion Designer</p>
              </div>
            </Reveal>
            <Reveal delay={0.45}>
              <p className="max-w-md text-[15px] leading-relaxed text-white/70">
                I create clean, modern edits that combine motion graphics,
                typography and cinematic storytelling.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.6}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton onClick={() => scrollToId("showreel")}>
                <span className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[13px] font-medium text-black">
                  <Play />
                  Watch Showreel
                </span>
              </MagneticButton>
              <a href={MAILTO}>
                <MagneticButton>
                  <span className="inline-flex items-center gap-3 rounded-full border border-white/30 px-6 py-3.5 text-[13px] font-medium text-white hover:bg-white hover:text-black transition-colors duration-500">
                    Contact Me
                    <Arrow />
                  </span>
                </MagneticButton>
              </a>
            </div>
          </Reveal>
        </motion.div>

        <div className="md:col-span-5 relative min-h-[420px] md:min-h-[70vh]">
          <motion.div
            style={{ y, scale }}
            className="absolute inset-0 md:inset-y-0 md:-right-6 md:left-0"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
              <motion.img
                initial={{ scale: 1.15, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                src={portraitAsset}
                alt="Portrait of Hassan Imran"
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(100%) contrast(1.05)" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between text-[11px] tracking-widest uppercase text-white/90">
                <span>Hassan Imran</span>
                <span>PK · 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="eyebrow text-white/50">Scroll</span>
        <div className="relative h-10 w-[1px] overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-3 bg-white scroll-cue" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- SHOWREEL (LIGHT) ---------------- */
function Showreel() {
  const [playing, setPlaying] = useState(false);
  const videoId = "PS1dQzVAxRk";
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&fs=1`;

  return (
    <section id="showreel" className="relative py-28 md:py-40 bg-white text-black">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-14 md:mb-20">
          <div>
            <Reveal>
              <p className="eyebrow text-black/50 mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-black/50" />
                01 — Showreel
              </p>
            </Reveal>
            <h2 className="text-display text-[12vw] md:text-[7.5vw]">
              <MaskLine>Featured</MaskLine>
              <MaskLine delay={0.1}>
                <span className="text-serif-italic">showreel.</span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="hidden md:block max-w-xs text-[15px] text-black/70 leading-relaxed pb-4">
              A showcase of my editing style and creative work.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="md:hidden text-[15px] text-black/70 -mt-8 mb-10">
            A showcase of my editing style and creative work.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-[min(420px,85vw)] md:max-w-[460px] aspect-[9/16] overflow-hidden rounded-[20px] bg-black shadow-[0_60px_120px_-40px_rgba(0,0,0,0.45)] border border-black/10"
            >
              {playing ? (
                <iframe
                  src={embed}
                  title="Hassan Imran — Showreel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play showreel"
                  className="group absolute inset-0 h-full w-full"
                >
                  <img
                    src={thumb}
                    alt="Showreel thumbnail"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/25 transition-opacity duration-500 group-hover:bg-black/35" />
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-20 w-20 md:h-24 md:w-24 place-items-center rounded-full bg-white text-black shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                  >
                    <svg width="22" height="22" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                      <path d="M2 1.5v9l8-4.5-8-4.5z" />
                    </svg>
                  </motion.span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* ---------------- ABOUT (DARK) ---------------- */
function About() {
  return (
    <section id="about" className="relative py-28 md:py-40 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow text-white/50 mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-white/50" />
              02 — About
            </p>
          </Reveal>
          <h2 className="text-display text-[14vw] md:text-[7vw]">
            <MaskLine>About</MaskLine>
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 flex flex-col justify-center gap-8">
          <BlurReveal>
            <p className="text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.35] tracking-[-0.01em]">
              I'm Hassan Imran, a video editor and motion designer passionate about
              creating clean, engaging visuals through motion graphics, typography,
              and <span className="text-serif-italic">cinematic storytelling.</span>
            </p>
          </BlurReveal>
          <BlurReveal delay={0.15}>
            <p className="text-[17px] text-white/65 leading-relaxed max-w-xl">
              As I continue learning and improving, I focus on producing thoughtful
              edits that balance creativity with attention to detail. Every project
              is an opportunity to refine my skills and create work I'm proud of.
            </p>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- QUOTE (LIGHT) ---------------- */
function Quote() {
  const lines = [
    ["Good", "editing"],
    ["isn't", "about"],
    ["more", "effects."],
    [""],
    ["It's", "about"],
    ["making", "people"],
    ["keep", "watching."],
  ];

  return (
    <section id="quote" className="relative bg-white text-black py-32 md:py-52 overflow-hidden grain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 mb-16 opacity-60">
          <span className="inline-block h-px w-8 bg-black/60" />
          <span className="eyebrow">Manifesto</span>
        </div>
        <h2 className="text-display text-[10vw] md:text-[7.2vw] leading-[0.95] tracking-[-0.045em]">
          {lines.map((line, i) =>
            line[0] === "" ? (
              <div key={i} className="h-6 md:h-10" />
            ) : (
              <QuoteLine key={i} index={i}>
                {line.map((w, wi) =>
                  wi === line.length - 1 && (i === 2 || i === 6) ? (
                    <span key={wi} className="text-serif-italic text-black/50">
                      {w}{" "}
                    </span>
                  ) : (
                    <span key={wi}>{w} </span>
                  )
                )}
              </QuoteLine>
            )
          )}
        </h2>
      </div>
    </section>
  );
}

function QuoteLine({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------- CONTACT (DARK) ---------------- */
function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow text-white/50 mb-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-white/50" />
            03 — Contact
          </p>
        </Reveal>

        <h2 className="text-display text-[12vw] md:text-[8vw] leading-[0.9] max-w-[14ch]">
          <MaskLine>Let's create</MaskLine>
          <MaskLine delay={0.1}>something</MaskLine>
          <MaskLine delay={0.2}>
            <span className="text-serif-italic">great.</span>
          </MaskLine>
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-white/15 pt-12">
          <div className="md:col-span-5">
            <ContactRow label="Email" value={EMAIL} href={MAILTO} />
            <ContactRow label="Phone" value={PHONE_DISPLAY} href={PHONE_HREF} />
          </div>
          <div className="md:col-span-5 md:col-start-8 flex md:justify-end items-end">
            <a href={MAILTO}>
              <MagneticButton>
                <span className="group relative inline-flex items-center gap-4 rounded-full bg-white text-black px-8 py-5 text-[14px] font-medium overflow-hidden">
                  <span className="relative z-10">Get in Touch</span>
                  <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-black text-white transition-transform duration-500 group-hover:rotate-45">
                    <Arrow />
                  </span>
                </span>
              </MagneticButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} className="group block border-b border-white/15 py-6 transition-colors hover:border-white/40">
      <p className="eyebrow text-white/50 mb-2">{label}</p>
      <div className="text-display text-[clamp(1.75rem,3.6vw,3rem)] transition-transform duration-500 ease-out group-hover:translate-x-2">
        {value}
      </div>
    </a>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-black text-white/60 border-t border-white/10 py-10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px]">
        <p>© Hassan Imran</p>
        <p className="tracking-widest uppercase text-[11px]">
          Video Editor <span className="mx-2 opacity-50">•</span> Motion Designer
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group inline-flex items-center gap-2 hover:text-white transition-colors"
        >
          Back to top
          <span className="inline-block transition-transform group-hover:-translate-y-0.5">↑</span>
        </button>
      </div>
    </footer>
  );
}

/* ---------------- PRIMITIVES ---------------- */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 24, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function BlurReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(14px)", y: 20 }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function MaskLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function MagneticButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * 0.25);
    y.set(my * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y }}
      className="inline-block cursor-pointer will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Play() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M2 1.5v9l8-4.5-8-4.5z" />
    </svg>
  );
}
