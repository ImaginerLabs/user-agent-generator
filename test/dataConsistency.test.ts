import * as fs from 'fs';
import * as path from 'path';

// 数据目录路径 / Data directory path
const dataDir = path.resolve(__dirname, '../data');

describe('data consistency', () => {
  // 需要测试的数据文件列表 / List of data files to test
  const files = [
    'chrome.json',
    'safari.json',
    'firefox.json',
    'macos.json',
    'windows.json',
    'ios.json',
    'ipad.json',
  ];

  it('all data files can be parsed correctly', () => {
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });

  it('all version arrays are non-empty', () => {
    for (const file of files) {
      const json = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
      expect(Array.isArray(json.versions)).toBe(true);
      expect(json.versions.length).toBeGreaterThan(0);
    }
  });

  it('chrome.json contains non-empty webkitVersions and safariVersions', () => {
    const json = JSON.parse(fs.readFileSync(path.join(dataDir, 'chrome.json'), 'utf-8'));
    expect(Array.isArray(json.webkitVersions)).toBe(true);
    expect(json.webkitVersions.length).toBeGreaterThan(0);
    expect(Array.isArray(json.safariVersions)).toBe(true);
    expect(json.safariVersions.length).toBeGreaterThan(0);
  });

  it('safari.json contains non-empty webkitVersions', () => {
    const json = JSON.parse(fs.readFileSync(path.join(dataDir, 'safari.json'), 'utf-8'));
    expect(Array.isArray(json.webkitVersions)).toBe(true);
    expect(json.webkitVersions.length).toBeGreaterThan(0);
  });
});
