/**
 * Weight Distribution Test
 * 权重分布测试
 *
 * This test file verifies that the pickWeightedRandom function produces results that match the expected weight distribution
 * 该测试文件验证 pickWeightedRandom 函数产生的结果是否符合预期的权重分布
 */

import { pickWeightedRandom } from '../src/utils';
import * as fs from 'fs';
import * as path from 'path';

// Test parameters configuration
// 测试参数配置
const TEST_ITERATIONS = 100000; // Number of test iterations / 测试迭代次数
const TOLERANCE = 0.05; // Allowed error margin (5%) / 允许的误差范围（5%）

// Define version distribution interface
// 定义版本分布接口
interface VersionDistribution {
  value: string;
  expectedWeight: number;
  actualWeight: number;
}

describe('Weight Distribution Tests', () => {
  // Read Chrome version data from JSON file
  // 从 JSON 文件读取 Chrome 版本数据
  const chromeData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/chrome.json'), 'utf-8'),
  );

  test('Chrome versions should follow weight distribution', () => {
    // Count occurrences of each version selection
    // 统计每个版本被选中的次数
    const versionCounts: Record<string, number> = {};
    const versions = chromeData.versions;

    // Initialize counters for all versions
    // 为所有版本初始化计数器
    versions.forEach((v: { value: string }) => {
      versionCounts[v.value] = 0;
    });

    // Perform multiple random selections to test distribution
    // 执行多次随机选择以测试分布
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const selected = pickWeightedRandom(versions);
      versionCounts[selected]++;
    }

    // Calculate actual distribution percentages
    // 计算实际分布百分比
    const actualDistribution: VersionDistribution[] = versions.map(
      (v: { value: string; weight: number }) => ({
        value: v.value,
        expectedWeight: v.weight,
        actualWeight: (versionCounts[v.value] / TEST_ITERATIONS) * 100,
      }),
    );

    // Verify if actual distribution is within expected tolerance range
    // 验证实际分布是否在预期容差范围内
    actualDistribution.forEach(({ value, expectedWeight, actualWeight }: VersionDistribution) => {
      const difference = Math.abs(actualWeight - expectedWeight);
      console.log(
        `Version ${value}: Expected ${expectedWeight}%, Got ${actualWeight.toFixed(2)}%, Difference: ${difference.toFixed(2)}%`,
      );
      expect(difference).toBeLessThanOrEqual(TOLERANCE * 100);
    });
  });

  test('Total distribution should sum to 100%', () => {
    // Count occurrences of each version selection
    // 统计每个版本被选中的次数
    const versionCounts: Record<string, number> = {};
    const versions = chromeData.versions;

    // Initialize counters for all versions
    // 为所有版本初始化计数器
    versions.forEach((v: { value: string }) => {
      versionCounts[v.value] = 0;
    });

    // Perform multiple random selections to test total distribution
    // 执行多次随机选择以测试总分布
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const selected = pickWeightedRandom(versions);
      versionCounts[selected]++;
    }

    // Calculate total distribution sum
    // 计算总分布和
    const totalDistribution = Object.values(versionCounts).reduce((sum, count) => sum + count, 0);

    // Verify if total distribution equals 100%
    // 验证总分布是否等于 100%
    const totalPercentage = (totalDistribution / TEST_ITERATIONS) * 100;
    console.log(`Total distribution: ${totalPercentage.toFixed(2)}%`);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });
});
