import { BrowserType, UserAgentMeta } from './types';

/**
 * 组装 UA 的 meta 信息结构
 */
interface BuildMetaParams {
  browser: BrowserType; // 浏览器类型
  browserVersion: string; // 浏览器版本
  os: string; // 操作系统类型
  osVersion: string; // 操作系统版本
  device: 'desktop' | 'mobile' | 'tablet'; // 设备类型
}

/**
 * 构建 UA 的 meta 信息
 * @param params 组装参数
 * @returns UserAgentMeta 结构
 */
export function buildMeta(params: BuildMetaParams): UserAgentMeta {
  return {
    browser: {
      name: params.browser,
      version: params.browserVersion,
    },
    os: {
      name: params.os as any,
      version: params.osVersion,
    },
    device: params.device,
  };
}
