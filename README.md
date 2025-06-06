<div align="center">

[中文文档](./README_CN.md) | [English](./README.md)

</div>

# 🎭 user-agent-generator

> 🚀 High-performance, weighted distribution, batch generation User-Agent spoofing library. Supports multiple browsers, devices, realistic probability distribution, dynamic webkit/safari number concatenation, ultimate anti-crawling protection. Perfect for web scraping, automated testing, proxy pools and more.

---

## ✨ Key Features

- ✅ **Smart Weighted Distribution**: Based on real usage data, mainstream versions/systems/kernels have high weights, niche ones have low weights, realistic probability distribution, extremely difficult to detect by frequency analysis
- ✅ **Multi-browser/Multi-device**: Supports Chrome / Safari / Firefox, macOS / Windows / iPhone / iPad
- ✅ **Dynamic UA Assembly**: webkit/safari numbers and other fields are dynamically sampled, highly realistic browser structure restoration
- ✅ **High-performance Batch Generation**: Millisecond-level batch generation, 10000 UAs < 100ms
- ✅ **Optional Meta Information**: Can return structured meta information for secondary processing
- ✅ **Extensible Data Pool**: All data can be customized and extended, supports weighted distribution
- ✅ **Automated Testing**: Full coverage of functionality, performance, and data consistency tests, ensuring robustness

---

## 📦 Installation

```bash
npm install user-agent-generator
```

## 🔧 Quick Start

```js
import { generateUserAgent } from 'user-agent-generator';

// Generate Chrome + Mac style UA
const ua = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
});
console.log(ua);
// Example output: Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36

// Generate Safari + iPhone style UA
const ua2 = generateUserAgent({
  browser: 'safari',
  device: 'iphone',
});
console.log(ua2);
// Example output: Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1

// Generate Firefox + Windows style UA
const ua3 = generateUserAgent({
  browser: 'firefox',
  device: 'windows',
});
console.log(ua3);
// Example output: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0
```

## ✅ Batch Generation Example

```js
// Generate 3 Chrome + Mac style UAs in batch
const uas = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
  count: 3,
});
console.log(uas);
// Example output:
// [
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36",
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.92 Safari/537.36",
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.93 Safari/537.36"
// ]
```

## ✅ Generation with Meta Information Example

```js
// Generate Chrome + Mac UA with meta information
const result = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
  withMeta: true,
});
console.log(result);
// Example output:
// {
//   "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36",
//   "meta": {
//     "browser": { "name": "chrome", "version": "124.0.6367.91" },
//     "os": { "name": "macos", "version": "14.4" },
//     "device": "desktop"
//   }
// }
```

## 🧰 API Parameters

| Parameter  | Type                                             | Required | Default | Description                                     |
| ---------- | ------------------------------------------------ | -------- | ------- | ----------------------------------------------- |
| `browser`  | `'chrome'` ｜ `'safari'` ｜ `'firefox'`          | No       | Random  | Specify browser type                            |
| `device`   | `'mac'` ｜ `'windows'` ｜ `'iphone'` ｜ `'ipad'` | No       | Random  | Specify device type                             |
| `count`    | `number`                                         | No       | `1`     | Number of UAs to generate                       |
| `withMeta` | `boolean`                                        | No       | `false` | Whether to return version numbers and meta info |

## 🔄 Return Types

| Scenario                | Return Type           | Description                               |
| ----------------------- | --------------------- | ----------------------------------------- |
| Single UA, no meta      | `string`              | Returns UA string directly                |
| Single UA, with meta    | `UserAgentWithMeta`   | Returns object with ua and meta fields    |
| Multiple UAs, no meta   | `string[]`            | Returns array of UA strings               |
| Multiple UAs, with meta | `UserAgentWithMeta[]` | Returns array of objects with ua and meta |
| count=0                 | `[]`                  | Returns empty array                       |

### UserAgentWithMeta Structure

```typescript
interface UserAgentWithMeta {
  ua: string; // User Agent string
  meta: {
    browser: {
      name: BrowserType; // 'chrome' | 'safari' | 'firefox'
      version: string; // Browser version number
    };
    os: {
      name: OSType; // 'macos' | 'windows' | 'ios' | 'ipados'
      version: string; // Operating system version number
    };
    device: 'desktop' | 'mobile' | 'tablet'; // Device type
  };
}
```

## 🔍 Supported Version Ranges & Distribution

| Category         | Name           | Version Range     | Distribution Description                                                              |
| ---------------- | -------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Browser          | Chrome         | `94 ~ 124`        | Mainstream high weight (124 weight 25, 123 weight 20), niche low weight (94 weight 1) |
|                  | Safari         | `13 ~ 17`         | Mainstream high weight, niche low weight                                              |
|                  | Firefox        | `88 ~ 126`        | Mainstream high weight, niche low weight                                              |
| Operating System | macOS          | `10.15 ~ 14.4`    | Mainstream high weight, niche low weight                                              |
|                  | Windows        | `Windows 7 ~ 11`  | Mainstream high weight, niche low weight                                              |
|                  | iOS (iPhone)   | `13 ~ 17`         | Mainstream high weight, niche low weight                                              |
|                  | iPadOS         | `13 ~ 17`         | Mainstream high weight, niche low weight                                              |
| UA Details       | WebKit Version | `537.34 ~ 537.36` | Dynamic sub-version sampling, highly realistic browser restoration                    |
|                  | Safari Version | `537.34 ~ 537.36` | Dynamic sub-version sampling, highly realistic browser restoration                    |

## 📁 Project Structure

```
user-agent-generator/
├── /data/                  # Various version information data files (weighted distribution, extensible)
│   ├── chrome.json        # Chrome version data (with weights)
│   ├── safari.json        # Safari version data (with weights)
│   ├── firefox.json       # Firefox version data (with weights)
│   ├── macos.json         # macOS version data (with weights)
│   ├── windows.json       # Windows version data (with weights)
│   ├── ios.json           # iOS version data (with weights)
│   └── ipad.json          # iPadOS version data (with weights)
├── /src/
│   ├── index.ts           # Main entry module
│   ├── generator.ts       # UA construction logic (weighted distribution, dynamic assembly)
│   ├── metaBuilder.ts     # Meta information assembly logic
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utility functions
├── /test/
│   ├── generator.test.ts                # Functionality and performance tests (includes 10000 UA generation performance test)
│   ├── dataConsistency.test.ts          # Data consistency tests
│   ├── weightDistribution.test.ts       # Weight distribution tests
│   ├── weightedRandomEdgeCases.test.ts  # Edge case tests
│   └── errorHandling.test.ts            # Error handling tests
├── README.md
├── package.json
└── tsconfig.json
```

## 🧠 Typical Use Cases

- 🕷️ Web scraping / Anti-crawling User-Agent pool construction
- 🤖 Automated testing (Selenium / Puppeteer)
- 🔐 Security testing, simulated access
- 🛰️ Building proxy servers or middleware
- 📊 Data collection and analysis
- 🎯 A/B testing and user behavior simulation

## 🚀 Performance

- Single generation of 10000 UAs < 100ms (based on test cases)
- Supports high concurrency and batch calls
- Uses random number pool optimization for performance, pre-generates 1000 random numbers to avoid frequent Math.random() calls
- Data file caching mechanism to avoid repeated file reads

## 🛡️ Data Consistency & Robustness

- All data/\*.json files have automated tests to ensure data structure and content health
- UA structure highly restores real browsers, WebKit/Safari versions dynamically assembled
- Weighted distribution mechanism greatly improves anti-detection capability, supports weighted version selection with sub-values
- Complete type definitions, supports TypeScript
- Edge case handling: count=0 returns empty array, comprehensive error handling mechanism
- 5 test suites with full coverage: functionality tests, performance tests, data consistency, weight distribution, error handling

## 📃 License

MIT License © 2025
