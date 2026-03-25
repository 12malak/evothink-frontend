"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type SectionKey = "vocabulary" | "grammar" | "listening" | "practice" | "ai";
type QuizState  = "idle" | "answering" | "result";
type HWState    = "idle" | "doing" | "submitted";

interface VocabWord { en:string; ar:string; example:string; exampleAr:string; phonetic:string; }
interface QuizQuestion { q:string; qAr:string; options:string[]; optionsAr:string[]; correct:number; }
interface HWQuestion   { q:string; qAr:string; placeholder:string; placeholderAr:string; }

// ─── Lesson data ──────────────────────────────────────────────
const LESSON = {
  number:14, total:20, level:"B2",
  titleEn:"Speaking Fluency & Natural Flow",
  titleAr:"طلاقة الكلام والتدفق الطبيعي",
  unitEn:"Unit 4 — Conversational English",
  unitAr:"الوحدة 4 — الإنجليزية التحادثية",
  xpReward:80,
};

const VOCAB_WORDS: VocabWord[] = [
  { en:"Fluent",      ar:"طليق / بطلاقة",     phonetic:"/ˈfluːənt/",   example:"She speaks English fluently.", exampleAr:"هي تتكلم الإنجليزية بطلاقة." },
  { en:"Articulate",  ar:"يُعبّر بوضوح",       phonetic:"/ɑːrˈtɪkjʊleɪt/", example:"He is very articulate in meetings.", exampleAr:"هو يُعبّر بوضوح في الاجتماعات." },
  { en:"Intonation",  ar:"التنغيم",             phonetic:"/ˌɪntəˈneɪʃn/",   example:"Rising intonation signals a question.", exampleAr:"التنغيم الصاعد يشير لسؤال." },
  { en:"Filler words",ar:"كلمات حشو",           phonetic:"/ˈfɪlər wɜːrdz/",  example:"Avoid filler words like 'um' and 'uh'.", exampleAr:"تجنب كلمات الحشو مثل 'أم' و'آه'." },
  { en:"Cadence",     ar:"إيقاع الكلام",        phonetic:"/ˈkeɪdəns/",        example:"A natural cadence makes speech easier.", exampleAr:"إيقاع طبيعي يجعل الكلام أسهل." },
  { en:"Paraphrase",  ar:"يُعيد الصياغة",       phonetic:"/ˈpærəfreɪz/",      example:"Can you paraphrase that sentence?", exampleAr:"هل يمكنك إعادة صياغة تلك الجملة؟" },
];

const GRAMMAR_RULES = [
  { titleEn:"Discourse Markers",    titleAr:"علامات الخطاب",      bodyEn:"Words like 'however', 'moreover', 'on the other hand' connect ideas and make speech flow naturally.", bodyAr:"كلمات مثل 'ومع ذلك' و'علاوة على ذلك' تربط الأفكار وتجعل الكلام يتدفق بشكل طبيعي." },
  { titleEn:"Hedging Language",      titleAr:"لغة التحفظ",         bodyEn:"Use phrases like 'I think', 'It seems to me', 'As far as I know' to soften statements.", bodyAr:"استخدم عبارات مثل 'أعتقد' و'يبدو لي' و'فيما أعلم' لتخفيف الادعاءات." },
  { titleEn:"Tag Questions",         titleAr:"أسئلة الذيل",         bodyEn:"Attach short questions to statements: 'It's cold today, isn't it?' This promotes natural conversation.", bodyAr:"أضف أسئلة قصيرة للجمل: 'الجو بارد اليوم، أليس كذلك؟' هذا يعزز المحادثة الطبيعية." },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q:"Which word means 'able to express thoughts clearly and easily'?", qAr:"أي كلمة تعني 'القادر على التعبير عن الأفكار بوضوح وسهولة'؟", options:["Fluent","Articulate","Intonation","Cadence"], optionsAr:["طليق","يُعبّر بوضوح","التنغيم","إيقاع الكلام"], correct:1 },
  { q:"What do 'discourse markers' help with?", qAr:"بماذا تساعد 'علامات الخطاب'؟", options:["Vocabulary building","Connecting ideas in speech","Pronunciation","Speed of speech"], optionsAr:["بناء المفردات","ربط الأفكار في الكلام","النطق","سرعة الكلام"], correct:1 },
  { q:"Which phrase is an example of 'hedging language'?", qAr:"أي عبارة مثال على 'لغة التحفظ'؟", options:["I know that...","It seems to me...","You must...","The fact is..."], optionsAr:["أعلم أن...","يبدو لي...","يجب عليك...","الحقيقة هي..."], correct:1 },
];

const HW_QUESTIONS: HWQuestion[] = [
  { q:"Record yourself speaking for 2 minutes about your daily routine. Focus on using discourse markers.", qAr:"سجّل نفسك وأنت تتكلم لمدة دقيقتين عن روتينك اليومي. ركّز على استخدام علامات الخطاب.", placeholder:"Write your reflection here...", placeholderAr:"اكتب تأملاتك هنا..." },
  { q:"Write 5 sentences using hedging language about a topic of your choice.", qAr:"اكتب 5 جمل باستخدام لغة التحفظ حول موضوع من اختيارك.", placeholder:"Your 5 sentences...", placeholderAr:"جملك الخمس..." },
];

// ─── Colors per section ───────────────────────────────────────
const SECTION_CFG: Record<SectionKey,{en:string;ar:string;color:string;bg:string;icon:React.ReactNode}> = {
  vocabulary:{en:"Vocabulary",  ar:"المفردات",  color:"#107789",bg:"#EBF5F7",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>},
  grammar:   {en:"Grammar",     ar:"القواعد",   color:"#7c3aed",bg:"#ede9fe",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>},
  listening: {en:"Listening",   ar:"الاستماع",  color:"#059669",bg:"#d1fae5",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>},
  practice:  {en:"Practice",    ar:"التدريب",   color:"#d97706",bg:"#fef3c7",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
  ai:        {en:"AI Practice", ar:"تدريب AI",  color:"#0369a1",bg:"#e0f2fe",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/></svg>},
};

const SECTION_ORDER: SectionKey[] = ["vocabulary","grammar","listening","practice","ai"];

// ─── Icons ────────────────────────────────────────────────────
const I={
  check:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  play:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  lock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  zap:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  mic:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  sound:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  robot:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>,
  chevL:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  arrow:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

// ─── Toast ────────────────────────────────────────────────────
function Toast({msg,onClose}:{msg:string;onClose:()=>void}){
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:"#f0fdf4",border:"1px solid #bbf7d0",color:"#15803d",animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span>{I.check}</span>
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-xs font-bold">✕</button>
    </div>
  );
}

// ─── Vocabulary Section ───────────────────────────────────────
function VocabularySection({lang,t}:{lang:string;t:(a:string,b:string)=>string}){
  const [flipped,setFlipped]=useState<number|null>(null);
  return(
    <div className="space-y-4">
      <p className="text-sm text-[#64748b]">{t("Tap a card to reveal the Arabic translation and example.","اضغط على البطاقة لإظهار الترجمة العربية والمثال.")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VOCAB_WORDS.map((w,i)=>(
          <div key={i} onClick={()=>setFlipped(flipped===i?null:i)}
            className={`rounded-2xl border cursor-pointer transition-all duration-300 p-5 hover:shadow-md hover:border-[#b2dce4] active:scale-[.98] ${flipped===i?"bg-[#EBF5F7] border-[#b2dce4]":"bg-white border-[#F1F5F9]"}`}
            style={{animation:`cardIn .4s ${i*0.07}s both`}}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-lg font-black text-[#1e293b]">{w.en}</p>
                <p className="text-[11px] text-[#94a3b8] font-mono mt-0.5">{w.phonetic}</p>
              </div>
              <button onClick={e=>{e.stopPropagation();}}
                className="w-8 h-8 rounded-full bg-[#EBF5F7] flex items-center justify-center text-[#107789] hover:bg-[#107789] hover:text-white transition-all">
                {I.sound}
              </button>
            </div>
            {flipped===i?(
              <div className="space-y-2 mt-3 pt-3 border-t border-[#b2dce4]" style={{animation:"fadeIn .25s ease both"}}>
                <p className="text-base font-bold text-[#107789]">{w.ar}</p>
                <p className="text-xs text-[#64748b] italic">"{w.example}"</p>
                <p className="text-xs text-[#94a3b8]" dir="rtl">{w.exampleAr}</p>
              </div>
            ):(
              <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                <p className="text-xs text-[#94a3b8]">{t("Tap to reveal","اضغط للكشف")} →</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Grammar Section ──────────────────────────────────────────
function GrammarSection({lang,t}:{lang:string;t:(a:string,b:string)=>string}){
  const [open,setOpen]=useState<number|null>(0);
  return(
    <div className="space-y-3">
      {GRAMMAR_RULES.map((rule,i)=>(
        <div key={i} className="rounded-2xl border border-[#F1F5F9] overflow-hidden bg-white hover:border-[#b2dce4] transition-all duration-200"
          style={{animation:`cardIn .4s ${i*0.1}s both`}}>
          <button onClick={()=>setOpen(open===i?null:i)}
            className="w-full flex items-center justify-between px-5 py-4 text-start hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ede9fe] flex items-center justify-center">
                <span className="text-sm font-black text-[#7c3aed]">{i+1}</span>
              </div>
              <span className="text-sm font-bold text-[#1e293b]">{lang==="ar"?rule.titleAr:rule.titleEn}</span>
            </div>
            <span className="text-[#94a3b8] transition-transform duration-200" style={{transform:open===i?"rotate(90deg)":"none"}}>
              {I.arrow}
            </span>
          </button>
          {open===i&&(
            <div className="px-5 pb-5" style={{animation:"slideUp .25s ease both"}}>
              <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
                <p className="text-sm text-[#64748b] leading-relaxed">{lang==="ar"?rule.bodyAr:rule.bodyEn}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Listening Section ────────────────────────────────────────
function ListeningSection({lang,t}:{lang:string;t:(a:string,b:string)=>string}){
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);

  const togglePlay=()=>{
    setPlaying(p=>{
      if(!p){
        let p2=progress;
        const id=setInterval(()=>{
          p2+=1.5;
          if(p2>=100){clearInterval(id);setPlaying(false);p2=100;}
          setProgress(p2);
        },150);
      }
      return !p;
    });
  };

  const CLIPS=[
    {titleEn:"Dialogue: Job Interview",    titleAr:"حوار: مقابلة عمل",    dur:"2:34"},
    {titleEn:"Podcast: Travel Tips",       titleAr:"بودكاست: نصائح السفر", dur:"4:12"},
    {titleEn:"News Excerpt: Technology",   titleAr:"مقطع أخبار: التكنولوجيا",dur:"1:45"},
  ];

  return(
    <div className="space-y-5">
      {/* Main clip */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] p-5 hover:border-[#b2dce4] hover:shadow-md transition-all" style={{animation:"cardIn .4s both"}}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-[#1e293b]">{t("Main Listening Clip","المقطع الصوتي الرئيسي")}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Natural conversation at native speed","محادثة طبيعية بسرعة الناطق الأصلي")}</p>
          </div>
          <span className="text-xs font-bold text-[#94a3b8] bg-[#F8FAFC] border border-[#F1F5F9] px-2.5 py-1 rounded-full">3:20</span>
        </div>
        {/* Waveform mock */}
        <div className="flex items-center gap-1 h-12 mb-4">
          {Array.from({length:40}).map((_,i)=>(
            <div key={i} className="flex-1 rounded-full transition-all duration-100"
              style={{
                height:`${20+Math.sin(i*0.6)*30}%`,
                backgroundColor: (i/40)*100<progress?"#107789":"#E2E8F0",
                minHeight:4,
              }}/>
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full bg-[#107789]" style={{width:`${progress}%`,transition:"width .15s"}}/>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-[#94a3b8] font-mono">{Math.floor(progress*2/100)}:{String(Math.floor((progress*200/100)%60)).padStart(2,"0")}</span>
          <span className="text-[10px] text-[#94a3b8] font-mono">3:20</span>
        </div>
        <button onClick={togglePlay}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
          style={{backgroundColor:"#107789"}}>
          {playing?(
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>{t("Pause","إيقاف مؤقت")}</>
          ):(
            <>{I.play}{t("Play Clip","تشغيل المقطع")}</>
          )}
        </button>
      </div>

      {/* Other clips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CLIPS.map((clip,i)=>(
          <div key={i} className="rounded-2xl bg-white border border-[#F1F5F9] p-4 flex items-center gap-3 hover:border-[#b2dce4] hover:shadow-sm transition-all cursor-pointer active:scale-[.98]"
            style={{animation:`cardIn .4s ${0.1+i*0.08}s both`}}>
            <div className="w-10 h-10 rounded-xl bg-[#d1fae5] flex items-center justify-center text-[#059669] flex-shrink-0">{I.sound}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?clip.titleAr:clip.titleEn}</p>
              <p className="text-[10px] text-[#94a3b8] font-mono">{clip.dur}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Practice / Quiz Section ──────────────────────────────────
function PracticeSection({lang,t,onXPEarned}:{lang:string;t:(a:string,b:string)=>string;onXPEarned:(xp:number)=>void}){
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [quizState,setQuizState]=useState<QuizState>("idle");
  const [score,setScore]=useState(0);
  const [answers,setAnswers]=useState<(number|null)[]>(Array(QUIZ_QUESTIONS.length).fill(null));

  const q=QUIZ_QUESTIONS[qIdx];
  const options=lang==="ar"?q.optionsAr:q.options;
  const question=lang==="ar"?q.qAr:q.q;
  const answered=answers[qIdx]!==null;

  const handleSelect=(idx:number)=>{
    if(answered||quizState==="result") return;
    setSelected(idx);
    const newAnswers=[...answers]; newAnswers[qIdx]=idx; setAnswers(newAnswers);
    if(idx===q.correct) setScore(s=>s+1);
  };

  const handleNext=()=>{
    if(qIdx<QUIZ_QUESTIONS.length-1){setQIdx(i=>i+1);setSelected(null);}
    else{setQuizState("result");onXPEarned(Math.round((score/(QUIZ_QUESTIONS.length))*40));}
  };

  const handleRestart=()=>{setQIdx(0);setSelected(null);setScore(0);setQuizState("idle");setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));};

  if(quizState==="idle"||quizState==="answering"){
    const pct=Math.round((qIdx/QUIZ_QUESTIONS.length)*100);
    return(
      <div className="space-y-5" style={{animation:"cardIn .4s both"}}>
        {/* Quiz header */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#1e293b]">{t("Quiz","اختبار")} · {qIdx+1}/{QUIZ_QUESTIONS.length}</p>
            <span className="text-xs font-bold text-[#d97706]">+{Math.round(1/(QUIZ_QUESTIONS.length)*40)} XP {t("per correct","لكل صحيح")}</span>
          </div>
          <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-5">
            <div className="h-full rounded-full bg-[#d97706] transition-all duration-500" style={{width:`${pct}%`}}/>
          </div>
          {/* Question */}
          <p className="text-base font-bold text-[#1e293b] mb-5 leading-relaxed">{question}</p>
          {/* Options */}
          <div className="space-y-3">
            {options.map((opt,i)=>{
              const sel=answers[qIdx];
              const isSelected=sel===i;
              const isCorrect=i===q.correct;
              const showResult=sel!==null;
              let bg="#F8FAFC", border="#F1F5F9", color="#1e293b";
              if(showResult){
                if(isCorrect){bg="#d1fae5";border="#6ee7b7";color="#059669";}
                else if(isSelected&&!isCorrect){bg="#fee2e2";border="#fca5a5";color="#ef4444";}
              } else if(isSelected){bg="#EBF5F7";border="#b2dce4";color="#107789";}
              return(
                <button key={i} onClick={()=>handleSelect(i)}
                  className="w-full text-start px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-[.98]"
                  style={{backgroundColor:bg,borderColor:border,color}}>
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                      style={{backgroundColor:isSelected||showResult&&isCorrect?"#107789":"#E2E8F0",color:isSelected||showResult&&isCorrect?"white":"#64748b"}}>
                      {String.fromCharCode(65+i)}
                    </span>
                    {opt}
                    {showResult&&isCorrect&&<span className="ms-auto text-[#059669]">{I.check}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        {answers[qIdx]!==null&&(
          <button onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:"#107789",animation:"slideUp .3s both"}}>
            {qIdx<QUIZ_QUESTIONS.length-1?t("Next Question","السؤال التالي"):t("See Results","عرض النتائج")}
            {I.chevR}
          </button>
        )}
      </div>
    );
  }

  // Result screen
  const pct2=Math.round((score/QUIZ_QUESTIONS.length)*100);
  return(
    <div className="rounded-2xl bg-white border border-[#F1F5F9] p-8 text-center space-y-5" style={{animation:"cardIn .4s both"}}>
      <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl"
        style={{backgroundColor:pct2>=70?"#d1fae5":"#fef3c7"}}>
        {pct2>=70?"🎉":"📚"}
      </div>
      <div>
        <p className="text-3xl font-black text-[#1e293b]">{pct2}%</p>
        <p className="text-sm text-[#94a3b8] mt-1">{score}/{QUIZ_QUESTIONS.length} {t("correct answers","إجابات صحيحة")}</p>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef3c7]">
        <span className="text-[#d97706]">{I.zap}</span>
        <span className="text-sm font-black text-[#d97706]">+{Math.round((score/QUIZ_QUESTIONS.length)*40)} XP {t("earned","مكتسبة")}</span>
      </div>
      <button onClick={handleRestart}
        className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
        style={{backgroundColor:"#107789"}}>
        {t("Try Again","المحاولة مجدداً")}
      </button>
    </div>
  );
}

// ─── Homework Section ─────────────────────────────────────────
function HomeworkSection({lang,t,onXPEarned}:{lang:string;t:(a:string,b:string)=>string;onXPEarned:(xp:number)=>void}){
  const [answers,setAnswers]=useState<string[]>(Array(HW_QUESTIONS.length).fill(""));
  const [hwState,setHWState]=useState<HWState>("idle");

  const handleSubmit=()=>{
    if(answers.some(a=>a.trim().length<10)){return;}
    setHWState("submitted");
    onXPEarned(30);
  };

  if(hwState==="submitted"){
    return(
      <div className="rounded-2xl bg-white border border-[#F1F5F9] p-8 text-center space-y-4" style={{animation:"cardIn .4s both"}}>
        <div className="w-16 h-16 rounded-full bg-[#d1fae5] mx-auto flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className="text-xl font-black text-[#1e293b]">{t("Homework Submitted!","تم تسليم الواجب!")}</p>
        <p className="text-sm text-[#94a3b8]">{t("Your teacher will review and provide feedback.","سيراجع معلمك ويقدم تغذية راجعة.")}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef3c7]">
          <span className="text-[#d97706]">{I.zap}</span>
          <span className="text-sm font-black text-[#d97706]">+30 XP {t("earned","مكتسبة")}</span>
        </div>
      </div>
    );
  }

  return(
    <div className="space-y-5" style={{animation:"cardIn .4s both"}}>
      <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex items-start gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-xs text-[#d97706] font-medium">{t("Complete all questions before submitting. Minimum 10 characters per answer.","أكمل جميع الأسئلة قبل التسليم. 10 أحرف على الأقل لكل إجابة.")}</p>
      </div>

      {HW_QUESTIONS.map((hw,i)=>(
        <div key={i} className="rounded-2xl bg-white border border-[#F1F5F9] p-5 hover:border-[#b2dce4] transition-all"
          style={{animation:`cardIn .4s ${i*0.1}s both`}}>
          <div className="flex items-start gap-3 mb-4">
            <span className="w-7 h-7 rounded-xl bg-[#fef3c7] flex items-center justify-center text-sm font-black text-[#d97706] flex-shrink-0">{i+1}</span>
            <p className="text-sm font-semibold text-[#1e293b] leading-relaxed">{lang==="ar"?hw.qAr:hw.q}</p>
          </div>
          <textarea
            rows={4}
            value={answers[i]}
            onChange={e=>{ const a=[...answers]; a[i]=e.target.value; setAnswers(a); }}
            placeholder={lang==="ar"?hw.placeholderAr:hw.placeholder}
            className="w-full px-4 py-3 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all resize-none"
            dir={lang==="ar"?"rtl":"ltr"}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-[#94a3b8]">{answers[i].length} {t("chars","حرف")}</span>
            {answers[i].length>=10&&<span className="text-[10px] font-semibold text-[#059669] flex items-center gap-1">{I.check}{t("Ready","جاهز")}</span>}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
        style={{backgroundColor:"#107789"}}>
        {t("Submit Answers","تسليم الإجابات")}
        {I.arrow}
      </button>
    </div>
  );
}

// ─── AI Practice Section ──────────────────────────────────────
function AISection({lang,isRTL,t}:{lang:string;isRTL:boolean;t:(a:string,b:string)=>string}){
  const [msgs,setMsgs]=useState<{role:"user"|"ai";text:string}[]>([
    {role:"ai", text:lang==="ar"?"مرحبًا! أنا مساعدك الذكي لتدريب المحادثة. دعنا نتدرب على التدفق الطبيعي. ابدأ بإخباري عن يومك بالإنجليزية.":"Hi! I'm your AI speaking coach. Let's practice natural flow. Start by telling me about your day in English!"},
  ]);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);

  const SUGGESTIONS=lang==="ar"?["أخبرني بجملة مع discourse marker","كيف أتجنب كلمات الحشو؟","دربني على سؤال ذيل"]:["Give me a sentence with a discourse marker","How do I avoid filler words?","Practice a tag question with me"];

  const send=(text:string)=>{
    if(!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]);
    setInput(""); setTyping(true);
    setTimeout(()=>{
      const replies=lang==="ar"?[
        "رائع! لاحظت أنك استخدمت 'moreover' — هذا مثال ممتاز على discourse marker. حاول الآن ربط فكرة أخرى!",
        "جيد جداً! لتجنب كلمات الحشو، خذ نفساً قصيراً بدلاً منها. جرّب جملة أخرى بدون 'um' أو 'uh'.",
        "ممتاز! لاحظت طلاقة في كلامك. استمر في التدريب وستصل للمستوى C1!",
      ]:[
        "Great job! I noticed you used 'moreover' — that's a perfect discourse marker. Try linking another idea!",
        "Nice! To avoid filler words, take a short pause instead. Try another sentence without 'um' or 'uh'.",
        "Excellent! I noticed good fluency there. Keep practicing and you'll reach C1 level!",
      ];
      setMsgs(m=>[...m,{role:"ai",text:replies[Math.floor(Math.random()*replies.length)]}]);
      setTyping(false);
    },1500);
  };

  return(
    <div className="space-y-4" style={{animation:"cardIn .4s both"}}>
      {/* Chat window */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0369a1]">{I.robot}</div>
          <div>
            <p className="text-sm font-bold text-[#1e293b]">{t("AI Speaking Coach","مدرب الكلام الذكي")}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"/>
              <p className="text-[10px] text-[#059669] font-semibold">{t("Online","متصل")}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 min-h-48 max-h-72 overflow-y-auto">
          {msgs.map((m,i)=>(
            <div key={i} className={`flex ${m.role==="user"?(isRTL?"justify-start":"justify-end"):(isRTL?"justify-end":"justify-start")}`}
              style={{animation:"slideUp .25s ease both"}}>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  backgroundColor:m.role==="user"?"#107789":"#F8FAFC",
                  color:m.role==="user"?"white":"#1e293b",
                  borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                }}>
                {m.text}
              </div>
            </div>
          ))}
          {typing&&(
            <div className={`flex ${isRTL?"justify-end":"justify-start"}`}>
              <div className="bg-[#F8FAFC] rounded-2xl px-4 py-3 flex items-center gap-1">
                {[0,1,2].map(i=><span key={i} className="w-2 h-2 rounded-full bg-[#94a3b8] animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-5 py-3 border-t border-[#F8FAFC] flex flex-wrap gap-2">
          {SUGGESTIONS.map((s,i)=>(
            <button key={i} onClick={()=>send(s)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#E2E8F0] text-[#64748b] hover:bg-[#EBF5F7] hover:text-[#107789] hover:border-[#b2dce4] active:scale-95 transition-all">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pb-5">
          <div className="flex gap-2 mt-2">
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);} }}
              placeholder={t("Type your response in English…","اكتب ردك بالإنجليزية…")}
              className="flex-1 px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all"/>
            <button onClick={()=>send(input)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
              style={{backgroundColor:"#107789"}}>
              {I.arrow}
            </button>
          </div>
        </div>
      </div>

      {/* Voice practice CTA */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] p-5 flex items-center gap-4 hover:border-[#b2dce4] hover:shadow-sm transition-all">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] flex-shrink-0">{I.mic}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1e293b]">{t("Voice Practice Mode","وضع التدريب الصوتي")}</p>
          <p className="text-xs text-[#94a3b8] mt-0.5">{t("Speak and get instant pronunciation feedback","تكلم واحصل على تغذية راجعة فورية للنطق")}</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-bold text-[#107789] border border-[#107789]/30 hover:bg-[#EBF5F7] active:scale-95 transition-all flex-shrink-0">
          {t("Try it","جرّبه")}
        </button>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function LearningPage(){
  const {lang,isRTL,t}=useLanguage();

  const [activeSection,setActiveSection]=useState<SectionKey>("vocabulary");
  const [completed,setCompleted]=useState<Set<SectionKey>>(new Set());
  const [totalXP,setTotalXP]=useState(0);
  const [toast,setToast]=useState<string|null>(null);

  const fire=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),3500); };

  const handleSectionComplete=(key:SectionKey)=>{
    if(!completed.has(key)){
      setCompleted(p=>new Set([...p,key]));
    }
  };

  const handleXPEarned=(xp:number)=>{
    setTotalXP(p=>p+xp);
    fire(t(`+${xp} XP earned! Great work!`,`+${xp} نقطة مكتسبة! عمل رائع!`));
  };

  const activeCfg=SECTION_CFG[activeSection];
  const progressPct=Math.round(((completed.size)/SECTION_ORDER.length)*100);

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Lesson Header ── */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)",animation:"cardIn .4s both"}}>
          <div className="relative p-5 sm:p-6">
            <div className="absolute -top-8 -end-8 w-44 h-44 rounded-full opacity-10 bg-white pointer-events-none"/>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white" style={{backgroundColor:"rgba(255,255,255,0.15)"}}>
                    {t("Level","المستوى")} {LESSON.level}
                  </span>
                  <span className="text-[10px] text-white/60 font-medium">
                    {t("Lesson","الدرس")} {LESSON.number}/{LESSON.total}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1">
                  {lang==="ar"?LESSON.titleAr:LESSON.titleEn}
                </h1>
                <p className="text-xs text-white/60">{lang==="ar"?LESSON.unitAr:LESSON.unitEn}</p>
              </div>

              {/* XP earned this session */}
              {totalXP>0&&(
                <div className="flex-shrink-0 rounded-2xl bg-white/10 px-4 py-3 text-center" style={{animation:"fadeIn .4s both"}}>
                  <p className="text-2xl font-black text-[#d97706]">+{totalXP}</p>
                  <p className="text-[10px] text-white/60 font-semibold">XP {t("earned","مكتسبة")}</p>
                </div>
              )}
            </div>

            {/* Lesson progress */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/60">
                <span>{t("Lesson Progress","تقدم الدرس")}</span>
                <span>{completed.size}/{SECTION_ORDER.length} {t("sections","أقسام")}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full"
                  style={{width:`${progressPct}%`,background:"linear-gradient(90deg,#E8763A,#f59e0b)",transition:"width .7s ease"}}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Navigation ── */}
        <div className="flex gap-2 flex-wrap" style={{animation:"cardIn .4s .15s both"}}>
          {SECTION_ORDER.map((key,i)=>{
            const cfg=SECTION_CFG[key];
            const isActive=activeSection===key;
            const isDone=completed.has(key);
            return(
              <button key={key} onClick={()=>{setActiveSection(key);handleSectionComplete(key);}}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={isActive
                  ?{backgroundColor:cfg.color,color:"white",boxShadow:`0 2px 12px ${cfg.color}40`}
                  :{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}
                >
                <span style={{color:isActive?"white":cfg.color}}>{cfg.icon}</span>
                {lang==="ar"?cfg.ar:cfg.en}
                {isDone&&!isActive&&<span className="w-4 h-4 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">{I.check}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Section Content Card ── */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
          style={{animation:"cardIn .4s .2s cubic-bezier(.34,1.2,.64,1) both"}}>
          {/* Section header */}
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:activeCfg.bg}}>
              <span style={{color:activeCfg.color}}>{activeCfg.icon}</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">{lang==="ar"?activeCfg.ar:activeCfg.en}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                {activeSection==="vocabulary"&&t("6 key words to master","6 كلمات رئيسية لإتقانها")}
                {activeSection==="grammar"&&t("3 grammar rules","3 قواعد نحوية")}
                {activeSection==="listening"&&t("Native speed audio clips","مقاطع صوتية بسرعة الناطق الأصلي")}
                {activeSection==="practice"&&t("3-question quiz","اختبار من 3 أسئلة")}
                {activeSection==="ai"&&t("AI-powered conversation practice","تدريب محادثة بالذكاء الاصطناعي")}
              </p>
            </div>
            <div className="ms-auto flex-shrink-0">
              {completed.has(activeSection)?(
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#059669] bg-[#d1fae5] px-3 py-1 rounded-full">
                  {I.check}{t("Completed","مكتمل")}
                </span>
              ):(
                <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-3 py-1 rounded-full">
                  +{LESSON.xpReward} XP
                </span>
              )}
            </div>
          </div>

          {/* Section body */}
          <div className="p-5">
            {activeSection==="vocabulary"&&<VocabularySection lang={lang} t={t}/>}
            {activeSection==="grammar"&&<GrammarSection lang={lang} t={t}/>}
            {activeSection==="listening"&&<ListeningSection lang={lang} t={t}/>}
            {activeSection==="practice"&&<PracticeSection lang={lang} t={t} onXPEarned={xp=>{handleSectionComplete("practice");handleXPEarned(xp);}}/>}
            {activeSection==="ai"&&<AISection lang={lang} isRTL={isRTL} t={t}/>}
          </div>

          {/* Section nav footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
            <button
              onClick={()=>{const i=SECTION_ORDER.indexOf(activeSection);if(i>0){setActiveSection(SECTION_ORDER[i-1]);}}}
              disabled={activeSection===SECTION_ORDER[0]}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              {isRTL?null:I.chevL}{t("Previous","السابق")}{isRTL?I.chevR:null}
            </button>
            <div className="flex gap-1.5">
              {SECTION_ORDER.map(k=>(
                <div key={k} className="w-2 h-2 rounded-full transition-all"
                  style={{backgroundColor:activeSection===k?"#107789":completed.has(k)?"#059669":"#E2E8F0"}}/>
              ))}
            </div>
            <button
              onClick={()=>{
                handleSectionComplete(activeSection);
                const i=SECTION_ORDER.indexOf(activeSection);
                if(i<SECTION_ORDER.length-1){setActiveSection(SECTION_ORDER[i+1]);}
                else{handleXPEarned(LESSON.xpReward);}
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#107789"}}>
              {activeSection===SECTION_ORDER[SECTION_ORDER.length-1]?t("Complete Lesson","إنهاء الدرس"):t("Next Section","القسم التالي")}
              {isRTL?I.chevL:I.chevR}
            </button>
          </div>
        </div>

      </main>

      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}