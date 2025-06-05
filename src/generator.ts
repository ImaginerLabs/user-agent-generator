/**
 * User-Agent Generator Module
 * User-Agent 生成器模块
 *
 * This module provides functionality to generate realistic User-Agent strings
 * for different browsers, operating systems, and devices.
 * 该模块提供生成不同浏览器、操作系统和设备的真实 User-Agent 字符串的功能。
 */

import { BrowserType, DeviceType, GenerateUserAgentOptions, UserAgentWithMeta } from './types';
import {
  readVersions,
  pickRandom,
  pickWeightedRandom,
  pickWeightedVersionWithSubValue,
} from './utils';
import { buildMeta } from './metaBuilder';

// 缓存所有数据文件的内容 / Cache all data file contents
const dataCache: Record<string, any> = {};

// 预生成一批随机数 / Pre-generate a batch of random numbers
const randomPool: number[] = [];
const POOL_SIZE = 1000;
for (let i = 0; i < POOL_SIZE; i++) {
  randomPool.push(Math.random());
}
let randomIndex = 0;

// 获取随机数的函数 / Function to get random number
function getRandom(): number {
  if (randomIndex >= POOL_SIZE) {
    randomIndex = 0;
    // 重新填充随机数池 / Refill random number pool
    for (let i = 0; i < POOL_SIZE; i++) {
      randomPool[i] = Math.random();
    }
  }
  return randomPool[randomIndex++];
}

// Mapping between browser types and their data files
// 浏览器类型与其数据文件的映射关系
const browserDataFile: Record<BrowserType, string> = {
  chrome: 'chrome.json',
  safari: 'safari.json',
  firefox: 'firefox.json',
};

// Mapping between device types and their OS data files
// 设备类型与其操作系统数据文件的映射关系
const osDataFile: Record<DeviceType, string> = {
  mac: 'macos.json',
  windows: 'windows.json',
  iphone: 'ios.json',
  ipad: 'ipad.json',
};

// Device type specific UA string generation rules
// 设备类型特定的 UA 字符串生成规则
const deviceUAInfo = {
  mac: {
    // Generate macOS UA string fragment
    // 生成 macOS UA 字符串片段
    osString: (osVersion: string) => `Macintosh; Intel Mac OS X ${osVersion.replace('.', '_')}`,
    device: 'desktop',
    os: 'macos',
  },
  windows: {
    // Generate Windows UA string fragment
    // 生成 Windows UA 字符串片段
    osString: (osVersion: string) =>
      `Windows NT ${osVersion === '7' ? '6.1' : osVersion === '8' ? '6.2' : osVersion === '8.1' ? '6.3' : osVersion === '10' ? '10.0' : '10.0'}; Win64; x64`,
    device: 'desktop',
    os: 'windows',
  },
  iphone: {
    // Generate iPhone UA string fragment
    // 生成 iPhone UA 字符串片段
    osString: (osVersion: string) =>
      `iPhone; CPU iPhone OS ${osVersion.replace('.', '_')} like Mac OS X`,
    device: 'mobile',
    os: 'ios',
  },
  ipad: {
    // Generate iPad UA string fragment
    // 生成 iPad UA 字符串片段
    osString: (osVersion: string) => `iPad; CPU OS ${osVersion.replace('.', '_')} like Mac OS X`,
    device: 'tablet',
    os: 'ipados',
  },
};

// UA string templates for different browsers
// 不同浏览器的 UA 字符串模板
const uaTemplates = {
  chrome: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
  safari: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`,
  firefox: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}; rv:${version}) Gecko/20100101 Firefox/${version}`,
};

// 获取缓存的数据 / Get cached data
function getCachedData(file: string): any {
  if (!dataCache[file]) {
    dataCache[file] = require(`../data/${file}`);
  }
  return dataCache[file];
}

/**
 * Generate User-Agent string or structured object
 * 生成 User-Agent 字符串或结构化对象
 *
 * @param options Generation parameters (browser, device, count, withMeta)
 * @param options 生成参数（浏览器、设备、数量、是否包含元数据）
 * @returns Single UA string/object, or array of UAs
 * @returns 单个 UA 字符串/对象，或 UA 数组
 */
export function generateUserAgent(
  options: GenerateUserAgentOptions = {},
): string | UserAgentWithMeta | (string | UserAgentWithMeta)[] {
  const count = options.count || 1;
  const browser: BrowserType = options.browser || pickRandom(['chrome', 'safari', 'firefox']);
  const device: DeviceType = options.device || pickRandom(['mac', 'windows', 'iphone', 'ipad']);

  const result: (string | UserAgentWithMeta)[] = [];
  for (let i = 0; i < count; i++) {
    let ua = '';
    let meta: UserAgentWithMeta['meta'] | undefined;
    const osInfo = deviceUAInfo[device];

    // 使用缓存的数据 / Use cached data
    const osData = getCachedData(osDataFile[device]);
    let osVersion: string;
    if (
      osData.versions[0] &&
      typeof osData.versions[0] === 'object' &&
      'subValue' in osData.versions[0]
    ) {
      osVersion = pickWeightedVersionWithSubValue(osData.versions, getRandom());
    } else {
      osVersion = pickRandom(osData.versions as string[], getRandom());
    }

    const osString = osInfo.osString(osVersion);
    let browserVersion = '';

    switch (browser) {
      case 'chrome': {
        const chromeData = getCachedData(browserDataFile.chrome);
        let chromeVersion: string;
        if (
          chromeData.versions[0] &&
          typeof chromeData.versions[0] === 'object' &&
          'subValue' in chromeData.versions[0]
        ) {
          chromeVersion = pickWeightedVersionWithSubValue(chromeData.versions, getRandom());
        } else {
          chromeVersion = pickRandom(chromeData.versions as string[], getRandom());
        }

        let webkitVersion: string;
        if (
          chromeData.webkitVersions &&
          chromeData.webkitVersions[0] &&
          typeof chromeData.webkitVersions[0] === 'object' &&
          'subValue' in chromeData.webkitVersions[0]
        ) {
          webkitVersion = pickWeightedVersionWithSubValue(chromeData.webkitVersions, getRandom());
        } else {
          webkitVersion = pickRandom(chromeData.webkitVersions as string[], getRandom());
        }

        let safariVersion: string;
        if (
          chromeData.safariVersions &&
          chromeData.safariVersions[0] &&
          typeof chromeData.safariVersions[0] === 'object' &&
          'subValue' in chromeData.safariVersions[0]
        ) {
          safariVersion = pickWeightedVersionWithSubValue(chromeData.safariVersions, getRandom());
        } else {
          safariVersion = pickRandom(chromeData.safariVersions as string[], getRandom());
        }

        browserVersion = chromeVersion;
        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${safariVersion}`;
        break;
      }
      case 'safari': {
        const safariData = getCachedData(browserDataFile.safari);
        let safariVersion: string;
        if (
          safariData.versions[0] &&
          typeof safariData.versions[0] === 'object' &&
          'subValue' in safariData.versions[0]
        ) {
          browserVersion = pickWeightedVersionWithSubValue(safariData.versions, getRandom());
        } else {
          browserVersion = pickRandom(safariData.versions as string[], getRandom());
        }

        let webkitVersion: string;
        if (
          safariData.webkitVersions &&
          safariData.webkitVersions[0] &&
          typeof safariData.webkitVersions[0] === 'object' &&
          'subValue' in safariData.webkitVersions[0]
        ) {
          webkitVersion = pickWeightedVersionWithSubValue(safariData.webkitVersions, getRandom());
        } else {
          webkitVersion = pickRandom(safariData.webkitVersions as string[], getRandom());
        }

        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Version/${browserVersion} Safari/${webkitVersion}`;
        break;
      }
      case 'firefox': {
        const firefoxData = getCachedData(browserDataFile.firefox);
        let ffVersion: string;
        if (
          firefoxData.versions[0] &&
          typeof firefoxData.versions[0] === 'object' &&
          'subValue' in firefoxData.versions[0]
        ) {
          ffVersion = pickWeightedVersionWithSubValue(firefoxData.versions, getRandom());
        } else {
          ffVersion = pickRandom(firefoxData.versions as string[], getRandom());
        }
        browserVersion = ffVersion;
        ua = `Mozilla/5.0 (${osString}; rv:${browserVersion}) Gecko/20100101 Firefox/${browserVersion}`;
        break;
      }
    }

    // 是否返回结构化 meta 信息
    if (options.withMeta) {
      meta = buildMeta({
        browser,
        browserVersion,
        os: osInfo.os as any,
        osVersion,
        device: osInfo.device as any,
      });
      result.push({ ua, meta });
    } else {
      result.push(ua);
    }
  }
  return count === 1 ? result[0] : result;
}
