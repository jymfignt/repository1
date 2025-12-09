<template>
  <div class="game-page">
    <div class="game-container">
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
            <button class="action-btn" @click="goHome">返回首页</button>
          </div>
        </div>

        <!-- 故事内容 -->
        <div class="story-content" v-if="currentNode">
          <div class="story-text">
            {{ currentNode.text }}
          </div>

          <!-- 选择按钮 -->
          <div class="choices" v-if="currentNode.choices.length > 0">
            <button v-for="(choice, index) in currentNode.choices" :key="index" @click="makeChoice(choice)"
              class="choice-btn">
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
          <span class="step-info">第{{ currentStep }}步</span>
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
            <span class="info-value">{{ currentStep }}</span>
          </div>
        </div>

        <div class="attributes-section">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="当前属性" name="1" class="section-title">
              <div class="stat-item">
            <span class="stat-label">技能</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.skill + '%' }"></div>
              <span class="stat-value">{{ playerStats.skill }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">创造力</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.creativity + '%' }"></div>
              <span class="stat-value">{{ playerStats.creativity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">人脉</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.network + '%' }"></div>
              <span class="stat-value">{{ playerStats.network }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">财富</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.wealth + '%' }"></div>
              <span class="stat-value">{{ playerStats.wealth }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">幸福感</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.wellbeing + '%' }"></div>
              <span class="stat-value">{{ playerStats.wellbeing }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">正直度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.integrity + '%' }"></div>
              <span class="stat-value">{{ playerStats.integrity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险承受度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.risk + '%' }"></div>
              <span class="stat-value">{{ playerStats.risk }}</span>
            </div>
          </div>
            </el-collapse-item>
            <el-collapse-item title="成就状态" name="2" class="a">
              <div class="achievement-grid">
            <div v-for="(achievement, key) in achievements" :key="key" class="achievement-item"
              :class="{ 'achieved': achievement }">
              <span class="achievement-icon">{{ achievement ? '✓' : '○' }}</span>
              <span class="achievement-text">{{ achievementLabels[key] }}</span>
            </div>
          </div>
        </el-collapse-item>
     
          </el-collapse>
          <!-- <h4 class="section-title">当前属性</h4>
          <div class="stat-item">
            <span class="stat-label">技能</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.skill + '%' }"></div>
              <span class="stat-value">{{ playerStats.skill }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">创造力</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.creativity + '%' }"></div>
              <span class="stat-value">{{ playerStats.creativity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">人脉</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.network + '%' }"></div>
              <span class="stat-value">{{ playerStats.network }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">财富</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.wealth + '%' }"></div>
              <span class="stat-value">{{ playerStats.wealth }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">幸福感</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.wellbeing + '%' }"></div>
              <span class="stat-value">{{ playerStats.wellbeing }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">正直度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.integrity + '%' }"></div>
              <span class="stat-value">{{ playerStats.integrity }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险承受度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: playerStats.risk + '%' }"></div>
              <span class="stat-value">{{ playerStats.risk }}</span>
            </div>
          </div> -->
        </div>

        <!-- <div class="achievements-section">
          <h4 class="section-title">成就状态</h4>
          <div class="achievement-grid">
            <div v-for="(achievement, key) in achievements" :key="key" class="achievement-item"
              :class="{ 'achieved': achievement }">
              <span class="achievement-icon">{{ achievement ? '✓' : '○' }}</span>
              <span class="achievement-text">{{ achievementLabels[key] }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { story, character } from '../data/story';

import type { CollapseModelValue } from 'element-plus'

const activeNames = ref(['0'])
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}
const router = useRouter();

// 游戏状态
const currentNodeId = ref('start');
const choiceHistory = ref<any[]>([]);
const currentStep = ref(1);

// 玩家状态
const playerStats = ref({
  skill: 30,
  creativity: 40,
  network: 20,
  wealth: 10,
  wellbeing: 60,
  integrity: 80,
  risk: 30
});

const playerFlags = ref({
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
});

// 历史快照（用于撤销）
const stateHistory = ref<any[]>([]);

// 当前节点
const currentNode = computed(() => {
  return story.find(node => node.id === currentNodeId.value) || story[0];
});

// 成就
const achievements = computed(() => ({
  startup: playerFlags.value.hasStartup,
  corporate: playerFlags.value.hasCorporateJob,
  creative: playerFlags.value.hasCreativeWork,
  family: playerFlags.value.hasFamily,
  mentor: playerFlags.value.hasMentor,
  burnout: playerFlags.value.hasBurnout,
  ethical: playerFlags.value.hasEthicalDilemma,
  failure: playerFlags.value.hasMajorFailure,
  success: playerFlags.value.hasMajorSuccess,
  secret: playerFlags.value.hasSecretKnowledge
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

// ================= 方法 =================
const makeChoice = (choice: any) => {
  // 保存快照
  stateHistory.value.push({
    currentNodeId: currentNodeId.value,
    currentStep: currentStep.value,
    playerStats: JSON.parse(JSON.stringify(playerStats.value)),
    playerFlags: JSON.parse(JSON.stringify(playerFlags.value)),
    choiceHistory: JSON.parse(JSON.stringify(choiceHistory.value))
  });

  // 保存选择
  choiceHistory.value.push(choice);

  // 应用效果
  if (choice.effects) {
    if (choice.effects.stats) {
      Object.keys(choice.effects.stats).forEach(key => {
        const value = choice.effects.stats[key];
        if (value !== undefined) {
          playerStats.value[key as keyof typeof playerStats.value] = Math.max(
            0,
            Math.min(
              100,
              playerStats.value[key as keyof typeof playerStats.value] + value
            )
          );
        }
      });
    }

    if (choice.effects.flags) {
      Object.keys(choice.effects.flags).forEach(key => {
        const value = choice.effects.flags[key];
        if (value !== undefined) {
          playerFlags.value[key as keyof typeof playerFlags.value] = value;
        }
      });
    }
  }

  // 跳转节点
  currentNodeId.value = choice.next;
  currentStep.value++;

  // 检查是否结束
  const nextNode = story.find(node => node.id === choice.next);
  if (nextNode && nextNode.choices.length === 0) {
    setTimeout(() => {
      checkEnding();
    }, 1000);
  }
};

const undoLastChoice = () => {
  if (stateHistory.value.length === 0) return;

  const prevState = stateHistory.value.pop();

  currentNodeId.value = prevState.currentNodeId;
  currentStep.value = prevState.currentStep;
  playerStats.value = prevState.playerStats;
  playerFlags.value = prevState.playerFlags;
  choiceHistory.value = prevState.choiceHistory;
};

const checkEnding = () => {
  const ending = {
    id: 'simple_ending',
    name: '测试结局',
    description: '这是一个测试结局',
    epilogue: '恭喜你完成了游戏！这是一个简化的测试版本。',
    category: 'success',
    rarity: 'common'
  };

  sessionStorage.setItem(
    'endingData',
    JSON.stringify({
      ending: ending,
      playerStats: playerStats.value,
      playerFlags: playerFlags.value,
      currentStep: currentStep.value,
      choiceHistory: choiceHistory.value
    })
  );

  router.push('/ending');
};

const saveGame = () => {
  const saveData = {
    currentNodeId: currentNodeId.value,
    currentStep: currentStep.value,
    playerStats: playerStats.value,
    playerFlags: playerFlags.value,
    choiceHistory: choiceHistory.value,
    stateHistory: stateHistory.value,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('jobSimulator_save', JSON.stringify(saveData));
  alert('游戏已保存！');
};

const loadGame = () => {
  const saveData = localStorage.getItem('jobSimulator_save');
  if (saveData) {
    try {
      const data = JSON.parse(saveData);
      currentNodeId.value = data.currentNodeId;
      currentStep.value = data.currentStep;
      playerStats.value = data.playerStats || playerStats.value;
      playerFlags.value = data.playerFlags || playerFlags.value;
      choiceHistory.value = data.choiceHistory || [];
      stateHistory.value = data.stateHistory || [];
      alert('游戏已读取！');
    } catch (error) {
      alert('存档数据损坏！');
    }
  } else {
    alert('没有找到存档！');
  }
};

const goHome = () => {
  router.push('/');
};

// 初始化
onMounted(() => {
  const saveData = localStorage.getItem('jobSimulator_save');
  if (saveData) {
    try {
      const data = JSON.parse(saveData);
      currentNodeId.value = data.currentNodeId;
      currentStep.value = data.currentStep;
      playerStats.value = data.playerStats || playerStats.value;
      playerFlags.value = data.playerFlags || playerFlags.value;
      choiceHistory.value = data.choiceHistory || [];
      stateHistory.value = data.stateHistory || [];
    } catch (error) {
      console.error('加载存档失败:', error);
    }
  }
});
</script>

<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { story, character } from '../data/story';

const router = useRouter();

// 游戏状态
const currentNodeId = ref('start');
const choiceHistory = ref<any[]>([]);
const currentStep = ref(1);

// 简化的玩家状态
const playerStats = ref({
  skill: 30,
  creativity: 40,
  network: 20,
  wealth: 10,
  wellbeing: 60,
  integrity: 80,
  risk: 30
});

const playerFlags = ref({
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
});

// 计算属性
const currentNode = computed(() => {
  return story.find(node => node.id === currentNodeId.value) || story[0];
});

// 成就系统
const achievements = computed(() => ({
  startup: playerFlags.value.hasStartup,
  corporate: playerFlags.value.hasCorporateJob,
  creative: playerFlags.value.hasCreativeWork,
  family: playerFlags.value.hasFamily,
  mentor: playerFlags.value.hasMentor,
  burnout: playerFlags.value.hasBurnout,
  ethical: playerFlags.value.hasEthicalDilemma,
  failure: playerFlags.value.hasMajorFailure,
  success: playerFlags.value.hasMajorSuccess,
  secret: playerFlags.value.hasSecretKnowledge
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
const makeChoice = (choice: any) => {
  // 保存选择到历史记录
  choiceHistory.value.push(choice);
  
  // 应用选择效果
  if (choice.effects) {
    if (choice.effects.stats) {
      Object.keys(choice.effects.stats).forEach(key => {
        const value = choice.effects.stats[key];
        if (value !== undefined) {
          playerStats.value[key as keyof typeof playerStats.value] = Math.max(0, Math.min(100, 
            playerStats.value[key as keyof typeof playerStats.value] + value
          ));
        }
      });
    }
    
    if (choice.effects.flags) {
      Object.keys(choice.effects.flags).forEach(key => {
        const value = choice.effects.flags[key];
        if (value !== undefined) {
          playerFlags.value[key as keyof typeof playerFlags.value] = value;
        }
      });
    }
  }
  
  // 跳转到下一个节点
  currentNodeId.value = choice.next;
  currentStep.value++;
  
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
  // 创建简单的结局数据
  const ending = {
    id: 'simple_ending',
    name: '测试结局',
    description: '这是一个测试结局',
    epilogue: '恭喜你完成了游戏！这是一个简化的测试版本。',
    category: 'success',
    rarity: 'common'
  };
  
  // 保存结局数据并跳转
  sessionStorage.setItem('endingData', JSON.stringify({
    ending: ending,
    playerStats: playerStats.value,
    playerFlags: playerFlags.value,
    currentStep: currentStep.value,
    choiceHistory: choiceHistory.value
  }));
  
  router.push('/ending');
};

const undoLastChoice = () => {
  if (choiceHistory.value.length === 0) return;
  
  choiceHistory.value.pop()!;
  currentStep.value--;
  
  // 找到上一个节点
  const currentIndex = story.findIndex(node => node.id === currentNodeId.value);
  if (currentIndex > 0) {
    const previousNode = story[currentIndex - 1];
    if (previousNode) {
      currentNodeId.value = previousNode.id;
    }
  }
};

const saveGame = () => {
  const saveData = {
    currentNodeId: currentNodeId.value,
    currentStep: currentStep.value,
    playerStats: playerStats.value,
    playerFlags: playerFlags.value,
    choiceHistory: choiceHistory.value,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('jobSimulator_save', JSON.stringify(saveData));
  alert('游戏已保存！');
};

const loadGame = () => {
  const saveData = localStorage.getItem('jobSimulator_save');
  if (saveData) {
    try {
      const data = JSON.parse(saveData);
      currentNodeId.value = data.currentNodeId;
      currentStep.value = data.currentStep;
      playerStats.value = data.playerStats || playerStats.value;
      playerFlags.value = data.playerFlags || playerFlags.value;
      choiceHistory.value = data.choiceHistory || [];
      alert('游戏已读取！');
    } catch (error) {
      alert('存档数据损坏！');
    }
  } else {
    alert('没有找到存档！');
  }
};

const goHome = () => {
  router.push('/');
};

// 组件挂载时检查是否有存档
onMounted(() => {
  const saveData = localStorage.getItem('jobSimulator_save');
  if (saveData) {
    try {
      const data = JSON.parse(saveData);
      currentNodeId.value = data.currentNodeId;
      currentStep.value = data.currentStep;
      playerStats.value = data.playerStats || playerStats.value;
      playerFlags.value = data.playerFlags || playerFlags.value;
      choiceHistory.value = data.choiceHistory || [];
    } catch (error) {
      console.error('加载存档失败:', error);
    }
  }
});
</script> -->

<style scoped>
.game-page {
  min-height: 100vh;
  background: gray;
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
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid black;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
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
  font-size: 1.2rem;
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
  background: white;
  border: 1px solid black;
  border-radius: 8px;
  font-size: 1.1rem;
  color: black;
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

.info-section,
.attributes-section,
.achievements-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item {
  margin-bottom: 12px;
}

.info-label,
.stat-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 4px;
  display: block;
}

.info-value,
.stat-value {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.stat-bar {
  position: relative;
  height: 16px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 8px;
  transition: width 0.5s ease;
}

.stat-value {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #495057;
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
