<template>
  <div class="ending-page">
    <div class="ending-container">
      <!-- 结局标题 -->
      <div class="ending-header">
        <div class="rarity-badge" :class="rarityClass">
          {{ rarityText }}
        </div>
        <h1 class="ending-title">{{ endingData.ending.name }}</h1>
        <p class="ending-description">{{ endingData.ending.description }}</p>
      </div>

      <!-- 结局内容 -->
      <div class="ending-content">
        <div class="epilogue-text">
          {{ endingData.ending.epilogue }}
        </div>
      </div>

      <!-- 玩家统计信息 -->
      <div class="player-stats">
        <h3 class="stats-title">最终属性</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">技能</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.skill + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.skill }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">创造力</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.creativity + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.creativity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">人脉</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.network + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.network }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">财富</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.wealth + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.wealth }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">幸福感</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.wellbeing + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.wellbeing }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">正直度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.integrity + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.integrity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险承受度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: endingData.playerStats.risk + '%' }"></div>
              <span class="stat-value">{{ endingData.playerStats.risk }}</span>
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

      <!-- 游戏统计 -->
      <div class="game-summary">
        <h3 class="summary-title">游戏统计</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">游戏步数</span>
            <span class="summary-value">{{ endingData.currentStep }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">选择次数</span>
            <span class="summary-value">{{ endingData.choiceHistory.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">结局稀有度</span>
            <span class="summary-value" :class="rarityClass">{{ rarityText }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="ending-actions">
        <button class="action-btn primary" @click="restartGame">重新开始</button>
        <button class="action-btn secondary" @click="shareEnding">分享结局</button>
        <button class="action-btn secondary" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const endingData = ref<any>(null);

// 计算稀有度样式
const rarityClass = computed(() => {
  if (!endingData.value?.ending) return '';
  switch (endingData.value.ending.rarity) {
    case 'legendary': return 'legendary';
    case 'epic': return 'epic';
    case 'rare': return 'rare';
    default: return 'common';
  }
});

const rarityText = computed(() => {
  if (!endingData.value?.ending) return '';
  switch (endingData.value.ending.rarity) {
    case 'legendary': return '传奇';
    case 'epic': return '史诗';
    case 'rare': return '稀有';
    default: return '普通';
  }
});

// 成就系统
const achievements = computed(() => {
  if (!endingData.value?.playerFlags) return {};
  return {
    startup: endingData.value.playerFlags.hasStartup,
    corporate: endingData.value.playerFlags.hasCorporateJob,
    creative: endingData.value.playerFlags.hasCreativeWork,
    family: endingData.value.playerFlags.hasFamily,
    mentor: endingData.value.playerFlags.hasMentor,
    burnout: endingData.value.playerFlags.hasBurnout,
    ethical: endingData.value.playerFlags.hasEthicalDilemma,
    failure: endingData.value.playerFlags.hasMajorFailure,
    success: endingData.value.playerFlags.hasMajorSuccess,
    secret: endingData.value.playerFlags.hasSecretKnowledge
  };
});

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
  // 清除存档
  localStorage.removeItem('jobSimulator_save');
  sessionStorage.removeItem('endingData');
  router.push('/game');
};

const shareEnding = () => {
  if (!endingData.value?.ending) return;
  
  const shareText = `我在《理想工作模拟器》中获得了结局：${endingData.value.ending.name} - ${endingData.value.ending.description}`;
  
  if (navigator.share) {
    navigator.share({ text: shareText });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('结局信息已复制到剪贴板！');
    });
  } else {
    alert(shareText);
  }
};

const goHome = () => {
  router.push('/');
};

// 从sessionStorage获取数据
onMounted(() => {
  const data = sessionStorage.getItem('endingData');
  if (data) {
    try {
      endingData.value = JSON.parse(data);
    } catch (error) {
      console.error('读取结局数据失败:', error);
      router.push('/');
    }
  } else {
    // 如果没有数据，跳转到首页
    router.push('/');
  }
});
</script>

<style scoped>
.ending-page {
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
  max-width: 900px;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.game-summary {
  margin-bottom: 40px;
  text-align: left;
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-align: center;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.summary-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

.summary-value.legendary {
  color: #ffd700;
}

.summary-value.epic {
  color: #9b59b6;
}

.summary-value.rare {
  color: #3498db;
}

.summary-value.common {
  color: #95a5a6;
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
  
  .summary-grid {
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
