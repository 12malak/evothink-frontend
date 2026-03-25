"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";
import { useRouter }    from "next/navigation";

// ─── Types ────────────────────────────────────────────────────
type LeadStatus = "new" | "contacted" | "trial_booked" | "converted" | "lost";

interface Agent {
  id: string; name: string; nameAr: string; avatar: string;
  leads: number; conversions: number; revenue: number;
}
interface TrialItem {
  id: string; leadName: string; leadNameAr: string;
  teacher: string; teacherAr: string; teacherAvatar: string;
  date: string; dateAr: string; time: string;
  subject: string; subjectAr: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  agent: string;
}
interface RecentActivity {
  id: string; en: string; ar: string;
  time: string; timeAr: string;
  dot: string; icon: string;
}

// ─── Data ─────────────────────────────────────────────────────
const AGENTS: Agent[] = [
  { id:"A1", name:"Nour Al-Khalil",  nameAr:"نور الخليل",  avatar:"NK", leads:42, conversions:28, revenue:6160 },
  { id:"A2", name:"Fares Mansoor",   nameAr:"فارس منصور",  avatar:"FM", leads:38, conversions:22, revenue:4840 },
  { id:"A3", name:"Dana Rashid",     nameAr:"دانا راشد",   avatar:"DR", leads:31, conversions:19, revenue:4180 },
  { id:"A4", name:"Sami Al-Zoubi",   nameAr:"سامي الزعبي", avatar:"SZ", leads:29, conversions:15, revenue:3300 },
];

const UPCOMING_TRIALS: TrialItem[] = [
  { id:"T001", leadName:"Ahmad Hassan",     leadNameAr:"أحمد حسن",     teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  teacherAvatar:"AN", date:"Today",     dateAr:"اليوم",    time:"02:00 PM", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  status:"scheduled", agent:"Nour" },
  { id:"T002", leadName:"Lina Al-Hajj",     leadNameAr:"لينا الحاج",   teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",   teacherAvatar:"NK", date:"Today",     dateAr:"اليوم",    time:"04:30 PM", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",    status:"scheduled", agent:"Fares" },
  { id:"T003", leadName:"Khalid Nabulsi",   leadNameAr:"خالد النابلسي", teacher:"Dr. Samir Yousef",  teacherAr:"د. سمير يوسف",   teacherAvatar:"SY", date:"Tomorrow",  dateAr:"غداً",     time:"10:00 AM", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",     status:"scheduled", agent:"Dana" },
  { id:"T004", leadName:"Reem Barakat",     leadNameAr:"ريم بركات",    teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  teacherAvatar:"AN", date:"Tomorrow",  dateAr:"غداً",     time:"01:00 PM", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  status:"scheduled", agent:"Nour" },
  { id:"T005", leadName:"Omar Suleiman",    leadNameAr:"عمر سليمان",   teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",   teacherAvatar:"NK", date:"Wed, Mar 26",dateAr:"الأربعاء", time:"11:00 AM", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",    status:"scheduled", agent:"Sami" },
];

const FUNNEL: {stageEn:string;stageAr:string;count:number;color:string;pct:number}[] = [
  { stageEn:"Total Leads",   stageAr:"إجمالي العملاء",    count:140, color:"#107789", pct:100 },
  { stageEn:"Contacted",     stageAr:"تم التواصل",         count:112, color:"#7c3aed", pct:80  },
  { stageEn:"Trial Booked",  stageAr:"حصة تجريبية محجوزة", count:84,  color:"#d97706", pct:60  },
  { stageEn:"Converted",     stageAr:"تحوّل لطالب",        count:56,  color:"#059669", pct:40  },
];

const MONTHLY: {m:string;mAr:string;leads:number;conv:number}[] = [
  { m:"Oct", mAr:"أكت", leads:18, conv:10 },
  { m:"Nov", mAr:"نوف", leads:22, conv:14 },
  { m:"Dec", mAr:"ديس", leads:20, conv:12 },
  { m:"Jan", mAr:"ينا", leads:26, conv:17 },
  { m:"Feb", mAr:"فبر", leads:30, conv:19 },
  { m:"Mar", mAr:"مار", leads:24, conv:16 },
];

const ACTIVITY: RecentActivity[] = [
  { id:"a1", en:"Ahmad Hassan booked a trial class",        ar:"أحمد حسن حجز حصة تجريبية",          time:"5m ago",    timeAr:"منذ 5 د",     dot:"#107789", icon:"📅" },
  { id:"a2", en:"Lina Al-Hajj converted to paid student",   ar:"لينا الحاج تحوّلت لطالبة مدفوعة",   time:"1h ago",    timeAr:"منذ ساعة",    dot:"#059669", icon:"✅" },
  { id:"a3", en:"Nour sent payment link to Reem Barakat",   ar:"نور أرسلت رابط دفع لريم بركات",      time:"2h ago",    timeAr:"منذ ساعتين",  dot:"#7c3aed", icon:"💳" },
  { id:"a4", en:"New lead: Omar Suleiman added",            ar:"عميل جديد: تم إضافة عمر سليمان",     time:"3h ago",    timeAr:"منذ 3 ساعات", dot:"#d97706", icon:"👤" },
  { id:"a5", en:"Khalid Nabulsi trial completed — 9/10",    ar:"انتهت تجربة خالد النابلسي — 9/10",   time:"Yesterday", timeAr:"أمس",         dot:"#ef4444", icon:"🎯" },
];

// ─── Avatar ───────────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}

// ─── Bar chart ────────────────────────────────────────────────
function BarChart({data,lang}:{data:typeof MONTHLY;lang:string}){
  const max=Math.max(...data.map(d=>d.leads));
  const cH=90; const bW=22; const gap=10;
  const topPad=28; const botPad=32;
  const totalW=data.length*(bW*2+gap+6)-gap;
  const vb=`0 -${topPad} ${totalW+8} ${cH+topPad+botPad}`;
  return(
    <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"auto",display:"block"}}>
      {data.map((d,i)=>{
        const lH=Math.max(4,(d.leads/max)*cH);
        const cH2=Math.max(4,(d.conv/max)*cH);
        const x=i*(bW*2+gap+6);
        const isLast=i===data.length-1;
        return(
          <g key={i}>
            {/* Leads bar */}
            <rect x={x} y={0} width={bW} height={cH} rx={4} fill="#F1F5F9"/>
            <rect x={x} y={cH-lH} width={bW} height={lH} rx={4} fill={isLast?"#107789":"#b2dce4"}
              style={{transition:`height .7s ${i*.1}s ease,y .7s ${i*.1}s ease`}}/>
            {/* Conv bar */}
            <rect x={x+bW+4} y={0} width={bW} height={cH} rx={4} fill="#F1F5F9"/>
            <rect x={x+bW+4} y={cH-cH2} width={bW} height={cH2} rx={4} fill={isLast?"#059669":"#6ee7b7"}
              style={{transition:`height .7s ${i*.1+.05}s ease,y .7s ${i*.1+.05}s ease`}}/>
            {/* Label above current month */}
            {isLast&&(
              <>
                <rect x={x-2} y={cH-lH-22} width={bW+4} height={14} rx={7} fill="#107789"/>
                <text x={x+bW/2} y={cH-lH-11} textAnchor="middle" fontSize="9" fontWeight="800" fill="white">{d.leads}</text>
              </>
            )}
            {/* Month */}
            <text x={x+bW+2} y={cH+16} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {lang==="ar"?d.mAr:d.m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const IC_CLOCK=<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IC_ARROW=<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

export default function SalesDashboard(){
  const {lang,isRTL,t}=useLanguage();
  const router=useRouter();

  const totalLeads=140; const activeLeads=89; const converted=56; const convRate=40;
  const totalRevenue=AGENTS.reduce((a,ag)=>a+ag.revenue,0);

  const stats=[
    {icon:"👥", value:String(totalLeads),  label:t("Total Leads","إجمالي العملاء"),       sub:t("+12 this week","+12 هذا الأسبوع"), color:"#107789",bg:"#EBF5F7",delay:0    },
    {icon:"🔥", value:String(activeLeads), label:t("Active Leads","العملاء النشطون"),      sub:t("In pipeline","في خط الأنابيب"),    color:"#d97706",bg:"#fef3c7",delay:0.07 },
    {icon:"✅", value:`${convRate}%`,      label:t("Conversion Rate","معدل التحويل"),      sub:t("+5% vs last month","+5% الشهر"),  color:"#059669",bg:"#d1fae5",delay:0.14 },
    {icon:"💰", value:`$${(totalRevenue/1000).toFixed(1)}k`,label:t("Revenue","الإيرادات"),sub:t("This month","هذا الشهر"),          color:"#7c3aed",bg:"#ede9fe",delay:0.21 },
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Sales Dashboard","لوحة تحكم المبيعات")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Track leads, trials, and conversions","تتبع العملاء والتجارب والتحويلات")}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>router.push("/sales/leads")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
              👥 {t("Manage Leads","إدارة العملاء")}
            </button>
            <button onClick={()=>router.push("/sales/trials")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] bg-white text-[#64748b] hover:border-[#107789]/40 hover:text-[#107789] active:scale-95 transition-all"
              style={{animation:"cardIn .4s .1s both"}}>
              🎯 {t("Trials","التجارب")}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{backgroundColor:s.bg}}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none" style={{color:s.color}}>{s.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium">{s.label}</p>
                <p className="text-[10px] text-[#94a3b8] mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Funnel */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3" style={{animation:"cardIn .45s .22s both"}}>

          {/* Bar chart */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Monthly Performance","الأداء الشهري")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Leads vs Conversions","العملاء مقابل التحويلات")}</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{backgroundColor:"#107789"}}/>{t("Leads","عملاء")}</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{backgroundColor:"#059669"}}/>{t("Converted","تحوّل")}</div>
              </div>
            </div>
            <BarChart data={MONTHLY} lang={lang}/>
          </div>

          {/* Conversion Funnel */}
          <div className="xl:col-span-1 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all">
            <p className="text-sm font-bold text-[#1e293b] mb-1">{t("Conversion Funnel","قمع التحويل")}</p>
            <p className="text-xs text-[#94a3b8] mb-5">{t("Lead journey stages","مراحل رحلة العميل")}</p>
            <div className="space-y-3">
              {FUNNEL.map((f,i)=>(
                <div key={i} style={{animation:`slideUp .35s ${.25+i*.08}s ease both`}}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[#64748b]">{lang==="ar"?f.stageAr:f.stageEn}</span>
                    <span className="text-xs font-black" style={{color:f.color}}>{f.count}</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${f.pct}%`,backgroundColor:f.color}}/>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">{f.pct}% {t("of total","من الإجمالي")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's trials + Top agents */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Upcoming Trials */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all"
            style={{animation:"cardIn .45s .32s both"}}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Upcoming Trials","التجارب القادمة")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{UPCOMING_TRIALS.length} {t("sessions scheduled","جلسة مجدولة")}</p>
              </div>
              <button onClick={()=>router.push("/sales/trials")}
                className="text-xs font-semibold text-[#107789] hover:underline active:opacity-70">{t("View All","عرض الكل")}</button>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {UPCOMING_TRIALS.slice(0,4).map((tr,i)=>(
                <div key={tr.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${.36+i*.06}s ease both`}}>
                  <Av i={tr.teacherAvatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e293b] truncate">{lang==="ar"?tr.leadNameAr:tr.leadName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-xs text-[#94a3b8]">{lang==="ar"?tr.teacherAr:tr.teacher}</span>
                      <span className="text-[#E2E8F0]">·</span>
                      <div className="flex items-center gap-1 text-[#94a3b8]">{IC_CLOCK}<span className="text-xs">{lang==="ar"?tr.dateAr:tr.date} · {tr.time}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF5F7] text-[#107789]">
                      {lang==="ar"?tr.subjectAr:tr.subject}
                    </span>
                    {(tr.date==="Today"||tr.dateAr==="اليوم")&&(
                      <span className="flex items-center gap-1 text-[10px] font-black text-[#ef4444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" style={{animation:"blink 1.2s infinite"}}/>
                        {t("Today","اليوم")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Agents */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all"
            style={{animation:"cardIn .45s .38s both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <p className="text-sm font-bold text-[#1e293b]">{t("Top Agents","أفضل الوكلاء")}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("This month","هذا الشهر")}</p>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {AGENTS.map((ag,i)=>{
                const rate=Math.round((ag.conversions/ag.leads)*100);
                return(
                  <div key={ag.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                    style={{animation:`slideUp .3s ${.4+i*.06}s ease both`}}>
                    <span className="w-5 text-center text-sm flex-shrink-0">
                      {i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-xs font-black text-[#94a3b8]">#{i+1}</span>}
                    </span>
                    <Av i={ag.avatar} size="sm"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?ag.nameAr:ag.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{ag.conversions}/{ag.leads} · {rate}%</p>
                    </div>
                    <span className="text-xs font-black text-[#059669] flex-shrink-0">${(ag.revenue/1000).toFixed(1)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all"
          style={{animation:"cardIn .45s .44s both"}}>
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <p className="text-sm font-bold text-[#1e293b]">{t("Recent Activity","النشاط الأخير")}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Latest sales actions","أحدث إجراءات المبيعات")}</p>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {ACTIVITY.map((a,i)=>(
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                style={{animation:`slideUp .3s ${.46+i*.05}s ease both`}}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{backgroundColor:`${a.dot}18`}}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e293b]">{lang==="ar"?a.ar:a.en}</p>
                </div>
                <span className="text-[10px] text-[#94a3b8] whitespace-nowrap flex-shrink-0">{lang==="ar"?a.timeAr:a.time}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}