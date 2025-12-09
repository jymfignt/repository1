// 结局系统使用示例
import { getEnding, getAllPossibleEndings, getEndingStats } from '../data/endings';
import { defaultPlayerState, type PlayerState } from '../types/player';

// 示例1: 创建一个创业成功的玩家状态
export function createEntrepreneurSuccessExample(): PlayerState {
  return {
    stats: {
      skill: 75,
      creativity: 80,
      network: 85,
      wealth: 90,
      wellbeing: 60,
      integrity: 70,
      risk: 85
    },
    flags: {
      hasStartup: true,
      hasCorporateJob: false,
      hasCreativeWork: false,
      hasFamily: true,
      hasMentor: true,
      hasBurnout: false,
      hasEthicalDilemma: false,
      hasMajorFailure: false,
      hasMajorSuccess: true,
      hasSecretKnowledge: false
    },
    currentStep: 25,
    path: 'entrepreneur_success'
  };
}

// 示例2: 创建一个燃尽的玩家状态
export function createBurnoutExample(): PlayerState {
  return {
    stats: {
      skill: 85,
      creativity: 70,
      network: 80,
      wealth: 85,
      wellbeing: 20,
      integrity: 60,
      risk: 70
    },
    flags: {
      hasStartup: false,
      hasCorporateJob: true,
      hasCreativeWork: false,
      hasFamily: false,
      hasMentor: false,
      hasBurnout: true,
      hasEthicalDilemma: true,
      hasMajorFailure: false,
      hasMajorSuccess: true,
      hasSecretKnowledge: false
    },
    currentStep: 20,
    path: 'corporate_burnout'
  };
}

// 示例3: 创建一个家庭优先的玩家状态
export function createFamilyFirstExample(): PlayerState {
  return {
    stats: {
      skill: 60,
      creativity: 50,
      network: 55,
      wealth: 65,
      wellbeing: 85,
      integrity: 90,
      risk: 30
    },
    flags: {
      hasStartup: false,
      hasCorporateJob: true,
      hasCreativeWork: false,
      hasFamily: true,
      hasMentor: true,
      hasBurnout: false,
      hasEthicalDilemma: true,
      hasMajorFailure: false,
      hasMajorSuccess: false,
      hasSecretKnowledge: false
    },
    currentStep: 18,
    path: 'family_balanced'
  };
}

// 示例4: 创建一个秘密结局的玩家状态
export function createSecretEndingExample(): PlayerState {
  return {
    stats: {
      skill: 70,
      creativity: 85,
      network: 60,
      wealth: 50,
      wellbeing: 70,
      integrity: 95,
      risk: 40
    },
    flags: {
      hasStartup: false,
      hasCorporateJob: false,
      hasCreativeWork: true,
      hasFamily: false,
      hasMentor: false,
      hasBurnout: false,
      hasEthicalDilemma: true,
      hasMajorFailure: false,
      hasMajorSuccess: false,
      hasSecretKnowledge: true
    },
    currentStep: 22,
    path: 'secret_discovery'
  };
}

// 测试所有示例
export function testAllEndings(): void {
  console.log('=== 结局系统测试 ===\n');
  
  const examples = [
    { name: '创业成功', state: createEntrepreneurSuccessExample() },
    { name: '燃尽结局', state: createBurnoutExample() },
    { name: '家庭优先', state: createFamilyFirstExample() },
    { name: '秘密结局', state: createSecretEndingExample() }
  ];
  
  examples.forEach(({ name, state }) => {
    console.log(`--- ${name} ---`);
    const ending = getEnding(state);
    console.log(`结局: ${ending.name}`);
    console.log(`描述: ${ending.description}`);
    console.log(`稀有度: ${ending.rarity}`);
    console.log(`分类: ${ending.category}`);
    console.log('属性值:', state.stats);
    console.log('标记状态:', state.flags);
    console.log('\n');
  });
  
  // 统计信息
  console.log('--- 结局统计 ---');
  console.log('总结局数量:', getEndingStats());
}

// 随机生成测试玩家状态
export function generateRandomPlayerState(): PlayerState {
  const randomStats = {
    skill: Math.floor(Math.random() * 100),
    creativity: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100),
    wealth: Math.floor(Math.random() * 100),
    wellbeing: Math.floor(Math.random() * 100),
    integrity: Math.floor(Math.random() * 100),
    risk: Math.floor(Math.random() * 100)
  };
  
  const randomFlags = {
    hasStartup: Math.random() > 0.5,
    hasCorporateJob: Math.random() > 0.5,
    hasCreativeWork: Math.random() > 0.5,
    hasFamily: Math.random() > 0.5,
    hasMentor: Math.random() > 0.5,
    hasBurnout: Math.random() > 0.5,
    hasEthicalDilemma: Math.random() > 0.5,
    hasMajorFailure: Math.random() > 0.5,
    hasMajorSuccess: Math.random() > 0.5,
    hasSecretKnowledge: Math.random() > 0.8 // 秘密知识更稀有
  };
  
  return {
    stats: randomStats,
    flags: randomFlags,
    currentStep: Math.floor(Math.random() * 30) + 1,
    path: 'random_test'
  };
}

// 批量测试随机结局
export function testRandomEndings(count: number = 10): void {
  console.log(`=== 随机测试 ${count} 个结局 ===\n`);
  
  const results: { [key: string]: number } = {};
  
  for (let i = 0; i < count; i++) {
    const state = generateRandomPlayerState();
    const ending = getEnding(state);
    results[ending.id] = (results[ending.id] || 0) + 1;
    
    console.log(`测试 ${i + 1}: ${ending.name} (${ending.rarity})`);
  }
  
  console.log('\n--- 测试结果统计 ---');
  Object.entries(results).forEach(([endingId, count]) => {
    console.log(`${endingId}: ${count} 次`);
  });
}

// 导出所有示例函数
export default {
  createEntrepreneurSuccessExample,
  createBurnoutExample,
  createFamilyFirstExample,
  createSecretEndingExample,
  testAllEndings,
  generateRandomPlayerState,
  testRandomEndings
};
