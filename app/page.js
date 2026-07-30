"use client";

import { useEffect, useRef, useState } from "react";

const SERVICE_NAME = "인생 게임";
const EXP_PER_LEVEL = 100;

// 레벨 구간별 성장 단계 (알 → 런닝+팬티 차림 → 한 겹씩 갖춰 입고 → 완전무장하고 전투 출정)
const STAGES = [
  { min: 1, label: "취준생", emoji: "🥚", visual: "eggCracked" },
  { min: 10, label: "쉬었음 취준생", emoji: "🐣", visual: "personUndies" },
  { min: 20, label: "노력하는 취준생", emoji: "🐤", visual: "personTee" },
  { min: 30, label: "열정있는 취준생", emoji: "🐥", visual: "personShorts" },
  { min: 40, label: "성장하는 취준생", emoji: "🐦", visual: "personArmorTop" },
  { min: 50, label: "잘 하고 있는 취준생", emoji: "🪶", visual: "personArmorLegs" },
  { min: 60, label: "포기하지 않는 취준생", emoji: "🕊️", visual: "personArmorBoots" },
  { min: 70, label: "백수 아니라 취준생", emoji: "🕊️", visual: "personHelmet" },
  { min: 80, label: "죽기 살기로 한다 취준생", emoji: "🦅", visual: "personSword" },
  { min: 90, label: "취준생 졸업반", emoji: "🏆", visual: "personBattleReady" },
];

function getStage(level) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (level >= s.min) stage = s;
  }
  return stage;
}

// LV1~9: 참고 이미지 그대로 사용 (알)
function EggCrackedIcon({ className }) {
  return (
    <img
      src="/characters/eggCracked.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV10~19: 참고 이미지 그대로 사용 (흰 런닝 + 줄무늬 반바지, 고민하는 포즈)
function PersonUndiesIcon({ className }) {
  return (
    <img
      src="/characters/personUndies.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// 부화 축하 연출 전용: LV10 단계 이미지를 그대로 재사용
function PersonHatchPoseIcon({ className }) {
  return (
    <img
      src="/characters/personHatch.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV20~29: 참고 이미지 그대로 사용 (빨간 티셔츠 + 줄무늬 반바지, 파이팅 포즈)
function PersonTeeIcon({ className }) {
  return (
    <img
      src="/characters/personTee.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV30~39: 참고 이미지 그대로 사용 (빨간 티셔츠 + 파란 반바지, 허리에 손)
function PersonShortsIcon({ className }) {
  return (
    <img
      src="/characters/personShorts.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV40~49: 참고 이미지 그대로 사용 (상의 갑옷 + 어깨보호대)
function PersonArmorTopIcon({ className }) {
  return (
    <img
      src="/characters/personArmorTop.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV50~59: 참고 이미지 그대로 사용 (전신 갑옷, 투구 전)
function PersonArmorLegsIcon({ className }) {
  return (
    <img
      src="/characters/personArmorLegs.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV60~69: 참고 이미지 그대로 사용 (투구 추가, 망토 전)
function PersonArmorBootsIcon({ className }) {
  return (
    <img
      src="/characters/personArmorBoots.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV70~79: 참고 이미지 그대로 사용 (투구 + 붉은 망토)
function PersonHelmetIcon({ className }) {
  return (
    <img
      src="/characters/personHelmet.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV80~89: 참고 이미지 그대로 사용 (전투 도끼 장착)
function PersonSwordIcon({ className }) {
  return (
    <img
      src="/characters/personSword.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV90+: 참고 이미지 그대로 사용 (금장 갑옷 + 전투 도끼 + 망토, 힘차게 달려나가는 모습)
// 문 챌린지 공격 중에는 문을 부수는 전용 이미지로 바꿔 보여준다
function PersonBattleReadyIcon({ className, attacking, swing }) {
  if (attacking) return <PersonDoorThrustIcon className={className} swing={swing} />;
  return (
    <img
      src="/characters/personBattleReady.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// LV90+ 문 챌린지 중: 평소에는 문 앞에 자세를 잡은 정지 이미지, 미션을 완료해 HIT이 들어가는
// 순간에는 자세 잡기 → 내려찍기로 이어지는 GIF가 "한 번만" 재생되고 마지막 프레임(내려찍는 순간)에서 멈춘다
// (GIF 자체에 반복 재생 정보가 없어 루프를 돌지 않는다). 스윙 상태가 끝나면 다시 정지 이미지로 되돌아간다.
function PersonDoorThrustIcon({ className, swing }) {
  return (
    <img
      key={swing ? "hit" : "ready"}
      src={swing ? "/characters/doorHit.gif" : "/characters/personDoorReady.png"}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// 문 챌린지 클리어(최종 합격) 축하 연출: 갑옷을 벗고 관복을 입은 채 벼슬을 받는 모습
function PersonGwanbokIcon({ className }) {
  return (
    <img
      src="/characters/personGwanbok.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

const STAGE_VISUALS = {
  eggCracked: EggCrackedIcon,
  personUndies: PersonUndiesIcon,
  personTee: PersonTeeIcon,
  personShorts: PersonShortsIcon,
  personArmorTop: PersonArmorTopIcon,
  personArmorLegs: PersonArmorLegsIcon,
  personArmorBoots: PersonArmorBootsIcon,
  personHelmet: PersonHelmetIcon,
  personSword: PersonSwordIcon,
  personBattleReady: PersonBattleReadyIcon,
};

// stage.visual이 있으면 해당 SVG로, 없으면 그냥 이모지로 표시
// door: 만렙(LV90) 이후 문 챌린지 중이면 뛰어가는 자세 대신 문을 찌르는 자세로 보여준다
function StageVisual({ stage, level, className, door, swing }) {
  const VisualComponent = STAGE_VISUALS[stage.visual];
  if (VisualComponent)
    return (
      <VisualComponent
        className={className}
        level={level}
        attacking={door}
        swing={swing}
      />
    );
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

// 미션 기간 설정(우선순위)에 따라 "미완료 페널티"를 주기 전에 봐줄 유예일수.
// 급함/당일은 그날 안에 끝내는 게 기본이라 유예 없음, 내일/이번주/이번달은 그만큼 여유를 준다.
function graceDaysForPriority(priority) {
  switch (priority) {
    case "tomorrow":
      return 1;
    case "week":
      return 6;
    case "month":
      return 29;
    default:
      return 0; // urgent, today
  }
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

// 일정관리(ISO, 0-패딩)에서 고른 날짜를 일일퀘스트 저장 키 포맷(dateKey, 0-패딩 없음)으로 변환
function missionKeyFromIso(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}-${m}-${d}`;
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
  door: null, // 만렙(LV90) 이후: { company, hp, maxHp } — 존재하는 동안은 EXP 대신 문 체력이 깎인다
};

// 만렙 이후 "문" 챌린지: 회사 하나당 이 정도 미션을 깨야 문이 부서진다
const DOOR_MAX_HP = 1000;
const DOOR_DAMAGE_PER_HIT = 100; // 미션 1건 완료 = 고정 100 데미지 (문 체력 1000 기준 10개면 클리어)
const DOOR_LEVEL = 90;

// 돌발미션: 눌렀을 때 랜덤으로 뽑히는 기분전환 퀘스트 풀
const SURPRISE_QUESTS = [
  "오늘 감사한 일 3가지 적어보기",
  "마음에 드는 명언 필사하기",
  "가볍게 스트레칭 하기",
  "할 수 있다 3번 외치기",
  "20초간 먼 곳 바라보며 눈 쉬기",
  "목과 어깨 천천히 돌리기",
  "물 한 잔 마시고 오기",
  "창문 열고 심호흡 3번 하기",
  "좋아하는 노래 한 곡 듣기",
  "손가락 10개 접었다가 펴기",
  "1분간 눈 감고 쉬기",
  "자리에서 일어나 기지개 켜기",
  "좋아하는 향 맡으며 잠깐 쉬기",
  "창밖 풍경 1분 바라보기",
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

// 오늘의 미션을 전부 완료한 순간에 건네는 축하 한마디 (랜덤 레퍼토리)
const DAY_COMPLETE_MESSAGES = [
  "수고했어, 오늘도!",
  "가보자고!",
  "잘하고 있어!",
  "고생많았어!",
  "화이팅!",
  "충분히 잘하고 있어!",
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
function CalendarView({ monthDate, onChangeMonth, deadlines, selectedDate, onSelectDate }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const cells = buildMonthCells(monthDate);
  const today = todayIso();

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
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
          const isSelected = cellIso === selectedDate;
          const hasDeadline = deadlines.some((d) => d.date === cellIso);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate?.(cellIso)}
              className={`relative flex h-10 flex-col items-center justify-center rounded-lg text-xs transition ${
                isSelected
                  ? "border border-cyan-300/80 bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-white shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : isToday
                    ? "border border-cyan-300/70 bg-cyan-500/10 font-bold text-cyan-100"
                    : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {day}
              {hasDeadline && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
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
    ctx.shadowBlur = 4;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    // 경로를 여기서 다시 시작해야 다음 구간에서 지금까지 그린 전체 선을 또 겹쳐 그리지 않는다.
    // 안 그러면 stroke()가 매번 시작점부터 누적된 경로 전체를 다시 그려서, 마우스를 천천히
    // 움직인 구간일수록 같은 자리를 여러 번 덧칠해 번지고 두께가 들쭉날쭉해 보인다.
    ctx.beginPath();
    ctx.moveTo(x, y);
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
            ✦ 목표로 하는 직업을 마우스로 직접 적어주세요.
            <br />
            잘 쓰지 않아도 괜찮아요
            <br />
            각오를 다짐하며 서명하듯 눌러 담아보세요.
          </p>
        </div>

        <div className="relative">
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
  // 지금 떠 있는 위로 메시지가 "방금 HIT" 반응인지 여부 (문 챌린지 중 애니메이션을 이 경우에만 보여주기 위함).
  // 오늘 마지막 미션을 완료하면 "미션 보상" 위로와 "오늘 전부 완료" 위로가 연달아 뜨는데,
  // 둘 다 같은 comfortMsg를 공유하다 보니 HIT 애니메이션도 두 번 재생되는 것처럼 보였다.
  const [comfortIsHit, setComfortIsHit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showCharacterZoom, setShowCharacterZoom] = useState(false);
  const [showHatchCelebration, setShowHatchCelebration] = useState(false);
  // 부화 연출 진행 단계: "egg"(흔들림) → "crack"(깨지는 순간 플래시) → "hatched"(캐릭터 등장)
  const [hatchPhase, setHatchPhase] = useState("egg");
  const [showDoorSetup, setShowDoorSetup] = useState(false);
  const [doorCompanyInput, setDoorCompanyInput] = useState("");
  const [showDoorBreak, setShowDoorBreak] = useState(false);
  // 문 챌린지 중 미션 완료(HIT)가 들어간 순간에만 잠깐 true가 되어
  // 도끼로 내려찍는 이미지로 스왑되는 "때리는" 애니메이션을 재생한다.
  const [doorSwing, setDoorSwing] = useState(false);
  const prevDoorRef = useRef(null);

  // 수련(hunt) 집중 모드: 큰 타이머로 화면을 꽉 채워 몰입시키는 뽀모도로 스타일 팝업
  const [focusHuntId, setFocusHuntId] = useState(null);
  const [tabAway, setTabAway] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("general");
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
  // 일정관리 달력에서 고른 날짜의 일일퀘스트 목록 (읽기 전용 미리보기)
  const [selectedDateMissions, setSelectedDateMissions] = useState([]);

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

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let penalty = 0;
      let missedDays = 0;
      if (parsedProfile.lastActiveDate) {
        const cursor = parseDateKey(parsedProfile.lastActiveDate);
        while (dateKey(cursor) !== todayKey()) {
          const dayRaw = localStorage.getItem(`missions_${dateKey(cursor)}`);
          if (dayRaw) {
            const dayMissions = JSON.parse(dayRaw);
            // 미션의 기간 설정(급함/당일/내일/이번주/이번달)에 따라 마감일이 지난
            // 것만 페널티로 잡는다 — "이번달"로 잡아둔 미션은 다음날 하루 안 했다고 안 깎임
            const incomplete = dayMissions.filter((m) => {
              if (m.isDone) return false;
              const deadline = new Date(cursor);
              deadline.setDate(deadline.getDate() + graceDaysForPriority(m.priority));
              return deadline < today;
            });
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

  // 일정관리 달력에서 날짜를 고르면(선택 안 했으면 오늘 기준) 그날의 일일퀘스트를 불러와 보여준다.
  // 오늘 날짜면 저장된 값 대신 지금 화면에 떠 있는 missions를 그대로 써서 체크 상태가 실시간으로 맞도록 한다.
  useEffect(() => {
    if (!loaded) return;
    const effectiveIso = newDeadlineDate || todayIso();
    const key = missionKeyFromIso(effectiveIso);
    if (key === todayKey()) {
      setSelectedDateMissions(missions);
      return;
    }
    try {
      const raw = localStorage.getItem(`missions_${key}`);
      setSelectedDateMissions(raw ? JSON.parse(raw) : []);
    } catch {
      setSelectedDateMissions([]);
    }
  }, [newDeadlineDate, missions, loaded]);

  // 만렙(LV90) 이후 문이 떠 있는 동안은 EXP가 늘어나는 대신, 미션 종류·EXP값과 무관하게
  // 완료 1회당 문 체력을 1씩 깎는다. 문이 없으면 지금까지처럼 EXP를 그대로 더한다.
  // 미션 카드에 보여줄 보상 표기: 문 챌린지 중이면 EXP 대신 고정 데미지(HIT)로 표시한다
  function rewardLabel(expValue) {
    return profile.door ? `HIT ${DOOR_DAMAGE_PER_HIT}` : `+${expValue} EXP`;
  }

  function gainProgress(prevProfile, expAmount) {
    if (prevProfile.door) {
      return {
        ...prevProfile,
        door: {
          ...prevProfile.door,
          hp: Math.max(0, prevProfile.door.hp - DOOR_DAMAGE_PER_HIT),
        },
      };
    }
    return { ...prevProfile, exp: prevProfile.exp + expAmount };
  }

  // 문에 HIT이 들어간 순간 잠깐 "내려찍는" 이미지로 바꿔 보여주고, 애니메이션이 끝나면 원래 자세로 되돌린다
  function pulseDoorSwing() {
    setDoorSwing(true);
    // GIF가 몇 번 반복될 만큼 충분히 유지했다가, 계속 열려있어도 더 이상 반복되지 않도록 멈춘다
    setTimeout(() => setDoorSwing(false), 2800);
  }

  // 문이 0체력이 된 "순간"에만 한 번 축하 연출을 띄우고 문을 치운다 (다음 회사에 재도전 가능)
  useEffect(() => {
    if (!loaded) return;
    if (
      profile.door &&
      profile.door.hp <= 0 &&
      prevDoorRef.current &&
      prevDoorRef.current.hp > 0
    ) {
      setShowDoorBreak(true);
      setProfile((p) => ({ ...p, door: null }));
    }
    prevDoorRef.current = profile.door;
  }, [profile.door, loaded]);

  // 만렙(LV90) 도달 후 도전 중인 문이 없으면 회사명을 입력받는 문 등장 모달을 띄운다
  useEffect(() => {
    if (!loaded) return;
    const level = levelFromExp(profile.exp);
    if (level >= DOOR_LEVEL && !profile.door && !showDoorSetup && !showDoorBreak) {
      setShowDoorSetup(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.exp, profile.door, loaded, showDoorBreak]);

  function startDoorChallenge() {
    const company = doorCompanyInput.trim();
    if (!company) return;
    setProfile((p) => ({
      ...p,
      door: { company, hp: DOOR_MAX_HP, maxHp: DOOR_MAX_HP },
    }));
    setShowDoorSetup(false);
    setDoorCompanyInput("");
  }

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
      // LV9(알) → LV10(런닝+사각팬티) 전환은 알을 깨고 나오는 특별한 순간이라 따로 축하해준다
      if (prevLevelRef.current < 10 && level >= 10) {
        setHatchPhase("egg");
        setShowHatchCelebration(true);
      }
      prevLevelRef.current = level;
      const t = setTimeout(() => setLevelUpMsg(""), 2500);
      return () => clearTimeout(t);
    }
    prevLevelRef.current = level;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.exp, loaded]);

  // 부화 연출 진행: 알이 흔들리다가 → 깨지는 플래시 → 캐릭터 등장 순서로 자동 전환
  useEffect(() => {
    if (!showHatchCelebration) return;
    const t1 = setTimeout(() => setHatchPhase("crack"), 900);
    const t2 = setTimeout(() => setHatchPhase("hatched"), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [showHatchCelebration]);

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
      setComfortIsHit(false);
      setComfortMsg(
        DAY_COMPLETE_MESSAGES[
          Math.floor(Math.random() * DAY_COMPLETE_MESSAGES.length)
        ]
      );
    }
    prevAllDoneRef.current = nowAllDone;
  }, [missions, loaded]);

  // 페널티 안내 배너는 일정 시간 뒤 자동으로 닫힘
  useEffect(() => {
    if (!penaltyMsg) return;
    const t = setTimeout(() => setPenaltyMsg(""), 6000);
    return () => clearTimeout(t);
  }, [penaltyMsg]);

  function showComfort(isHit) {
    setComfortIsHit(!!isHit);
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

  // 사냥 타이머: 1초마다 running 중인 미션의 경과시간 증가.
  // 도중에 조금씩 EXP를 주지 않고, 목표 시간을 끝까지 다 채운 순간에만 expValue만큼 지급한다.
  // 25분 목표를 다 채우면 바로 멈추지 않고 5분 휴식 타이머로 이어진다 (뽀모도로 스타일).
  useEffect(() => {
    const timer = setInterval(() => {
      // setState 업데이트 함수 안에서 다른 setState를 호출하면 개발 모드(Strict Mode)에서
      // 함수가 두 번 실행되어 EXP가 두 배로 적립되므로, 계산은 밖에서 순수하게 하고
      // setMissions/setProfile은 결과값으로 한 번씩만 호출한다.
      let expGain = 0;
      let breakJustFinished = false;
      const next = missionsRef.current.map((m) => {
        if (m.type !== "hunt" || !m.running) return m;

        if (m.onBreak) {
          const breakElapsed = m.breakElapsedSeconds + 1;
          const breakDone = breakElapsed >= 300; // 5분
          if (breakDone) breakJustFinished = true;
          return {
            ...m,
            breakElapsedSeconds: breakElapsed,
            onBreak: !breakDone,
            running: !breakDone,
          };
        }

        const elapsed = m.elapsedSeconds + 1;
        const targetReached =
          m.targetMinutes && elapsed >= m.targetMinutes * 60;
        if (targetReached && !m.isDone) {
          // 수련 목표 시간을 막 채운 순간 → EXP 지급 + 선물 상자 대기열에 추가, 5분 휴식 시작
          expGain += m.expValue || 5;
          queueGift("수련 목표 클리어 선물", profileRef.current.trainingReward);
        }
        return {
          ...m,
          elapsedSeconds: elapsed,
          onBreak: targetReached ? true : m.onBreak,
          breakElapsedSeconds: targetReached ? 0 : m.breakElapsedSeconds,
          isDone: targetReached ? true : m.isDone,
        };
      });
      setMissions(next);
      if (expGain > 0) {
        setProfile((p) => gainProgress(p, expGain));
        if (profileRef.current.door) pulseDoorSwing();
      }
      if (breakJustFinished) {
        setComfortMsg("휴식 끝! 다시 집중해볼까요?");
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
      expValue:
        newType === "dungeon" ? 30 : newType === "battle" ? 10 : newType === "hunt" ? 5 : 10,
      targetMinutes: newType === "hunt" ? 25 : null,
      elapsedSeconds: 0,
      running: false,
      onBreak: false,
      breakElapsedSeconds: 0,
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
      setProfile((p) =>
        p.door
          ? {
              ...p,
              door: {
                ...p.door,
                hp: Math.min(p.door.maxHp, p.door.hp + DOOR_DAMAGE_PER_HIT),
              },
            }
          : { ...p, exp: Math.max(0, p.exp - mission.expValue) }
      );
    }
    if (rewardPopup?.id === id) setRewardPopup(null);
  }

  function claimReward() {
    if (!rewardPopup) return;
    const { id, exp } = rewardPopup;
    const mission = missions.find((m) => m.id === id);
    setProfile((p) => gainProgress(p, exp));
    if (profile.door) pulseDoorSwing();
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, expClaimed: true } : m))
    );
    setRewardPopup(null);
    if (profile.comfortRewardedDate !== todayKey()) {
      showComfort(!!profile.door);
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

  function startHuntFocus(id) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, running: true } : m))
    );
    setFocusHuntId(id);
  }

  // 집중모드가 열려있는 동안: 화면이 꺼지지 않게 Wake Lock을 걸고,
  // 다른 탭/앱으로 이탈했다가 돌아오면 알 수 있도록 감지한다.
  // (웹 특성상 다른 앱으로 전환하는 것 자체를 막을 방법은 없다 — 감지와 화면 유지가 할 수 있는 최선)
  useEffect(() => {
    if (!focusHuntId) return;
    setTabAway(false);
    let wakeLock = null;
    (async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (e) {
        // Wake Lock 미지원/거부 시 조용히 무시
      }
    })();
    const handleVisibility = () => {
      if (document.hidden) setTabAway(true);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [focusHuntId]);

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
    // 목표(직업)를 새로 정하는 것이므로, 그 전까지 쌓아온 EXP는 새 목표를 위해 리셋한다
    setProfile((p) => ({ ...p, jobSignature: null, exp: 0 }));
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
  // 레벨이 오를수록 서명이 점점 또렷해지다가, 완성(LV90+)에서 완전히 선명해진다.
  // 처음부터 아예 안 보이면 의미가 없으니, LV1부터도 반투명하게는 보이도록 시작값을 높게 잡는다.
  const signatureOpacity =
    level >= 90 ? 1 : Math.min(0.9, 0.35 + (level - 1) * 0.01);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FuturisticBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-3 py-5">
        {/* 헤더 */}
        <header className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-[0_0_20px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
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
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_25px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCharacterZoom(true)}
              aria-label="캐릭터 크게 보기"
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-slate-950/80 text-3xl shadow-[0_0_18px_rgba(34,211,238,0.5)] transition hover:border-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.7)]"
            >
              <StageVisual stage={stage} level={level} door={!!profile.door} swing={doorSwing} className="h-11 w-11" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-violet-600 px-2 py-0.5 font-display text-[11px] text-white shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                LV{level}
              </span>
              {levelUpMsg && (
                <div className="animate-pop-in absolute inset-x-0 -top-8 mx-auto w-max -translate-x-1/2 left-1/2 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1 font-display text-xs whitespace-nowrap text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                  {levelUpMsg}
                </div>
              )}
            </button>
            <div className="flex-1">
              <p className="font-display text-sm tracking-wide text-cyan-50">
                LV.{level} {stage.label}
              </p>
              {profile.door ? (
                <>
                  <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full border border-rose-400/40 bg-slate-950/80 shadow-inner">
                    <div
                      className="relative h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 shadow-[0_0_10px_rgba(244,63,94,0.7)] transition-all"
                      style={{
                        width: `${(profile.door.hp / profile.door.maxHp) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/30" />
                    </div>
                  </div>
                  <p className="mt-0.5 text-right font-display text-[11px] tracking-wide text-rose-300/80">
                    🚪 {profile.door.company} 문 체력 {profile.door.hp}/
                    {profile.door.maxHp}
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full border border-cyan-400/30 bg-slate-950/80 shadow-inner">
                    <div
                      className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/30" />
                    </div>
                  </div>
                  <p className="mt-0.5 text-right font-display text-[11px] tracking-wide text-cyan-300/80">
                    누적 EXP {profile.exp} (다음 LV까지 {expIntoLevel}/{EXP_PER_LEVEL})
                  </p>
                </>
              )}
            </div>
          </div>

          {/* 목표 직업 서명 — 박스 없이 서명 자체만, 목표설정 버튼과 한 줄에 표시, 레벨이 오를수록 점점 또렷해짐 */}
          <div className="relative mt-2 flex items-center gap-2">
            <div className="relative h-12 flex-1 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.jobSignature}
                alt="내가 직접 적은 목표 직업 서명"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
                style={{
                  opacity: signatureOpacity,
                  filter: "drop-shadow(0 0 10px rgba(34,211,238,0.6))",
                }}
              />
            </div>
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
                  <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs whitespace-nowrap text-cyan-300/80">
                    🍅 25분 목표 고정
                  </span>
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
              : `🎲 돌발미션 뽑기 (${rewardLabel(15)})`}
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
                      m.onBreak ? (
                        <p className="text-xs text-slate-400">
                          ☕ 휴식 중 {formatClock(m.breakElapsedSeconds)} / 5분
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">
                          {formatClock(m.elapsedSeconds)}
                          {m.targetMinutes
                            ? ` / 목표 ${m.targetMinutes}분`
                            : ""}{" "}
                          ·{" "}
                          <span className="font-display text-fuchsia-300">
                            {m.targetMinutes}분 채우면 {rewardLabel(m.expValue)}
                          </span>
                        </p>
                      )
                    ) : (
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 font-display text-[11px] tracking-wide ${meta.badge}`}
                      >
                        {rewardLabel(m.expValue)}
                      </span>
                    )}
                  </div>
                </div>

                {m.type === "hunt" && (
                  <div className="flex shrink-0 items-center gap-1">
                    {m.running ? (
                      <button
                        onClick={() => setFocusHuntId(m.id)}
                        className="rounded-lg border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1 text-xs font-bold text-white shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      >
                        🔒 집중모드
                      </button>
                    ) : (
                      <button
                        onClick={() => startHuntFocus(m.id)}
                        className="rounded-lg border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1 text-xs font-bold text-white shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      >
                        수련 시작
                      </button>
                    )}
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
              selectedDate={newDeadlineDate}
              onSelectDate={setNewDeadlineDate}
            />
          </div>

          {/* 달력에서 고른 날짜(기본값 오늘)의 일일퀘스트를 읽기 전용으로 보여줌 */}
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
            <p className="mb-2 font-display text-sm tracking-wide text-cyan-100">
              {(() => {
                const [, m, d] = (newDeadlineDate || todayIso()).split("-").map(Number);
                return `${m}월 ${d}일`;
              })()}{" "}
              퀘스트
              {(newDeadlineDate || todayIso()) === todayIso() && (
                <span className="ml-1.5 text-xs text-cyan-300/70">(오늘)</span>
              )}
            </p>
            {selectedDateMissions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center text-sm text-cyan-200/70">
                이 날짜에 기록된 퀘스트가 없어요.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {selectedDateMissions.map((m) => {
                  const meta = MISSION_TYPE_META[m.type] || MISSION_TYPE_META.general;
                  return (
                    <div
                      key={m.id}
                      className={`flex items-center gap-2 rounded-xl border border-l-[4px] border-white/10 bg-black/20 px-3 py-2 text-sm ${meta.leftAccent} ${
                        m.isDone ? "opacity-55" : ""
                      }`}
                    >
                      <span className={m.isDone ? "text-emerald-400" : "text-slate-500"}>
                        {m.isDone ? "✓" : "○"}
                      </span>
                      <span
                        className={
                          m.isDone
                            ? "text-emerald-300 line-through"
                            : "text-cyan-50"
                        }
                      >
                        {m.type !== "hunt" && meta.prefix}
                        {m.content}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
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

      {/* 수련 집중 모드: 뽀모도로처럼 화면을 꽉 채운 큰 타이머로 몰입시킴.
          웹 특성상 다른 앱/탭 전환 자체를 막을 수는 없어서, 화면이 꺼지지 않게(Wake Lock)
          하고 다른 화면으로 이탈했다 돌아오면 알려주는 것까지가 할 수 있는 최선이다. */}
      {focusHuntId && (() => {
        const m = missions.find((x) => x.id === focusHuntId);
        if (!m) return null;

        if (m.onBreak) {
          const breakRemain = Math.max(0, 300 - m.breakElapsedSeconds);
          const breakProgress = Math.min(
            100,
            (m.breakElapsedSeconds / 300) * 100
          );
          return (
            <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-black/95 p-6 text-center">
              <p className="font-display text-xs tracking-[0.2em] text-amber-400/70">
                ☕ 휴식 시간
              </p>
              <p className="max-w-xs font-display text-base text-amber-50">
                {m.content}
              </p>
              <p className="font-display text-6xl tabular-nums text-amber-100 [text-shadow:0_0_25px_rgba(251,191,36,0.6)]">
                {formatClock(breakRemain)}
              </p>
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                    style={{ width: `${breakProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  25분 완료! 5분 쉬고 다시 시작해요
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleHuntRunning(m.id)}
                  className={`rounded-xl border px-4 py-2.5 font-display text-sm font-bold text-white ${
                    m.running
                      ? "border-rose-400/60 bg-rose-500/90"
                      : "border-amber-300/50 bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
                >
                  {m.running ? "휴식 일시정지" : "휴식 계속하기"}
                </button>
                <button
                  onClick={() => setFocusHuntId(null)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300"
                >
                  집중모드 나가기
                </button>
              </div>
            </div>
          );
        }

        const targetSeconds = (m.targetMinutes || 0) * 60;
        const remain = targetSeconds
          ? Math.max(0, targetSeconds - m.elapsedSeconds)
          : null;
        const progress = targetSeconds
          ? Math.min(100, (m.elapsedSeconds / targetSeconds) * 100)
          : 0;
        return (
          <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-black/95 p-6 text-center">
            <p className="font-display text-xs tracking-[0.2em] text-cyan-400/70">
              🔒 집중 모드
            </p>
            <p className="max-w-xs font-display text-base text-cyan-50">
              {m.content}
            </p>
            <p className="font-display text-6xl tabular-nums text-cyan-100 [text-shadow:0_0_25px_rgba(34,211,238,0.6)]">
              {formatClock(m.elapsedSeconds)}
            </p>
            {targetSeconds > 0 && (
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  목표 {m.targetMinutes}분 · 남은 시간 {formatClock(remain)} ·
                  다 채우면 5분 휴식이 이어져요
                </p>
              </div>
            )}
            {tabAway && (
              <p className="animate-pulse rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
                ⚠️ 방금 다른 화면으로 이탈했었어요 — 집중!
              </p>
            )}
            <p className="max-w-xs text-[11px] text-slate-500">
              웹 특성상 다른 앱 전환 자체를 막을 순 없지만, 이 화면을 켜두면 화면이
              꺼지지 않고 이탈 시 알려드려요.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => toggleHuntRunning(m.id)}
                className={`rounded-xl border px-4 py-2.5 font-display text-sm font-bold text-white ${
                  m.running
                    ? "border-rose-400/60 bg-rose-500/90"
                    : "border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600"
                }`}
              >
                {m.running ? "일시정지" : "다시 시작"}
              </button>
              <button
                onClick={() => setFocusHuntId(null)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300"
              >
                집중모드 나가기
              </button>
            </div>
          </div>
        );
      })()}

      {/* 미션 완료 보상 알림창 */}
      {rewardPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className={`animate-pop-in relative w-full max-w-xs rounded-2xl border p-6 backdrop-blur-2xl text-center ${
              profile.door
                ? "border-rose-300/50 bg-slate-900/70 shadow-[0_0_40px_rgba(244,63,94,0.4)]"
                : "border-cyan-300/50 bg-slate-900/70 shadow-[0_0_40px_rgba(34,211,238,0.4)]"
            }`}
          >
            <p
              className={`font-display text-base tracking-wide ${
                profile.door ? "text-rose-100" : "text-cyan-100"
              }`}
            >
              {profile.door ? "⚔️ 명중!" : "🎉 미션 완료!"}
            </p>
            <p
              className={`mt-3 bg-clip-text font-display text-3xl text-transparent ${
                profile.door
                  ? "bg-gradient-to-r from-rose-500 to-orange-400"
                  : "bg-gradient-to-r from-cyan-400 to-violet-400"
              }`}
            >
              {rewardLabel(rewardPopup.exp)}
            </p>
            <button
              onClick={claimReward}
              className={`mt-5 w-full rounded-xl border px-4 py-2.5 font-display text-sm tracking-wide text-white transition ${
                profile.door
                  ? "border-rose-300/50 bg-gradient-to-r from-rose-500 to-orange-500 shadow-[0_0_18px_rgba(244,63,94,0.4)]"
                  : "border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_18px_rgba(34,211,238,0.4)]"
              }`}
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
              {comfortMsg}
              {/* 말풍선 꼬리: 알 캐릭터 쪽(아래)을 향하도록 */}
              <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[11px] border-t-[16px] border-x-transparent border-t-rose-300/60" />
              <span className="absolute left-1/2 top-full -mt-px h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[13px] border-x-transparent border-t-rose-50" />
            </div>
            <div
              className={`mt-3 drop-shadow-[0_0_40px_rgba(244,63,94,0.55)] ${
                profile.door ? "" : "animate-shake"
              }`}
            >
              {/* "방금 HIT" 반응일 때만, 그리고 사용자가 탭해서 닫을 때까지 계속 애니메이션을 보여준다.
                  오늘 마지막 미션을 완료하면 이 위로 메시지 다음에 "오늘 전부 완료" 위로가 곧바로
                  이어서 뜨는데, 그건 HIT 반응이 아니므로 여기서 걸러내지 않으면 애니메이션이
                  불필요하게 두 번 재생된 것처럼 보인다. */}
              <StageVisual stage={stage} level={level} door={!!profile.door} swing={comfortIsHit && !!profile.door} className="h-40 w-40 text-[7rem] leading-none" />
            </div>
          </div>
          <p className="text-xs text-slate-400">탭하면 닫혀요</p>
        </div>
      )}

      {/* 선물 상자: 레벨업 / 일일퀘스트 3개 달성 / 던전 / 격투신청 보상을 순서대로 하나씩 보여줌 */}
      {giftQueue[0] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in relative w-full max-w-xs rounded-2xl border border-amber-300/50 bg-slate-900/70 p-6 backdrop-blur-2xl text-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
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
                onClick={() => setShowResignConfirm(true)}
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

      {/* 목표 재서명 확인: EXP가 초기화된다는 걸 미리 알리고 되돌릴 수 없는 선택이니 한 번 더 확인받는다 */}
      {showResignConfirm && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-4">
          <div className="animate-pop-in w-full max-w-xs rounded-2xl border border-rose-400/50 bg-slate-900/80 p-6 text-center backdrop-blur-2xl shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <p className="font-display text-base tracking-wide text-rose-200">
              ⚠️ 목표 다시 서명
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              지금까지 쌓은 EXP({profile.exp})가 0으로 초기화되고,
              <br />
              목표를 처음부터 다시 시작하게 돼요.
              <br />
              괜찮으시겠습니까?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowResignConfirm(false);
                  setShowSettings(false);
                  resignJob();
                }}
                className="flex-1 rounded-xl border border-rose-400/60 bg-rose-500/90 px-3 py-2 font-display text-xs tracking-wide text-white shadow-[0_0_18px_rgba(244,63,94,0.4)]"
              >
                네, 다시 서명할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 캐릭터 크게 보기: HUD의 작은 아바타를 눌렀을 때 지금 단계 캐릭터를 크게 보여줌 */}
      {showCharacterZoom && (
        <div
          onClick={() => setShowCharacterZoom(false)}
          role="button"
          aria-label="닫기"
          className="fixed inset-0 z-[65] flex cursor-pointer flex-col items-center justify-center gap-4 bg-black/80 p-4"
        >
          <div className="rounded-3xl border-2 border-cyan-400/60 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <StageVisual stage={stage} level={level} door={!!profile.door} swing={doorSwing} className="h-56 w-56" />
          </div>
          <p className="font-display text-base tracking-wide text-cyan-100">
            LV.{level} {stage.label}
          </p>
          <p className="text-xs text-slate-400">탭하면 닫혀요</p>
        </div>
      )}

      {/* 부화 축하: LV9(알)에서 LV10(런닝+사각팬티 캐릭터)로 넘어가는 순간만 특별히 보여주는 연출 */}
      {showHatchCelebration && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-black/95 p-6 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-amber-300/80">
            🎉🎊 축하합니다 🎊🎉
          </p>
          <div className="relative flex h-48 w-48 items-center justify-center">
            <span className="animate-hatch-glow absolute inset-0 rounded-full bg-amber-400/30 blur-2xl" />
            {hatchPhase !== "hatched" ? (
              // 1단계: 알이 부들부들 떨리다가, 2단계: 깨지는 순간 하얗게 번쩍인다
              <div
                className={
                  hatchPhase === "crack"
                    ? "animate-crack-flash relative"
                    : "animate-shake relative"
                }
              >
                <EggCrackedIcon className="h-40 w-40 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
              </div>
            ) : (
              <>
                <div className="animate-pop-in relative">
                  <PersonHatchPoseIcon className="h-40 w-40 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
                </div>
                {/* 사방으로 튀는 알 껍질 조각들 */}
                <span
                  className="animate-shard absolute left-1/2 top-1/2 text-xl"
                  style={{ "--shard-x": "70px", "--shard-y": "-60px" }}
                >
                  🥚
                </span>
                <span
                  className="animate-shard absolute left-1/2 top-1/2 text-lg"
                  style={{ "--shard-x": "-75px", "--shard-y": "-45px" }}
                >
                  🥚
                </span>
                <span
                  className="animate-shard absolute left-1/2 top-1/2 text-lg"
                  style={{ "--shard-x": "60px", "--shard-y": "55px" }}
                >
                  🥚
                </span>
                <span
                  className="animate-shard absolute left-1/2 top-1/2 text-xl"
                  style={{ "--shard-x": "-65px", "--shard-y": "60px" }}
                >
                  🥚
                </span>
              </>
            )}
          </div>
          <p className="max-w-xs font-display text-lg text-amber-100">
            {hatchPhase === "hatched" ? "LV.10 부화!" : "알이 흔들리기 시작한다..."}
          </p>
          <blockquote className="max-w-xs rounded-2xl border border-amber-300/40 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-50/90 italic">
            &ldquo;새는 알에서 나오기 위해 싸운다.
            <br />
            알은 세계다.
            <br />
            태어나고자 하는 자는 반드시 하나의 세계를 깨뜨려야 한다.&rdquo;
          </blockquote>
          <button
            onClick={() => setShowHatchCelebration(false)}
            className="rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 font-display text-sm font-bold text-white shadow-[0_0_20px_rgba(251,191,36,0.4)]"
          >
            계속하기
          </button>
        </div>
      )}

      {/* 만렙(LV90) 도달 후 문 등장: 도전할 회사명을 입력받는다 */}
      {showDoorSetup && (
        <div className="fixed inset-0 z-[85] flex flex-col items-center justify-center gap-6 bg-black/95 p-6 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-rose-300/80">
            🚪 문이 나타났다
          </p>
          <div className="relative flex h-40 w-40 items-center justify-center">
            <span className="animate-hatch-glow absolute inset-0 rounded-full bg-rose-500/25 blur-2xl" />
            <span className="animate-pop-in relative text-8xl drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]">
              🚪
            </span>
          </div>
          <p className="max-w-xs font-display text-lg text-rose-100">
            도전할 회사를 입력하세요
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-slate-300">
            지금부터는 EXP 대신, 미션을 완료할 때마다
            <br />이 문에 데미지를 줘요.
            <br />문 체력({DOOR_MAX_HP})을 전부 깎으면 문이 부서집니다.
          </p>
          <input
            type="text"
            value={doorCompanyInput}
            onChange={(e) => setDoorCompanyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") startDoorChallenge();
            }}
            placeholder="예: 카카오"
            className="w-full max-w-xs rounded-xl border border-rose-400/40 bg-slate-900/80 px-4 py-2.5 text-center text-sm text-rose-50 placeholder:text-slate-500 focus:border-rose-300 focus:outline-none"
          />
          <button
            onClick={startDoorChallenge}
            disabled={!doorCompanyInput.trim()}
            className="rounded-xl border border-rose-300/50 bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-2.5 font-display text-sm font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            도전 시작
          </button>
        </div>
      )}

      {/* 문을 다 부쉈을 때: 팡파레 + "축 입사" 축하 연출 */}
      {showDoorBreak && (
        <div className="fixed inset-0 z-[85] flex flex-col items-center justify-center gap-6 bg-black/95 p-6 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-amber-300/80">
            🎉🎊 축하합니다 🎊🎉
          </p>
          <p className="font-display text-4xl font-bold text-amber-200 [text-shadow:0_0_20px_rgba(251,191,36,0.7)]">
            축 입사!
          </p>
          <p className="font-display text-lg text-amber-100">수고하셨습니다</p>
          <div className="relative flex h-48 w-48 items-center justify-center">
            <span className="animate-hatch-glow absolute inset-0 rounded-full bg-amber-400/30 blur-2xl" />
            <PersonGwanbokIcon className="animate-pop-in relative h-40 w-40 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
            {/* 사방으로 터지는 팡파레 컨페티 */}
            {[
              { emoji: "🎉", x: "80px", y: "-70px", size: "text-2xl" },
              { emoji: "✨", x: "-85px", y: "-55px", size: "text-xl" },
              { emoji: "🎊", x: "70px", y: "65px", size: "text-2xl" },
              { emoji: "⭐", x: "-75px", y: "70px", size: "text-lg" },
              { emoji: "🥳", x: "0px", y: "-95px", size: "text-2xl" },
              { emoji: "🎇", x: "95px", y: "0px", size: "text-xl" },
              { emoji: "🎈", x: "-95px", y: "0px", size: "text-xl" },
              { emoji: "✨", x: "0px", y: "95px", size: "text-lg" },
            ].map((c, i) => (
              <span
                key={i}
                className={`animate-shard absolute left-1/2 top-1/2 ${c.size}`}
                style={{ "--shard-x": c.x, "--shard-y": c.y }}
              >
                {c.emoji}
              </span>
            ))}
          </div>
          <p className="max-w-xs font-display text-lg text-amber-100">
            앞으로도 당신의 눈부신 성장과
            <br />
            찬란한 미래를 응원합니다.
          </p>
          <button
            onClick={() => setShowDoorBreak(false)}
            className="rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 font-display text-sm font-bold text-white shadow-[0_0_20px_rgba(251,191,36,0.4)]"
          >
            다음 문으로
          </button>
        </div>
      )}
    </div>
  );
}
