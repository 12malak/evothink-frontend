"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "now" | "upcoming" | "completed";

interface UpcomingClass {
  id: string; teacher: string; avatar: string;
  subject: string; subjectAr: string;
  date: string; dateAr: string;
  time: string; duration: string;
  status: ClassStatus;
}
interface LeaderboardEntry {
  rank: number; name: string; nameAr: string;
  avatar: string; xp: number; delta: number; isMe: boolean;
}
interface NotifItem {
  id: string; en: string; ar: string;
  time: string; timeAr: string;
  dot: string; read: boolean; icon: React.ReactNode;
}
interface ActivityItem {
  en: string; ar: string; xp: number;
  time: string; timeAr: string; icon: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────
const CLASSES: UpcomingClass[] = [
  { id:"c1", teacher:"Mr. Ahmad Nasser", avatar:"AN", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  date:"Today",     dateAr:"اليوم",    time:"03:00 PM", duration:"60 min", status:"now"      },
  { id:"c2", teacher:"Ms. Nora Khalil",  avatar:"NK", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",    date:"Tomorrow",  dateAr:"غداً",     time:"10:00 AM", duration:"60 min", status:"upcoming" },
  { id:"c3", teacher:"Dr. Samir Yousef", avatar:"SY", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",     date:"Wednesday", dateAr:"الأربعاء", time:"02:00 PM", duration:"90 min", status:"upcoming" },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank:1, name:"Layla Hassan",   nameAr:"ليلى حسن",    avatar:"LH", xp:2840, delta:+120, isMe:false },
  { rank:2, name:"Omar Khalid",    nameAr:"عمر خالد",    avatar:"OK", xp:2615, delta:+85,  isMe:false },
  { rank:3, name:"You",            nameAr:"أنت",          avatar:"SA", xp:2480, delta:+250, isMe:true  },
  { rank:4, name:"Reem Al-Jabri",  nameAr:"ريم الجابري", avatar:"RJ", xp:2200, delta:+40,  isMe:false },
  { rank:5, name:"Khalid Mansoor", nameAr:"خالد منصور",  avatar:"KM", xp:1980, delta:-20,  isMe:false },
];

const SKILL_BARS = [
  { en:"Speaking",   ar:"المحادثة",  val:72, color:"#107789" },
  { en:"Listening",  ar:"الاستماع",  val:85, color:"#7c3aed" },
  { en:"Reading",    ar:"القراءة",   val:68, color:"#059669" },
  { en:"Writing",    ar:"الكتابة",   val:55, color:"#d97706" },
  { en:"Vocabulary", ar:"المفردات",  val:80, color:"#0369a1" },
];

// ─── Icons ────────────────────────────────────────────────────
const I = {
  play:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  join:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  cal:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  star:   <svg width="16" height="16" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17l-1 7a5 5 0 0 1-8 0z"/><path d="M5 4H3v3a4 4 0 0 0 4 4"/><path d="M19 4h2v3a4 4 0 0 1-4 4"/></svg>,
  bell:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  book:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  check:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  zap:    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  close:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  fire:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  lesson: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  pay:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  notif:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

const NOTIFS: NotifItem[] = [
  { id:"n1", en:"Class with Mr. Ahmad starts in 30 min",      ar:"حصتك مع أ. أحمد تبدأ بعد 30 دقيقة",    time:"30m",    timeAr:"30 د",       dot:"#ef4444", read:false, icon:I.bell  },
  { id:"n2", en:"Lesson 14: Speaking Fluency is now unlocked", ar:"الدرس 14: طلاقة الكلام أصبح متاحاً",    time:"2h ago", timeAr:"منذ ساعتين", dot:"#107789", read:false, icon:I.book  },
  { id:"n3", en:"You earned 120 XP from yesterday's session",  ar:"ربحت 120 نقطة من جلسة أمس",            time:"1d ago", timeAr:"أمس",         dot:"#d97706", read:true,  icon:I.star  },
  { id:"n4", en:"New homework: Unit 4 Grammar exercises",       ar:"واجب جديد: تمارين قواعد الوحدة 4",     time:"2d ago", timeAr:"منذ يومين",  dot:"#7c3aed", read:true,  icon:I.book  },
];

const ACTIVITY: ActivityItem[] = [
  { en:"Completed Lesson 13: Advanced Vocabulary",  ar:"أتممت الدرس 13: المفردات المتقدمة",   xp:80,  time:"Yesterday",  timeAr:"أمس",          icon:I.book  },
  { en:"Joined Speaking Practice class",            ar:"انضممت لحصة التدرب على الكلام",        xp:50,  time:"2 days ago", timeAr:"منذ يومين",    icon:I.join  },
  { en:"Aced Grammar Quiz — Score: 94%",            ar:"تفوقت في اختبار القواعد — 94٪",        xp:120, time:"3 days ago", timeAr:"منذ 3 أيام",  icon:I.check },
];

// ─── Avatar ───────────────────────────────────────────────────
const AVT = [
  {bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},
  {bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},
  {bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"},
];
const avt = (s:string) => AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];

function Av({initials,size="md"}:{initials:string;size?:"sm"|"md"|"lg"}){
  const c=avt(initials);
  const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{initials}</div>;
}

// ─── Progress Ring ────────────────────────────────────────────
function Ring({val,size=76,stroke=6,color="#107789"}:{val:number;size?:number;stroke?:number;color?:string}){
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, dash=(val/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray .9s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({icon,value,label,sub,bg,color,delay=0}:{icon:React.ReactNode;value:string;label:string;sub?:string;bg:string;color:string;delay?:number}){
  return (
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .45s ${delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:bg}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{label}</p>
        {sub&&<p className="text-[10px] text-[#94a3b8] mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function StudentDashboard(){
  const {lang,isRTL,t}=useLanguage();
  const router=useRouter();

  const [notifs,setNotifs]=useState<NotifItem[]>(NOTIFS);
  const [showNotifs,setShowNotifs]=useState(false);
  const unread=notifs.filter(n=>!n.read).length;

  // Student state
  const lesson={
    number:14, total:20,
    titleEn:"Speaking Fluency & Natural Flow",
    titleAr:"طلاقة الكلام والتدفق الطبيعي",
    unitEn:"Unit 4 — Conversational English",
    unitAr:"الوحدة 4 — الإنجليزية التحادثية",
    progress:68, xp:2480, level:"B2", streak:12,
    remaining:6, nextMilestone:2560,
  };

  const today=new Date().toLocaleDateString(lang==="ar"?"ar-SA":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  const stats=[
    {icon:I.lesson, value:`${lesson.number}/${lesson.total}`, label:t("Lessons Done","الدروس المكتملة"),  sub:t(`${lesson.remaining} remaining`,`${lesson.remaining} متبقي`),bg:"#EBF5F7",color:"#107789",delay:0    },
    {icon:I.fire,   value:`${lesson.streak}🔥`,               label:t("Day Streak","أيام متتالية"),       sub:t("Don't break it!","لا تكسرها!"),                               bg:"#fef3c7",color:"#d97706",delay:0.06 },
    {icon:I.star,   value:`${lesson.xp} XP`,                  label:t("Total XP","مجموع النقاط"),         sub:t("Rank #3 this week","الترتيب #3 هذا الأسبوع"),                  bg:"#ede9fe",color:"#7c3aed",delay:0.12 },
    {icon:I.trophy, value:"#3",                               label:t("Leaderboard","لوحة الصدارة"),      sub:t("135 XP to #2","135 نقطة للمرتبة #2"),                         bg:"#d1fae5",color:"#059669",delay:0.18 },
  ];

  const CLASS_STATUS_CFG={
    now:     {bg:"#fee2e2",text:"#ef4444",en:"Live Now",  ar:"مباشر الآن"},
    upcoming:{bg:"#EBF5F7",text:"#107789",en:"Upcoming",  ar:"قادمة"},
    completed:{bg:"#d1fae5",text:"#059669",en:"Completed",ar:"مكتملة"},
  };

  return (
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">
              {t("Good afternoon, Sara! 👋","مرحباً سارة! 👋")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{today}</p>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button onClick={()=>setShowNotifs(p=>!p)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#F1F5F9] shadow-sm text-[#64748b] hover:text-[#107789] hover:border-[#b2dce4] hover:shadow-md active:scale-95 transition-all">
              {I.bell}
              {unread>0&&(
                <span className="absolute top-1.5 end-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ef4444] text-[9px] font-black text-white">
                  <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-[#ef4444] opacity-50 -top-0.5 -end-0.5"/>
                  {unread}
                </span>
              )}
            </button>

            {showNotifs&&(
              <div className="absolute top-[calc(100%+8px)] end-0 z-50 w-72 sm:w-80 rounded-2xl bg-white border border-[#F1F5F9] shadow-[0_20px_48px_rgba(15,23,42,0.13)] overflow-hidden"
                style={{animation:"cardIn .2s cubic-bezier(.34,1.56,.64,1) both"}}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1e293b]">{t("Notifications","الإشعارات")}</span>
                    {unread>0&&<span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-black text-white">{unread}</span>}
                  </div>
                  {unread>0&&(
                    <button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}
                      className="text-[11px] font-semibold text-[#107789] hover:underline active:opacity-60">
                      {t("Mark all read","قراءة الكل")}
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#F8FAFC]">
                  {notifs.map((n,i)=>(
                    <div key={n.id} onClick={()=>setNotifs(p=>p.map((x,j)=>j===i?{...x,read:true}:x))}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${n.read?"hover:bg-[#F8FAFC]":"bg-[#F8FDFF] hover:bg-[#F1F9FB]"}`}>
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{backgroundColor:n.read?"#CBD5E1":n.dot}}/>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs leading-snug ${n.read?"text-[#64748b]":"font-semibold text-[#1e293b]"}`}>
                          {lang==="ar"?n.ar:n.en}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#94a3b8]">{lang==="ar"?n.timeAr:n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F1F5F9] px-4 py-2.5 text-center">
                  <button className="text-xs font-semibold text-[#107789] hover:underline">
                    {t("View all notifications","عرض كل الإشعارات")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* ══════════════════════════════════════════
            DECISION ENGINE — The Core Section
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3" style={{animation:"cardIn .45s .2s both"}}>

          {/* ── Hero: Current Lesson ── */}
          <div className="xl:col-span-2 rounded-2xl overflow-hidden shadow-sm relative"
            style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)"}}>
            <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none"/>
            <div className="absolute -bottom-10 -start-10 w-60 h-60 rounded-full opacity-5 bg-white pointer-events-none"/>

            {/* Top badges */}
            <div className="relative flex items-center justify-between px-5 sm:px-6 pt-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black"
                style={{backgroundColor:"rgba(255,255,255,0.15)",color:"white",backdropFilter:"blur(8px)"}}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8763A]" style={{animation:"blink 1.5s infinite"}}/>
                {t("Level","المستوى")} · {lesson.level}
              </span>
              <span className="text-[10px] font-bold text-white/60">
                {t("Unit 4","الوحدة 4")} · {t("Lesson","الدرس")} {lesson.number}
              </span>
            </div>

            <div className="relative p-5 sm:p-6 pt-4">
              {/* Lesson title + ring */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-1.5">
                    {t("Current Lesson","الدرس الحالي")}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1">
                    {lang==="ar"?lesson.titleAr:lesson.titleEn}
                  </h2>
                  <p className="text-xs text-white/50">{lang==="ar"?lesson.unitAr:lesson.unitEn}</p>
                </div>
                {/* Progress ring */}
                <div className="relative flex-shrink-0">
                  <Ring val={lesson.progress} size={76} stroke={7} color="#E8763A"/>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                    {lesson.progress}%
                  </span>
                </div>
              </div>

              {/* Progress bar + counters */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>{t("Course Progress","تقدم المقرر")}</span>
                  <span>{lesson.number}/{lesson.total} {t("lessons","دروس")}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{
                      width:`${(lesson.number/lesson.total)*100}%`,
                      background:"linear-gradient(90deg,#E8763A,#f59e0b)",
                      transition:"width .9s ease",
                    }}/>
                </div>
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>✓ {lesson.number} {t("completed","مكتمل")}</span>
                  <span>{lesson.remaining} {t("remaining","متبقي")} →</span>
                </div>
              </div>

              {/* XP progress strip */}
              <div className="rounded-xl bg-white/10 p-3 mb-5 flex items-center gap-3">
                <div className="flex-shrink-0 text-white/80">{I.zap}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[10px] text-white/60 mb-1">
                    <span>{lesson.xp} XP</span>
                    <span>{lesson.nextMilestone} XP {t("to rank up","للترقية")}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#d97706]"
                      style={{width:`${(lesson.xp/lesson.nextMilestone)*100}%`,transition:"width .9s ease"}}/>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#d97706] flex-shrink-0">
                  {lesson.nextMilestone-lesson.xp} XP
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={()=>router.push("/student/learning")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#107789] bg-white hover:bg-white/90 active:scale-[.98] transition-all shadow-sm">
                  {I.play}{t("Continue Lesson","استكمال الدرس")}
                </button>
                <button onClick={()=>router.push("/class/live")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 active:scale-[.98] transition-all"
                  style={{backdropFilter:"blur(8px)"}}>
                  {I.join}{t("Join Class","انضم للحصة")}
                </button>
                <button onClick={()=>router.push("/student/classes")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white active:scale-[.98] transition-all">
                  {I.cal}{t("Schedule","الجدول")}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Streak + Skills ── */}
          <div className="flex flex-col gap-4">

            {/* Streak */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .28s both"}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1e293b]">{t("Daily Streak","التعلم اليومي")}</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["M","T","W","T","F","S","S"].map((d,i)=>(
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-[#94a3b8] font-medium">{d}</span>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all"
                      style={{backgroundColor:i<5?"#107789":"#F8FAFC",color:i<5?"white":"#CBD5E1"}}>
                      {i<5?"✓":"·"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[#EBF5F7] p-3 text-center">
                <p className="text-xl font-black text-[#107789]">{lesson.streak} {t("days","يوم")}</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">{t("Don't break your streak!","لا تكسر سلسلتك!")}</p>
              </div>
            </div>

            {/* Skills breakdown */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 flex-1 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .34s both"}}>
              <h3 className="text-sm font-bold text-[#1e293b] mb-4">{t("Skill Progress","تقدم المهارات")}</h3>
              <div className="space-y-3">
                {SKILL_BARS.map((s,i)=>(
                  <div key={s.en} style={{animation:`slideUp .3s ${0.36+i*0.07}s ease both`}}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-semibold text-[#64748b]">{lang==="ar"?s.ar:s.en}</span>
                      <span className="text-[11px] font-bold" style={{color:s.color}}>{s.val}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${s.val}%`,backgroundColor:s.color,transition:"width .8s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Upcoming Classes + Leaderboard ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Upcoming classes */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .38s both"}}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Upcoming Classes","الحصص القادمة")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your scheduled sessions","جلساتك المجدولة")}</p>
              </div>
              <button onClick={()=>router.push("/student/classes")}
                className="text-xs font-semibold text-[#107789] hover:underline active:opacity-70">
                {t("View All","عرض الكل")}
              </button>
            </div>

            <div className="divide-y divide-[#F8FAFC]">
              {CLASSES.map((cls,i)=>{
                const sc=CLASS_STATUS_CFG[cls.status];
                const isNow=cls.status==="now";
                return (
                  <div key={cls.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${isNow?"bg-[#FFF8F8]":"hover:bg-[#F8FAFC]"}`}
                    style={{animation:`slideUp .3s ${0.42+i*0.07}s ease both`}}>
                    <div className="relative">
                      <Av initials={cls.avatar} size="md"/>
                      {isNow&&<span className="absolute -top-0.5 -end-0.5 w-3 h-3 rounded-full bg-[#ef4444] border-2 border-white" style={{animation:"blink 1.2s infinite"}}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1e293b] truncate">
                        {lang==="ar"?cls.subjectAr:cls.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-[#94a3b8]">{cls.teacher}</span>
                        <span className="text-[#E2E8F0]">·</span>
                        <div className="flex items-center gap-1 text-[#94a3b8]">
                          {I.clock}
                          <span className="text-xs">{lang==="ar"?cls.dateAr:cls.date} · {cls.time}</span>
                        </div>
                        <span className="text-[10px] text-[#94a3b8]">· {cls.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{backgroundColor:sc.bg,color:sc.text}}>
                        {lang==="ar"?sc.ar:sc.en}
                      </span>
                      {isNow ? (
                        <button onClick={()=>router.push("/class/live")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                          style={{backgroundColor:"#ef4444"}}>
                          {I.join}{t("Join Now","انضم الآن")}
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all">
                          {I.cal}{t("Details","تفاصيل")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .44s both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Leaderboard","لوحة الصدارة")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Weekly ranking","الترتيب الأسبوعي")}</p>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {LEADERBOARD.map((e,i)=>(
                <div key={e.rank}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors ${e.isMe?"bg-[#F1F9FB]":"hover:bg-[#F8FAFC]"}`}
                  style={{animation:`slideUp .3s ${0.48+i*0.06}s ease both`}}>
                  {/* Rank */}
                  <span className="w-6 flex-shrink-0 text-center text-sm">
                    {e.rank===1?"🥇":e.rank===2?"🥈":e.rank===3?"🥉":<span className="text-xs font-black text-[#94a3b8]">#{e.rank}</span>}
                  </span>
                  {/* Avatar */}
                  <div className="relative">
                    <Av initials={e.avatar} size="sm"/>
                    {e.isMe&&<span className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-[#107789] border-2 border-white"/>}
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${e.isMe?"text-[#107789]":"text-[#1e293b]"}`}>
                      {lang==="ar"?e.nameAr:e.name}
                    </p>
                  </div>
                  {/* XP + delta */}
                  <div className="text-end flex-shrink-0">
                    <p className="text-xs font-black text-[#1e293b]">{e.xp}</p>
                    <p className="text-[9px] font-semibold" style={{color:e.delta>0?"#059669":"#ef4444"}}>
                      {e.delta>0?"+":""}{e.delta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC] text-center">
              <p className="text-[10px] text-[#94a3b8]">
                {t("135 XP to overtake Omar Khalid","135 نقطة للتفوق على عمر خالد")} 🎯
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions + Recent Activity ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .5s both"}}>
            <h2 className="text-sm font-bold text-[#1e293b] mb-4">{t("Quick Actions","الإجراءات السريعة")}</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                {en:"Continue",  ar:"استكمال الدرس", icon:I.play,   bg:"#EBF5F7", color:"#107789", path:"/student/learning",  bold:true  },
                {en:"Join Class", ar:"انضم للحصة",   icon:I.join,   bg:"#fee2e2", color:"#ef4444", path:"/class/live",         bold:false },
                {en:"Schedule",  ar:"الجدول",        icon:I.cal,    bg:"#fef3c7", color:"#d97706", path:"/student/classes",   bold:false },
                {en:"Progress",  ar:"تقدمي",         icon:I.check,  bg:"#ede9fe", color:"#7c3aed", path:"/student/learning",   bold:false },
                {en:"Rankings",  ar:"الترتيب",       icon:I.trophy, bg:"#d1fae5", color:"#059669", path:"/student",            bold:false },
                {en:"Payments",  ar:"المدفوعات",    icon:I.pay,    bg:"#e0f2fe", color:"#0369a1", path:"/student/payments",   bold:false },
              ].map((a,i)=>(
                <button key={a.en} onClick={()=>router.push(a.path)}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all hover:shadow-sm active:scale-[.97]"
                  style={{
                    borderColor:a.bold?"#107789":"#F1F5F9",
                    backgroundColor:a.bold?"#EBF5F7":"white",
                    animation:`cardIn .35s ${0.52+i*0.05}s both`,
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{backgroundColor:a.bg}}>
                    <span style={{color:a.color}}>{a.icon}</span>
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight text-center ${a.bold?"text-[#107789]":"text-[#64748b]"}`}>
                    {lang==="ar"?a.ar:a.en}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .56s both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Recent Activity","النشاط الأخير")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your latest learning actions","أحدث أنشطتك التعليمية")}</p>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {ACTIVITY.map((a,i)=>(
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${0.58+i*0.07}s ease both`}}>
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#d97706]">{I.zap}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1e293b] leading-snug">
                      {lang==="ar"?a.ar:a.en}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{lang==="ar"?a.timeAr:a.time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#059669] bg-[#d1fae5] px-2 py-0.5 rounded-full flex-shrink-0">
                    +{a.xp} XP
                  </span>
                </div>
              ))}
            </div>
            {/* Weekly XP total */}
            <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-xs text-[#64748b] font-medium">{t("Total XP this week","إجمالي نقاط هذا الأسبوع")}</span>
              <span className="text-sm font-black text-[#d97706]">
                +{ACTIVITY.reduce((a,r)=>a+r.xp,0)} XP ⚡
              </span>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}