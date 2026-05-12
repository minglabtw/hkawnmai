# HKAWN MAI 學中文

> 緬甸語—中文對照 HSK 學習工具
>
> **ဟော်ကောင်မိုင်တရုတ်စကသင်လို့ရတဲ့ application ‌‌လေး**

---

## 開發源起

HKAWN MAI 是一位緬甸華裔女孩的名字。她正在學習中文，但市面上的學習工具大多以英文為中介語言，對於母語是緬甸語的學習者來說，門檻很高。

這個專案就是為她打造的——以 **緬甸語 ↔ 中文** 直接對照的方式，讓緬甸語使用者可以繞過英文，直接用母語學習中文。所有介面文字都可以切換中/緬文。

---

## 功能特色

- **HSK 分級學習**：初級 / 中級 / 高級三級詞彙，對應 HSK 1-6 級
- **雙語介面**：一鍵切換簡體中文 ↔ 緬甸語
- **暗黑模式**：支援深色主題
- **每日一句**：每日隨機展示一句中文及其緬甸語翻譯
- **學習進度追蹤**：環形進度條顯示各級學習完成率
- **單字卡模式**：翻卡學習，中文→緬甸語雙向記憶
- **測驗模式**：隨機出題，即時反饋正確/錯誤音效
- **發音朗讀**：每字每句均有真人發音 mp3（共 14,838 個音檔）
- **進度備份**：支援匯出/匯入學習進度 JSON
- **PWA 支援**：可加入手機主畫面，離線使用
- **Android APK**：正式簽名封裝，可直接安裝

---

## 使用方式

### PWA 版（推薦，免安裝）

1. 用手機 Chrome 開啟 **https://minglabtw.github.io/hkawnmai/**
2. 點選 Chrome 選單 →「加入主畫面」
3. 像原生 App 一樣直接使用，支援離線

### Android APK 版

1. 前往 [GitHub Releases](https://github.com/minglabtw/hkawnmai/releases) 下載 `app-release.apk`
2. 開啟手機的「允許安裝不明應用程式」設定
3. 安裝後直接開啟
4. APK 版內建完整音頻檔，無需網路即可發音

> **注意**：若從舊版 APK（com.hkawnmai.app）升級，請先解除安裝舊版再安裝新版。

---

## 音頻說明

- 每個詞彙包含兩個音檔：`0001.mp3`（中文發音）+ `0001_e.mp3`（例句發音）
- 共 7,419 組 × 2 = 14,838 個 mp3 檔案，總容量約 300MB
- APK 版內建完整音頻
- PWA 版音頻方案待定（選項：Cloudflare R2 按需載入 / GitHub Releases 壓包下載）

---

## 技術架構

```
prototype.html       ← 主要開發檔案（單檔 HTML，所有 CSS/JS 行內）
  ├─ data/
  │   ├─ beginner.js     初級詞彙 (~500KB)
  │   ├─ intermediate.js  中級詞彙 (~1.3MB)
  │   ├─ advanced.js      高級詞彙 (~2.2MB)
  │   └─ vocabulary.json  完整詞彙資料
  ├─ audio/              音頻 mp3 檔案
  ├─ icons/              PWA 圖示
  ├─ service-worker.js   PWA Service Worker
  ├─ manifest.json       PWA manifest
  ├─ android/            Capacitor Android 專案 + 簽名金鑰
  └─ build.sh            APK 建置腳本
```

### 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | 原生 HTML + CSS + JavaScript（單檔無框架） |
| 發音 | Web Audio API（音效）+ HTML Audio（朗讀） |
| 離線 | Service Worker + Cache Storage API |
| 封裝 | Capacitor + Android SDK |
| 簽名 | JDK keytool 生成 release keystore |
| 部署 | GitHub Actions → GitHub Pages |

### 資料延遲載入

為解決手機端同時載入 5MB 詞彙資料的問題，採用延遲載入：

- `beginner.js` 頁面載入時同步載入
- `intermediate.js` / `advanced.js` 切換級別時動態載入
- 載入期間顯示「載入中...」遮罩

---

## 本地開發

```bash
# 開發：直接編輯 prototype.html
# 預覽：用瀏覽器打開 prototype.html
# 注意：音頻需要本地伺服器才能播放（因 CORS）
python3 -m http.server 8000
# 瀏覽器開啟 http://localhost:8000/prototype.html
```

### 建置 APK

```bash
# 需要 JDK 21 + Android SDK
./build.sh
# APK 產出：android/app/build/outputs/apk/release/app-release.apk
```

### 部署 PWA

推送至 `main` 分支後，GitHub Actions 會自動部署到：
`https://minglabtw.github.io/hkawnmai/`

---

## 詞彙資料格式

```js
var words = [
  {
    word: "爱",             // 中文詞彙
    pinyin: "ài",           // 拼音
    meaning: "ချစ်သည်",    // 緬甸語釋義
    hsk: 1,                 // HSK 級別
    audio: "0001.mp3",      // 中文發音
    sentence: "我爱妈妈",   // 例句
    sentence_pinyin: "Wǒ ài māma",
    sentence_meaning: "ငါအမေကိုချစ်တယ်",
    audio_e: "0001_e.mp3"   // 例句發音
  },
  // ...
]
```

---

## 版權

© 2026 銘於心 (MING). 智慧物聯架構實驗室

版權所有，禁止商業使用與未授權散布。
