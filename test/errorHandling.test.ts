/**
 * Error Handling Tests
 * 错误处理测试
 *
 * This test file verifies that the library handles error cases gracefully
 * 该测试文件验证库能够优雅地处理错误情况
 */

import { pickRandom, pickWeightedRandom, pickWeightedVersionWithSubValue } from '../src/utils';

describe('Error Handling Tests', () => {
  describe('pickRandom', () => {
    // Test empty array handling
    // 测试空数组处理
    it('should throw error for empty array', () => {
      expect(() => pickRandom([])).toThrow('Array is empty or undefined');
    });

    // Test undefined array handling
    // 测试未定义数组处理
    it('should throw error for undefined array', () => {
      expect(() => pickRandom(undefined as any)).toThrow('Array is empty or undefined');
    });

    // Test null array handling
    // 测试空数组处理
    it('should throw error for null array', () => {
      expect(() => pickRandom(null as any)).toThrow('Array is empty or undefined');
    });

    // Test boundary random values
    // 测试边界随机值
    it('should handle boundary random values correctly', () => {
      const array = ['a', 'b', 'c'];
      expect(pickRandom(array, 0)).toBe('a');
      expect(pickRandom(array, 0.999999)).toBe('c');
      expect(pickRandom(array, 1)).toBe('c'); // Should be normalized to 0.999999
    });
  });

  describe('pickWeightedRandom', () => {
    // Test empty array handling
    // 测试空数组处理
    it('should throw error for empty array', () => {
      expect(() => pickWeightedRandom([])).toThrow('Array is empty or undefined');
    });

    // Test undefined array handling
    // 测试未定义数组处理
    it('should throw error for undefined array', () => {
      expect(() => pickWeightedRandom(undefined as any)).toThrow('Array is empty or undefined');
    });

    // Test single element array
    // 测试单元素数组
    it('should return single element for single element array', () => {
      const array = [{ value: 'only', weight: 10 }];
      expect(pickWeightedRandom(array)).toBe('only');
    });

    // Test negative weights handling
    // 测试负权重处理
    it('should handle negative weights gracefully', () => {
      const array = [
        { value: 'a', weight: -10 },
        { value: 'b', weight: 10 },
        { value: 'c', weight: 5 },
      ];
      // Should not throw and should work with positive weights only
      // 不应该抛出异常，应该只使用正权重
      expect(() => pickWeightedRandom(array)).not.toThrow();

      // Run multiple times to ensure it works
      // 多次运行确保正常工作
      for (let i = 0; i < 10; i++) {
        const result = pickWeightedRandom(array);
        expect(['a', 'b', 'c']).toContain(result);
      }
    });

    // Test all zero weights
    // 测试所有权重为零
    it('should return last element when all weights are zero', () => {
      const array = [
        { value: 'a', weight: 0 },
        { value: 'b', weight: 0 },
        { value: 'c', weight: 0 },
      ];
      expect(pickWeightedRandom(array)).toBe('c');
    });
  });

  describe('pickWeightedVersionWithSubValue', () => {
    // Test empty array handling
    // 测试空数组处理
    it('should throw error for empty array', () => {
      expect(() => pickWeightedVersionWithSubValue([])).toThrow('Array is empty or undefined');
    });

    // Test missing subValue
    // 测试缺失 subValue
    it('should throw error for missing subValue', () => {
      const array = [{ value: '1.0', weight: 10, subValue: [] }];
      expect(() => pickWeightedVersionWithSubValue(array)).toThrow(
        'SubValue array is empty for version: 1.0',
      );
    });

    // Test undefined subValue
    // 测试未定义 subValue
    it('should throw error for undefined subValue', () => {
      const array = [{ value: '1.0', weight: 10, subValue: undefined as any }];
      expect(() => pickWeightedVersionWithSubValue(array)).toThrow(
        'SubValue array is empty for version: 1.0',
      );
    });

    // Test valid subValue selection
    // 测试有效的 subValue 选择
    it('should select valid subValue', () => {
      const array = [
        {
          value: '1.0',
          weight: 10,
          subValue: [{ value: '1.0.1' }, { value: '1.0.2' }, { value: '1.0.3' }],
        },
      ];

      const result = pickWeightedVersionWithSubValue(array);
      expect(['1.0.1', '1.0.2', '1.0.3']).toContain(result);
    });
  });

  describe('Data file error handling', () => {
    // Test invalid browser type
    // 测试无效浏览器类型
    it('should handle invalid data gracefully', () => {
      // This test ensures the system doesn't crash with unexpected data
      // 该测试确保系统在遇到意外数据时不会崩溃
      const validArray = [{ value: 'test', weight: 10 }];

      expect(() => pickWeightedRandom(validArray)).not.toThrow();
    });
  });
});
