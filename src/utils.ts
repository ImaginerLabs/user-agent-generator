import * as fs from 'fs';
import * as path from 'path';

/**
 * 读取指定数据文件的版本号数组（支持字符串或 {value, weight}）
 * @param file 文件名（如 chrome.json）
 * @returns 版本号数组
 */
export function readVersions(file: string): (string | { value: string; weight: number })[] {
  const filePath = path.resolve(__dirname, '../data', file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);
  return json.versions || [];
}

/**
 * 随机选择数组中的一个元素（等概率）
 * @param arr 任意数组
 * @returns 随机元素
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 按权重随机选择数组中的一个元素
 * @param arr [{ value, weight }]
 * @returns value
 */
export function pickWeightedRandom(arr: { value: string; weight: number }[]): string {
  const total = arr.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of arr) {
    if (r < item.weight) return item.value;
    r -= item.weight;
  }
  return arr[arr.length - 1].value;
}
