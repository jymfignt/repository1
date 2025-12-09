<template>
  <div class="game-with-endings">
    <!-- 游戏进行中 -->
    <div v-if="!gameEnded" class="game-container">
      <!-- 左侧游戏内容区域 -->
      <div class="game-content">
        <!-- 角色信息头部 -->
        <div class="character-header">
          <div class="character-info">
            <h2 class="character-name">主角: {{ character.name }}</h2>
            <p class="character-description">{{ character.description }}</p>
          </div>
          <div class="action-buttons">
            <button class="action-btn" @click="saveGame">存档</button>
            <button class="action-btn" @click="loadGame">读档</button>
            <button class="action-btn" @click="toggleBGM">{{ bgmEnabled ? 'BGM 关' : 'BGM 开' }}</button>
          </div>
        </div>

        <!-- 故事内容 -->
        <div class="story-content" v-if="currentNode">
          <div class="story-text">
            {{ currentNode.text }}
          </div>
          
          <!-- 选择按钮 -->
          <div class="choices" v-if="currentNode.choices.length > 0">
            <button 
              v-for="(choice, index) in currentNode.choices" 
              :key="index"
              @click="makeChoice(choice)"
              class="choice-btn"
            >
              {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
            </button>
          </div>

          <!-- 游戏结束检查 -->
          <div v-else class="game-ended">
            <button @click="checkEnding" class="check-ending-btn">查看结局</button>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="game-footer">
          <span class="step-info">第{{ playerState.currentStep }}步</span>
          <button class="undo-btn" @click="undoLastChoice" :disabled="choiceHistory.length === 0">撤销</button>
        </div>
      </div>

      <!-- 右侧进度信息区域 -->
      <div class="info-sidebar">
        <h3 class="sidebar-title">进度与信息</h3>
        
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">当前场景</span>
            <span class="info-value">{{ currentNodeId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">历史步数</span>
            <span class="info-value">{{ playerState.currentStep }}</span>
          </div>
        </div>

        <div class="attributes-section">
          <h4 class="section-title">当前属性</h4>
          <div class="stat-item">
            <span class="stat-label">技能</span>
            <span class="stat-value">{{ playerState.stats.skill }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">创造力</span>
            <span class="stat-value">{{ playerState.stats.creativity }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">人脉</span>
            <span class="stat-value">{{ playerState.stats.network }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">财富</span>
            <span class="stat-value">{{ playerState.stats.wealth }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">幸福感</span>
            <span class="stat-value">{{ playerState.stats.wellbeing }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">正直度</span>
            <span class="stat-value">{{ playerState.stats.integrity }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险承受度</span>
            <span class="stat-value">{{ playerState.stats.risk }}</span>
          </div>
        </div>

        <div class="achievements-section">
          <h4 class="section-title">成就状态</h4>
          <div class="achievement-grid">
            <div v-for="(achievement, key) in achievements" :key="key" class="achievement-item" :class="{ 'achieved': achievement }">
              <span class="achievement-icon">{{ achievement ? '✓' : '○' }}</span>
              <span class="achievement-text">{{ achievementLabels[key] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏结束 - 显示结局 -->
    <div v-else class="ending-container">
      <EndingScreen 
        :ending="currentEnding" 
        :player-state="playerState"
        @restart="restartGame"
        @share="shareEnding"
        @view-stats="viewStats"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { story, character, type Choice } from '../data/story';
import { getEnding } from '../data/endings';
import { defaultPlayerState, applyChoiceEffect, type PlayerState } from '../types/player';
import EndingScreen from './EndingScreen.vue';

// 游戏状态
const currentNodeId = ref('start');
const choiceHistory = ref<Choice[]>([]);
const bgmEnabled = ref(false);
const gameEnded = ref(false);
const currentEnding = ref<any>(null);

// 玩家状态
const playerState = ref<PlayerState>({ ...defaultPlayerState });

// 计算属性
const currentNode = computed(() => {
  return story.find(node => node.id === currentNodeId.value) || story[0];
});

// 成就系统
const achievements = computed(() => ({
  startup: playerState.value.flags.hasStartup,
  corporate: playerState.value.flags.hasCorporateJob,
  creative: playerState.value.flags.hasCreativeWork,
  family: playerState.value.flags.hasFamily,
  mentor: playerState.value.flags.hasMentor,
  burnout: playerState.value.flags.hasBurnout,
  ethical: playerState.value.flags.hasEthicalDilemma,
  failure: playerState.value.flags.hasMajorFailure,
  success: playerState.value.flags.hasMajorSuccess,
  secret: playerState.value.flags.hasSecretKnowledge
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

// 方法
const makeChoice = (choice: Choice) => {
  // 保存选择到历史记录
  choiceHistory.value.push(choice);
  
  // 应用选择效果
  if (choice.effects) {
    playerState.value = applyChoiceEffect(playerState.value, choice.effects);
  }
  
  // 跳转到下一个节点
  currentNodeId.value = choice.next;
  playerState.value.currentStep++;
  playerState.value.path = choice.next;
  
  // 检查是否是游戏结束节点
  const nextNode = story.find(node => node.id === choice.next);
  if (nextNode && nextNode.choices.length === 0) {
    // 这是一个结束节点，准备显示结局
    setTimeout(() => {
      checkEnding();
    }, 1000);
  }
};

const checkEnding = () => {
  currentEnding.value = getEnding(playerState.value);
  gameEnded.value = true;
};

const undoLastChoice = () => {
  if (choiceHistory.value.length === 0) return;
  
  choiceHistory.value.pop()!;
  playerState.value.currentStep--;
  
  // 找到上一个节点
  const currentIndex = story.findIndex(node => node.id === currentNodeId.value);
  if (currentIndex > 0) {
    const previousNode = story[currentIndex - 1];
    if (previousNode) {
      currentNodeId.value = previousNode.id;
      playerState.value.path = previousNode.id;
    }
  }
};

const restartGame = () => {
  currentNodeId.value = 'start';
  choiceHistory.value = [];
  playerState.value = { ...defaultPlayerState };
  gameEnded.value = false;
  currentEnding.value = null;
};

const saveGame = () => {
  const saveData = {
    currentNodeId: currentNodeId.value,
    playerState: playerState.value,
    choiceHistory: choiceHistory.value
  };
  localStorage.setItem('jobSimulator_save', JSON.stringify(saveData));
  alert('游戏已保存！');
};

const loadGame = () => {
  const saveData = localStorage.getItem('jobSimulator_save');
  if (saveData) {
    const data = JSON.parse(saveData);
    currentNodeId.value = data.currentNodeId;
    playerState.value = data.playerState;
    choiceHistory.value = data.choiceHistory || [];
    alert('游戏已读取！');
  } else {
    alert('没有找到存档！');
  }
};

const toggleBGM = () => {
  bgmEnabled.value = !bgmEnabled.value;
};

const shareEnding = (ending: any) => {
  const shareText = `我在《理想工作模拟器》中获得了结局：${ending.name} - ${ending.description}`;
  if (navigator.share) {
    navigator.share({ text: shareText });
  } else {
    navigator.clipboard.writeText(shareText);
    alert('结局信息已复制到剪贴板！');
  }
};

const viewStats = () => {
  alert(`游戏统计信息：\n步数：${playerState.value.currentStep}\n当前路径：${playerState.value.path}`);
};

// 组件挂载时初始化
onMounted(() => {
  console.log('带结局系统的理想工作模拟器已启动');
});
</script>

<style scoped>
.game-with-endings {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.game-container {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-content {
  width: 600px;
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  margin-right: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.character-info {
  flex: 1;
}

.character-name {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.character-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 12px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.story-content {
  flex: 1;
  margin-bottom: 30px;
}

.story-text {
  font-size: 16px;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 30px;
  text-align: justify;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-btn {
  padding: 16px 20px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.choice-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.game-ended {
  text-align: center;
  padding: 40px 20px;
}

.check-ending-btn {
  padding: 16px 32px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.check-ending-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.step-info {
  font-size: 12px;
  color: #6c757d;
}

.undo-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 12px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.undo-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.undo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-sidebar {
  width: 280px;
  max-width: 280px;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  margin-left: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 24px 0;
}

.info-section, .attributes-section, .achievements-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
}

.info-item, .stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-label, .stat-label {
  font-size: 13px;
  color: #6c757d;
}

.info-value, .stat-value {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.achievement-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 6px;
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
  font-size: 1rem;
  font-weight: bold;
}

.achievement-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.ending-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }
  
  .info-sidebar {
    width: 600px;
    max-width: 600px;
    margin: 10px 0;
  }
  
  .game-content {
    margin: 0 0 10px 0;
  }
}

@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }
  
  .character-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .action-buttons {
    align-self: flex-end;
  }
  
  .game-content,
  .info-sidebar {
    width: 100%;
    max-width: 100%;
    padding: 20px;
    margin: 5px 0;
  }
}
</style>
