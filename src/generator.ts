/**
 * User-Agent Generator Module
 * User-Agent 生成器模块
 *
 * This module provides functionality to generate realistic User-Agent strings
 * for different browsers, operating systems, and devices.
 * 该模块提供生成不同浏览器、操作系统和设备的真实 User-Agent 字符串的功能。
 */

import { BrowserType, DeviceType, GenerateUserAgentOptions, UserAgentWithMeta } from './types';
import { pickRandom, pickWeightedVersionWithSubValue } from './utils';
import { buildMeta } from './metaBuilder';

// Cache all data file contents
// 缓存所有数据文件的内容
const dataCache: Record<string, any> = {};

// Pre-generate a batch of random numbers
// 预生成一批随机数
const randomPool: number[] = [];
const POOL_SIZE = 1000;
for (let i = 0; i < POOL_SIZE; i++) {
  randomPool.push(Math.random());
}
let randomIndex = 0;

/**
 * Function to get random number
 * 获取随机数的函数
 *
 * @returns Random number / 随机数
 */
function getRandom(): number {
  if (randomIndex >= POOL_SIZE) {
    randomIndex = 0;
    // Refill random number pool
    // 重新填充随机数池
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
    osString: (osVersion: string) => `Macintosh; Intel Mac OS X ${osVersion.replace(/\./g, '_')}`,
    device: 'desktop',
    os: 'macos',
  },
  windows: {
    // Generate Windows UA string fragment
    // 生成 Windows UA 字符串片段
    osString: (osVersion: string) => {
      const versionMap: Record<string, string> = {
        '7': '6.1',
        '8': '6.2',
        '8.1': '6.3',
        '10': '10.0',
        '11': '10.0',
      };
      const ntVersion = versionMap[osVersion] || '10.0';
      return `Windows NT ${ntVersion}; Win64; x64`;
    },
    device: 'desktop',
    os: 'windows',
  },
  iphone: {
    // Generate iPhone UA string fragment
    // 生成 iPhone UA 字符串片段
    osString: (osVersion: string) =>
      `iPhone; CPU iPhone OS ${osVersion.replace(/\./g, '_')} like Mac OS X`,
    device: 'mobile',
    os: 'ios',
  },
  ipad: {
    // Generate iPad UA string fragment
    // 生成 iPad UA 字符串片段
    osString: (osVersion: string) => `iPad; CPU OS ${osVersion.replace(/\./g, '_')} like Mac OS X`,
    device: 'tablet',
    os: 'ipados',
  },
};

/**
 * Get cached data
 * 获取缓存的数据
 *
 * @param file Filename (e.g., chrome.json) / 文件名（如 chrome.json）
 * @returns Cached data object / 缓存的数据对象
 */
function getCachedData(file: string): any {
  if (!dataCache[file]) {
    try {
      dataCache[file] = require(`../data/${file}`);
    } catch (error) {
      throw new Error(`Failed to load data file: ${file}. Error: ${error}`);
    }
  }
  return dataCache[file];
}

/**
 * Select version from data array (supports both string and weighted object formats)
 * 从数据数组中选择版本（支持字符串和权重对象格式）
 *
 * @param versions Version array / 版本数组
 * @param random Random number / 随机数
 * @returns Selected version / 选中的版本
 */
function selectVersion(versions: any[], random: number = getRandom()): string {
  if (!versions || versions.length === 0) {
    throw new Error('Versions array is empty or undefined');
  }

  // Check if it's a weighted version with subValue
  // 检查是否为带子值的权重版本
  if (versions[0] && typeof versions[0] === 'object' && 'subValue' in versions[0]) {
    return pickWeightedVersionWithSubValue(versions, random);
  } else {
    return pickRandom(versions as string[], random);
  }
}

/**
 * Generate User-Agent string or structured object
 * 生成 User-Agent 字符串或结构化对象
 *
 * @param options Generation parameters (browser, device, count, withMeta) / 生成参数（浏览器、设备、数量、是否包含元数据）
 * @returns Single UA string/object, or array of UAs / 单个 UA 字符串/对象，或 UA 数组
 */
export function generateUserAgent(
  options: GenerateUserAgentOptions = {},
): string | UserAgentWithMeta | (string | UserAgentWithMeta)[] {
  const count = options.count ?? 1;

  // Handle edge case: count = 0
  // 处理边界情况：count = 0
  if (count === 0) {
    return [];
  }
  const browser: BrowserType = options.browser || pickRandom(['chrome', 'safari', 'firefox']);
  const device: DeviceType = options.device || pickRandom(['mac', 'windows', 'iphone', 'ipad']);

  const result: (string | UserAgentWithMeta)[] = [];

  for (let i = 0; i < count; i++) {
    let ua = '';
    let meta: UserAgentWithMeta['meta'] | undefined;
    const osInfo = deviceUAInfo[device];

    // Use cached data
    // 使用缓存的数据
    const osData = getCachedData(osDataFile[device]);
    const osVersion = selectVersion(osData.versions);
    const osString = osInfo.osString(osVersion);
    let browserVersion = '';

    switch (browser) {
      case 'chrome': {
        const chromeData = getCachedData(browserDataFile.chrome);
        const chromeVersion = selectVersion(chromeData.versions);
        const webkitVersion = selectVersion(chromeData.webkitVersions);
        const safariVersion = selectVersion(chromeData.safariVersions);

        browserVersion = chromeVersion;
        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${safariVersion}`;
        break;
      }
      case 'safari': {
        const safariData = getCachedData(browserDataFile.safari);
        browserVersion = selectVersion(safariData.versions);
        const webkitVersion = selectVersion(safariData.webkitVersions);

        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Version/${browserVersion} Safari/${webkitVersion}`;
        break;
      }
      case 'firefox': {
        const firefoxData = getCachedData(browserDataFile.firefox);
        browserVersion = selectVersion(firefoxData.versions);
        ua = `Mozilla/5.0 (${osString}; rv:${browserVersion}) Gecko/20100101 Firefox/${browserVersion}`;
        break;
      }
    }

    // Whether to return structured meta information
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

  return count === 1 && result.length > 0 ? result[0] : result;
}
