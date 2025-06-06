<div align="center">

[中文文档](./README_CN.md) | [English](./README.md)

</div>

# 🎭 user-agent-generator

> 🚀 高性能、权重分布、批量生成的 User-Agent 伪装库。支持多浏览器、多设备、真实概率分布，动态拼接 webkit/safari 号，极致防反爬。适用于爬虫、自动化测试、代理池等多场景。

---

## ✨ 特性亮点

- ✅ **智能权重分布**：基于真实使用数据，主流版本/系统/内核高权重，冷门低权重，真实概率分布，极难被频率分析检测
- ✅ **多浏览器/多设备**：支持 Chrome / Safari / Firefox，macOS / Windows / iPhone / iPad
- ✅ **动态 UA 拼接**：webkit/safari 号等字段动态采样，结构高度还原真实浏览器
- ✅ **批量高性能**：毫秒级批量生成，10000条UA < 100ms
- ✅ **可选 meta 信息**：可返回结构化元信息，便于二次处理
- ✅ **数据池可扩展**：所有数据均可自定义扩充，支持权重分布
- ✅ **自动化测试**：功能、性能、数据一致性全覆盖，保障健壮性

---

## 📦 安装

```bash
npm i @imaginerlabs/user-agent-generator
```

## 🔧 快速上手

```js
import { generateUserAgent } from '@imaginerlabs/user-agent-generator';

// 生成 Chrome + Mac 风格的 UA
const ua = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
});
console.log(ua);
// 输出示例：Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36

// 生成 Safari + iPhone 风格的 UA
const ua2 = generateUserAgent({
  browser: 'safari',
  device: 'iphone',
});
console.log(ua2);
// 输出示例：Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1

// 生成 Firefox + Windows 风格的 UA
const ua3 = generateUserAgent({
  browser: 'firefox',
  device: 'windows',
});
console.log(ua3);
// 输出示例：Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0
```

## ✅ 批量生成示例

```js
import { generateUserAgent } from '@imaginerlabs/user-agent-generator';

// 批量生成 3 条 Chrome + Mac 风格的 UA
const uas = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
  count: 3,
});
console.log(uas);
// 输出示例：
// [
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36",
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.92 Safari/537.36",
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.93 Safari/537.36"
// ]
```

## ✅ 带元信息的生成示例

```js
import { generateUserAgent } from '@imaginerlabs/user-agent-generator';

// 生成带元信息的 Chrome + Mac UA
const result = generateUserAgent({
  browser: 'chrome',
  device: 'mac',
  withMeta: true,
});
console.log(result);
// 输出示例：
// {
//   "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36",
//   "meta": {
//     "browser": { "name": "chrome", "version": "124.0.6367.91" },
//     "os": { "name": "macos", "version": "14.4" },
//     "device": "desktop"
//   }
// }
```

## 🧰 API 参数说明

| 参数名     | 类型                                             | 是否必填 | 默认值  | 说明                                 |
| ---------- | ------------------------------------------------ | -------- | ------- | ------------------------------------ |
| `browser`  | `'chrome'` ｜ `'safari'` ｜ `'firefox'`          | 否       | 随机    | 指定浏览器类型                       |
| `device`   | `'mac'` ｜ `'windows'` ｜ `'iphone'` ｜ `'ipad'` | 否       | 随机    | 指定设备类型                         |
| `count`    | `number`                                         | 否       | `1`     | 要生成多少条 UA                      |
| `withMeta` | `boolean`                                        | 否       | `false` | 是否返回版本号等元信息（结构化数据） |

## 🔄 返回值类型说明

| 场景             | 返回类型              | 说明                           |
| ---------------- | --------------------- | ------------------------------ |
| 单个UA，无元数据 | `string`              | 直接返回UA字符串               |
| 单个UA，带元数据 | `UserAgentWithMeta`   | 返回包含ua和meta字段的对象     |
| 多个UA，无元数据 | `string[]`            | 返回UA字符串数组               |
| 多个UA，带元数据 | `UserAgentWithMeta[]` | 返回包含ua和meta字段的对象数组 |
| count=0          | `[]`                  | 返回空数组                     |

### UserAgentWithMeta 结构

```typescript
interface UserAgentWithMeta {
  ua: string; // User Agent 字符串
  meta: {
    browser: {
      name: BrowserType; // 'chrome' | 'safari' | 'firefox'
      version: string; // 浏览器版本号
    };
    os: {
      name: OSType; // 'macos' | 'windows' | 'ios' | 'ipados'
      version: string; // 操作系统版本号
    };
    device: 'desktop' | 'mobile' | 'tablet'; // 设备类型
  };
}
```

## 🔍 支持的版本范围与分布

| 分类     | 名称         | 版本范围          | 分布说明                                                  |
| -------- | ------------ | ----------------- | --------------------------------------------------------- |
| 浏览器   | Chrome       | `94 ~ 124`        | 主流高权重（124权重25，123权重20），冷门低权重（94权重1） |
|          | Safari       | `13 ~ 17`         | 主流高权重，冷门低权重                                    |
|          | Firefox      | `88 ~ 126`        | 主流高权重，冷门低权重                                    |
| 操作系统 | macOS        | `10.15 ~ 14.4`    | 主流高权重，冷门低权重                                    |
|          | Windows      | `Windows 7 ~ 11`  | 主流高权重，冷门低权重                                    |
|          | iOS (iPhone) | `13 ~ 17`         | 主流高权重，冷门低权重                                    |
|          | iPadOS       | `13 ~ 17`         | 主流高权重，冷门低权重                                    |
| UA 细节  | WebKit版本   | `537.34 ~ 537.36` | 动态子版本采样，高度还原真实浏览器                        |
|          | Safari版本   | `537.34 ~ 537.36` | 动态子版本采样，高度还原真实浏览器                        |

## 📁 项目目录结构

```
user-agent-generator/
├── /data/                  # 各类版本信息数据文件（权重分布，可扩展）
│   ├── chrome.json        # Chrome 版本数据（含权重）
│   ├── safari.json        # Safari 版本数据（含权重）
│   ├── firefox.json       # Firefox 版本数据（含权重）
│   ├── macos.json         # macOS 版本数据（含权重）
│   ├── windows.json       # Windows 版本数据（含权重）
│   ├── ios.json           # iOS 版本数据（含权重）
│   └── ipad.json          # iPadOS 版本数据（含权重）
├── /src/
│   ├── index.ts           # 主入口模块
│   ├── generator.ts       # UA 构造逻辑（权重分布、动态拼接）
│   ├── metaBuilder.ts     # Meta 信息组装逻辑
│   ├── types.ts           # 类型定义
│   └── utils.ts           # 工具函数
├── /test/
│   ├── generator.test.ts                # 功能与性能测试（包含10000条UA生成性能测试）
│   ├── dataConsistency.test.ts          # 数据一致性测试
│   ├── weightDistribution.test.ts       # 权重分布测试
│   ├── weightedRandomEdgeCases.test.ts  # 边界情况测试
│   └── errorHandling.test.ts            # 错误处理测试
├── README.md
├── package.json
└── tsconfig.json
```

## 🧠 典型应用场景

- 🕷️ Web 爬虫 / 防反爬 User-Agent 池构建
- 🤖 自动化测试（Selenium / Puppeteer）
- 🔐 安全测试、模拟访问
- 🛰️ 构建代理服务器或中间件
- 📊 数据采集与分析
- 🎯 A/B测试与用户行为模拟

## 🚀 性能说明

- 单次生成 10000 条 UA < 100ms（基于测试用例）
- 支持高并发、批量调用
- 使用随机数池优化性能，预生成1000个随机数避免频繁调用Math.random()
- 数据文件缓存机制，避免重复读取文件

## 🛡️ 数据一致性与健壮性

- 所有 data/\*.json 文件均有自动化测试，保障数据结构和内容健康
- UA 结构高度还原真实浏览器，WebKit/Safari 版本动态拼接
- 权重分布机制，极大提升反检测能力，支持带子值的权重版本选择
- 完整的类型定义，支持 TypeScript
- 边界情况处理：count=0返回空数组，错误处理机制完善
- 5个测试套件全覆盖：功能测试、性能测试、数据一致性、权重分布、错误处理

## 📃 License

MIT License © 2025
