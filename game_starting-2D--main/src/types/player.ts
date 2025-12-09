// 玩家核心属性
export interface PlayerStats {
  skill: number;        // 技能 (0-100)
  creativity: number;   // 创造力 (0-100)
  network: number;      // 人脉 (0-100)
  wealth: number;       // 财富 (0-100)
  wellbeing: number;    // 幸福感 (0-100)
  integrity: number;    // 正直度 (0-100)
  risk: number;         // 风险承受度 (0-100)
}

// 隐藏标记/成就
export interface PlayerFlags {
  hasStartup: boolean;          // 是否创业过
  hasCorporateJob: boolean;     // 是否在大公司工作过
  hasCreativeWork: boolean;     // 是否从事过创作工作
  hasFamily: boolean;           // 是否有家庭
  hasMentor: boolean;           // 是否有导师
  hasBurnout: boolean;          // 是否经历过燃尽
  hasEthicalDilemma: boolean;   // 是否面临过道德困境
  hasMajorFailure: boolean;     // 是否有重大失败
  hasMajorSuccess: boolean;     // 是否有重大成功
  hasSecretKnowledge: boolean;  // 是否获得秘密知识
}

// 玩家完整状态
export interface PlayerState {
  stats: PlayerStats;
  flags: PlayerFlags;
  currentStep: number;
  path: string;  // 当前路径标识
}

// 选择效果
export interface ChoiceEffect {
  stats?: Partial<PlayerStats>;
  flags?: Partial<PlayerFlags>;
}

// 默认玩家状态
export const defaultPlayerState: PlayerState = {
  stats: {
    skill: 30,
    creativity: 40,
    network: 20,
    wealth: 10,
    wellbeing: 60,
    integrity: 80,
    risk: 30
  },
  flags: {
    hasStartup: false,
    hasCorporateJob: false,
    hasCreativeWork: false,
    hasFamily: false,
    hasMentor: false,
    hasBurnout: false,
    hasEthicalDilemma: false,
    hasMajorFailure: false,
    hasMajorSuccess: false,
    hasSecretKnowledge: false
  },
  currentStep: 1,
  path: 'start'
};

// 应用选择效果的工具函数
export function applyChoiceEffect(playerState: PlayerState, effect: ChoiceEffect): PlayerState {
  const newState = JSON.parse(JSON.stringify(playerState)); // 深拷贝
  
  // 应用属性变化
  if (effect.stats) {
    Object.keys(effect.stats).forEach(key => {
      const statKey = key as keyof PlayerStats;
      if (effect.stats![statKey] !== undefined) {
        newState.stats[statKey] = Math.max(0, Math.min(100, 
          newState.stats[statKey] + (effect.stats![statKey] || 0)
        ));
      }
    });
  }
  
  // 应用标记变化
  if (effect.flags) {
    Object.keys(effect.flags).forEach(key => {
      const flagKey = key as keyof PlayerFlags;
      if (effect.flags![flagKey] !== undefined) {
        newState.flags[flagKey] = effect.flags![flagKey] || false;
      }
    });
  }
  
  return newState;
}
