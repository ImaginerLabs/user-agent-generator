/**
 * Demo file for user-agent-generator package
 * 用户代理生成器包的演示文件
 */

// Import the generateUserAgent function from the built package
// 从构建的包中导入 generateUserAgent 函数
const { generateUserAgent } = require('../dist');

/**
 * Example 1: Generate Chrome user agents for Mac with metadata
 * 示例 1：生成带有元数据的 Mac Chrome 用户代理
 *
 * Demonstrates how to generate Chrome user agents for Mac devices with metadata information
 * 演示如何生成带有元数据信息的 Mac Chrome 用户代理
 */
console.log('Chrome + Mac (with meta):');
console.dir(
  generateUserAgent({
    browser: 'chrome', // 指定浏览器类型 / Specify browser type
    device: 'mac', // 指定设备类型 / Specify device type
    withMeta: true, // 返回元数据信息 / Return metadata information
  }),
  { depth: null },
);

/**
 * Example 2: Generate Safari user agents for iPhone
 * 示例 2：生成 iPhone Safari 用户代理
 *
 * Shows how to generate Safari user agents specifically for iPhone devices
 * 展示如何专门为 iPhone 设备生成 Safari 用户代理
 */
console.log('Safari + iPhone:');
console.dir(
  generateUserAgent({
    browser: 'safari', // 指定浏览器类型 / Specify browser type
    device: 'iphone', // 指定设备类型 / Specify device type
  }),
  { depth: null },
);

/**
 * Example 3: Generate Firefox user agents for Windows with metadata
 * 示例 3：生成带有元数据的 Windows Firefox 用户代理
 *
 * Demonstrates Firefox user agent generation for Windows with detailed metadata
 * 演示如何生成带有详细元数据的 Windows Firefox 用户代理
 */
console.log('Firefox + Windows (with meta):');
console.dir(
  generateUserAgent({
    browser: 'firefox', // 指定浏览器类型 / Specify browser type
    device: 'windows', // 指定设备类型 / Specify device type
    withMeta: true, // 返回元数据信息 / Return metadata information
  }),
  { depth: null },
);

/**
 * Example 4: Generate multiple user agents with specific browser
 * 示例 4：生成多个特定浏览器的用户代理
 *
 * Shows how to generate multiple user agents for a specific browser
 * 展示如何生成多个特定浏览器的用户代理
 */
console.log('Multiple Chrome user agents:');
console.dir(
  generateUserAgent({
    browser: 'chrome', // 指定浏览器类型 / Specify browser type
    count: 3, // 生成数量 / Number of user agents to generate
    withMeta: true, // 返回元数据信息 / Return metadata information
  }),
  { depth: null },
);

/**
 * Example 5: Generate default user agent (no options)
 * 示例 5：生成默认用户代理（无选项）
 *
 * Shows how to generate a user agent with default settings
 * 展示如何使用默认设置生成用户代理
 */
console.log('Default user agent:');
console.dir(generateUserAgent(), { depth: null });

/**
 * Example 6: Generate iPad Safari user agents
 * 示例 6：生成 iPad Safari 用户代理
 *
 * Shows how to generate Safari user agents for iPad devices
 * 展示如何为 iPad 设备生成 Safari 用户代理
 */
console.log('Safari + iPad:');
console.dir(
  generateUserAgent({
    browser: 'safari', // 指定浏览器类型 / Specify browser type
    device: 'ipad', // 指定设备类型 / Specify device type
    withMeta: true, // 返回元数据信息 / Return metadata information
  }),
  { depth: null },
);
