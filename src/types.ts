/**
 * Browser type definitions
 * 浏览器类型定义
 */
export type BrowserType = 'chrome' | 'safari' | 'firefox'; // Supported browsers / 支持的浏览器

/**
 * Device type definitions
 * 设备类型定义
 */
export type DeviceType = 'mac' | 'windows' | 'iphone' | 'ipad'; // Supported devices / 支持的设备

/**
 * Operating system type definitions
 * 操作系统类型定义
 */
export type OSType = 'macos' | 'windows' | 'ios' | 'ipados'; // Supported operating systems / 支持的操作系统

/**
 * Browser metadata structure
 * 浏览器元数据结构
 *
 * Example / 示例: { name: 'chrome', version: '114.0.5735.133' }
 */
type BrowserMeta = {
  name: BrowserType; // Browser name / 浏览器名称
  version: string; // Browser version / 浏览器版本
};

/**
 * Operating system metadata structure
 * 操作系统元数据结构
 *
 * Example / 示例: { name: 'macos', version: '12.6' }
 */
type OSMeta = {
  name: OSType; // OS name / 操作系统名称
  version: string; // OS version / 操作系统版本
};

/**
 * User Agent metadata structure
 * UA 元数据结构
 */
export interface UserAgentMeta {
  browser: BrowserMeta; // Browser information / 浏览器信息
  os: OSMeta; // Operating system information / 操作系统信息
  device: 'desktop' | 'mobile' | 'tablet'; // Device type / 设备类型
}

/**
 * Options for generating User Agent strings
 * 生成 User Agent 字符串的选项
 */
export interface GenerateUserAgentOptions {
  browser?: BrowserType; // Target browser / 目标浏览器
  device?: DeviceType; // Target device / 目标设备
  count?: number; // Number of UAs to generate / 要生成的 UA 数量
  withMeta?: boolean; // Whether to include metadata / 是否包含元数据
}

/**
 * User Agent string with metadata
 * 包含元数据的 User Agent 字符串
 */
export interface UserAgentWithMeta {
  ua: string; // User Agent string / UA 字符串
  meta: UserAgentMeta; // Structured metadata / 结构化元数据
}
