<template>
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

        <!-- 游戏结束 -->
        <div v-else class="game-ended">
          <div class="ending-message">
            <h3>游戏结束</h3>
            <p>{{ currentNode.text }}</p>
            <button @click="restartGame" class="restart-btn">重新开始</button>
          </div>
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
        <h4 class="section-title">状态(示例)</h4>
        <div class="info-item">
          <span class="info-label">能量</span>
          <span class="info-value">{{ currentStats.energy }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">创造力</span>
          <span class="info-value">{{ currentStats.creativity }}</span>
        </div>
      </div>

      <div class="tip-section">
        <p class="tip-text">提示: 这个侧栏会随着你增加属性和成就而扩展。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { story, character, type Choice, type Character } from '../data/story'

// 游戏状态
const currentNodeId = ref('start')
const choiceHistory = ref<Choice[]>([])
const currentStep = ref(1)
const bgmEnabled = ref(false)

// 角色属性状态（固定值，不随选择变化）
const currentStats = ref<Character>({ ...character })

// 计算属性
const currentNode = computed(() => {
  return story.find(node => node.id === currentNodeId.value) || story[0]
})

// 方法
const makeChoice = (choice: Choice) => {
  // 保存选择到历史记录
  choiceHistory.value.push(choice)
  
  // 跳转到下一个节点
  currentNodeId.value = choice.next
  currentStep.value++
}

const undoLastChoice = () => {
  if (choiceHistory.value.length === 0) return
  
  choiceHistory.value.pop()!
  currentStep.value--
  
  // 找到上一个节点
  const currentIndex = story.findIndex(node => node.id === currentNodeId.value)
  if (currentIndex > 0) {
    const previousNode = story[currentIndex - 1]
    if (previousNode) {
      currentNodeId.value = previousNode.id
    }
  }
}

const restartGame = () => {
  currentNodeId.value = 'start'
  choiceHistory.value = []
  currentStep.value = 1
  currentStats.value = { ...character }
}

const saveGame = () => {
  const saveData = {
    currentNodeId: currentNodeId.value,
    currentStep: currentStep.value,
    choiceHistory: choiceHistory.value
  }
  localStorage.setItem('jobSimulator_save', JSON.stringify(saveData))
  alert('游戏已保存！')
}

const loadGame = () => {
  const saveData = localStorage.getItem('jobSimulator_save')
  if (saveData) {
    const data = JSON.parse(saveData)
    currentNodeId.value = data.currentNodeId
    currentStep.value = data.currentStep
    choiceHistory.value = data.choiceHistory || []
    alert('游戏已读取！')
  } else {
    alert('没有找到存档！')
  }
}

const toggleBGM = () => {
  bgmEnabled.value = !bgmEnabled.value
  // 这里可以添加实际的BGM控制逻辑
}

// 组件挂载时初始化
onMounted(() => {
  console.log('理想工作模拟器已启动')
})
</script>

<style scoped>
.game-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 左侧游戏内容区域 */
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

/* 角色信息头部 */
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

/* 故事内容 */
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

.choice-btn:active {
  transform: translateY(0);
}

/* 游戏结束 */
.game-ended {
  text-align: center;
  padding: 40px 20px;
}

.ending-message {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 30px;
}

.ending-message h3 {
  color: #856404;
  margin: 0 0 16px 0;
  font-size: 20px;
}

.ending-message p {
  color: #856404;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.restart-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.restart-btn:hover {
  background: #0056b3;
}

/* 底部信息 */
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

/* 右侧信息栏 */
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

.info-section {
  margin-bottom: 24px;
}

.attributes-section {
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

.info-label {
  font-size: 13px;
  color: #6c757d;
}

.info-value {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.tip-section {
  margin-top: auto;
}

.tip-text {
  font-size: 11px;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
  text-align: center;
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
