<template>
  <div class="ending-screen">
    <div class="ending-container">
      <!-- 结局标题 -->
      <div class="ending-header">
        <div class="rarity-badge" :class="rarityClass">
          {{ rarityText }}
        </div>
        <h1 class="ending-title">{{ ending.name }}</h1>
        <p class="ending-description">{{ ending.description }}</p>
      </div>

      <!-- 结局内容 -->
      <div class="ending-content">
        <div class="epilogue-text">
          {{ ending.epilogue }}
        </div>
      </div>

      <!-- 玩家统计信息 -->
      <div class="player-stats">
        <h3 class="stats-title">最终属性</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">技能</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.skill + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.skill }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">创造力</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.creativity + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.creativity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">人脉</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.network + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.network }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">财富</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.wealth + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.wealth }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">幸福感</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.wellbeing + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.wellbeing }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">正直度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.integrity + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.integrity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险承受度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerState.stats.risk + '%' }"></div>
              <span class="stat-value">{{ playerState.stats.risk }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 成就标记 -->
      <div class="achievements" v-if="hasAchievements">
        <h3 class="achievements-title">成就解锁</h3>
        <div class="achievement-list">
          <div 
            v-for="(achievement, key) in achievements" 
            :key="key"
            class="achievement-item"
            :class="{ 'achieved': achievement }"
          >
            <span class="achievement-icon">{{ achievement ? '✓' : '○' }}</span>
            <span class="achievement-text">{{ achievementLabels[key] }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="ending-actions">
        <button class="action-btn primary" @click="restartGame">重新开始</button>
        <button class="action-btn secondary" @click="shareEnding">分享结局</button>
        <button class="action-btn secondary" @click="viewStats">查看统计</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Ending } from '../data/endings';
import { PlayerState } from '../types/player';

interface Props {
  ending: Ending;
  playerState: PlayerState;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  restart: [];
  share: [ending: Ending];
  viewStats: [];
}>();

// 计算稀有度样式
const rarityClass = computed(() => {
  switch (props.ending.rarity) {
    case 'legendary': return 'legendary';
    case 'epic': return 'epic';
    case 'rare': return 'rare';
    default: return 'common';
  }
});

const rarityText = computed(() => {
  switch (props.ending.rarity) {
    case 'legendary': return '传奇';
    case 'epic': return '史诗';
    case 'rare': return '稀有';
    default: return '普通';
  }
});

// 成就系统
const achievements = computed(() => ({
  startup: props.playerState.flags.hasStartup,
  corporate: props.playerState.flags.hasCorporateJob,
  creative: props.playerState.flags.hasCreativeWork,
  family: props.playerState.flags.hasFamily,
  mentor: props.playerState.flags.hasMentor,
  burnout: props.playerState.flags.hasBurnout,
  ethical: props.playerState.flags.hasEthicalDilemma,
  failure: props.playerState.flags.hasMajorFailure,
  success: props.playerState.flags.hasMajorSuccess,
  secret: props.playerState.flags.hasSecretKnowledge
}));

const achievementLabels = {
  startup: '创业者',
  corporate: '企业精英',
  creative: '艺术家',
  family: '家庭优先',
  mentor: '有导师',
  burnout: '经历燃尽',
  ethical: '道德考验',
  failure: '重大失败',
  success: '重大成功',
  secret: '秘密知识'
};

const hasAchievements = computed(() => {
  return Object.values(achievements.value).some(achieved => achieved);
});

// 事件处理
const restartGame = () => {
  emit('restart');
};

const shareEnding = () => {
  emit('share', props.ending);
};

const viewStats = () => {
  emit('viewStats');
};
</script>

<style scoped>
.ending-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.ending-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.ending-header {
  margin-bottom: 30px;
}

.rarity-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rarity-badge.legendary {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #8b4513;
}

.rarity-badge.epic {
  background: linear-gradient(45deg, #9b59b6, #e74c3c);
  color: white;
}

.rarity-badge.rare {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.rarity-badge.common {
  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  color: white;
}

.ending-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-description {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
  font-style: italic;
}

.ending-content {
  margin-bottom: 40px;
}

.epilogue-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  text-align: left;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #667eea;
}

.player-stats {
  margin-bottom: 40px;
  text-align: left;
}

.stats-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-bar {
  position: relative;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 0.8s ease;
}

.stat-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
}

.achievements {
  margin-bottom: 40px;
  text-align: left;
}

.achievements-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-align: center;
}

.achievement-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.achievement-item.achieved {
  background: #d4edda;
  color: #155724;
}

.achievement-item:not(.achieved) {
  background: #f8f9fa;
  color: #6c757d;
}

.achievement-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.achievement-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.ending-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.action-btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ending-container {
    padding: 20px;
    margin: 10px;
  }
  
  .ending-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-list {
    grid-template-columns: 1fr;
  }
  
  .ending-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
