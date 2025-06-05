import { generateUserAgent } from '../src';

describe('generateUserAgent', () => {
  // 测试生成 Chrome + Mac 用户代理 / Test generating Chrome + Mac user agent
  it('generates Chrome + Mac UA', () => {
    const ua = generateUserAgent({ browser: 'chrome', device: 'mac' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Chrome\//);
    expect(ua).toMatch(/Macintosh/);
  });

  // 测试生成 Safari + iPhone 用户代理 / Test generating Safari + iPhone user agent
  it('generates Safari + iPhone UA', () => {
    const ua = generateUserAgent({ browser: 'safari', device: 'iphone' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Safari\//);
    expect(ua).toMatch(/iPhone/);
  });

  // 测试生成 Firefox + Windows 用户代理 / Test generating Firefox + Windows user agent
  it('generates Firefox + Windows UA', () => {
    const ua = generateUserAgent({ browser: 'firefox', device: 'windows' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Firefox\//);
    expect(ua).toMatch(/Windows NT/);
  });

  // 测试批量生成用户代理 / Test batch generation of user agents
  it('generates multiple UAs', () => {
    const uas = generateUserAgent({ browser: 'chrome', device: 'mac', count: 3 });
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(3);
    }
  });

  // 测试生成带元数据的用户代理 / Test generating user agent with metadata
  it('generates UA with metadata', () => {
    const result = generateUserAgent({ browser: 'chrome', device: 'mac', withMeta: true });
    if (typeof result === 'object' && result !== null && 'ua' in result && 'meta' in result) {
      expect(result).toHaveProperty('ua');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('browser');
      expect(result.meta).toHaveProperty('os');
      expect(result.meta).toHaveProperty('device');
    } else {
      throw new Error('Structure with metadata was not returned');
    }
  });

  // 性能测试：批量生成1000条用户代理 / Performance test: Generate 1000 user agents
  it('performance test for generating 1000 UAs', () => {
    const count = 10000;
    const start = Date.now();
    const uas = generateUserAgent({ count });
    const duration = Date.now() - start;
    console.log(`Time taken to generate ${count} UAs: ${duration} ms`);
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(count);
    }
    expect(duration).toBeLessThan(50); // 可以根据实际机器性能调整阈值 / Threshold can be adjusted based on actual machine performance
  });
});
