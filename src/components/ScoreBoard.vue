<template>
  <div class="anime-scoreboard">
    <div class="scoreboard-header">
      <h3 class="header-title">
        <span class="header-icon">📊</span>
        <span class="header-text">ステータス</span>
      </h3>
    </div>

    <div class="score-items">
      <div class="score-item eco-points">
        <div class="item-icon">💰</div>
        <div class="item-content">
          <div class="item-label">エコポイント</div>
          <div class="item-value">{{ formatNumber(gameState.ecoPoints) }}</div>
        </div>
        <div class="item-glow"></div>
      </div>

      <div class="score-item planet-health" :class="healthClass">
        <div class="item-icon">🌍</div>
        <div class="item-content">
          <div class="item-label">惑星の健康</div>
          <div class="item-value">
            {{ Math.floor(gameState.planetHealth) }}%
          </div>
          <div class="health-bar">
            <div
              class="health-fill"
              :style="{ width: `${gameState.planetHealth}%` }"
            ></div>
            <div class="health-shine"></div>
          </div>
        </div>
        <div class="item-glow"></div>
      </div>

      <div class="score-item click-power">
        <div class="item-icon">👆</div>
        <div class="item-content">
          <div class="item-label">クリック力</div>
          <div class="item-value">{{ gameState.clickValue }}</div>
        </div>
        <div class="item-glow"></div>
      </div>

      <div class="score-item auto-rate" v-if="gameState.autoClickRate > 0">
        <div class="item-icon">⚡</div>
        <div class="item-content">
          <div class="item-label">自動生成</div>
          <div class="item-value">{{ gameState.autoClickRate }}/秒</div>
        </div>
        <div class="item-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { gameState } from "../stores/gameStore";

const healthClass = computed(() => {
  if (gameState.planetHealth > 60) return "healthy";
  if (gameState.planetHealth > 20) return "warning";
  return "critical";
});

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return Math.floor(num).toString();
};
</script>

<style scoped>
.anime-scoreboard {
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1),
    rgba(20, 20, 40, 0.2)
  );
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.scoreboard-header {
  margin-bottom: 15px;
  text-align: center;
}

.header-title {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.header-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.6));
}

.header-text {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.score-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(74, 222, 128, 0.5);
}

.item-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.item-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  font-family: "Noto Sans JP", monospace;
}

.item-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(74, 222, 128, 0.1),
    rgba(59, 130, 246, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.score-item:hover .item-glow {
  opacity: 1;
}

/* Health bar anime style */
.health-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 6px;
}

.health-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.5s ease;
  position: relative;
}

.health-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.healthy .health-fill {
  background: linear-gradient(90deg, #4ade80, #22c55e);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
}

.warning .health-fill {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
}

.critical .health-fill {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
  animation: criticalPulse 1s ease-in-out infinite;
}

@keyframes criticalPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .anime-scoreboard {
    padding: 15px;
  }

  .score-item {
    padding: 12px;
  }

  .item-value {
    font-size: 1.1rem;
  }

  .item-icon {
    font-size: 1.5rem;
  }
}
</style>
