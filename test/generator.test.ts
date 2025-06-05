import { generateUserAgent } from '../src';

describe('generateUserAgent', () => {
  it('生成 Chrome + Mac UA', () => {
    const ua = generateUserAgent({ browser: 'chrome', device: 'mac' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Chrome\//);
    expect(ua).toMatch(/Macintosh/);
  });

  it('生成 Safari + iPhone UA', () => {
    const ua = generateUserAgent({ browser: 'safari', device: 'iphone' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Safari\//);
    expect(ua).toMatch(/iPhone/);
  });

  it('生成 Firefox + Windows UA', () => {
    const ua = generateUserAgent({ browser: 'firefox', device: 'windows' });
    expect(typeof ua).toBe('string');
    expect(ua).toMatch(/Firefox\//);
    expect(ua).toMatch(/Windows NT/);
  });

  it('批量生成 UA', () => {
    const uas = generateUserAgent({ browser: 'chrome', device: 'mac', count: 3 });
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(3);
    }
  });

  it('生成带 meta 的 UA', () => {
    const result = generateUserAgent({ browser: 'chrome', device: 'mac', withMeta: true });
    if (typeof result === 'object' && result !== null && 'ua' in result && 'meta' in result) {
      expect(result).toHaveProperty('ua');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('browser');
      expect(result.meta).toHaveProperty('os');
      expect(result.meta).toHaveProperty('device');
    } else {
      throw new Error('未返回带 meta 的结构');
    }
  });

  it('批量生成1000条UA性能测试', () => {
    const start = Date.now();
    const uas = generateUserAgent({ count: 1000 });
    const duration = Date.now() - start;
    console.log(`生成1000条UA耗时: ${duration} ms`);
    expect(Array.isArray(uas)).toBe(true);
    if (Array.isArray(uas)) {
      expect(uas.length).toBe(1000);
    }
    expect(duration).toBeLessThan(500); // 你可以根据实际机器性能调整阈值
  });
});
