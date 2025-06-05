/**
 * Utility Functions Module
 * 工具函数模块
 *
 * This module provides utility functions for the User-Agent generator
 * 该模块为 User-Agent 生成器提供工具函数
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Read version numbers array from specified data file (supports string or {value, weight})
 * 从指定的数据文件中读取版本号数组（支持字符串或 {value, weight} 格式）
 *
 * @param file Filename (e.g., chrome.json) / 文件名（如 chrome.json）
 * @returns Array of version numbers / 版本号数组
 */
export function readVersions(file: string): (string | { value: string; weight: number })[] {
  const filePath = path.resolve(__dirname, '../data', file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);
  return json.versions || [];
}

/**
 * Pick a random item from an array
 * 从数组中随机选择一个元素
 *
 * @param array Array to pick from / 要选择的数组
 * @param random Optional random number (0-1) / 可选的随机数（0-1）
 * @returns Random item from array / 数组中的随机元素
 */
export function pickRandom<T>(array: T[], random: number = Math.random()): T {
  return array[Math.floor(random * array.length)];
}

/**
 * Pick a random item from a weighted array
 * 从带权重的数组中随机选择一个元素
 *
 * @param array Array of {value, weight} objects / {value, weight} 对象数组
 * @param random Optional random number (0-1) / 可选的随机数（0-1）
 * @returns Random value based on weights / 基于权重的随机值
 */
export function pickWeightedRandom<T extends { value: any; weight: number }>(
  array: T[],
  random: number = Math.random(),
): T['value'] {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }
  const totalWeight = array.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) {
    // When all weights are 0, return the last element
    // 所有权重为0时，返回最后一个元素
    return array[array.length - 1].value;
  }
  // When random=0, return the first element with weight > 0
  // random=0时，返回第一个权重大于0的元素
  if (random === 0) {
    const first = array.find((item) => item.weight > 0);
    if (first) return first.value;
    // This should never happen since totalWeight > 0
    // 理论上不会走到这里，因为 totalWeight > 0
  }
  let currentWeight = 0;
  const targetWeight = random * totalWeight;
  for (const item of array) {
    currentWeight += item.weight;
    if (targetWeight <= currentWeight) {
      return item.value;
    }
  }
  return array[array.length - 1].value;
}

/**
 * Pick a random version from a weighted version array with subValues
 * 从带权重的版本数组中随机选择一个版本，并从其 subValue 数组中随机选择具体版本号
 *
 * @param array Array of {value, weight, subValue} objects / {value, weight, subValue} 对象数组
 * @param random Optional random number (0-1) / 可选的随机数（0-1）
 * @returns Random subValue based on weights / 基于权重的随机子版本号
 */
export function pickWeightedVersionWithSubValue<
  T extends { value: any; weight: number; subValue: { value: string }[] },
>(array: T[], random: number = Math.random()): string {
  // First select major version by weight
  // 首先按权重选择大版本号
  const selectedVersion = pickWeightedRandom(array, random);
  // Find the corresponding complete object
  // 找到对应的完整对象
  const versionObj = array.find((item) => item.value === selectedVersion);
  if (!versionObj) {
    throw new Error('Version object not found');
  }
  // Randomly select a subValue from the array
  // 从数组中随机选择一个 subValue
  const subValue = pickRandom(versionObj.subValue, random);
  return subValue.value;
}
