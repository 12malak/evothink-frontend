"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface HeaderProps {
  userName?:    string;
  userRole?:    string;
  userInitial?: string;
}
interface Notification {
  id:string; en:string; ar:string; time:string; timeAr:string; dot:string; read:boolean;
}

const INITIAL_NOTIFS: Notification[] = [
  {id:"n1",en:"New student enrolled: Omar Khalid", ar:"طالب جديد مسجّل: عمر خالد",      time:"2m ago",  timeAr:"منذ دقيقتين",  dot:"#107789",read:false},
  {id:"n2",en:"Class starting in 30 minutes",      ar:"حصة تبدأ خلال 30 دقيقة",          time:"25m ago", timeAr:"منذ 25 دقيقة", dot:"#d97706",read:false},
  {id:"n3",en:"Evaluation submitted successfully", ar:"تم إرسال التقييم بنجاح",           time:"1h ago",  timeAr:"منذ ساعة",     dot:"#059669",read:true },
  {id:"n4",en:"Payout of $320 is now processing",  ar:"دفعة $320 قيد المعالجة الآن",      time:"3h ago",  timeAr:"منذ 3 ساعات",  dot:"#7c3aed",read:true },
];

const ROLE_COLORS: Record<string,{bg:string;text:string;border:string}> = {
  ADMIN:   {bg:"#ede9fe",text:"#7c3aed",border:"#c4b5fd"},
  TEACHER: {bg:"#EBF5F7",text:"#107789",border:"#b2dce4"},
  STUDENT: {bg:"#d1fae5",text:"#059669",border:"#6ee7b7"},
  SALES:   {bg:"#fef3c7",text:"#d97706",border:"#fde68a"},
  PARENT:  {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5"},
};
const AVT_COLORS=["#107789","#7c3aed","#059669","#d97706","#ef4444","#0369a1","#f97316"];
const avtColor=(s:string)=>AVT_COLORS[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT_COLORS.length];

const IC={
  bell:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chevron:(flip:boolean)=><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:flip?"rotate(180deg)":"none",transition:"transform .2s ease"}}><polyline points="6 9 12 15 18 9"/></svg>,
  user:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  gear:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  close:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

function LangToggle({lang,onToggle}:{lang:string;onToggle:()=>void}){
  const isAr=lang==="ar";
  return(
    <button onClick={onToggle} dir="ltr"
      className="relative flex items-center rounded-full border transition-all duration-300 active:scale-95 select-none overflow-hidden flex-shrink-0"
      style={{height:34,width:78,backgroundColor:"#F8FAFC",borderColor:"#b2dce4",boxShadow:"0 1px 3px rgba(16,119,137,.15)"}}>
      <span className="absolute top-[3px] h-[26px] w-[34px] rounded-full shadow-sm transition-all duration-300"
        style={{left:isAr?"41px":"3px",backgroundColor:"#107789"}}/>
      <span className="relative z-10 flex w-full">
        <span className="flex-1 text-center text-[11px] font-black transition-colors duration-200" style={{color:!isAr?"#fff":"#107789"}}>EN</span>
        <span className="flex-1 text-center text-[11px] font-black transition-colors duration-200" style={{color:isAr?"#fff":"#107789"}}>ع</span>
      </span>
    </button>
  );
}

// ─── Notification list (shared between mobile+desktop) ────────
function NotifContent({notifs,unread,lang,t,onMarkAll,onRead}:{
  notifs:Notification[]; unread:number; lang:string;
  t:(a:string,b:string)=>string; onMarkAll:()=>void; onRead:(i:number)=>void;
}){
  return(
    <>
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-[#1e293b]">{t("Notifications","الإشعارات")}</span>
          {unread>0&&<span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[9px] font-black text-white">{unread}</span>}
        </div>
        {unread>0&&(
          <button onClick={onMarkAll} className="text-[11px] font-semibold text-[#107789] hover:underline active:opacity-60 transition-opacity">
            {t("Mark all read","قراءة الكل")}
          </button>
        )}
      </div>

      {/* Items — scrollable */}
      <div className="overflow-y-auto divide-y divide-[#F8FAFC]" style={{maxHeight:"min(300px, calc(100dvh - 140px))"}}>
        {notifs.map((n,i)=>(
          <div key={n.id}
            className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[#F8FAFC] active:scale-[.99]"
            style={{backgroundColor:n.read?"white":"#F8FDFF",animationDelay:`${i*.04}s`}}
            onClick={()=>onRead(i)}>
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{backgroundColor:n.read?"#CBD5E1":n.dot}}/>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug ${n.read?"text-[#64748b]":"font-semibold text-[#1e293b]"}`}>
                {lang==="ar"?n.ar:n.en}
              </p>
              <p className="mt-0.5 text-[10px] text-[#94a3b8]">{lang==="ar"?n.timeAr:n.time}</p>
            </div>
            {!n.read&&<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{backgroundColor:n.dot}}/>}
          </div>
        ))}
        {notifs.length===0&&(
          <p className="px-4 py-8 text-center text-sm text-[#94a3b8]">{t("No notifications","لا توجد إشعارات")}</p>
        )}
      </div>

      {/* Footer — no broken /notifications link */}
      <div className="border-t border-[#F1F5F9] px-4 py-2.5 text-center">
        <p className="text-[11px] font-medium" style={{color:unread===0?"#94a3b8":"#107789"}}>
          {unread===0
            ? t("All caught up ✓","لا يوجد شيء جديد ✓")
            : t(`${unread} unread notification${unread>1?"s":""}`,`${unread} إشعار${unread>1?"ات":""} غير مقروء`)}
        </p>
      </div>
    </>
  );
}

// ─── User dropdown shell ──────────────────────────────────────
function UserDrop({open,align,children}:{open:boolean;align:"left"|"right";children:React.ReactNode}){
  return(
    <div className={[
      "absolute top-[calc(100%+8px)] z-[200] w-56 overflow-hidden rounded-2xl",
      "border border-[#F1F5F9] bg-white",
      "shadow-[0_20px_48px_rgba(15,23,42,.12),0_4px_12px_rgba(15,23,42,.06)]",
      "transition-all duration-[180ms] ease-out origin-top",
      align==="left"?"left-0":"right-0",
      open?"pointer-events-auto translate-y-0 scale-100 opacity-100"
          :"pointer-events-none -translate-y-2 scale-[.96] opacity-0",
    ].join(" ")}>{children}</div>
  );
}

// ═══════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════
export default function Header({
  userName    = "Admin",
  userRole    = "ADMIN",
  userInitial = "A",
}: HeaderProps){
  const router = useRouter();
  const {lang, setLang, t, isRTL} = useLanguage();
  const dropAlign = isRTL?"left":"right";

  const [userOpen, setUserOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifs,   setNotifs  ] = useState<Notification[]>(INITIAL_NOTIFS);

  const userRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const fn=(e:MouseEvent)=>{
      if(userRef.current&&!userRef.current.contains(e.target as Node)) setUserOpen(false);
      if(bellRef.current&&!bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown",fn); return()=>document.removeEventListener("mousedown",fn);
  },[]);

  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{if(e.key==="Escape"){setUserOpen(false);setBellOpen(false);}};
    document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn);
  },[]);

  const only=(w:"user"|"bell")=>{setUserOpen(w==="user"?p=>!p:false);setBellOpen(w==="bell"?p=>!p:false);};
  const unread      = notifs.filter(n=>!n.read).length;
  const markAllRead = ()=>setNotifs(p=>p.map(n=>({...n,read:true})));
  const roleCfg     = ROLE_COLORS[userRole]??{bg:"#F1F5F9",text:"#64748b",border:"#E2E8F0"};
  const bgColor     = avtColor(userInitial);

  return(
    <>
      <style>{`
        @keyframes bellRing{0%,100%{transform:rotate(0)}15%{transform:rotate(-16deg)}30%{transform:rotate(16deg)}45%{transform:rotate(-10deg)}60%{transform:rotate(10deg)}75%{transform:rotate(-5deg)}}
        @keyframes notifSlide{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:none}}
        .bell-hover:hover .bell-icon{animation:bellRing .55s ease}
      `}</style>

      <header dir={isRTL?"rtl":"ltr"} className="sticky top-0 z-50 w-full"
        style={{background:"rgba(255,255,255,.95)",backdropFilter:"blur(24px) saturate(180%)",WebkitBackdropFilter:"blur(24px) saturate(180%)",borderBottom:"1px solid rgba(241,245,249,.9)",boxShadow:"0 1px 0 rgba(241,245,249,1),0 4px 24px rgba(15,23,42,.04)"}}>

        <div className="flex h-[60px] sm:h-[68px] items-center justify-between gap-2 px-3 sm:px-5 lg:px-8">

          {/* Logo — hidden on mobile */}
         <div className="flex-shrink-0" dir="ltr">
  
  {/* Mobile logo (icon فقط) */}
  <img
    src="/images/logo.png"
    alt="Evothink"
    className="w-9 h-9 object-contain sm:hidden"
  />

  {/* Desktop logo */}
  <img
    src="/images/logo.png"
    alt="Evothink"
    className="hidden sm:block w-[150px] lg:w-[200px] h-auto object-contain"
  />

</div>

          {/* Controls */}
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 ms-auto">

            <LangToggle lang={lang} onToggle={()=>setLang(lang==="en"?"ar":"en")}/>
            <div className="mx-1 h-5 w-px rounded-full bg-[#E5E7EB]"/>

            {/* ── Bell ── */}
            <div ref={bellRef} className="relative bell-hover">
              <button onClick={()=>only("bell")} aria-label={t("Notifications","الإشعارات")} aria-expanded={bellOpen}
                className={["relative flex items-center justify-center w-10 h-10 rounded-xl text-[#64748b] transition-all duration-200 active:scale-95",
                  bellOpen?"bg-[#EBF5F7] text-[#107789]":"hover:bg-[#F5F7F9] hover:text-[#107789]"].join(" ")}>
                <span className="bell-icon block">{IC.bell}</span>
                {unread>0&&(
                  <>
                    <span className="absolute end-1.5 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#ef4444] px-0.5 text-[9px] font-black leading-none text-white">{unread>9?"9+":unread}</span>
                    <span className="absolute end-1 top-1 h-3 w-3 animate-ping rounded-full bg-[#ef4444] opacity-30"/>
                  </>
                )}
              </button>

              {/* ── MOBILE: fixed below header, full width with margins ── */}
              {bellOpen&&(
                <div
                  className="sm:hidden fixed z-[300] overflow-hidden rounded-2xl bg-white border border-[#F1F5F9]"
                  style={{
                    top:64, left:12, right:12,
                    boxShadow:"0 20px 48px rgba(15,23,42,.18),0 4px 12px rgba(15,23,42,.1)",
                    animation:"notifSlide .18s cubic-bezier(.34,1.56,.64,1) both",
                  }}>
                  <NotifContent notifs={notifs} unread={unread} lang={lang} t={t}
                    onMarkAll={markAllRead}
                    onRead={i=>setNotifs(p=>p.map((x,j)=>j===i?{...x,read:true}:x))}/>
                </div>
              )}

              {/* ── DESKTOP: absolute dropdown from bell button ── */}
              <div className={[
                "hidden sm:block absolute top-[calc(100%+8px)] z-[200] w-[340px] overflow-hidden rounded-2xl bg-white border border-[#F1F5F9]",
                "shadow-[0_20px_48px_rgba(15,23,42,.12),0_4px_12px_rgba(15,23,42,.06)]",
                "transition-all duration-[180ms] ease-out origin-top",
                dropAlign==="left"?"left-0":"right-0",
                bellOpen?"pointer-events-auto translate-y-0 scale-100 opacity-100"
                        :"pointer-events-none -translate-y-2 scale-[.96] opacity-0",
              ].join(" ")}>
                <NotifContent notifs={notifs} unread={unread} lang={lang} t={t}
                  onMarkAll={markAllRead}
                  onRead={i=>setNotifs(p=>p.map((x,j)=>j===i?{...x,read:true}:x))}/>
              </div>
            </div>

            <div className="mx-1 h-5 w-px rounded-full bg-[#E5E7EB]"/>

            {/* ── User menu ── */}
            <div ref={userRef} className="relative">
              <button onClick={()=>only("user")} aria-expanded={userOpen}
                className={["flex items-center gap-2 rounded-xl px-1.5 sm:px-2.5 py-1.5 transition-all duration-200 active:scale-[.97]",
                  userOpen?"bg-[#EBF5F7]":"hover:bg-[#F5F7F9]"].join(" ")}>
                <div className={`hidden sm:flex flex-col gap-0.5 ${isRTL?"items-start":"items-end"}`}>
                  <span className="max-w-[96px] truncate text-[13px] font-bold leading-none text-[#1e293b]">{userName}</span>
                  <span className="inline-flex items-center rounded-md px-1.5 py-[2px] text-[10px] font-bold leading-none whitespace-nowrap"
                    style={{backgroundColor:roleCfg.bg,color:roleCfg.text,border:`1px solid ${roleCfg.border}`}}>{userRole}</span>
                </div>
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
                  style={{backgroundColor:bgColor,boxShadow:`0 0 0 2px white,0 0 0 3.5px ${bgColor}40`}}>
                  {userInitial}
                </div>
                <span className="hidden sm:block flex-shrink-0 text-[#9ca3af]">{IC.chevron(userOpen)}</span>
              </button>

              <UserDrop open={userOpen} align={dropAlign}>
                <div className="px-4 py-3.5 border-b border-[#F8FAFC] bg-[#FAFBFC]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
                      style={{backgroundColor:bgColor,boxShadow:`0 0 0 2px white,0 0 0 3.5px ${bgColor}40`}}>
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-black text-[#1e293b]">{userName}</p>
                      <span className="inline-flex items-center rounded-md px-2 py-[3px] text-[10px] font-bold leading-none mt-1"
                        style={{backgroundColor:roleCfg.bg,color:roleCfg.text,border:`1px solid ${roleCfg.border}`}}>{userRole}</span>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  {[
                    {key:"profile", href:"/profile",  label:{en:"Profile",  ar:"الملف الشخصي"},icon:IC.user},
                    {key:"settings",href:"/settings", label:{en:"Settings", ar:"الإعدادات"},   icon:IC.gear},
                  ].map(item=>(
                    <button key={item.key} onClick={()=>{router.push(item.href);setUserOpen(false);}}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F8FAFC] hover:text-[#107789] transition-all duration-150 active:scale-[.98]">
                      <span className="text-[#9ca3af]">{item.icon}</span>
                      {t(item.label.en,item.label.ar)}
                    </button>
                  ))}
                  <div className="my-1.5 h-px bg-[#F1F5F9]"/>
                  <button onClick={()=>{router.push("/auth/login");setUserOpen(false);}}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#ef4444] hover:bg-[#FEF2F2] transition-all duration-150 active:scale-[.98]">
                    <span>{IC.logout}</span>{t("Sign Out","تسجيل الخروج")}
                  </button>
                </div>
              </UserDrop>
            </div>

          </div>
        </div>

        <div className="h-[2.5px] w-full" style={{background:"linear-gradient(90deg,#107789 0%,#E8763A 55%,transparent 100%)",opacity:.3}}/>
      </header>

      {/* Mobile backdrop — closes panel when tapping outside */}
      {bellOpen&&(
        <div className="sm:hidden fixed inset-0 z-[290]" onClick={()=>setBellOpen(false)}/>
      )}
    </>
  );
}