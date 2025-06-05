/**
 * Weight Distribution Test
 * 权重分布测试
 *
 * This test file verifies that the pickWeightedRandom function
 * produces results that match the expected weight distribution.
 * 该测试文件验证 pickWeightedRandom 函数产生的结果是否符合预期的权重分布。
 */

import { pickWeightedRandom } from '../src/utils';
import * as fs from 'fs';
import * as path from 'path';

// 测试参数 / Test parameters
const TEST_ITERATIONS = 100000; // 测试迭代次数 / Number of test iterations
const TOLERANCE = 0.05; // 允许的误差范围（5%）/ Allowed error margin (5%)

// 定义版本分布接口 / Define version distribution interface
interface VersionDistribution {
  value: string;
  expectedWeight: number;
  actualWeight: number;
}

describe('Weight Distribution Tests', () => {
  // 读取 Chrome 版本数据 / Read Chrome version data
  const chromeData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/chrome.json'), 'utf-8'),
  );

  test('Chrome versions should follow weight distribution', () => {
    // 统计每个版本被选中的次数 / Count occurrences of each version
    const versionCounts: Record<string, number> = {};
    const versions = chromeData.versions;

    // 初始化计数器 / Initialize counters
    versions.forEach((v: { value: string }) => {
      versionCounts[v.value] = 0;
    });

    // 执行多次随机选择 / Perform multiple random selections
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const selected = pickWeightedRandom(versions);
      versionCounts[selected]++;
    }

    // 计算实际分布 / Calculate actual distribution
    const actualDistribution: VersionDistribution[] = versions.map(
      (v: { value: string; weight: number }) => ({
        value: v.value,
        expectedWeight: v.weight,
        actualWeight: (versionCounts[v.value] / TEST_ITERATIONS) * 100,
      }),
    );

    // 验证每个版本的实际分布是否在预期范围内 / Verify if actual distribution is within expected range
    actualDistribution.forEach(({ value, expectedWeight, actualWeight }: VersionDistribution) => {
      const difference = Math.abs(actualWeight - expectedWeight);
      console.log(
        `Version ${value}: Expected ${expectedWeight}%, Got ${actualWeight.toFixed(2)}%, Difference: ${difference.toFixed(2)}%`,
      );
      expect(difference).toBeLessThanOrEqual(TOLERANCE * 100);
    });
  });

  test('Total distribution should sum to 100%', () => {
    const versionCounts: Record<string, number> = {};
    const versions = chromeData.versions;

    // 初始化计数器 / Initialize counters
    versions.forEach((v: { value: string }) => {
      versionCounts[v.value] = 0;
    });

    // 执行多次随机选择 / Perform multiple random selections
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const selected = pickWeightedRandom(versions);
      versionCounts[selected]++;
    }

    // 计算总分布 / Calculate total distribution
    const totalDistribution = Object.values(versionCounts).reduce((sum, count) => sum + count, 0);

    // 验证总分布是否接近 100% / Verify if total distribution is close to 100%
    const totalPercentage = (totalDistribution / TEST_ITERATIONS) * 100;
    console.log(`Total distribution: ${totalPercentage.toFixed(2)}%`);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });
});
