# ⚡ 마감 구출 작전 (Deadline Runner)

> **미루고 있는 작업과 최종 마감 기한을 입력하면, Gemini API가 실시간 타임테이블을 짜주고 브라우저 알림으로 완수를 도와주는 웹 앱입니다.**

---

## ✨ 주요 기능

1. **상단 입력창**: 미루고 있는 작업 내용과 마감 날짜/시간을 입력
2. **2분할 레이아웃**:
   - **좌측 (시간대별 타임테이블)**: 마감 시각에 맞춘 단계별 일정 및 할 일 안내
   - **우측 (마감 전략 & 코칭)**: 동기부여 응원 메시지 및 핵심 실행 전략
3. **실시간 브라우저 알림**: 각 타임테이블 시간대가 되면 데스크톱 알림이 전송되고 UI 카드가 하이라이트됩니다.
4. **활력 있는 디자인**: 화이트 & 블루 톤의 대시보드로 조급하지만 활력 있게 몰입할 수 있는 스티어링 환경을 제공합니다.

---

## 📁 프로젝트 구조

```text
deadline-alarm-app/
├── api/
│   └── generate.js      # Gemini API 호출 Vercel 서버리스 함수
├── index.html           # 대시보드 프론트엔드 UI & 알림 스크립트
├── package.json         # Node.js 패키지 설정 (@google/genai)
├── vercel.json          # Vercel 라우팅 설정
└── README.md            # 프로젝트 안내 문서
```

---

## 🚀 Vercel 배포 가이드

### 1. 프로젝트 다운로드 및 GitHub 업로드
1. 다운로드받은 ZIP 파일의 압축을 풉니다.
2. 내 GitHub 계정에 새 Repositiory를 생성하고 파일들을 푸시합니다.

### 2. Vercel 프로젝트 생성
1. [Vercel Dashboard](https://vercel.com/)에 접속하여 **Add New Project**를 클릭합니다.
2. 방금 올린 GitHub 저장소를 연결(Import)합니다.

### 3. 환경변수(Environment Variables) 설정
Vercel 배포 설정 화면의 **Environment Variables** 항목에 아래 값을 추가합니다:

* **NAME**: `GEMINI_API_KEY`
* **VALUE**: `Google AI Studio에서 발급받은 API Key`

### 4. Deploy 완료
* **Deploy** 버튼을 누르면 약 1분 이내에 배포가 완료되며 웹 URL이 생성됩니다.

---

## 🛠️ 기술 스택
* **Frontend**: HTML5, TailwindCSS (CDN), FontAwesome, Vanilla JS (Notification API)
* **Backend**: Vercel Serverless Function (Node.js)
* **AI Model**: Google Gemini API (`gemini-2.5-flash`)
