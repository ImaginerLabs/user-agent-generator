import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.resolve(__dirname, '../data');

describe('data consistency', () => {
  const files = [
    'chrome.json',
    'safari.json',
    'firefox.json',
    'macos.json',
    'windows.json',
    'ios.json',
    'ipad.json',
  ];

  it('所有数据文件都能被正确解析', () => {
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });

  it('所有版本号数组都非空', () => {
    for (const file of files) {
      const json = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
      expect(Array.isArray(json.versions)).toBe(true);
      expect(json.versions.length).toBeGreaterThan(0);
    }
  });

  it('chrome.json 包含 webkitVersions 和 safariVersions 且非空', () => {
    const json = JSON.parse(fs.readFileSync(path.join(dataDir, 'chrome.json'), 'utf-8'));
    expect(Array.isArray(json.webkitVersions)).toBe(true);
    expect(json.webkitVersions.length).toBeGreaterThan(0);
    expect(Array.isArray(json.safariVersions)).toBe(true);
    expect(json.safariVersions.length).toBeGreaterThan(0);
  });

  it('safari.json 包含 webkitVersions 且非空', () => {
    const json = JSON.parse(fs.readFileSync(path.join(dataDir, 'safari.json'), 'utf-8'));
    expect(Array.isArray(json.webkitVersions)).toBe(true);
    expect(json.webkitVersions.length).toBeGreaterThan(0);
  });
});
