import { BrowserType, DeviceType, GenerateUserAgentOptions, UserAgentWithMeta } from './types';
import { readVersions, pickRandom, pickWeightedRandom } from './utils';
import { buildMeta } from './metaBuilder';

// 浏览器与数据文件的映射关系
const browserDataFile: Record<BrowserType, string> = {
  chrome: 'chrome.json',
  safari: 'safari.json',
  firefox: 'firefox.json',
};

// 设备与系统数据文件的映射关系
const osDataFile: Record<DeviceType, string> = {
  mac: 'macos.json',
  windows: 'windows.json',
  iphone: 'ios.json',
  ipad: 'ipad.json',
};

// 设备类型与 UA 片段生成规则
const deviceUAInfo = {
  mac: {
    // 生成 macOS UA 片段
    osString: (osVersion: string) => `Macintosh; Intel Mac OS X ${osVersion.replace('.', '_')}`,
    device: 'desktop',
    os: 'macos',
  },
  windows: {
    // 生成 Windows UA 片段
    osString: (osVersion: string) =>
      `Windows NT ${osVersion === '7' ? '6.1' : osVersion === '8' ? '6.2' : osVersion === '8.1' ? '6.3' : osVersion === '10' ? '10.0' : '10.0'}; Win64; x64`,
    device: 'desktop',
    os: 'windows',
  },
  iphone: {
    // 生成 iPhone UA 片段
    osString: (osVersion: string) =>
      `iPhone; CPU iPhone OS ${osVersion.replace('.', '_')} like Mac OS X`,
    device: 'mobile',
    os: 'ios',
  },
  ipad: {
    // 生成 iPad UA 片段
    osString: (osVersion: string) => `iPad; CPU OS ${osVersion.replace('.', '_')} like Mac OS X`,
    device: 'tablet',
    os: 'ipados',
  },
};

// UA 模板
const uaTemplates = {
  chrome: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
  safari: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`,
  firefox: (osString: string, version: string) =>
    `Mozilla/5.0 (${osString}; rv:${version}) Gecko/20100101 Firefox/${version}`,
};

/**
 * 生成 User-Agent 字符串或结构化对象
 * @param options 生成参数（浏览器、设备、数量、是否带 meta）
 * @returns 单条 UA 字符串/对象，或批量数组
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
    // 随机选取系统版本
    const osVersions = readVersions(osDataFile[device]);
    let osVersion: string;
    if (osVersions[0] && typeof osVersions[0] === 'object') {
      osVersion = pickWeightedRandom(osVersions as any) as string;
    } else {
      osVersion = pickRandom(osVersions as string[]);
    }
    const osString = osInfo.osString(osVersion);
    let browserVersion = '';
    switch (browser) {
      case 'chrome': {
        const chromeData = require(`../data/${browserDataFile.chrome}`);
        // 版本号
        let chromeVersion: string;
        if (chromeData.versions[0] && typeof chromeData.versions[0] === 'object') {
          chromeVersion = pickWeightedRandom(chromeData.versions);
        } else {
          chromeVersion = pickRandom(chromeData.versions as string[]);
        }
        // webkit
        let webkitVersion: string;
        if (
          chromeData.webkitVersions &&
          chromeData.webkitVersions[0] &&
          typeof chromeData.webkitVersions[0] === 'object'
        ) {
          webkitVersion = pickWeightedRandom(chromeData.webkitVersions);
        } else {
          webkitVersion = pickRandom(chromeData.webkitVersions as string[]);
        }
        // safari
        let safariVersion: string;
        if (
          chromeData.safariVersions &&
          chromeData.safariVersions[0] &&
          typeof chromeData.safariVersions[0] === 'object'
        ) {
          safariVersion = pickWeightedRandom(chromeData.safariVersions);
        } else {
          safariVersion = pickRandom(chromeData.safariVersions as string[]);
        }
        browserVersion = chromeVersion;
        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${safariVersion}`;
        break;
      }
      case 'safari': {
        const safariData = require(`../data/${browserDataFile.safari}`);
        let safariVersion: string;
        if (safariData.versions[0] && typeof safariData.versions[0] === 'object') {
          browserVersion = pickWeightedRandom(safariData.versions);
        } else {
          browserVersion = pickRandom(safariData.versions as string[]);
        }
        let webkitVersion: string;
        if (
          safariData.webkitVersions &&
          safariData.webkitVersions[0] &&
          typeof safariData.webkitVersions[0] === 'object'
        ) {
          webkitVersion = pickWeightedRandom(safariData.webkitVersions);
        } else {
          webkitVersion = pickRandom(safariData.webkitVersions as string[]);
        }
        ua = `Mozilla/5.0 (${osString}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Version/${browserVersion} Safari/${webkitVersion}`;
        break;
      }
      case 'firefox': {
        const firefoxVersions = readVersions(browserDataFile.firefox);
        let ffVersion: string;
        if (firefoxVersions[0] && typeof firefoxVersions[0] === 'object') {
          ffVersion = pickWeightedRandom(firefoxVersions as any);
        } else {
          ffVersion = pickRandom(firefoxVersions as string[]);
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
