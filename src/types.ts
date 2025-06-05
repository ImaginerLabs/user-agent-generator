// 浏览器类型
export type BrowserType = 'chrome' | 'safari' | 'firefox'; // 支持的浏览器

// 设备类型
export type DeviceType = 'mac' | 'windows' | 'iphone' | 'ipad'; // 支持的设备

// 操作系统类型
export type OSType = 'macos' | 'windows' | 'ios' | 'ipados'; // 支持的操作系统

// 浏览器元信息
// 如 { name: 'chrome', version: '114.0.5735.133' }
type BrowserMeta = {
  name: BrowserType;
  version: string;
};

// 操作系统元信息
// 如 { name: 'macos', version: '12.6' }
type OSMeta = {
  name: OSType;
  version: string;
};

// UA 元信息结构
export interface UserAgentMeta {
  browser: BrowserMeta; // 浏览器信息
  os: OSMeta; // 操作系统信息
  device: 'desktop' | 'mobile' | 'tablet'; // 设备类型
}

// generateUserAgent 参数
export interface GenerateUserAgentOptions {
  browser?: BrowserType; // 指定浏览器
  device?: DeviceType; // 指定设备
  count?: number; // 生成数量
  withMeta?: boolean; // 是否返回 meta 信息
}

// UA 返回结构（带 meta）
export interface UserAgentWithMeta {
  ua: string; // UA 字符串
  meta: UserAgentMeta; // 结构化 meta 信息
}
