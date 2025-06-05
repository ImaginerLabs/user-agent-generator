/**
 * pickWeightedRandom Edge & Extreme Cases Test
 * pickWeightedRandom 边界与极端情况测试
 *
 * Test content:
 * 1. Empty array
 *    空数组
 * 2. Single element array
 *    单元素数组
 * 3. All weights are 0
 *    所有权重为0
 * 4. Extreme weight distribution
 *    极端权重分布
 * 5. Negative weights
 *    权重为负数
 * 6. Random number boundary
 *    随机数边界
 */

import { pickWeightedRandom } from '../src/utils';

describe('pickWeightedRandom Edge & Extreme Cases', () => {
  /**
   * Empty array should throw
   * 空数组应抛出异常
   */
  test('should throw if array is empty', () => {
    expect(() => pickWeightedRandom([], Math.random())).toThrow();
  });

  /**
   * Single element array should always return that element
   * 单元素数组应总是返回该元素
   */
  test('should always return the only element if array has one', () => {
    const arr = [{ value: 'only', weight: 100 }];
    for (let i = 0; i < 10; i++) {
      expect(pickWeightedRandom(arr, Math.random())).toBe('only');
    }
  });

  /**
   * All weights are 0, should return the last element
   * 所有权重为0时应返回最后一个元素
   */
  test('should return the last element if all weights are 0', () => {
    const arr = [
      { value: 'a', weight: 0 },
      { value: 'b', weight: 0 },
      { value: 'c', weight: 0 },
    ];
    expect(pickWeightedRandom(arr, Math.random())).toBe('c');
  });

  /**
   * Extreme weight: big weight should be picked almost always
   * 极端权重应几乎总是选中大权重元素
   */
  test('should almost always pick the big weight element', () => {
    const arr = [
      { value: 'big', weight: 9999 },
      { value: 'small', weight: 1 },
    ];
    let bigCount = 0;
    for (let i = 0; i < 10000; i++) {
      if (pickWeightedRandom(arr) === 'big') bigCount++;
    }
    expect(bigCount).toBeGreaterThan(9900); // 99%+
  });

  /**
   * Negative weights: should not throw
   * 权重为负数时应有合理行为
   */
  test('should not throw if there are negative weights', () => {
    const arr = [
      { value: 'a', weight: -10 },
      { value: 'b', weight: 10 },
    ];
    expect(() => pickWeightedRandom(arr, Math.random())).not.toThrow();
  });

  /**
   * random=0 should return the first element with weight>0
   * random=0 应返回第一个权重大于0的元素
   */
  test('should return the first element with weight>0 if random=0', () => {
    const arr = [
      { value: 'a', weight: 0 },
      { value: 'b', weight: 10 },
      { value: 'c', weight: 10 },
    ];
    expect(pickWeightedRandom(arr, 0)).toBe('b');
  });

  /**
   * random=1 should return the last element
   * random=1 应返回最后一个元素
   */
  test('should return the last element if random=1', () => {
    const arr = [
      { value: 'a', weight: 10 },
      { value: 'b', weight: 10 },
      { value: 'c', weight: 10 },
    ];
    expect(pickWeightedRandom(arr, 1)).toBe('c');
  });
});
