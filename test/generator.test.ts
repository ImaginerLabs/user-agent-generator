import { generateUserAgent } from '../src';

describe('generateUserAgent', () => {
  // Test generating Chrome + Mac user agent
  // 测试生成 Chrome + Mac 用户代理
  it('generates Chrome + Mac UA', () => {
    const ua = generateUserAgent({ browser: 'chrome', device: 'mac' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Chrome\//);
    expect(ua).toMatch(/Macintosh/);
    expect(ua).toMatch(/Intel Mac OS X/);
  });

  // Test generating Safari + iPhone user agent
  // 测试生成 Safari + iPhone 用户代理
  it('generates Safari + iPhone UA', () => {
    const ua = generateUserAgent({ browser: 'safari', device: 'iphone' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Safari\//);
    expect(ua).toMatch(/iPhone/);
    expect(ua).toMatch(/CPU iPhone OS/);
  });

  // Test generating Firefox + Windows user agent
  // 测试生成 Firefox + Windows 用户代理
  it('generates Firefox + Windows UA', () => {
    const ua = generateUserAgent({ browser: 'firefox', device: 'windows' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Firefox\//);
    expect(ua).toMatch(/Windows NT/);
  });

  // Test generating Safari + iPad user agent
  // 测试生成 Safari + iPad 用户代理
  it('generates Safari + iPad UA', () => {
    const ua = generateUserAgent({ browser: 'safari', device: 'ipad' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Safari\//);
    expect(ua).toMatch(/iPad/);
    expect(ua).toMatch(/CPU OS/);
  });

  // Test batch generation of user agents
  // 测试批量生成用户代理
  it('generates multiple UAs', () => {
    const uas = generateUserAgent({ browser: 'chrome', device: 'mac', count: 3 });
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(3);
      uas.forEach((ua) => {
        expect(typeof ua).toBe('string');
        expect(ua).toMatch(/Chrome\//);
      });
    }
  });

  // Test generating user agent with metadata
  // 测试生成带元数据的用户代理
  it('generates UA with metadata', () => {
    const result = generateUserAgent({ browser: 'chrome', device: 'mac', withMeta: true });
    if (typeof result === 'object' && result !== null && 'ua' in result && 'meta' in result) {
      expect(result).toHaveProperty('ua');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('browser');
      expect(result.meta).toHaveProperty('os');
      expect(result.meta).toHaveProperty('device');
      expect(result.meta.browser.name).toBe('chrome');
      expect(result.meta.os.name).toBe('macos');
      expect(result.meta.device).toBe('desktop');
    } else {
      throw new Error('Structure with metadata was not returned');
    }
  });

  // Test generating multiple UAs with metadata
  // 测试生成多个带元数据的用户代理
  it('generates multiple UAs with metadata', () => {
    const results = generateUserAgent({
      browser: 'safari',
      device: 'iphone',
      count: 2,
      withMeta: true,
    });
    expect(Array.isArray(results)).toBe(true);
    if (Array.isArray(results)) {
      expect(results.length).toBe(2);
      results.forEach((result) => {
        if (typeof result === 'object' && result !== null && 'ua' in result && 'meta' in result) {
          expect(result).toHaveProperty('ua');
          expect(result).toHaveProperty('meta');
          expect(result.meta.browser.name).toBe('safari');
          expect(result.meta.os.name).toBe('ios');
          expect(result.meta.device).toBe('mobile');
        } else {
          throw new Error('Structure with metadata was not returned');
        }
      });
    }
  });

  // Test default parameters
  // 测试默认参数
  it('generates UA with default parameters', () => {
    const ua = generateUserAgent();
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Mozilla\/5\.0/);
  });

  // Test edge case: count = 0
  // 测试边界情况：count = 0
  it('handles count = 0', () => {
    const result = generateUserAgent({ count: 0 });
    // When count is 0, it should return an empty array
    // count 为 0 时，应该返回空数组
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result.length).toBe(0);
    }
  });

  // Performance test: Generate 10000 user agents
  // 性能测试：批量生成10000条用户代理
  it('performance test for generating 10000 UAs', () => {
    const count = 10000;
    const start = Date.now();
    const uas = generateUserAgent({ count });
    const duration = Date.now() - start;
    console.log(`Time taken to generate ${count} UAs: ${duration} ms`);
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(count);
    }
    expect(duration).toBeLessThan(100); // Adjusted threshold / 调整阈值
  });

  // Test UA string format validity
  // 测试 UA 字符串格式有效性
  it('generates valid UA string formats', () => {
    const browsers: Array<'chrome' | 'safari' | 'firefox'> = ['chrome', 'safari', 'firefox'];
    const devices: Array<'mac' | 'windows' | 'iphone' | 'ipad'> = [
      'mac',
      'windows',
      'iphone',
      'ipad',
    ];

    browsers.forEach((browser) => {
      devices.forEach((device) => {
        const ua = generateUserAgent({ browser, device }) as string;
        expect(typeof ua).toBe('string');
        expect(ua.length).toBeGreaterThan(50); // UA strings should be reasonably long / UA 字符串应该有合理的长度
        expect(ua).toMatch(/Mozilla\/5\.0/); // All UAs should start with Mozilla/5.0 / 所有 UA 都应该以 Mozilla/5.0 开头
      });
    });
  });
});
