# 🎭 user-agent-generator

> 🚀 高性能、权重分布、批量生成的 User-Agent 伪装库。支持多浏览器、多设备、真实概率分布，动态拼接 webkit/safari 号，极致防反爬。适用于爬虫、自动化测试、代理池等多场景。

---

## ✨ 特性亮点

- ✅ **权重分布**：主流版本/系统/内核高权重，冷门低权重，真实概率分布，极难被频率分析检测
- ✅ **多浏览器/多设备**：支持 Chrome / Safari / Firefox，macOS / Windows / iPhone / iPad
- ✅ **动态 UA 拼接**：webkit/safari 号等字段动态采样，结构高度还原真实浏览器
- ✅ **批量高性能**：毫秒级批量生成，1000条UA < 50ms
- ✅ **可选 meta 信息**：可返回结构化元信息，便于二次处理
- ✅ **数据池可扩展**：所有数据均可自定义扩充，支持权重分布
- ✅ **自动化测试**：功能、性能、数据一致性全覆盖，保障健壮性

---

## 📦 安装

```bash
npm install user-agent-generator
```

## 🔧 快速上手

```js
import { generateUserAgent } from "user-agent-generator";

// 生成 3 条 Chrome + Mac 风格的 UA（含详细信息）
const uas = generateUserAgent({
  browser: "chrome",
  device: "mac",
  count: 3,
  withMeta: true,
});
console.log(uas);
```

## ✅ 输出示例（带 meta）

```json
[
  {
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.91 Safari/537.36",
    "meta": {
      "browser": { "name": "chrome", "version": "124.0.6367.91" },
      "os": { "name": "macos", "version": "14.4" },
      "device": "desktop"
    }
  }
]
```

## 🧰 API 参数说明

| 参数名     | 类型                                             | 是否必填 | 默认值  | 说明                                 |
| ---------- | ------------------------------------------------ | -------- | ------- | ------------------------------------ |
| `browser`  | `'chrome'` ｜ `'safari'` ｜ `'firefox'`          | 否       | 随机    | 指定浏览器类型                       |
| `device`   | `'mac'` ｜ `'windows'` ｜ `'iphone'` ｜ `'ipad'` | 否       | 随机    | 指定设备类型                         |
| `count`    | `number`                                         | 否       | `1`     | 要生成多少条 UA                      |
| `withMeta` | `boolean`                                        | 否       | `false` | 是否返回版本号等元信息（结构化数据） |

## 🔍 支持的版本范围与分布

| 分类     | 名称           | 版本范围             | 分布说明               |
| -------- | -------------- | -------------------- | ---------------------- |
| 浏览器   | Chrome         | `94 ~ 124`           | 主流高权重，冷门低权重 |
|          | Safari         | `13 ~ 17`            | 主流高权重，冷门低权重 |
|          | Firefox        | `88 ~ 126`           | 主流高权重，冷门低权重 |
| 操作系统 | macOS          | `10.15 ~ 14.4`       | 主流高权重，冷门低权重 |
|          | Windows        | `Windows 7 ~ 11`     | 主流高权重，冷门低权重 |
|          | iOS (iPhone)   | `13 ~ 17`            | 主流高权重，冷门低权重 |
|          | iPadOS         | `13 ~ 17`            | 主流高权重，冷门低权重 |
| UA 细节  | webkitVersions | 多主流版本，权重分布 |
|          | safariVersions | 多主流版本，权重分布 |

## 📁 项目目录结构

```
user-agent-generator/
├── /data/                  # 各类版本信息数据文件（权重分布，可扩展）
│   ├── chrome.json
│   ├── safari.json
│   ├── firefox.json
│   ├── macos.json
│   ├── windows.json
│   ├── ios.json
│   └── ipad.json
├── /src/
│   ├── index.ts            # 主入口模块
│   ├── generator.ts        # UA 构造逻辑（权重分布、动态拼接）
│   ├── metaBuilder.ts      # Meta 信息组装逻辑
│   ├── types.ts            # 类型定义
│   └── utils.ts            # 工具函数
├── /examples/
│   └── demo.js             # 示例用法
├── /test/
│   ├── generator.test.ts   # 功能与性能测试
│   └── dataConsistency.test.ts # 数据一致性测试
├── README.md
├── package.json
└── tsconfig.json
```

## 🧪 示例：生成不同设备 UA

```js
// Windows 上的 Firefox
generateUserAgent({
  browser: "firefox",
  device: "windows",
  withMeta: true,
});

// iPhone 上的 Safari
generateUserAgent({
  browser: "safari",
  device: "iphone",
  withMeta: true,
});
```

## 🧠 典型应用场景

- 🕷️ Web 爬虫 / 防反爬 User-Agent 池构建
- 🤖 自动化测试（Selenium / Puppeteer）
- 🔐 安全测试、模拟访问
- 🛰️ 构建代理服务器或中间件

## 🚀 性能说明

- 单次生成 1000 条 UA < 50ms（M1/16G Mac 实测）
- 支持高并发、批量调用

## 🛡️ 数据一致性与健壮性

- 所有 data/\*.json 文件均有自动化测试，保障数据结构和内容健康
- UA 结构高度还原真实浏览器，webKit/Safari 版本动态拼接
- 权重分布机制，极大提升反检测能力

## 📃 License

MIT License © 2025
