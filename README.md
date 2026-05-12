# HKAWN MAI 学中文

> 緬甸語—中文對照 HSK 學習工具
>
> **ဟော်ကောင်မိုင်တရုတ်စကသင်လို့ရတဲ့ application‌‌လေး**

---

## 開發源起

HKAWN MAI 是一位緬甸華裔女孩的名字。她正在學習中文，但市面上的學習工具大多以英文為中介語言，對於母語是緬甸語的學習者來說，門檻很高。

這個專案就是為她打造的——以 **緬甸語 ↔ 中文** 直接對照的方式，讓緬甸語使用者繞過英文，直接用母語學習中文。所有介面文字都可切換中/緬文。

---

## 功能特色

- **🧠 間隔重複**：8 級混合式排程，忘了自動重覆，記住間隔拉長，真正記牢才不再出現
- **🎯 HSK 分級**：初級 / 中級 / 高級三級，對應 HSK 1-6 級共 7,419 詞
- **📖 到期優先**：每天打開先複習到期的單字，學完再學新的，無上限
- **🔀 翻卡學習**：看中文想緬文，翻卡確認，雙向記憶
- **📝 兩階段測驗**：先選單字(2分)再選例句(1分)，優先納入待複習單字
- **🔊 真人發音**：14,838 個 mp3 音檔，CI 自動解壓，直讀單檔
- **🌙 深色模式**：支援暗黑主題
- **🌐 雙語介面**：一鍵切換簡體中文 ↔ 緬甸語
- **💾 進度備份**：支援匯出/匯入學習進度 JSON
- **📱 PWA + APK**：可加入手機主畫面，也有正式簽名 APK

---

## 使用方式

### PWA 版

1. 用手機 Chrome 或 Safari 開啟 **https://minglabtw.github.io/hkawnmai/**
2. 選單 → **加入主畫面**
3. 像原生 App 一樣使用，音頻自動從 CDN 串流

### Android APK 版

前往 [GitHub Releases](https://github.com/minglabtw/hkawnmai/releases) 下載 `app-release.apk`

> 若從舊版升級（com.hkawnmai.app），請先解除安裝舊版再安裝新版。

---

## 學習系統

### 8 級間隔重複

每個單字有 0～7 級的學習等級，決定下次出現的時間：

| 等級 | 間隔 | 意義 |
|------|------|------|
| 0 | 立即 | 剛忘記，馬上再出現 |
| 1 | 1 分鐘 | 短時確認 |
| 2 | 10 分鐘 | 短期記憶 |
| 3 | 1 小時 | 記憶鞏固 |
| 4 | 1 天 | 日複習 |
| 5 | 3 天 | 週複習 |
| 6 | 7 天 | 長期鞏固 |
| 7 | 30 天 | 幾乎掌握 |

### 按鈕行為

```
新單字 → 按「記得」→ 等級 +1，下次更久後再見
       → 按「忘了」→ 等級歸 0，馬上再出現

複習中 → 按「記得」→ 等級 +1，間隔遞增
       → 按「忘了」→ 等級歸 0，重新循環

等級 7 → 已掌握，不再出現（除非按「忘了」）
```

### 每天學習流程

1. 優先排入所有**已到期**的單字（到期越久排越前面）
2. 學完到期單字後，繼續學新單字（無每日上限）
3. 測驗也優先納入到期單字

### 測驗模式

兩階段出題：
- **第一階段**：看中文，從 4 個選項中選正確緬文（答對 2 分）
- **第二階段**：看例句，從 4 個選項中選正確緬文翻譯（答對 1 分）
- 每題最高 3 分，出題優先納入待複習單字

---

## 音頻系統

- 14,838 個 mp3（7,419 詞 × 中文發音 + 例句發音），總容量約 300MB
- **PWA**：CI 自動解壓音頻 zip → 部署到 GitHub Pages → 直讀單檔 mp3（8-25KB/檔）
- **APK**：內建完整音頻，無需網路
- 不需要 JSZip、不需要 IndexedDB

---

## 技術架構

```
prototype.html                單檔 HTML（所有 CSS/JS 行內，~1250 行）
├── data/*.js                 詞彙資料（延遲載入）
├── data/*.zip                音頻壓縮包（CI 解壓用）
├── icons/                    PWA 圖示
├── service-worker.js         PWA Service Worker
├── manifest.json             PWA manifest
├── android/                  Capacitor 專案 + Release keystore + 緬字圖示
├── build.sh                  APK 建置腳本
└── .github/workflows/        GitHub Actions 自動部署（含音頻解壓）

音頻流程：
  git push → Actions → unzip data/*.zip → build/audio/*.mp3
  → deploy to GitHub Pages
  → PWA: new Audio('/hkawnmai/audio/0001.mp3')
  → APK: new Audio('audio/0001.mp3')
```

### 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | 原生 HTML + CSS + JavaScript（單檔無框架） |
| 學習排程 | 混合式間隔重複（8 級箱 + 時間戳） |
| 發音 | HTML Audio 直讀 mp3 |
| 卡片 | 手機版 fade 切換 / 桌面版 3D 翻轉 |
| 音效 | Web Audio API（OscillatorNode） |
| 離線 | Service Worker + Cache Storage |
| 封裝 | Capacitor + Android SDK |
| 簽名 | JDK keytool + release keystore |
| 部署 | GitHub Actions → GitHub Pages |

### 資料延遲載入

- `beginner.js`（~500KB）頁面載入時同步載入
- `intermediate.js`（~1.3MB）/ `advanced.js`（~2.2MB）切換級別時動態載入

---

## 本地開發

```bash
# 開發：直接編輯 prototype.html
# 預覽（音頻需要 HTTP 才可播放）
python3 -m http.server 8000
# http://localhost:8000/prototype.html
```

### APK 建置

```bash
./build.sh
# 產出：android/app/build/outputs/apk/release/app-release.apk
```

### PWA 部署

推送至 `main` 分支 → GitHub Actions 自動部署：
https://minglabtw.github.io/hkawnmai/

---

## 開發歷史

詳細開發紀錄請見 `docs/開發日誌.md`

---

## 詞彙資料格式

```js
var words = [
  {
    word: "爱",             // 中文詞彙
    pinyin: "ài",           // 拼音
    meaning: "ချစ်သည်",    // 緬甸語釋義
    hsk: 1,                 // HSK 級別
    audio: "0001.mp3",      // 中文發音檔名
    sentence: "我爱妈妈",   // 例句
    sentence_pinyin: "Wǒ ài māma",
    sentence_meaning: "ငါအမေကိုချစ်တယ်",
    audio_e: "0001_e.mp3"   // 例句發音檔名
  },
]
```

---

## 版權

© 2026 銘於心 (MING). 智慧物聯架構實驗室

版權所有，禁止商業使用與未授權散布。
