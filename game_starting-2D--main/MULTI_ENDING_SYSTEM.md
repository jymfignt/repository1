# 多结局系统 - 使用指南

## 🎯 系统概述

《理想工作模拟器》的多结局系统允许玩家通过不同的选择路径和属性积累，最终获得不同的游戏结局。系统包含7个核心属性和10个隐藏标记，支持10种不同的结局类型。

## 📊 核心属性

| 属性 | 描述 | 范围 |
|------|------|------|
| **skill** | 技能 | 0-100 |
| **creativity** | 创造力 | 0-100 |
| **network** | 人脉 | 0-100 |
| **wealth** | 财富 | 0-100 |
| **wellbeing** | 幸福感 | 0-100 |
| **integrity** | 正直度 | 0-100 |
| **risk** | 风险承受度 | 0-100 |

## 🏷️ 隐藏标记

| 标记 | 描述 |
|------|------|
| **hasStartup** | 是否创业过 |
| **hasCorporateJob** | 是否在大公司工作过 |
| **hasCreativeWork** | 是否从事过创作工作 |
| **hasFamily** | 是否有家庭 |
| **hasMentor** | 是否有导师 |
| **hasBurnout** | 是否经历过燃尽 |
| **hasEthicalDilemma** | 是否面临过道德困境 |
| **hasMajorFailure** | 是否有重大失败 |
| **hasMajorSuccess** | 是否有重大成功 |
| **hasSecretKnowledge** | 是否获得秘密知识 |

## 🏆 结局类型

### 传奇结局 (Legendary)
- **秘密结局**: 需要秘密知识 + 高正直度 + 高创造力

### 史诗结局 (Epic)
- **创业传奇**: 创业 + 重大成功 + 高财富 + 高风险 + 高人脉
- **创作大师**: 创作工作 + 重大成功 + 高创造力 + 高幸福感

### 稀有结局 (Rare)
- **高管上位**: 大公司工作 + 重大成功 + 高技能 + 高人脉 + 高财富
- **家庭优先**: 有家庭 + 高幸福感 + 高正直度 + 中等财富
- **道德领袖**: 道德困境 + 极高正直度 + 高人脉 + 有导师

### 普通结局 (Common)
- **燃尽**: 燃尽经历 + 低幸福感 + 高技能或高财富
- **平衡人生**: 各方面均衡发展，无重大失败
- **新星崛起**: 技能、创造力、人脉均衡发展
- **低调成功**: 高幸福感 + 高正直度 + 中等财富 + 低风险

## 🛠️ 使用方法

### 1. 基本使用

```typescript
import { getEnding } from './data/endings';
import { PlayerState } from './types/player';

// 获取玩家结局
const ending = getEnding(playerState);
console.log(`结局: ${ending.name}`);
console.log(`描述: ${ending.description}`);
```

### 2. 在Vue组件中使用

```vue
<template>
  <div v-if="gameEnded">
    <EndingScreen 
      :ending="currentEnding" 
      :player-state="playerState"
      @restart="restartGame"
    />
  </div>
</template>

<script setup>
import { getEnding } from './data/endings';
import EndingScreen from './components/EndingScreen.vue';

// 检查结局
const checkEnding = () => {
  currentEnding.value = getEnding(playerState.value);
  gameEnded.value = true;
};
</script>
```

### 3. 应用选择效果

```typescript
import { applyChoiceEffect } from './types/player';

// 应用选择效果
if (choice.effects) {
  playerState.value = applyChoiceEffect(playerState.value, choice.effects);
}
```

## 📝 故事数据格式

```typescript
// 选择定义
{
  text: "选择文本",
  next: "下一个节点ID",
  effects: {
    stats: {
      skill: 5,        // +5技能
      wellbeing: -2    // -2幸福感
    },
    flags: {
      hasStartup: true  // 设置创业标记
    }
  }
}
```

## 🎮 完整游戏组件

使用 `GameWithEndings.vue` 组件可以获得完整的游戏体验：

```vue
<template>
  <GameWithEndings />
</template>

<script setup>
import GameWithEndings from './components/GameWithEndings.vue';
</script>
```

## 🧪 测试和调试

```typescript
import { testAllEndings, testRandomEndings } from './examples/EndingSystemExample';

// 测试所有预设结局
testAllEndings();

// 测试随机生成的结局
testRandomEndings(20);
```

## 🔧 扩展系统

### 添加新结局

1. 在 `endings.ts` 中添加新的结局定义
2. 编写条件判断函数
3. 更新结局列表

```typescript
// 新结局示例
{
  id: 'new_ending',
  name: '新结局',
  description: '这是一个新结局',
  epilogue: '结局描述文本...',
  condition: (playerState) => {
    // 判断条件
    return playerState.stats.skill >= 80;
  },
  category: 'success',
  rarity: 'rare'
}
```

### 添加新属性

1. 在 `PlayerStats` 接口中添加新属性
2. 更新默认状态
3. 在故事数据中添加相应效果

### 添加新标记

1. 在 `PlayerFlags` 接口中添加新标记
2. 更新默认状态
3. 在相关选择中设置标记

## 📊 数据统计

```typescript
import { getEndingStats } from './data/endings';

// 获取结局统计
const stats = getEndingStats();
console.log(stats); // { common: 4, rare: 3, epic: 2, legendary: 1 }
```

## 🎯 最佳实践

1. **平衡性**: 确保不同路径都能达到不同结局
2. **可发现性**: 隐藏结局应该有合理的触发条件
3. **反馈**: 及时显示属性变化，让玩家了解选择后果
4. **重玩价值**: 多个结局鼓励玩家重玩

## 🐛 常见问题

### Q: 如何调试结局判断？
A: 使用 `getAllPossibleEndings(playerState)` 查看所有可能的结局。

### Q: 如何重置玩家状态？
A: 使用 `{ ...defaultPlayerState }` 创建新的玩家状态。

### Q: 如何添加自定义结局条件？
A: 创建新的条件判断函数，然后在结局定义中使用。

## 📈 性能优化

- 结局判断是同步的，性能影响很小
- 建议在游戏结束时才调用 `getEnding()`
- 可以使用缓存来存储常见的玩家状态组合

---

这个多结局系统为您的游戏提供了丰富的重玩价值和深度，玩家可以通过不同的选择路径探索各种人生可能性！
