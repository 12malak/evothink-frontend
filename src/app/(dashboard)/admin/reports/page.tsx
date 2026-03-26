"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Period = "week" | "month" | "quarter" | "year";

// ─── Data ─────────────────────────────────────────────────────
const SALES_DATA: Record<Period,{label:string;labelAr:string;value:number}[]> = {
  week:    [{label:"Mon",labelAr:"إث",value:1800},{label:"Tue",labelAr:"ثل",value:2200},{label:"Wed",labelAr:"أر",value:1500},{label:"Thu",labelAr:"خم",value:2800},{label:"Fri",labelAr:"جم",value:3100},{label:"Sat",labelAr:"سب",value:900}],
  month:   [{label:"W1",labelAr:"أ1",value:9200},{label:"W2",labelAr:"أ2",value:11400},{label:"W3",labelAr:"أ3",value:8700},{label:"W4",labelAr:"أ4",value:12400}],
  quarter: [{label:"Jan",labelAr:"ينا",value:32000},{label:"Feb",labelAr:"فبر",value:28500},{label:"Mar",labelAr:"مار",value:41000}],
  year:    [{label:"Q1",labelAr:"ر1",value:101500},{label:"Q2",labelAr:"ر2",value:118000},{label:"Q3",labelAr:"ر3",value:95000},{label:"Q4",labelAr:"ر4",value:134000}],
};
const ATTEND_DATA: Record<Period,{label:string;labelAr:string;value:number}[]> = {
  week:    [{label:"Mon",labelAr:"إث",value:88},{label:"Tue",labelAr:"ثل",value:94},{label:"Wed",labelAr:"أر",value:91},{label:"Thu",labelAr:"خم",value:96},{label:"Fri",labelAr:"جم",value:89},{label:"Sat",labelAr:"سب",value:70}],
  month:   [{label:"W1",labelAr:"أ1",value:90},{label:"W2",labelAr:"أ2",value:93},{label:"W3",labelAr:"أ3",value:88},{label:"W4",labelAr:"أ4",value:95}],
  quarter: [{label:"Jan",labelAr:"ينا",value:91},{label:"Feb",labelAr:"فبر",value:89},{label:"Mar",labelAr:"مار",value:94}],
  year:    [{label:"Q1",labelAr:"ر1",value:91},{label:"Q2",labelAr:"ر2",value:93},{label:"Q3",labelAr:"ر3",value:90},{label:"Q4",labelAr:"ر4",value:94}],
};
const TOP_TEACHERS=[
  {name:"Ahmad Nasser", nameAr:"أحمد ناصر", avatar:"AN", color:"#107789", sessions:148, rating:4.9, revenue:"$8,200"},
  {name:"Layla Hassan",  nameAr:"ليلى حسن",  avatar:"LH", color:"#7c3aed", sessions:132, rating:4.8, revenue:"$7,400"},
  {name:"Khalid Samir",  nameAr:"خالد سمير", avatar:"KS", color:"#059669", sessions:119, rating:4.7, revenue:"$6,600"},
  {name:"Reem Faris",    nameAr:"ريم فارس",  avatar:"RF", color:"#d97706", sessions:104, rating:4.6, revenue:"$5,800"},
];
const TRANSACTIONS=[
  {student:"Sara Al-Rashid", studentAr:"سارة الراشد", avatar:"SA", color:"#107789", pkg:"Standard Pack", pkgAr:"الباقة المعيارية", amount:"$280", date:"Mar 20, 2025", status:"Paid"},
  {student:"Omar Yousef",    studentAr:"عمر يوسف",    avatar:"OY", color:"#7c3aed", pkg:"Basic Pack",    pkgAr:"الباقة الأساسية",  amount:"$150", date:"Mar 19, 2025", status:"Paid"},
  {student:"Nour Khalil",    studentAr:"نور خليل",    avatar:"NK", color:"#059669", pkg:"Premium Pack",  pkgAr:"الباقة المميزة",   amount:"$500", date:"Mar 18, 2025", status:"Paid"},
  {student:"Tariq Ziad",     studentAr:"طارق زياد",   avatar:"TZ", color:"#d97706", pkg:"Standard Pack", pkgAr:"الباقة المعيارية", amount:"$280", date:"Mar 17, 2025", status:"Pending"},
  {student:"Lina Hamdan",    studentAr:"لينا حمدان",  avatar:"LH", color:"#ef4444", pkg:"Basic Pack",    pkgAr:"الباقة الأساسية",  amount:"$150", date:"Mar 16, 2025", status:"Paid"},
];
const TX_SC={
  Paid:    {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",ar:"مدفوع"},
  Pending: {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",ar:"معلق"},
};

// ─── Avatar colors ────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];
function Av({i,size="md"}:{i:string;size?:"sm"|"md"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}

// ─── Bar Chart ────────────────────────────────────────────────
function BarChart({data,color="#107789",lang}:{data:{label:string;labelAr:string;value:number}[];color?:string;lang:string}){
  const max=Math.max(...data.map(d=>d.value),1);
  const cH=80; const bW=24; const gap=10; const topPad=26; const botPad=28;
  const total=data.length*(bW+gap)-gap+8;
  const vb=`0 -${topPad} ${total} ${cH+topPad+botPad}`;
  return(
    <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"auto",display:"block"}}>
      {data.map((d,i)=>{
        const x=i*(bW+gap); const h=Math.max(4,(d.value/max)*cH); const y=cH-h;
        const isLast=i===data.length-1;
        return(
          <g key={i}>
            <rect x={x} y={0} width={bW} height={cH} rx={4} fill="#F1F5F9"/>
            <rect x={x} y={y} width={bW} height={h} rx={4} fill={isLast?color:`${color}55`} style={{transition:`height .7s ${i*.1}s ease,y .7s ${i*.1}s ease`}}/>
            {isLast&&(
              <><rect x={x-2} y={y-22} width={bW+4} height={14} rx={7} fill={color}/>
              <text x={x+bW/2} y={y-11} textAnchor="middle" fontSize="9" fontWeight="800" fill="white">
                {d.value>=1000?`$${Math.round(d.value/1000)}k`:d.value}
              </text></>
            )}
            <text x={x+bW/2} y={cH+18} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
              {lang==="ar"?d.labelAr:d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Line Chart ───────────────────────────────────────────────
function LineChart({data,color="#059669",lang}:{data:{label:string;labelAr:string;value:number}[];color?:string;lang:string}){
  const max=Math.max(...data.map(d=>d.value),1)*1.1;
  const W=300; const H=80; const px=12;
  const step=(W-px*2)/(data.length-1||1);
  const pts=data.map((d,i)=>({x:px+i*step,y:H-(d.value/max)*H}));
  const pathD=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  const areaD=`${pathD} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
  return(
    <svg viewBox={`0 0 ${W} ${H+22}`} preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"auto",display:"block"}}>
      <path d={areaD} fill={`${color}18`}/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color}/>
      ))}
      {data.map((d,i)=>(
        <text key={i} x={pts[i].x} y={H+16} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
          {lang==="ar"?d.labelAr:d.label}
        </text>
      ))}
    </svg>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function ReportsPage(){
  const {lang,isRTL,t}=useLanguage();
  const [period,setPeriod]=useState<Period>("month");

  const totalSales=SALES_DATA[period].reduce((a,b)=>a+b.value,0);
  const avgAttend=Math.round(ATTEND_DATA[period].reduce((a,b)=>a+b.value,0)/ATTEND_DATA[period].length);

  const PERIODS:[Period,string,string][]=[
    ["week",  "Week",    "الأسبوع"],
    ["month", "Month",   "الشهر"],
    ["quarter","Quarter","الربع"],
    ["year",  "Year",    "السنة"],
  ];

  const stats=[
    {icon:"💰", en:"Sales Revenue",      ar:"إيرادات المبيعات",   val:`$${totalSales.toLocaleString()}`, change:"+8.3%", up:true,  color:"#107789",bg:"#EBF5F7",delay:0},
    {icon:"✅", en:"Attendance Rate",     ar:"نسبة الحضور",        val:`${avgAttend}%`,                   change:"+2.1%", up:true,  color:"#059669",bg:"#d1fae5",delay:0.07},
    {icon:"📈", en:"Student Progress",    ar:"تقدم الطلاب",         val:t("High","مرتفع"),                 change:t("Stable","مستقر"),up:true,color:"#7c3aed",bg:"#ede9fe",delay:0.14},
    {icon:"⭐", en:"Teacher Performance", ar:"أداء المعلمين",       val:t("Excellent","ممتاز"),            change:"+0.3 pts",up:true, color:"#d97706",bg:"#fef3c7",delay:0.21},
  ];

  const METRICS=[
    {en:"Trial Conversion",    ar:"تحويل التجريبي",          val:68, color:"#107789",delay:0},
    {en:"Fee Collection Rate", ar:"معدل تحصيل الرسوم",       val:87, color:"#059669",delay:0.1},
    {en:"Quiz Pass Rate",      ar:"معدل اجتياز الاختبارات",  val:83, color:"#7c3aed",delay:0.2},
    {en:"Student Retention",   ar:"الاحتفاظ بالطلاب",        val:79, color:"#d97706",delay:0.3},
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Reports & Analytics","التقارير والتحليلات")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Platform performance and financial overview","أداء المنصة ونظرة مالية شاملة")}</p>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1 rounded-xl border border-[#F1F5F9] bg-white p-1 shadow-sm"
            style={{animation:"cardIn .4s .05s both"}}>
            {PERIODS.map(([key,en,ar])=>(
              <button key={key} onClick={()=>setPeriod(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period===key?"bg-[#107789] text-white shadow-sm":"text-[#64748b] hover:text-[#107789]"}`}>
                {lang==="ar"?ar:en}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.en} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{backgroundColor:s.bg}}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xs text-[#94a3b8] font-medium truncate">{lang==="ar"?s.ar:s.en}</p>
                <p className="text-lg sm:text-xl font-black text-[#1e293b] mt-0.5 leading-tight">{s.val}</p>
                <p className="text-xs font-bold mt-1" style={{color:s.up?"#059669":"#ef4444"}}>{s.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Sales Bar Chart */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .22s both"}}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Sales Revenue","إيرادات المبيعات")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Total earned this period","إجمالي الأرباح في هذه الفترة")}</p>
              </div>
              <span className="text-sm font-black text-[#107789]">${totalSales.toLocaleString()}</span>
            </div>
            <BarChart data={SALES_DATA[period]} color="#107789" lang={lang}/>
          </div>

          {/* Attendance Line Chart */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .28s both"}}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Attendance Rate","نسبة الحضور")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Average session attendance","متوسط حضور الجلسات")}</p>
              </div>
              <span className="text-sm font-black text-[#059669]">{avgAttend}%</span>
            </div>
            <LineChart data={ATTEND_DATA[period]} color="#059669" lang={lang}/>
          </div>
        </div>

        {/* Teachers + Transactions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Top Teachers */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .32s both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <p className="text-sm font-bold text-[#1e293b]">{t("Top Teachers","أفضل المعلمين")}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("By sessions & revenue","حسب الجلسات والإيرادات")}</p>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {TOP_TEACHERS.map((tc,i)=>(
                <div key={tc.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${0.36+i*.07}s ease both`}}>
                  <span className="text-sm w-5 text-center flex-shrink-0">
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-[11px] font-black text-[#94a3b8]">#{i+1}</span>}
                  </span>
                  <Av i={tc.avatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?tc.nameAr:tc.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{tc.sessions} {t("sessions","جلسة")} · ⭐ {tc.rating}</p>
                  </div>
                  <span className="text-xs font-black text-[#107789] flex-shrink-0">{tc.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .38s both"}}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Recent Transactions","آخر المعاملات المالية")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Latest package purchases","آخر عمليات شراء الباقات")}</p>
              </div>
              <button className="text-xs font-semibold text-[#107789] hover:underline">{t("View all","عرض الكل")}</button>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {TRANSACTIONS.map((tx,i)=>{
                const sc=TX_SC[tx.status as keyof typeof TX_SC];
                return(
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5" style={{animation:`slideUp .3s ${0.4+i*.05}s ease both`}}>
                    <Av i={tx.avatar} size="sm"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?tx.studentAr:tx.student}</p>
                      <p className="text-[10px] text-[#94a3b8]">{lang==="ar"?tx.pkgAr:tx.pkg}</p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <p className="text-sm font-black text-[#1e293b]">{tx.amount}</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:sc.bg,color:sc.text}}>{lang==="ar"?sc.ar:tx.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{backgroundColor:"#F8FAFC"}}>
                    {[{en:"Student",ar:"الطالب"},{en:"Package",ar:"الباقة"},{en:"Amount",ar:"المبلغ"},{en:"Date",ar:"التاريخ"},{en:"Status",ar:"الحالة"}].map(col=>(
                      <th key={col.en} className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">
                        {lang==="ar"?col.ar:col.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx,i)=>{
                    const sc=TX_SC[tx.status as keyof typeof TX_SC];
                    return(
                      <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                        style={{animation:`slideUp .3s ${0.4+i*.05}s ease both`}}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Av i={tx.avatar} size="sm"/>
                            <span className="text-xs font-semibold text-[#1e293b]">{lang==="ar"?tx.studentAr:tx.student}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[#64748b] whitespace-nowrap">{lang==="ar"?tx.pkgAr:tx.pkg}</td>
                        <td className="px-5 py-3.5 text-sm font-black text-[#1e293b]">{tx.amount}</td>
                        <td className="px-5 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">{tx.date}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                            style={{backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:sc.dot}}/>
                            {lang==="ar"?sc.ar:tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
          style={{animation:"cardIn .45s .44s both"}}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-[#1e293b]">{t("Performance Metrics","مقاييس الأداء")}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Key platform indicators","مؤشرات المنصة الرئيسية")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {METRICS.map((m,i)=>(
              <div key={m.en} style={{animation:`slideUp .35s ${0.48+i*.08}s ease both`}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#94a3b8] font-medium leading-tight">{lang==="ar"?m.ar:m.en}</span>
                  <span className="text-sm font-black" style={{color:m.color}}>{m.val}%</span>
                </div>
                <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${m.val}%`,backgroundColor:m.color,transition:`width .8s ${0.5+m.delay}s ease`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}