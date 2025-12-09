import { PlayerState, PlayerStats, PlayerFlags } from '../types/player';

// 结局类型定义
export interface Ending {
  id: string;
  name: string;
  description: string;
  epilogue: string;
  condition: (playerState: PlayerState) => boolean;
  category: 'success' | 'failure' | 'balanced' | 'secret';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 结局条件判断函数
function isEntrepreneurialSuccess(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasStartup && 
         flags.hasMajorSuccess && 
         stats.wealth >= 70 && 
         stats.risk >= 60 && 
         stats.network >= 50;
}

function isCorporateExecutive(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasCorporateJob && 
         flags.hasMajorSuccess && 
         stats.skill >= 80 && 
         stats.network >= 70 && 
         stats.wealth >= 60;
}

function isBurnout(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasBurnout && 
         stats.wellbeing <= 30 && 
         (stats.skill >= 70 || stats.wealth >= 60);
}

function isFamilyFirst(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasFamily && 
         stats.wellbeing >= 70 && 
         stats.integrity >= 70 && 
         stats.wealth >= 40 && 
         stats.wealth <= 70;
}

function isSecretEnding(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasSecretKnowledge && 
         stats.integrity >= 80 && 
         stats.creativity >= 70 && 
         !flags.hasMajorFailure;
}

function isCreativeSuccess(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasCreativeWork && 
         flags.hasMajorSuccess && 
         stats.creativity >= 80 && 
         stats.wellbeing >= 60;
}

function isBalancedLife(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return stats.wellbeing >= 60 && 
         stats.integrity >= 60 && 
         stats.wealth >= 40 && 
         stats.skill >= 50 && 
         !flags.hasBurnout && 
         !flags.hasMajorFailure;
}

function isEthicalLeader(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return flags.hasEthicalDilemma && 
         stats.integrity >= 85 && 
         stats.network >= 60 && 
         flags.hasMentor;
}

function isRisingStar(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return stats.skill >= 70 && 
         stats.creativity >= 60 && 
         stats.network >= 50 && 
         stats.wellbeing >= 50 && 
         !flags.hasMajorFailure;
}

function isQuietSuccess(playerState: PlayerState): boolean {
  const { stats, flags } = playerState;
  return stats.wellbeing >= 70 && 
         stats.integrity >= 70 && 
         stats.wealth >= 50 && 
         stats.risk <= 40 && 
         !flags.hasStartup;
}

// 所有结局定义
export const endings: Ending[] = [
  {
    id: 'entrepreneurial_success',
    name: '创业传奇',
    description: '你成功创立了自己的商业帝国',
    epilogue: '多年后，你坐在自己公司的顶层办公室里，俯瞰着这座曾经让你迷茫的城市。你想起刚毕业时的那杯冷咖啡，那时的你绝不会想到今天。通过创业，你不仅实现了财务自由，更重要的是找到了自己的价值所在。你的公司为许多人提供了工作机会，你的创新改变了整个行业。虽然这一路上有过无数挫折，但每一次失败都让你变得更强大。',
    condition: isEntrepreneurialSuccess,
    category: 'success',
    rarity: 'epic'
  },
  {
    id: 'corporate_executive',
    name: '高管上位',
    description: '你在大公司中攀登到了顶峰',
    epilogue: '你成为了公司的CEO，站在了职业生涯的巅峰。这些年来，你通过不断学习和努力，从一个普通员工成长为公司的领导者。你带领团队取得了辉煌的业绩，公司的股价节节攀升。虽然工作压力巨大，但你也享受这种掌控全局的感觉。你明白，成功需要付出代价，但你已经准备好承担这份责任。',
    condition: isCorporateExecutive,
    category: 'success',
    rarity: 'rare'
  },
  {
    id: 'burnout',
    name: '燃尽',
    description: '成功换来了身心的疲惫',
    epilogue: '你躺在医院的病床上，看着窗外的夕阳。医生说你是因为过度工作导致的身体崩溃。这些年你一直在追求成功，却忘记了照顾自己。你的成就让人羡慕，但代价是你的健康和快乐。现在你终于有时间停下来思考：什么才是真正重要的？也许，是时候重新定义成功了。',
    condition: isBurnout,
    category: 'failure',
    rarity: 'common'
  },
  {
    id: 'family_first',
    name: '家庭优先',
    description: '你选择了平衡的生活',
    epilogue: '你坐在家中的客厅里，看着孩子们在院子里玩耍，妻子在厨房准备晚餐。虽然你的收入不是最高的，但你拥有最珍贵的东西：一个温暖的家和爱你的家人。你学会了在工作和生活之间找到平衡，学会了珍惜当下。这种平凡而幸福的生活，也许才是最大的成功。',
    condition: isFamilyFirst,
    category: 'balanced',
    rarity: 'rare'
  },
  {
    id: 'secret_knowledge',
    name: '秘密结局',
    description: '你发现了世界的真相',
    epilogue: '在一个雨夜，你偶然发现了一个惊人的秘密。这个世界远比表面看起来复杂，而你，成为了少数知道真相的人之一。这个秘密改变了你对一切的看法，但也带来了巨大的责任。你意识到，真正的成功不是追求名利，而是守护那些值得守护的东西。你选择隐藏身份，在暗中保护这个世界。',
    condition: isSecretEnding,
    category: 'secret',
    rarity: 'legendary'
  },
  {
    id: 'creative_success',
    name: '创作大师',
    description: '你在艺术领域获得了巨大成功',
    epilogue: '你的作品被世界各地的博物馆收藏，你的名字成为了艺术界的传奇。从最初在咖啡馆里写作的青涩少年，到现在的艺术大师，这一路走来充满了挑战和惊喜。你用自己的创作表达了对世界的理解，影响了无数人的心灵。艺术不仅给了你成功，更给了你内心的满足。',
    condition: isCreativeSuccess,
    category: 'success',
    rarity: 'epic'
  },
  {
    id: 'balanced_life',
    name: '平衡人生',
    description: '你在各个方面都取得了不错的成就',
    epilogue: '回顾自己的人生，你没有在某一个领域达到巅峰，但在各个方面都取得了不错的成就。你有一份稳定的工作，一个幸福的家庭，健康的身体，还有一群真诚的朋友。你学会了在追求成功的同时不忘记生活的本质。这种平衡的生活让你感到充实和满足。',
    condition: isBalancedLife,
    category: 'balanced',
    rarity: 'common'
  },
  {
    id: 'ethical_leader',
    name: '道德领袖',
    description: '你成为了行业的道德标杆',
    epilogue: '在面临道德困境时，你选择了坚持原则，即使这意味着失去一些机会。但正是这种坚持让你赢得了人们的尊重。你成为了行业的道德标杆，许多年轻人都以你为榜样。你证明了，在这个复杂的世界里，正直和诚信仍然是最宝贵的品质。',
    condition: isEthicalLeader,
    category: 'balanced',
    rarity: 'rare'
  },
  {
    id: 'rising_star',
    name: '新星崛起',
    description: '你正在快速成长，前途光明',
    epilogue: '虽然你还年轻，但已经在各个领域展现出了巨大的潜力。你的技能不断提升，创造力不断涌现，人脉网络也在不断扩大。你保持着良好的身心状态，对未来充满信心。虽然还没有达到巅峰，但所有人都相信，你的未来不可限量。',
    condition: isRisingStar,
    category: 'success',
    rarity: 'common'
  },
  {
    id: 'quiet_success',
    name: '低调成功',
    description: '你过着平静而富足的生活',
    epilogue: '你选择了一种低调的生活方式。虽然没有成为万众瞩目的焦点，但你拥有稳定的收入、健康的身体、平静的内心。你不追求刺激和冒险，而是专注于过好自己的生活。这种看似平凡的选择，却让你获得了内心的安宁和真正的幸福。',
    condition: isQuietSuccess,
    category: 'balanced',
    rarity: 'common'
  }
];

// 主要结局判断函数
export function getEnding(playerState: PlayerState): Ending {
  // 按优先级检查结局条件
  // 优先级：secret > epic > rare > common
  
  const secretEndings = endings.filter(e => e.rarity === 'legendary');
  for (const ending of secretEndings) {
    if (ending.condition(playerState)) {
      return ending;
    }
  }
  
  const epicEndings = endings.filter(e => e.rarity === 'epic');
  for (const ending of epicEndings) {
    if (ending.condition(playerState)) {
      return ending;
    }
  }
  
  const rareEndings = endings.filter(e => e.rarity === 'rare');
  for (const ending of rareEndings) {
    if (ending.condition(playerState)) {
      return ending;
    }
  }
  
  const commonEndings = endings.filter(e => e.rarity === 'common');
  for (const ending of commonEndings) {
    if (ending.condition(playerState)) {
      return ending;
    }
  }
  
  // 如果没有匹配的结局，返回默认结局
  return {
    id: 'default',
    name: '平凡人生',
    description: '你过着平凡而真实的生活',
    epilogue: '你没有成为传奇，也没有经历什么惊心动魄的冒险。你只是一个普通人，过着普通的生活。但这样的生活也有它的美好：有爱你的家人，有知心的朋友，有稳定的工作。也许，平凡本身就是一种成功。',
    condition: () => true,
    category: 'balanced',
    rarity: 'common'
  };
}

// 获取所有可能的结局（用于调试或展示）
export function getAllPossibleEndings(playerState: PlayerState): Ending[] {
  return endings.filter(ending => ending.condition(playerState));
}

// 结局统计信息
export function getEndingStats(): { [key: string]: number } {
  const stats: { [key: string]: number } = {};
  endings.forEach(ending => {
    stats[ending.rarity] = (stats[ending.rarity] || 0) + 1;
  });
  return stats;
}
