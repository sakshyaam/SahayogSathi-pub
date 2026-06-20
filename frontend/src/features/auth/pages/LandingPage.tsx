import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  MapPin,
  Users,
  AlertTriangle,
  Terminal,
  ArrowUpRight,
  Shield,
  Activity,
  Globe,
  DollarSign,
  CheckCircle2
} from "lucide-react";

/* ══════════════════════ SUBCOMPONENTS ══════════════════════ */

// 1. Hero Floating Glass Orb Component (Aesthetic Backdrop)
const FloatingGlassOrb = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
    <motion.div
      animate={{
        y: [0, -25, 0],
        rotate: [0, 8, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px]"
    >
      {/* Deep cosmic indigo background glow */}
      <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen" />

      {/* Outer translucent glass ring */}
      <div className="absolute inset-4 rounded-full border border-white/10 backdrop-blur-3xl shadow-[inset_0_0_50px_rgba(255,255,255,0.05)] bg-gradient-to-tr from-white/5 to-transparent" />

      {/* Main glass heart/orb center */}
      <div className="absolute inset-16 rounded-full border border-white/20 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(255,255,255,0.1)] bg-gradient-to-br from-white/10 via-transparent to-indigo-500/10 flex items-center justify-center">
        {/* Abstract 3D Graduation Cap or Book SVG nested in the glass */}
        <BookOpen className="w-20 h-20 text-white/25 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse" />
      </div>

      {/* High-contrast glossy reflection glare */}
      <div className="absolute top-1/4 left-1/4 w-40 h-20 bg-white/15 rounded-full blur-lg transform -rotate-45" />

      {/* Small satellite orbiting elements */}
      <motion.div
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/40"
      />
      <motion.div
        animate={{
          x: [40, -40, 40],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 9,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute bottom-16 left-6 w-16 h-16 rounded-full border border-white/10 bg-indigo-500/5 backdrop-blur-xl shadow-2xl shadow-black/40"
      />
    </motion.div>
  </div>
);

// 2. Campus Dispatch Map Widget (Card 1)
const LiveRequestsMap = () => {
  const points = [
    { x: 30, y: 40, label: "TU Kirtipur: DBMS ER-Diagram", active: true },
    { x: 70, y: 30, label: "KU Dhulikhel: React Native App", active: true },
    { x: 50, y: 70, label: "Pulchowk: AI Model Training", active: true },
    { x: 82, y: 65, label: "Patan Campus: OS Lab Report", active: false },
    { x: 22, y: 80, label: "NCIT: Microprocessor Lab", active: false },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] bg-black/40 overflow-hidden flex flex-col justify-between p-6">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">CAMPUS DISPATCH GRID</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          LIVE CONNECT
        </span>
      </div>

      {/* Vector/Dotted Map Mock Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none grid grid-cols-12 grid-rows-6 gap-2 p-4">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/10 rounded-sm" />
        ))}
      </div>

      {/* Glowing network lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <path d="M 60,80 L 140,60 L 100,140 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />
        <path d="M 140,60 L 220,150 L 100,140" fill="none" stroke="rgba(129, 140, 248, 0.15)" strokeWidth="1" />
      </svg>

      {/* Interactive Floating Campus Nodes */}
      {points.map((p, idx) => (
        <motion.div
          key={idx}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            {p.active && (
              <span className="absolute w-6 h-6 bg-indigo-400/20 rounded-full animate-ping" />
            )}
            <div className={`w-2.5 h-2.5 rounded-full ${p.active ? 'bg-indigo-400 shadow-[0_0_10px_#818cf8]' : 'bg-white/30'}`} />
          </div>
          <span className="font-mono text-[9px] text-white bg-black/90 border border-white/10 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
            {p.label}
          </span>
        </motion.div>
      ))}

      <div className="z-10 flex flex-col gap-1">
        <h4 className="font-display font-bold text-lg text-white">Nepal Campus Network</h4>
        <p className="font-mono text-xs text-white/50">Active assignment & project requests mapped across campuses.</p>
      </div>
    </div>
  );
};

// 3. Proposal Bids Tracker Widget (Card 2)
const ProposalBidsTracker = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] bg-black/40 p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">PROPOSAL VELOCITY</span>
        </div>
        <span className="font-mono text-[10px] text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5">
          ACTIVE MATCHING
        </span>
      </div>

      <div className="my-4 flex items-center justify-center relative h-16">
        {/* Animated ECG Pulse Path representing proposal submission signals */}
        <svg className="w-full h-full" viewBox="0 0 200 60">
          <motion.path
            d="M0,30 L40,30 L46,10 L52,50 L58,25 L64,35 L70,30 L100,30 L106,5 L112,55 L118,20 L124,38 L130,30 L160,30 L200,30"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>

      <div className="flex items-end justify-between border-t border-white/5 pt-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block">AVERAGE BUDGET</span>
          <span className="font-display font-black text-2xl text-white">NPR 1,500</span>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block">AVG BID TIME</span>
          <span className="font-display font-bold text-lg text-white">4.8 mins</span>
        </div>
      </div>
    </div>
  );
};

// 4. Rollup Counter Component (Card 3)
const RollupCounter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun) {
          setHasRun(true);
          let start = 0;
          const end = target;
          const duration = 1500; // ms
          const stepTime = Math.abs(Math.floor(duration / 100));

          const timer = setInterval(() => {
            start += Math.ceil(end / 80);
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            } else {
              setCount(start);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, hasRun]);

  return (
    <div ref={elementRef} className="relative w-full h-full min-h-[140px] bg-black/40 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">TOTAL DELIVERED</span>
        <Users className="w-4 h-4 text-indigo-400" />
      </div>

      <div className="my-2">
        <span className="font-display font-black text-4xl text-white tracking-tight">
          {count.toLocaleString()}+
        </span>
      </div>

      <span className="font-mono text-[10px] text-white/40">Academic tasks, project support, & notes successfully completed.</span>
    </div>
  );
};

// 5. Urgent Deadline SOS (Card 4)
const UrgentDeadlineSOS = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] border border-red-500/20 bg-red-500/5 p-6 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]">
      {/* Pulsating red glow border */}
      <div className="absolute inset-0 border border-red-500/10 animate-pulse pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold">DEADLINE SOS ALERTS</span>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      <div className="my-3">
        <h5 className="font-display font-black text-xl text-white tracking-tight leading-tight">DBMS NORMALIZATION LAB</h5>
        <p className="font-mono text-[10px] text-white/60 mt-1">Due in 5 hours — TU Patan Campus. 3 student helpers bidding now.</p>
      </div>

      <Link
        to="/register"
        className="w-full text-center block font-mono text-[10px] uppercase tracking-wider font-bold text-black bg-white py-3 hover:bg-red-500 hover:text-white transition-colors"
      >
        HELP RESOLVE DEADLINE
      </Link>
    </div>
  );
};

// 6. Sleek Terminal Logs Feed Component (Card 5 - Discord/Telegram Bot Bridge)
const TerminalLogs = () => {
  const [logs, setLogs] = useState<string[]>([
    "[15:40:01] SYS: Initializing SahayogSathi Discord-Bridge...",
    "[15:41:20] BOT: Listening to Telegram Channel @SahayogSathi_Tasks",
    "[15:42:05] POST: DBMS Normalization Assignment (Budget: NPR 1,200) - Patan",
    "[15:43:40] BID: Helper @ramesh bid NPR 1,000 on DBMS Assignment",
    "[15:45:10] ESCROW: NPR 1,000 held in escrow safety lock"
  ]);

  useEffect(() => {
    const extraLogs = [
      "[15:47:05] POST: React Native App for Final Year Project (Budget: NPR 8,000) - KU",
      "[15:49:12] BID: Helper @sagar bid NPR 7,500 on React Native project",
      "[15:51:30] MATCHED: Helper @sagar assigned. Syncing private workspace chat",
      "[15:53:01] ESCROW: NPR 7,500 locked successfully",
      "[15:54:42] COMPLETED: 'Microprocessor lab notes' delivered. Escrow released.",
      "[15:56:10] BOT: Channel connection verified. Latency: 14ms."
    ];

    let count = 0;
    const timer = setInterval(() => {
      if (count < extraLogs.length) {
        setLogs(prev => [...prev.slice(1), extraLogs[count]]);
        count++;
      } else {
        count = 0; // restart cycle
      }
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-black/60 font-mono p-5 flex flex-col justify-between border border-white/5">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-white/50">SAHAYOG_BOT_BRIDGE.LOG</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Scrolling Text Window */}
      <div className="flex-1 text-[10px] space-y-2 overflow-y-auto leading-relaxed text-indigo-300">
        <AnimatePresence>
          {logs.map((log, idx) => (
            <motion.div
              key={log}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={log.includes("POST") ? "text-indigo-400 font-bold" : log.includes("COMPLETED") ? "text-emerald-400" : "text-white/80"}
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between text-[9px] text-white/30">
        <span>CAMPUS BRIDGE: ONLINE</span>
        <span className="animate-pulse">● SYNCED</span>
      </div>
    </div>
  );
};


/* ══════════════════════ MAIN COMPONENT ══════════════════════ */

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Parallax Y offset mappings for different elements in the "Lift" section
  const yLiftSlow = useTransform(scrollYProgress, [0.35, 0.85], [100, -80]);
  const yLiftMedium = useTransform(scrollYProgress, [0.35, 0.85], [200, -150]);
  const yLiftFast = useTransform(scrollYProgress, [0.35, 0.85], [300, -260]);

  return (
    <div ref={containerRef} className="min-h-screen text-white relative overflow-hidden bg-[#050505]">

      {/* Cosmic background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/5 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      {/* ════════════════════ NAV BAR ════════════════════ */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex items-center justify-between border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-white text-black font-display font-black text-lg">
            S
          </div>
          <span className="font-display font-black text-base tracking-tight uppercase">SAHAYOGSATHI</span>
        </Link>

        {/* Minimal Navigation links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-wider uppercase text-white/50">
          <a href="#grid" className="hover:text-white transition-colors">THE BENTO GRID</a>
          <a href="#lift" className="hover:text-white transition-colors">DEADLINE LIFT</a>
          <a href="#features" className="hover:text-white transition-colors">SPECIFICATIONS</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="font-display font-bold text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            to="/register"
            className="font-display font-bold text-xs uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all px-4 py-2"
          >
            GET STARTED
          </Link>
        </div>
      </nav>

      {/* ════════════════════ HERO SECTION ════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 z-10">

        {/* Animated Glass Orb behind title */}
        <FloatingGlassOrb />

        <div className="relative max-w-4xl z-10 select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display font-black tracking-tighter text-5xl sm:text-7xl md:text-9xl leading-[0.9] text-white uppercase mt-8 select-none">
              SAHAYOG
              <br />
              SATHI
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-mono text-sm sm:text-base tracking-widest uppercase text-indigo-400 mt-8"
          >
            Nepal's Peer-to-Peer Campus Task Marketplace.
          </motion.p>
        </div>

        {/* Hero Actions - Rigid Square buttons, no generic round pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative z-10 mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            to="/register"
            className="relative font-display font-bold text-sm tracking-widest uppercase bg-white text-black px-10 py-5 transition-all duration-300 border border-white hover:bg-transparent hover:text-white text-center"
          >
            POST A TASK
          </Link>
          <Link
            to="/register"
            className="relative font-display font-bold text-sm tracking-widest uppercase border border-white/20 bg-white/5 backdrop-blur-md text-white px-10 py-5 transition-all duration-300 hover:bg-white hover:text-black text-center"
          >
            BECOME A HELPER
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════ BENTO SUPPORT GRID ════════════════════ */}
      <section id="grid" className="max-w-6xl mx-auto px-6 py-20 relative z-10">

        {/* Bento Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">CAMPUS MARKETPLACE ACTIVITY</span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-2 leading-[0.95] tracking-tighter uppercase">
            YOUR CAMPUS.<br />YOUR SKILLS. YOUR HUSTLE.
          </h2>
        </div>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-12 gap-4">

          {/* Card 1: Map Widget - 7 columns on desktop */}
          <div className="col-span-12 lg:col-span-7 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/30 group">
            <LiveRequestsMap />
          </div>

          {/* Card 2: Proposal Tracker - 5 columns on desktop */}
          <div className="col-span-12 lg:col-span-5 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/30 group">
            <ProposalBidsTracker />
          </div>

          {/* Card 3: Volunteer Rollup Counter - 4 columns on desktop */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/30 group">
            <RollupCounter target={4820} />
          </div>

          {/* Card 4: Emergency SOS (Academic Deadlines SOS) - 4 columns on desktop */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-red-500/40">
            <UrgentDeadlineSOS />
          </div>

          {/* Card 5: Sleek Terminal Feed Widget - 4 columns on desktop */}
          <div className="col-span-12 lg:col-span-4 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/30">
            <TerminalLogs />
          </div>

        </div>
      </section>

      {/* ════════════════════ THE "LIFT" PARALLAX SECTION ════════════════════ */}
      <section id="lift" className="relative min-h-screen py-32 flex flex-col justify-center overflow-hidden z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 relative w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">PHYSICS OF WORKFLOW SHARING</span>
            <h3 className="font-display font-black text-4xl sm:text-6xl text-white uppercase mt-4 leading-[0.9] tracking-tighter">
              DEADLINE
              <br />
              LIFT
            </h3>
            <p className="font-mono text-xs text-white/50 mt-6 leading-relaxed">
              When assignment loads and project deadlines weigh you down, distribute the weight across peer student helpers. Balance study pressures, share complete resources, and monetize your technical skills.
            </p>
          </div>

          {/* Parallax Floating Text Blocks */}
          <div className="relative h-[400px] flex flex-col justify-center">

            {/* Block 1 - Slow lift */}
            <motion.div
              style={{ y: yLiftSlow }}
              className="absolute top-0 right-4 md:right-12 p-6 border border-white/10 bg-white/5 backdrop-blur-md max-w-xs"
            >
              <h5 className="font-display font-black text-lg text-white">01 / DELEGATE TASKS</h5>
              <p className="font-mono text-[10px] text-white/60 mt-2">Post assignments, programming projects, or lab reports and set your budget range. Peer helpers bid competitive rates instantly.</p>
            </motion.div>

            {/* Block 2 - Medium lift */}
            <motion.div
              style={{ y: yLiftMedium }}
              className="absolute bottom-24 left-0 p-6 border border-indigo-400/20 bg-indigo-900/5 backdrop-blur-md max-w-xs"
            >
              <h5 className="font-display font-black text-lg text-indigo-400">02 / EARN FROM SKILLS</h5>
              <p className="font-mono text-[10px] text-indigo-300/80 mt-2">Turn your development, design, report writing, or calculus solving skills into a premium campus side-hustle.</p>
            </motion.div>

            {/* Block 3 - Fast lift */}
            <motion.div
              style={{ y: yLiftFast }}
              className="absolute top-1/3 left-10 md:left-24 p-6 border border-white/10 bg-white/5 backdrop-blur-xl max-w-xs shadow-2xl"
            >
              <h5 className="font-display font-black text-lg text-white">03 / ESCROW SECURITY</h5>
              <p className="font-mono text-[10px] text-white/60 mt-2">Funds are locked securely in platform escrow during task collaboration. Release payment only after reviewing and approving work.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════ CORE CAPABILITIES SECTION ════════════════════ */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">MARKET SPECIFICATIONS</span>
            <h4 className="font-display font-black text-3xl sm:text-5xl uppercase text-white mt-2 leading-[0.95] tracking-tighter">
              ENGINEERED FOR<br />STUDENT TRUST.
            </h4>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono">
            <div>
              <h5 className="font-display font-bold text-white text-lg tracking-tight uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400" /> Competitive Bidding
              </h5>
              <p className="text-xs text-white/50 mt-3 leading-relaxed">
                Helpers review your guidelines and submit transparent proposals with custom delivery speeds and pricing. You pick the perfect fit.
              </p>
            </div>

            <div>
              <h5 className="font-display font-bold text-white text-lg tracking-tight uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400" /> Secure Campus Escrow
              </h5>
              <p className="text-xs text-white/50 mt-3 leading-relaxed">
                Budget remains held safely. Sathi helpers work with confidence knowing payment is guaranteed, and you remain protected until delivery.
              </p>
            </div>

            <div>
              <h5 className="font-display font-bold text-white text-lg tracking-tight uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400" /> Verified Student Network
              </h5>
              <p className="text-xs text-white/50 mt-3 leading-relaxed">
                Sign-up is restricted to verified campus students in Nepal. Build trust and expand academic networks safely.
              </p>
            </div>

            <div>
              <h5 className="font-display font-bold text-white text-lg tracking-tight uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400" /> Instant Chat & Sync
              </h5>
              <p className="text-xs text-white/50 mt-3 leading-relaxed">
                Coordinate on tasks, send source files, review screenshots, and clarify requirements through our real-time in-app chat.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="border-t border-white/10 bg-black/60 relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-12 border-b border-white/5">
            <div>
              <h2 className="font-display font-light text-white tracking-widest text-4xl sm:text-6xl md:text-8xl uppercase leading-[0.9]">
                BUILT FOR
                <br />
                THE CAMPUS
              </h2>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-white text-black hover:bg-indigo-400 hover:text-white px-8 py-5 transition-all text-center self-start"
            >
              POST A REQUEST <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs text-white/40">

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold">SAHAYOGSATHI</span>
              <p className="text-[10px] leading-relaxed text-white/30">
                Nepal's premier peer student academic marketplace, connecting requests with skilled helpers natively and securely.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold">GRID INDEX</span>
              <a href="#grid" className="hover:text-white">Campuses Dispatch</a>
              <a href="#features" className="hover:text-white">Specs</a>
              <a href="#lift" className="hover:text-white">Antigravity Lift</a>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold">PORTALS</span>
              <Link to="/login" className="hover:text-white">Helper Login</Link>
              <Link to="/register" className="hover:text-white">Student Registration</Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold">PLATFORM</span>
              <a href="#" className="hover:text-white">Terms of Escrow</a>
              <a href="#" className="hover:text-white">Community Code</a>
              <a href="#" className="hover:text-white">Security Node</a>
            </div>

          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20">
            <span>© {new Date().getFullYear()} SAHAYOGSATHI. HOSTED IN NEPAL.</span>
            <span>DEVELOPED WITH NO AI SLOB OVERRIDES.</span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
