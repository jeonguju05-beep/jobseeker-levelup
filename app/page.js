"use client";

import { useEffect, useRef, useState } from "react";

const SERVICE_NAME = "인생 게임";
const EXP_PER_LEVEL = 100;

// 레벨 구간별 성장 단계 (LV1~10 알 → LV10~40 부화 과정 → LV40+ 병아리 → 이후 새로 성장)
const STAGES = [
  { min: 1, label: "취준생", emoji: "🥚", visual: "egg" },
  { min: 10, label: "부화 중", emoji: "🐣", visual: "eggEyes" },
  { min: 20, label: "다리 쏘옥", emoji: "🐤", visual: "eggLegs" },
  { min: 30, label: "거의 다 나옴", emoji: "🐥", visual: "eggHatching" },
  { min: 40, label: "병아리 등장", emoji: "🐦", visual: "chick" },
  { min: 50, label: "좌충우돌", emoji: "🪶" },
  { min: 60, label: "안정 비행 연습", emoji: "🕊️" },
  { min: 70, label: "방향 찾기", emoji: "🕊️" },
  { min: 80, label: "멋진 비행", emoji: "🦅" },
  { min: 90, label: "완성", emoji: "🏆" },
];

function getStage(level) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (level >= s.min) stage = s;
  }
  return stage;
}

// 디지몬 알 느낌의 신비로운 무늬가 있는 알 (LV1~9 취준생 단계 전용, 이모지 대신 사용)
function EggIcon({ className }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="eggShell" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#e8dcc0" />
          <stop offset="55%" stopColor="#c9b990" />
          <stop offset="100%" stopColor="#8a7a58" />
        </radialGradient>
      </defs>
      {/* 실제 공룡알처럼 길쭉한 타원 + 돌/화석 질감의 자연스러운 얼룩 */}
      <ellipse cx="50" cy="68" rx="42" ry="58" fill="url(#eggShell)" />
      <ellipse
        cx="35"
        cy="42"
        rx="7"
        ry="5"
        fill="#7c6a45"
        opacity="0.4"
        transform="rotate(20 35 42)"
      />
      <ellipse
        cx="63"
        cy="55"
        rx="6"
        ry="4"
        fill="#5f5236"
        opacity="0.35"
        transform="rotate(-15 63 55)"
      />
      <ellipse
        cx="45"
        cy="82"
        rx="8"
        ry="5"
        fill="#7c6a45"
        opacity="0.35"
        transform="rotate(10 45 82)"
      />
      <ellipse cx="30" cy="97" rx="5" ry="4" fill="#5f5236" opacity="0.3" />
      <ellipse cx="68" cy="92" rx="6" ry="4" fill="#7c6a45" opacity="0.3" />
      <ellipse cx="52" cy="30" rx="4" ry="3" fill="#5f5236" opacity="0.3" />
      <circle cx="40" cy="60" r="1.3" fill="#5f5236" opacity="0.4" />
      <circle cx="58" cy="70" r="1.1" fill="#5f5236" opacity="0.4" />
      <circle cx="46" cy="95" r="1.2" fill="#5f5236" opacity="0.4" />
      <circle cx="62" cy="40" r="1" fill="#5f5236" opacity="0.4" />
      <circle cx="30" cy="70" r="1" fill="#5f5236" opacity="0.4" />
      <ellipse cx="34" cy="34" rx="11" ry="16" fill="white" opacity="0.18" />
      {/* 서서히 금이 가는 잔금 */}
      <path
        d="M42 24 L47 38 L39 46 L46 58"
        fill="none"
        stroke="#5f5236"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M58 96 L63 106 L55 112"
        fill="none"
        stroke="#5f5236"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

// LV10~20: 껍질이 갈라진 틈 사이로 눈이 보이는 알
function EggEyesIcon({ className }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="eggShell2" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#e8dcc0" />
          <stop offset="55%" stopColor="#c9b990" />
          <stop offset="100%" stopColor="#8a7a58" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="72" rx="42" ry="54" fill="url(#eggShell2)" />
      <ellipse cx="45" cy="82" rx="8" ry="5" fill="#7c6a45" opacity="0.35" />
      <ellipse cx="66" cy="95" rx="6" ry="4" fill="#5f5236" opacity="0.3" />
      <ellipse cx="32" cy="95" rx="5" ry="4" fill="#7c6a45" opacity="0.3" />
      {/* 위쪽이 깨져서 벌어진 어두운 틈 */}
      <path d="M20 34 Q50 14 80 34 Q66 28 50 28 Q34 28 20 34 Z" fill="#3f3626" />
      {/* 튀어나온 껍질 파편 */}
      <path d="M18 36 L30 14 L38 30 Z" fill="#c9b990" />
      <path d="M82 36 L70 14 L62 30 Z" fill="#c9b990" />
      {/* 틈 사이로 보이는 눈 두 개 */}
      <circle cx="41" cy="30" r="4.5" fill="#1c1917" />
      <circle cx="59" cy="30" r="4.5" fill="#1c1917" />
      <circle cx="42.5" cy="28.3" r="1.3" fill="white" />
      <circle cx="60.5" cy="28.3" r="1.3" fill="white" />
    </svg>
  );
}

// LV20~30: 껍질 아래로 다리가 쏙 나온 상태
function EggLegsIcon({ className }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="eggShell3" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#e8dcc0" />
          <stop offset="55%" stopColor="#c9b990" />
          <stop offset="100%" stopColor="#8a7a58" />
        </radialGradient>
      </defs>
      {/* 다리 */}
      <rect x="38" y="98" width="5" height="16" rx="2" fill="#f59e0b" />
      <rect x="57" y="98" width="5" height="16" rx="2" fill="#f59e0b" />
      <path d="M35 114 L40 114 L44 120 L34 120 Z" fill="#ea580c" />
      <path d="M54 114 L59 114 L63 120 L53 120 Z" fill="#ea580c" />
      {/* 몸통은 아직 껍질 안 */}
      <ellipse cx="50" cy="62" rx="40" ry="50" fill="url(#eggShell3)" />
      <ellipse cx="35" cy="40" rx="7" ry="5" fill="#7c6a45" opacity="0.4" />
      <ellipse cx="63" cy="52" rx="6" ry="4" fill="#5f5236" opacity="0.35" />
      <ellipse cx="45" cy="76" rx="8" ry="5" fill="#7c6a45" opacity="0.35" />
    </svg>
  );
}

// LV30~40: 팔다리와 머리까지 다 나오고, 깨진 껍질 조각만 남은 상태
function EggHatchingIcon({ className }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      {/* 아래쪽 남은 껍질 */}
      <path
        d="M20 92 Q18 118 50 116 Q82 118 80 92 Q78 78 50 76 Q22 78 20 92 Z"
        fill="#c9b990"
      />
      {/* 다리 */}
      <rect x="40" y="104" width="5" height="14" rx="2" fill="#f59e0b" />
      <rect x="55" y="104" width="5" height="14" rx="2" fill="#f59e0b" />
      <path d="M37 118 L42 118 L46 124 L36 124 Z" fill="#ea580c" />
      <path d="M52 118 L57 118 L61 124 L51 124 Z" fill="#ea580c" />
      {/* 몸통 */}
      <ellipse cx="50" cy="80" rx="26" ry="26" fill="#fde68a" />
      {/* 날개 */}
      <ellipse
        cx="26"
        cy="82"
        rx="8"
        ry="12"
        fill="#fbbf24"
        transform="rotate(-20 26 82)"
      />
      <ellipse
        cx="74"
        cy="82"
        rx="8"
        ry="12"
        fill="#fbbf24"
        transform="rotate(20 74 82)"
      />
      {/* 머리 */}
      <circle cx="50" cy="46" r="22" fill="#fde68a" />
      {/* 부리 */}
      <path d="M42 50 L58 50 L50 60 Z" fill="#f97316" />
      {/* 눈 */}
      <circle cx="41" cy="42" r="3.2" fill="#1c1917" />
      <circle cx="59" cy="42" r="3.2" fill="#1c1917" />
      {/* 위쪽 깨진 껍질 파편 */}
      <path d="M28 24 L40 8 L44 26 Z" fill="#c9b990" />
      <path d="M72 24 L60 8 L56 26 Z" fill="#c9b990" />
    </svg>
  );
}

// LV40~50: 완전히 부화한 병아리
function ChickIcon({ className }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      {/* 다리 */}
      <rect x="40" y="104" width="5" height="16" rx="2" fill="#f59e0b" />
      <rect x="55" y="104" width="5" height="16" rx="2" fill="#f59e0b" />
      <path d="M37 118 L42 118 L46 124 L36 124 Z" fill="#ea580c" />
      <path d="M52 118 L57 118 L61 124 L51 124 Z" fill="#ea580c" />
      {/* 몸통 */}
      <ellipse cx="50" cy="82" rx="30" ry="30" fill="#fde68a" />
      {/* 날개 */}
      <ellipse
        cx="24"
        cy="84"
        rx="9"
        ry="14"
        fill="#fbbf24"
        transform="rotate(-20 24 84)"
      />
      <ellipse
        cx="76"
        cy="84"
        rx="9"
        ry="14"
        fill="#fbbf24"
        transform="rotate(20 76 84)"
      />
      {/* 머리 */}
      <circle cx="50" cy="42" r="24" fill="#fde68a" />
      {/* 볏 */}
      <path
        d="M46 16 Q50 6 54 16 Q52 20 50 18 Q48 20 46 16 Z"
        fill="#f97316"
      />
      {/* 부리 */}
      <path d="M40 46 L60 46 L50 58 Z" fill="#f97316" />
      {/* 눈 */}
      <circle cx="40" cy="38" r="3.5" fill="#1c1917" />
      <circle cx="60" cy="38" r="3.5" fill="#1c1917" />
      <circle cx="41.3" cy="36.3" r="1" fill="white" />
      <circle cx="61.3" cy="36.3" r="1" fill="white" />
    </svg>
  );
}

const STAGE_VISUALS = {
  egg: EggIcon,
  eggEyes: EggEyesIcon,
  eggLegs: EggLegsIcon,
  eggHatching: EggHatchingIcon,
  chick: ChickIcon,
};

// stage.visual이 있으면 해당 SVG로, 없으면 그냥 이모지로 표시
function StageVisual({ stage, className }) {
  const VisualComponent = STAGE_VISUALS[stage.visual];
  if (VisualComponent) return <VisualComponent className={className} />;
  return <span className={className}>{stage.emoji}</span>;
}

function levelFromExp(exp) {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function todayKey() {
  return dateKey(new Date());
}

function todayLabel() {
  return new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function formatClock(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

// 마감일 관리용 ISO 날짜(YYYY-MM-DD, <input type="date">와 동일한 포맷)
function isoDate(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function todayIso() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysUntil(dateStr) {
  const diff = (new Date(dateStr) - new Date(todayIso())) / 86400000;
  return Math.round(diff);
}

// 달력 그리드용 셀 배열 생성(빈 칸=null), 일요일 시작
function buildMonthCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const DEFAULT_PROFILE = {
  jobSignature: null, // 마우스로 직접 적은 목표 직업 서명 (canvas dataURL)
  rewardsOnboarded: false, // 서명 후 보상 설정을 한 번이라도 거쳤는지
  exp: 0,
  levelUpReward: "유튜브 30분 보기",
  quest3Reward: "",
  dungeonReward: "",
  battleReward: "",
  trainingReward: "",
  quest3RewardedDate: null,
  lastActiveDate: null,
  comfortRewardedDate: null,
};

// 돌발미션: 눌렀을 때 랜덤으로 뽑히는 기분전환 퀘스트 풀
const SURPRISE_QUESTS = [
  "오늘 감사한 일 3가지 적어보기",
  "명언 필사하기",
  "스트레칭 하기",
  "할 수 있다 3번 외치기",
];

// 미션 완료 시 캐릭터가 말풍선으로 건네는 위로/응원 한마디 (랜덤)
const COMFORT_MESSAGES = [
  "수고했어! 🥚",
  "응원하고 있어!",
  "잘하고 있네!",
  "쓰담쓰담~",
  "오늘도 해냈다!",
  "포기 안 하는 것만으로도 대단해",
  "한 걸음씩 잘 가고 있어",
  "충분히 잘하고 있어",
];

// 미션 유형(hunt 제외)별 표시 스타일: 카드 테두리 / 체크박스 / EXP 뱃지 / 이름 앞 아이콘
// 미션 유형은 이제 카드 왼쪽 색 띠 + 아이콘/뱃지로만 구분하고,
// 카드 전체 배경/테두리 색은 우선순위(PRIORITY_META)가 담당한다.
const MISSION_TYPE_META = {
  general: {
    leftAccent: "border-l-cyan-400",
    checkboxIdle: "border-cyan-400/50 bg-black/25 text-transparent",
    badge: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
    prefix: "",
  },
  dungeon: {
    leftAccent: "border-l-amber-400",
    checkboxIdle: "border-amber-400/60 bg-black/25 text-transparent",
    badge: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    prefix: "🏰 ",
  },
  surprise: {
    leftAccent: "border-l-violet-400",
    checkboxIdle: "border-violet-400/60 bg-black/25 text-transparent",
    badge: "border-violet-400/40 bg-violet-500/10 text-violet-300",
    prefix: "🎲 ",
  },
  battle: {
    leftAccent: "border-l-rose-400",
    checkboxIdle: "border-rose-400/60 bg-black/25 text-transparent",
    badge: "border-rose-400/40 bg-rose-500/10 text-rose-300",
    prefix: "⚔️ ",
  },
};

// 미션 우선순위: 정렬 순서(rank가 작을수록 위) + 뱃지 색 + 카드 전체 배경/테두리 색
// (급할수록 빨갛고 진하게, 여유로울수록 옅고 차분하게)
const PRIORITY_META = {
  urgent: {
    label: "급함",
    rank: 0,
    badge: "border-rose-400/50 bg-rose-500/15 text-rose-300",
    cardBg:
      "border-rose-400/50 bg-rose-500/15 shadow-[0_0_18px_rgba(244,63,94,0.3)]",
  },
  today: {
    label: "당일",
    rank: 1,
    badge: "border-orange-400/50 bg-orange-500/15 text-orange-300",
    cardBg: "border-orange-400/40 bg-orange-500/10",
  },
  tomorrow: {
    label: "내일",
    rank: 2,
    badge: "border-amber-400/50 bg-amber-500/15 text-amber-300",
    cardBg: "border-amber-400/30 bg-amber-500/10",
  },
  week: {
    label: "이번주",
    rank: 3,
    badge: "border-cyan-400/50 bg-cyan-500/15 text-cyan-300",
    cardBg: "border-cyan-400/30 bg-cyan-500/8",
  },
  month: {
    label: "이번달",
    rank: 4,
    badge: "border-slate-400/50 bg-slate-500/15 text-slate-300",
    cardBg: "border-slate-400/20 bg-slate-500/5",
  },
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 일정관리 탭의 달력: 마감일이 있는 날짜에 점 표시
function CalendarView({ monthDate, onChangeMonth, deadlines }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const cells = buildMonthCells(monthDate);
  const today = todayIso();

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
      <HudCorners />
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => onChangeMonth(-1)}
          className="rounded-lg border border-cyan-400/30 px-2.5 py-1 text-cyan-300"
          aria-label="이전 달"
        >
          ◀
        </button>
        <p className="font-display text-sm tracking-wide text-cyan-100">
          {year}. {pad2(month + 1)}
        </p>
        <button
          onClick={() => onChangeMonth(1)}
          className="rounded-lg border border-cyan-400/30 px-2.5 py-1 text-cyan-300"
          aria-label="다음 달"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="h-10" />;
          const cellIso = isoDate(year, month, day);
          const isToday = cellIso === today;
          const hasDeadline = deadlines.some((d) => d.date === cellIso);
          return (
            <div
              key={i}
              className={`relative flex h-10 flex-col items-center justify-center rounded-lg text-xs ${
                isToday
                  ? "border border-cyan-300/70 bg-cyan-500/10 font-bold text-cyan-100"
                  : "text-slate-300"
              }`}
            >
              {day}
              {hasDeadline && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// SF HUD 느낌의 모서리 브래킷 장식 — relative 부모 안에 넣으면 네 귀퉁이에 붙는다
function HudCorners({ variant = "md", tone = "cyan" }) {
  const size = variant === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";
  const toneColor =
    tone === "amber"
      ? "border-amber-300/80"
      : tone === "rose"
        ? "border-rose-300/80"
        : "border-cyan-300/80";
  const common = `pointer-events-none absolute ${size} ${toneColor}`;
  return (
    <>
      <span className={`${common} -left-px -top-px border-l-2 border-t-2`} />
      <span className={`${common} -right-px -top-px border-r-2 border-t-2`} />
      <span className={`${common} -left-px -bottom-px border-l-2 border-b-2`} />
      <span className={`${common} -right-px -bottom-px border-r-2 border-b-2`} />
    </>
  );
}

// EXP 게이지 안에 얇은 구분선을 깔아 HUD 계기판처럼 분절된 느낌을 줌
function GaugeSegments({ count = 10 }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1 border-r border-black/40 last:border-r-0"
        />
      ))}
    </div>
  );
}

// 배경 그리드 + 네온 글로우 블롭 (공통 배경 레이어)
function FuturisticBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,_#0b1230_0%,_#05060f_60%,_#000000_100%)]">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[110px]" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px]" />
    </div>
  );
}

// 목표 직업을 마우스로 직접 적는 서명 패드 (네온 홀로그램 스타일)
function SignaturePad({ onConfirm }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function startDraw(e) {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function moveDraw(e) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.strokeStyle = "#67e8f9";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  }

  function endDraw() {
    drawingRef.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setHasDrawn(false);
  }

  function confirm() {
    if (!hasDrawnRef.current) return;
    onConfirm(canvasRef.current.toDataURL("image/png"));
  }

  return (
    <div className="relative min-h-screen">
      <FuturisticBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-4 py-10">
        <div className="text-center">
          <h1 className="font-display text-3xl tracking-[0.15em] text-cyan-100 [text-shadow:0_0_18px_rgba(34,211,238,0.7)]">
            {SERVICE_NAME}
          </h1>
          <p className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-relaxed text-cyan-50 backdrop-blur-2xl">
            <HudCorners variant="sm" />
            ✦ 목표로 하는 직업을 마우스로 직접 적어주세요.
            <br />
            잘 쓰지 않아도 괜찮아요
            <br />
            각오를 다짐하며 서명하듯 눌러 담아보세요.
          </p>
        </div>

        <div className="relative">
          <HudCorners />
          <canvas
            ref={canvasRef}
            width={600}
            height={280}
            className="h-56 w-full touch-none rounded-2xl border border-cyan-400/40 bg-slate-950/80 shadow-[0_0_30px_rgba(34,211,238,0.15),inset_0_0_40px_rgba(0,0,0,0.5)]"
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={clear}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400"
          >
            다시 쓰기
          </button>
          <button
            onClick={confirm}
            disabled={!hasDrawn}
            className="flex-[2] rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_20px_rgba(34,211,238,0.45)] transition disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
          >
            서명 완료, 다음으로 ▶
          </button>
        </div>
      </div>
    </div>
  );
}

// 서명 다음 단계: 최종 목표(직업)를 정했으니, 완료했을 때 받을 보상을 미리 정해두는 온보딩 화면
function RewardSetup({ profile, onChangeReward, onDone }) {
  const fields = [
    {
      key: "levelUpReward",
      label: "레벨업 보상",
      placeholder: "예: 유튜브 30분 보기",
    },
    {
      key: "quest3Reward",
      label: "일일퀘스트 3개 달성 보상",
      placeholder: "예: 좋아하는 디저트 먹기",
    },
    {
      key: "dungeonReward",
      label: "던전 클리어 보상",
      placeholder: "예: 넷플릭스 1시간",
    },
    {
      key: "battleReward",
      label: "격투 신청 보상",
      placeholder: "예: 좋아하는 음료 마시기",
    },
    {
      key: "trainingReward",
      label: "수련 목표시간 클리어 보상",
      placeholder: "예: 산책 30분",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <FuturisticBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-4 py-10">
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-[0.1em] text-cyan-100 [text-shadow:0_0_18px_rgba(34,211,238,0.7)]">
            🎯 목표 설정
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-cyan-100/80">
            마지막으로, 미션을 클리어했을 때 나에게 줄 보상을 정해볼까요?
            <br />
            비워두면 그 항목은 그냥 생략돼요. 나중에 언제든 다시 바꿀 수 있어요.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
          <HudCorners />
          <div className="flex flex-col gap-3">
            {fields.map((f) => (
              <label key={f.key} className="text-[11px] text-slate-400">
                {f.label}
                <input
                  value={profile[f.key]}
                  onChange={(e) => onChangeReward(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onDone}
          className="rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-3 font-display text-sm tracking-wide text-white shadow-[0_0_20px_rgba(34,211,238,0.45)] transition"
        >
          투두리스트 시작하기 ▶
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [missions, setMissions] = useState([]);
  const [levelUpMsg, setLevelUpMsg] = useState("");
  const [penaltyMsg, setPenaltyMsg] = useState("");
  const [rewardPopup, setRewardPopup] = useState(null); // { id, exp }
  const [giftQueue, setGiftQueue] = useState([]); // [{ id, label, reward, opened }]
  const [comfortMsg, setComfortMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("general");
  const [newTargetMinutes, setNewTargetMinutes] = useState(10);
  const [newPriority, setNewPriority] = useState("today");

  // AI 피드백 (던전/격투신청 미션 카드에서 자소서·답변 붙여넣고 피드백 받기)
  const [feedbackTarget, setFeedbackTarget] = useState(null); // { id, content }
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackResult, setFeedbackResult] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // AI 추천 미션 (일정관리의 마감일을 컨텍스트로 오늘의 미션 제안)
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestResult, setSuggestResult] = useState("");
  const [suggestError, setSuggestError] = useState("");

  const [activeTab, setActiveTab] = useState("home");
  const [deadlines, setDeadlines] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [newDeadlineTitle, setNewDeadlineTitle] = useState("");
  const [newDeadlineDate, setNewDeadlineDate] = useState("");

  const prevLevelRef = useRef(1);
  const prevAllDoneRef = useRef(false);
  const missionsKey = `missions_${todayKey()}`;

  // 최초 로드: localStorage에서 불러오기 (브라우저에서만 동작)
  // + 00시가 지나도록 오늘의 미션을 다 못 끝낸 날이 있으면 그날 미완료 미션만큼 EXP를 깎는다
  useEffect(() => {
    try {
      const savedProfileRaw = localStorage.getItem("profile");
      const savedMissionsRaw = localStorage.getItem(missionsKey);
      const parsedProfile = savedProfileRaw
        ? { ...DEFAULT_PROFILE, ...JSON.parse(savedProfileRaw) }
        : DEFAULT_PROFILE;

      let penalty = 0;
      let missedDays = 0;
      if (parsedProfile.lastActiveDate) {
        const cursor = parseDateKey(parsedProfile.lastActiveDate);
        while (dateKey(cursor) !== todayKey()) {
          const dayRaw = localStorage.getItem(`missions_${dateKey(cursor)}`);
          if (dayRaw) {
            const dayMissions = JSON.parse(dayRaw);
            const incomplete = dayMissions.filter((m) => !m.isDone);
            if (incomplete.length > 0) {
              penalty += incomplete.reduce(
                (sum, m) => sum + (m.expValue || 10),
                0
              );
              missedDays += 1;
            }
          }
          cursor.setDate(cursor.getDate() + 1);
        }
      }
      parsedProfile.exp = Math.max(0, parsedProfile.exp - penalty);
      parsedProfile.lastActiveDate = todayKey();
      setProfile(parsedProfile);

      if (penalty > 0) {
        setPenaltyMsg(
          `${missedDays}일 동안 못 끝낸 미션이 있어서 -${penalty} EXP 됐어요`
        );
      }

      const loadedMissions = savedMissionsRaw ? JSON.parse(savedMissionsRaw) : [];
      if (savedMissionsRaw) setMissions(loadedMissions);

      const savedDeadlinesRaw = localStorage.getItem("deadlines");
      if (savedDeadlinesRaw) setDeadlines(JSON.parse(savedDeadlinesRaw));

      prevLevelRef.current = levelFromExp(parsedProfile.exp);
      // 이전 세션에서 이미 다 완료해둔 상태로 불러왔다면 "방금 완료"로 오인해 다시 축하하지 않도록 초기화
      prevAllDoneRef.current =
        loadedMissions.length > 0 && loadedMissions.every((m) => m.isDone);
    } catch (e) {
      console.error("불러오기 실패", e);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 저장 (로컬스토리지) — 최초 로드가 끝난 뒤부터만 저장
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(missionsKey, JSON.stringify(missions));
  }, [missions, loaded, missionsKey]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines, loaded]);

  function queueGift(label, reward) {
    if (!reward) return; // 해당 항목에 설정된 보상이 없으면 선물 상자는 띄우지 않음
    setGiftQueue((q) => [
      ...q,
      { id: crypto.randomUUID(), label, reward, opened: false },
    ]);
  }

  function openCurrentGift() {
    setGiftQueue((q) => q.map((g, i) => (i === 0 ? { ...g, opened: true } : g)));
  }

  function closeCurrentGift() {
    setGiftQueue((q) => q.slice(1));
  }

  // 레벨업 감지 (최초 로드가 끝나기 전의 기본값(exp:0) 렌더에서는 판단하지 않음)
  useEffect(() => {
    if (!loaded) return;
    const level = levelFromExp(profile.exp);
    if (level > prevLevelRef.current) {
      const stage = getStage(level);
      setLevelUpMsg(`LV UP! LV.${level} · ${stage.label}`);
      queueGift("레벨업 선물", profile.levelUpReward);
      prevLevelRef.current = level;
      const t = setTimeout(() => setLevelUpMsg(""), 2500);
      return () => clearTimeout(t);
    }
    prevLevelRef.current = level;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.exp, loaded]);

  // 오늘 미션 3개를 처음 달성한 순간 감지 (날짜별로 한 번만)
  useEffect(() => {
    if (!loaded) return;
    const doneCount = missions.filter((m) => m.isDone).length;
    if (doneCount >= 3 && profile.quest3RewardedDate !== todayKey()) {
      queueGift("일일퀘스트 3개 달성 선물", profile.quest3Reward);
      setProfile((p) => ({ ...p, quest3RewardedDate: todayKey() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions, loaded]);

  // 오늘의 미션을 전부 완료한 "순간"에만 한 번 위로 문구를 띄움 (계속 떠있는 배너가 아님)
  useEffect(() => {
    if (!loaded) return;
    const nowAllDone = missions.length > 0 && missions.every((m) => m.isDone);
    if (nowAllDone && !prevAllDoneRef.current) {
      setComfortMsg("수고했어, 오늘도!");
    }
    prevAllDoneRef.current = nowAllDone;
  }, [missions, loaded]);

  // 페널티 안내 배너는 일정 시간 뒤 자동으로 닫힘
  useEffect(() => {
    if (!penaltyMsg) return;
    const t = setTimeout(() => setPenaltyMsg(""), 6000);
    return () => clearTimeout(t);
  }, [penaltyMsg]);

  function showComfort() {
    setComfortMsg(
      COMFORT_MESSAGES[Math.floor(Math.random() * COMFORT_MESSAGES.length)]
    );
  }

  // missions/profile 최신값을 인터벌 콜백에서 읽기 위한 ref (setInterval 클로저의 stale state 방지)
  const missionsRef = useRef(missions);
  useEffect(() => {
    missionsRef.current = missions;
  }, [missions]);

  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // 사냥 타이머: 1초마다 running 중인 미션의 경과시간 증가 + 20분(1200초)당 5exp 적립
  useEffect(() => {
    const timer = setInterval(() => {
      // setState 업데이트 함수 안에서 다른 setState를 호출하면 개발 모드(Strict Mode)에서
      // 함수가 두 번 실행되어 EXP가 두 배로 적립되므로, 계산은 밖에서 순수하게 하고
      // setMissions/setProfile은 결과값으로 한 번씩만 호출한다.
      let expGain = 0;
      const next = missionsRef.current.map((m) => {
        if (m.type !== "hunt" || !m.running) return m;
        const elapsed = m.elapsedSeconds + 1;
        if (elapsed % 240 === 0) expGain += 1; // 240초(4분)마다 1exp = 20분당 5exp
        const targetReached =
          m.targetMinutes && elapsed >= m.targetMinutes * 60;
        if (targetReached && !m.isDone) {
          // 수련 목표 시간을 막 채운 순간 → 선물 상자 대기열에 추가
          queueGift("수련 목표 클리어 선물", profileRef.current.trainingReward);
        }
        return {
          ...m,
          elapsedSeconds: elapsed,
          running: targetReached ? false : m.running,
          isDone: targetReached ? true : m.isDone,
        };
      });
      setMissions(next);
      if (expGain > 0) {
        setProfile((p) => ({ ...p, exp: p.exp + expGain }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function addMission() {
    if (!newContent.trim()) return;
    const mission = {
      id: crypto.randomUUID(),
      content: newContent.trim(),
      type: newType,
      isDone: false,
      expValue: newType === "dungeon" ? 30 : newType === "battle" ? 10 : 10,
      targetMinutes: newType === "hunt" ? Number(newTargetMinutes) || 0 : null,
      elapsedSeconds: 0,
      running: false,
      expClaimed: false,
      priority: newPriority,
    };
    setMissions((prev) => [...prev, mission]);
    setNewContent("");
  }

  function drawSurpriseMission() {
    if (missions.some((m) => m.type === "surprise")) return; // 하루 한 번만
    const content =
      SURPRISE_QUESTS[Math.floor(Math.random() * SURPRISE_QUESTS.length)];
    const mission = {
      id: crypto.randomUUID(),
      content,
      type: "surprise",
      isDone: false,
      expValue: 15,
      targetMinutes: null,
      elapsedSeconds: 0,
      running: false,
      expClaimed: false,
      priority: "today",
    };
    setMissions((prev) => [...prev, mission]);
  }

  function toggleGeneralDone(id) {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;
    const nextDone = !mission.isDone;

    if (nextDone) {
      // 체크만 먼저 반영하고, EXP는 보상 알림창에서 "받기"를 눌러야 지급된다
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isDone: true } : m))
      );
      setRewardPopup({ id, exp: mission.expValue });
      return;
    }

    // 체크 해제: 이미 받은 보상이었다면 회수
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isDone: false, expClaimed: false } : m
      )
    );
    if (mission.expClaimed) {
      setProfile((p) => ({
        ...p,
        exp: Math.max(0, p.exp - mission.expValue),
      }));
    }
    if (rewardPopup?.id === id) setRewardPopup(null);
  }

  function claimReward() {
    if (!rewardPopup) return;
    const { id, exp } = rewardPopup;
    const mission = missions.find((m) => m.id === id);
    setProfile((p) => ({ ...p, exp: p.exp + exp }));
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, expClaimed: true } : m))
    );
    setRewardPopup(null);
    if (profile.comfortRewardedDate !== todayKey()) {
      showComfort();
      setProfile((p) => ({ ...p, comfortRewardedDate: todayKey() }));
    }
    if (mission?.type === "dungeon") {
      queueGift("던전 클리어 선물", profile.dungeonReward);
    }
    if (mission?.type === "battle") {
      queueGift("격투 신청 선물", profile.battleReward);
    }
  }

  function toggleHuntRunning(id) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, running: !m.running } : m))
    );
  }

  function toggleHuntDone(id) {
    const mission = missions.find((m) => m.id === id);
    if (mission && !mission.isDone) showComfort();
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isDone: !m.isDone } : m))
    );
  }

  function removeMission(id) {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  }

  function openFeedback(mission) {
    setFeedbackTarget({ id: mission.id, content: mission.content });
    setFeedbackText("");
    setFeedbackResult("");
  }

  function closeFeedback() {
    setFeedbackTarget(null);
  }

  async function submitFeedback() {
    if (!feedbackText.trim() || !feedbackTarget) return;
    setFeedbackLoading(true);
    setFeedbackResult("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionContent: feedbackTarget.content,
          userText: feedbackText,
        }),
      });
      const data = await res.json();
      setFeedbackResult(
        res.ok ? data.content : `⚠️ ${data.error || "요청에 실패했어요."}`
      );
    } catch (e) {
      setFeedbackResult(`⚠️ 네트워크 오류: ${e.message}`);
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function requestSuggestion() {
    setSuggestLoading(true);
    setSuggestError("");
    setSuggestResult("");
    try {
      const upcoming = [...deadlines]
        .map((d) => ({ ...d, dday: daysUntil(d.date) }))
        .filter((d) => d.dday >= 0)
        .sort((a, b) => a.dday - b.dday)
        .slice(0, 3);
      const res = await fetch("/api/suggest-mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadlines: upcoming,
          level: levelFromExp(profile.exp),
          stageLabel: getStage(levelFromExp(profile.exp)).label,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청에 실패했어요.");
      setSuggestResult(data.content);
    } catch (e) {
      setSuggestError(e.message);
    } finally {
      setSuggestLoading(false);
    }
  }

  function useSuggestion() {
    setNewContent(suggestResult);
    setSuggestResult("");
  }

  function addDeadline() {
    if (!newDeadlineTitle.trim() || !newDeadlineDate) return;
    setDeadlines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newDeadlineTitle.trim(),
        date: newDeadlineDate,
      },
    ]);
    setNewDeadlineTitle("");
    setNewDeadlineDate("");
  }

  function removeDeadline(id) {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  }

  function changeCalendarMonth(delta) {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
  }

  function handleSignatureConfirm(dataUrl) {
    setProfile((p) => ({ ...p, jobSignature: dataUrl }));
  }

  function resignJob() {
    setProfile((p) => ({ ...p, jobSignature: null }));
  }

  function handleRewardChange(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function finishRewardOnboarding() {
    setProfile((p) => ({ ...p, rewardsOnboarded: true }));
  }

  // 아직 로드 전이면 화면 깜빡임 방지를 위해 빈 배경만 표시
  if (!loaded) {
    return (
      <div className="relative min-h-screen">
        <FuturisticBackdrop />
      </div>
    );
  }

  // 목표 직업을 아직 서명하지 않았다면 온보딩(서명) 화면부터
  if (!profile.jobSignature) {
    return <SignaturePad onConfirm={handleSignatureConfirm} />;
  }

  // 서명을 마쳤어도 보상 설정을 아직 안 거쳤다면 투두리스트보다 먼저 보여준다
  if (!profile.rewardsOnboarded) {
    return (
      <RewardSetup
        profile={profile}
        onChangeReward={handleRewardChange}
        onDone={finishRewardOnboarding}
      />
    );
  }

  const level = levelFromExp(profile.exp);
  const expIntoLevel = profile.exp % EXP_PER_LEVEL;
  const progressPercent = Math.min(100, (expIntoLevel / EXP_PER_LEVEL) * 100);
  const stage = getStage(level);
  const hasSurpriseToday = missions.some((m) => m.type === "surprise");
  // 레벨이 오를수록 배경 서명이 점점 또렷해지다가, 완성(LV90+)에서 완전히 선명해진다
  const signatureOpacity =
    level >= 90 ? 1 : Math.min(0.85, 0.08 + (level - 1) * 0.01);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FuturisticBackdrop />

      {/* 목표 직업 서명 워터마크 (배경, 네온 홀로그램) */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.jobSignature}
          alt="내가 직접 적은 목표 직업 서명"
          className="w-4/5 max-w-sm transition-opacity duration-700"
          style={{
            opacity: signatureOpacity,
            filter: "drop-shadow(0 0 25px rgba(34,211,238,0.6))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-3 py-5">
        {/* 헤더 */}
        <header className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-[0_0_20px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
          <HudCorners />
          <h1 className="font-display text-base tracking-[0.1em] text-cyan-100 [text-shadow:0_0_10px_rgba(34,211,238,0.6)]">
            {SERVICE_NAME}
          </h1>
          <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-200">
            {todayLabel()}
          </span>
        </header>

        {/* 미션 미완료 페널티 안내 */}
        {penaltyMsg && (
          <div className="rounded-2xl border border-rose-500/50 bg-rose-950/60 p-3 text-center text-sm font-bold text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
            📉 {penaltyMsg}
          </div>
        )}

        {/* 캐릭터 상태창 (HUD) */}
        <section className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_25px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
          <HudCorners />
          <div className="flex items-center gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-slate-950/80 text-3xl shadow-[0_0_18px_rgba(34,211,238,0.5)]">
              <span className="absolute -inset-1.5 rounded-full border border-dashed border-cyan-400/40 [animation:spin_6s_linear_infinite]" />
              <StageVisual stage={stage} className="h-11 w-11" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-violet-600 px-2 py-0.5 font-display text-[11px] text-white shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                LV{level}
              </span>
              {levelUpMsg && (
                <div className="animate-pop-in absolute inset-x-0 -top-8 mx-auto w-max -translate-x-1/2 left-1/2 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1 font-display text-xs whitespace-nowrap text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                  {levelUpMsg}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-display text-sm tracking-wide text-cyan-50">
                LV.{level} {stage.label}
              </p>
              <div className="relative mt-1.5 h-3.5 w-full overflow-hidden rounded-md border border-cyan-400/30 bg-slate-950/80 shadow-inner">
                <div
                  className="relative h-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30" />
                </div>
                <GaugeSegments />
              </div>
              <p className="mt-0.5 text-right font-display text-[11px] tracking-wide text-cyan-300/80">
                누적 EXP {profile.exp} (다음 LV까지 {expIntoLevel}/{EXP_PER_LEVEL})
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={() => setShowSettings(true)}
              className="shrink-0 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-semibold text-slate-300"
            >
              ✦ 목표설정
            </button>
          </div>
        </section>


        {/* 탭 전환: 일일퀘스트 / 일정관리 */}
        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-2xl">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 rounded-xl py-2 font-display text-sm tracking-wide transition ${
              activeTab === "home"
                ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-slate-400"
            }`}
          >
            ⚔️ 일일퀘스트
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 rounded-xl py-2 font-display text-sm tracking-wide transition ${
              activeTab === "schedule"
                ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-slate-400"
            }`}
          >
            📅 일정관리
          </button>
        </div>

        {/* 오늘의 미션 — 메인 콘텐츠 */}
        {activeTab === "home" && (
        <section>
          <h2 className="mb-2 flex items-center gap-1.5 font-display text-lg tracking-wide text-cyan-100 [text-shadow:0_0_12px_rgba(34,211,238,0.5)]">
            ◈ 일일퀘스트
          </h2>

          <div className="relative mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
            <HudCorners />
            <div className="flex flex-col gap-2">
              <input
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMission()}
                placeholder="예: 이력서 자기소개서 1문항 작성"
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50"
                >
                  <option value="general">사냥 (오늘 할일)</option>
                  <option value="hunt">수련 (타이머)</option>
                  <option value="dungeon">던전 (면접실전/자격증 시험)</option>
                  <option value="battle">격투 신청 (입사지원/대외활동/공모전 신청)</option>
                </select>
                {newType === "hunt" && (
                  <input
                    type="number"
                    min={1}
                    value={newTargetMinutes}
                    onChange={(e) => setNewTargetMinutes(e.target.value)}
                    className="w-20 rounded-xl border border-white/10 bg-black/25 px-2 py-2 text-sm text-cyan-50"
                  />
                )}
                {newType === "hunt" && (
                  <span className="text-xs text-cyan-300/70">분 목표</span>
                )}
              </div>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50"
              >
                {Object.entries(PRIORITY_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    ⏱ {meta.label}
                  </option>
                ))}
              </select>
              <button
                onClick={addMission}
                className="rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)] transition"
              >
                + 미션 추가
              </button>
            </div>
          </div>

          <div className="relative mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
            <HudCorners />
            <button
              onClick={requestSuggestion}
              disabled={suggestLoading}
              className="w-full rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)] transition disabled:opacity-60"
            >
              {suggestLoading
                ? "🤖 마감일 확인하는 중..."
                : "🤖 AI추천 특급퀘스트"}
            </button>
            {suggestError && (
              <p className="mt-2 text-xs text-rose-300">⚠️ {suggestError}</p>
            )}
            {suggestResult && (
              <div className="mt-3 rounded-xl border border-cyan-400/30 bg-black/25 p-3">
                <p className="text-sm text-cyan-50">{suggestResult}</p>
                <button
                  onClick={useSuggestion}
                  className="mt-2 rounded-full border border-cyan-300/50 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-200"
                >
                  이 문구로 미션 등록하기
                </button>
              </div>
            )}
          </div>

          <button
            onClick={drawSurpriseMission}
            disabled={hasSurpriseToday}
            className={`mb-3 w-full rounded-xl border border-dashed px-4 py-2.5 font-display text-sm tracking-wide transition ${
              hasSurpriseToday
                ? "cursor-not-allowed border-slate-600 bg-slate-800/40 text-slate-500"
                : "border-violet-400/50 bg-violet-500/10 text-violet-200 shadow-[0_0_15px_rgba(167,139,250,0.25)] hover:bg-violet-500/20"
            }`}
          >
            {hasSurpriseToday
              ? "🎲 오늘의 돌발미션은 이미 뽑았어요"
              : "🎲 돌발미션 뽑기 (+15 EXP)"}
          </button>

          <div className="flex flex-col gap-2 pb-4">
            {missions.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center text-sm text-cyan-200/70">
                아직 오늘의 미션이 없어요. 위에서 추가해보세요!
              </p>
            )}
            {[...missions]
              .sort(
                (a, b) =>
                  (PRIORITY_META[a.priority]?.rank ?? 5) -
                  (PRIORITY_META[b.priority]?.rank ?? 5)
              )
              .map((m) => {
              const meta = MISSION_TYPE_META[m.type] || MISSION_TYPE_META.general;
              const priorityMeta = PRIORITY_META[m.priority];
              // 완료된 미션은 불 꺼진 듯 어둡게, 아니면 우선순위 색으로 카드 전체를 물들인다
              const cardTone = m.isDone
                ? "border-slate-700/50 bg-black/20"
                : priorityMeta?.cardBg || "border-white/10 bg-white/[0.04]";
              const leftAccent = m.isDone
                ? "border-l-slate-600"
                : m.type === "hunt"
                  ? "border-l-fuchsia-400"
                  : meta.leftAccent;
              return (
              <div
                key={m.id}
                className={`flex items-center gap-3 rounded-2xl border border-l-[6px] p-3 shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-colors ${cardTone} ${leftAccent} ${
                  m.isDone ? "opacity-55" : ""
                }`}
              >
                {m.type === "hunt" ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-fuchsia-400/50 bg-black/25 text-base">
                    📚
                  </span>
                ) : (
                  <button
                    onClick={() => toggleGeneralDone(m.id)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      m.isDone
                        ? "border-emerald-400 bg-emerald-500/80 text-white shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                        : meta.checkboxIdle
                    }`}
                  >
                    ✓
                  </button>
                )}

                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      m.isDone
                        ? "text-emerald-300 line-through"
                        : "text-cyan-50"
                    }`}
                  >
                    {m.type !== "hunt" && meta.prefix}
                    {m.content}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {priorityMeta && (
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 font-display text-[11px] tracking-wide ${priorityMeta.badge}`}
                      >
                        {priorityMeta.label}
                      </span>
                    )}
                    {m.type === "hunt" ? (
                      <p className="text-xs text-slate-400">
                        {formatClock(m.elapsedSeconds)}
                        {m.targetMinutes
                          ? ` / 목표 ${m.targetMinutes}분`
                          : ""}{" "}
                        ·{" "}
                        <span className="font-display text-fuchsia-300">
                          20분당 +5 EXP
                        </span>
                      </p>
                    ) : (
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 font-display text-[11px] tracking-wide ${meta.badge}`}
                      >
                        +{m.expValue} EXP
                      </span>
                    )}
                  </div>
                </div>

                {m.type === "hunt" && (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => toggleHuntRunning(m.id)}
                      className={`rounded-lg border px-3 py-1 text-xs font-bold text-white ${
                        m.running
                          ? "border-rose-400/60 bg-rose-500/90 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                          : "border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      }`}
                    >
                      {m.running ? "정지" : "수련 시작"}
                    </button>
                    <button
                      onClick={() => toggleHuntDone(m.id)}
                      className={`rounded-lg border px-2 py-1 text-xs font-bold ${
                        m.isDone
                          ? "border-emerald-400/50 text-emerald-300"
                          : "border-cyan-400/30 text-cyan-300"
                      }`}
                    >
                      완료
                    </button>
                  </div>
                )}

                {(m.type === "dungeon" || m.type === "battle") && (
                  <button
                    onClick={() => openFeedback(m)}
                    className="shrink-0 rounded-lg border border-cyan-300/50 bg-cyan-500/10 px-2 py-1 text-[11px] font-bold text-cyan-200"
                  >
                    🤖 AI 피드백
                  </button>
                )}

                <button
                  onClick={() => removeMission(m.id)}
                  className="shrink-0 text-slate-500 hover:text-rose-400"
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
              );
            })}
          </div>
        </section>
        )}

        {/* 일정관리 — 달력 + 마감일 */}
        {activeTab === "schedule" && (
        <section>
          <h2 className="mb-2 flex items-center gap-1.5 font-display text-lg tracking-wide text-cyan-100 [text-shadow:0_0_12px_rgba(34,211,238,0.5)]">
            📅 일정관리
          </h2>

          <div className="mb-3">
            <CalendarView
              monthDate={calendarMonth}
              onChangeMonth={changeCalendarMonth}
              deadlines={deadlines}
            />
          </div>

          <div className="relative mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
            <HudCorners />
            <div className="flex flex-col gap-2">
              <input
                value={newDeadlineTitle}
                onChange={(e) => setNewDeadlineTitle(e.target.value)}
                placeholder="예: OO기업 서류 마감"
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
              <input
                type="date"
                value={newDeadlineDate}
                onChange={(e) => setNewDeadlineDate(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
              <button
                onClick={addDeadline}
                className="rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)] transition"
              >
                + 마감일 추가
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-4">
            {deadlines.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center text-sm text-cyan-200/70">
                등록된 마감일이 없어요. 위에서 추가해보세요!
              </p>
            )}
            {[...deadlines]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((d) => {
                const diff = daysUntil(d.date);
                const isPast = diff < 0;
                const isUrgent = !isPast && diff <= 3;
                const label = isPast
                  ? "마감 지남"
                  : diff === 0
                    ? "D-DAY"
                    : `D-${diff}`;
                return (
                  <div
                    key={d.id}
                    className={`flex items-center justify-between rounded-2xl border p-3 shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-2xl ${
                      isPast
                        ? "border-slate-700 bg-slate-900/40 opacity-50"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-cyan-50">
                        {d.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {d.date}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 font-display text-[11px] tracking-wide ${
                          isUrgent
                            ? "border-rose-400/50 bg-rose-500/10 text-rose-300"
                            : "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                        }`}
                      >
                        {label}
                      </span>
                      <button
                        onClick={() => removeDeadline(d.id)}
                        className="text-slate-500 hover:text-rose-400"
                        aria-label="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
        )}

        <p className="pb-2 text-center text-[11px] text-slate-500">
          지금은 이 브라우저의 로컬 저장소에만 저장돼요. (추후 Supabase 연동 예정)
        </p>
      </div>

      {/* 미션 완료 보상 알림창 */}
      {rewardPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in relative w-full max-w-xs rounded-2xl border border-cyan-300/50 bg-slate-900/70 p-6 backdrop-blur-2xl text-center shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <HudCorners />
            <p className="font-display text-base tracking-wide text-cyan-100">
              🎉 미션 완료!
            </p>
            <p className="mt-3 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text font-display text-3xl text-transparent">
              +{rewardPopup.exp} EXP
            </p>
            <button
              onClick={claimReward}
              className="mt-5 w-full rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)] transition"
            >
              받기
            </button>
          </div>
        </div>
      )}

      {/* 위로 말풍선: 알 캐릭터가 화면 중앙에 크게 나와 흔들리며 위로해줌 (클릭하면 닫힘) */}
      {comfortMsg && (
        <div
          onClick={() => setComfortMsg("")}
          role="button"
          aria-label="닫기"
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-5 bg-black/75 p-4"
        >
          <div className="flex flex-col items-center">
            <div className="animate-pop-in relative mb-1 max-w-[85vw] rounded-2xl border border-rose-300/60 bg-rose-50 px-6 py-3 text-center font-display text-xl text-rose-600 shadow-lg">
              <HudCorners variant="sm" tone="rose" />
              {comfortMsg}
              {/* 말풍선 꼬리: 알 캐릭터 쪽(아래)을 향하도록 */}
              <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[11px] border-t-[16px] border-x-transparent border-t-rose-300/60" />
              <span className="absolute left-1/2 top-full -mt-px h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[13px] border-x-transparent border-t-rose-50" />
            </div>
            <div className="animate-shake mt-3 drop-shadow-[0_0_40px_rgba(244,63,94,0.55)]">
              <StageVisual stage={stage} className="h-40 w-40 text-[7rem] leading-none" />
            </div>
          </div>
          <p className="text-xs text-slate-400">탭하면 닫혀요</p>
        </div>
      )}

      {/* 선물 상자: 레벨업 / 일일퀘스트 3개 달성 / 던전 / 격투신청 보상을 순서대로 하나씩 보여줌 */}
      {giftQueue[0] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in relative w-full max-w-xs rounded-2xl border border-amber-300/50 bg-slate-900/70 p-6 backdrop-blur-2xl text-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
            <HudCorners tone="amber" />
            {!giftQueue[0].opened ? (
              <>
                <p className="font-display text-base tracking-wide text-amber-100">
                  🎉 {giftQueue[0].label}이 도착했어요!
                </p>
                <button
                  onClick={openCurrentGift}
                  aria-label="선물 상자 열기"
                  className="mt-5 text-7xl transition hover:scale-110"
                >
                  🎁
                </button>
                <p className="mt-3 text-xs text-amber-200/70">
                  눌러서 열어보세요
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-base tracking-wide text-amber-100">
                  🎁 선물 개봉!
                </p>
                <div className="mt-3 rounded-xl border-2 border-dashed border-amber-300/60 bg-amber-500/10 p-4">
                  <p className="font-display text-lg text-amber-200">
                    {giftQueue[0].reward}
                  </p>
                  <p className="mt-1 text-[11px] tracking-wide text-amber-300/60">
                    이용권
                  </p>
                </div>
                <button
                  onClick={closeCurrentGift}
                  className="mt-5 w-full rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 font-display text-sm tracking-wide text-white shadow-[0_0_18px_rgba(251,191,36,0.4)] transition"
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI 피드백: 던전/격투신청 미션에서 자소서·답변 붙여넣고 Solar 피드백 받기 */}
      {feedbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in relative w-full max-w-sm rounded-2xl border border-cyan-300/50 bg-slate-900/80 p-5 shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-2xl">
            <HudCorners />
            <h3 className="font-display text-base tracking-wide text-cyan-100">
              🤖 AI 피드백
            </h3>
            <p className="mt-1 text-xs text-slate-400">{feedbackTarget.content}</p>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="자소서 문장이나 예상 면접 답변을 붙여넣어주세요"
              rows={5}
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            />

            {feedbackResult && (
              <div className="mt-3 max-h-60 overflow-y-auto rounded-xl border border-cyan-400/30 bg-black/25 p-3 text-sm whitespace-pre-wrap text-cyan-50">
                {feedbackResult}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={closeFeedback}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md"
              >
                닫기
              </button>
              <button
                onClick={submitFeedback}
                disabled={feedbackLoading || !feedbackText.trim()}
                className="flex-1 rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-2 font-display text-xs tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {feedbackLoading ? "받아오는 중..." : "피드백 받기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 설정: 목표 직업 재서명 + 보상 항목별 설정 */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-2xl">
            <HudCorners />
            <h3 className="font-display text-base tracking-wide text-cyan-100">
              ⚙️ 설정
            </h3>

            <p className="mt-4 text-xs font-semibold text-cyan-300/80">
              🎁 보상 설정 (선물 상자에서 이 문구가 나와요)
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <label className="text-[11px] text-slate-400">
                레벨업 보상
                <input
                  value={profile.levelUpReward}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      levelUpReward: e.target.value,
                    }))
                  }
                  placeholder="예: 유튜브 30분 보기"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
              <label className="text-[11px] text-slate-400">
                일일퀘스트 3개 달성 보상
                <input
                  value={profile.quest3Reward}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      quest3Reward: e.target.value,
                    }))
                  }
                  placeholder="예: 좋아하는 디저트 먹기"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
              <label className="text-[11px] text-slate-400">
                던전 클리어 보상
                <input
                  value={profile.dungeonReward}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      dungeonReward: e.target.value,
                    }))
                  }
                  placeholder="예: 넷플릭스 1시간"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
              <label className="text-[11px] text-slate-400">
                격투 신청 보상
                <input
                  value={profile.battleReward}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      battleReward: e.target.value,
                    }))
                  }
                  placeholder="예: 좋아하는 음료 마시기"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
              <label className="text-[11px] text-slate-400">
                수련 목표시간 클리어 보상
                <input
                  value={profile.trainingReward}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      trainingReward: e.target.value,
                    }))
                  }
                  placeholder="예: 산책 30분"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={resignJob}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-3 py-2 text-xs font-semibold text-slate-300"
              >
                ✍️ 목표 직업 다시 서명
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 rounded-xl border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-2 font-display text-xs tracking-wide text-white shadow-[0_0_18px_rgba(34,211,238,0.4)]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
