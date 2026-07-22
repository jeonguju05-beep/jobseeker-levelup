import { Geist, Geist_Mono, Orbitron, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 한글 본문용 깔끔한 고딕체
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin", "korean"],
  weight: ["400", "500", "700", "900"],
});

// 미래지향적(사이버/HUD) 느낌의 라틴 문자·숫자 전용 폰트 (LV, EXP 등에 사용, 한글은 노토산스로 자동 폴백)
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

export const metadata = {
  title: "인생 게임",
  description: "오늘 할 일을 깨면 경험치가 쌓이고, 알이 자라나 목표 직업의 새로 완성되는 취준생 성장 다이어리",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
