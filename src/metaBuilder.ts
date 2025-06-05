/**
 * User-Agent Meta Information Builder
 * User-Agent 元信息构建器
 *
 * This module is responsible for building structured meta information
 * for User-Agent strings.
 * 该模块负责为 User-Agent 字符串构建结构化的元信息。
 */

import { BrowserType, UserAgentMeta } from './types';

/**
 * Parameters for building User-Agent meta information
 * 构建 User-Agent 元信息的参数
 */
interface BuildMetaParams {
  browser: BrowserType; // Browser type / 浏览器类型
  browserVersion: string; // Browser version / 浏览器版本
  os: string; // Operating system type / 操作系统类型
  osVersion: string; // Operating system version / 操作系统版本
  device: 'desktop' | 'mobile' | 'tablet'; // Device type / 设备类型
}

/**
 * Build User-Agent meta information structure
 * 构建 User-Agent 元信息结构
 *
 * @param params Build parameters / 构建参数
 * @returns UserAgentMeta structure / UserAgentMeta 结构
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
