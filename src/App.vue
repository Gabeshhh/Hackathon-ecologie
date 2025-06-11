<template>
  <div class="main-layout">
    <!-- Le canvas 3D est déjà en fixed/fullscreen dans 3DPlanet.vue -->
    <div class="panel panel-top-right">
      <div class="panel-content">
        <div class="panel-title">Dollars</div>
        <div class="panel-value">${{ formatNumber(gameState.dollars) }}</div>
        <div class="panel-title">Pollution CO₂</div>
        <div class="panel-value">{{ Math.floor(gameState.pollution) }}%</div>
      </div>
    </div>
    <div class="panel panel-bottom-left">
      <div class="panel-content">
        <div class="panel-title">Améliorations IA</div>
        <div class="panel-upgrades">
          <button
            v-for="upgrade in aiUpgrades"
            :key="upgrade.id"
            class="upgrade-btn"
            :disabled="gameState.dollars < getUpgradeCost(upgrade)"
            @click="purchaseUpgrade(upgrade.id)"
          >
            <span class="upgrade-icon">{{ upgrade.icon }}</span>
            <span class="upgrade-label">{{ upgrade.name }}</span>
            <span class="upgrade-level">Lv.{{ upgrade.level }}</span>
            <span class="upgrade-cost"
              >${{ formatNumber(getUpgradeCost(upgrade)) }}</span
            >
          </button>
        </div>
      </div>
    </div>
    <div class="panel panel-bottom-right">
      <div class="panel-content">
        <div class="panel-title">Améliorations Vertes</div>
        <div class="panel-upgrades">
          <button
            v-for="upgrade in greenUpgrades"
            :key="upgrade.id"
            class="upgrade-btn"
            :disabled="gameState.dollars < getUpgradeCost(upgrade)"
            @click="purchaseUpgrade(upgrade.id)"
          >
            <span class="upgrade-icon">{{ upgrade.icon }}</span>
            <span class="upgrade-label">{{ upgrade.name }}</span>
            <span class="upgrade-level">Lv.{{ upgrade.level }}</span>
            <span class="upgrade-cost"
              >${{ formatNumber(getUpgradeCost(upgrade)) }}</span
            >
          </button>
        </div>
      </div>
    </div>
    <ThreeDPlanet />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ThreeDPlanet from "./components/3DPlanet.vue";
import {
  gameState,
  upgrades,
  purchaseUpgrade,
  getUpgradeCost,
} from "./stores/gameStore";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fr-FR").format(num);
};

const aiUpgrades = computed(() => upgrades.filter((u) => u.type === "ai"));
const greenUpgrades = computed(() =>
  upgrades.filter((u) => u.type === "green")
);
</script>

<style scoped>
.main-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.panel {
  position: fixed;
  background: #ddd;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.07);
  padding: 24px 28px;
  min-width: 180px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.panel-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #555;
}
.panel-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}
.panel-upgrades {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.upgrade-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: background 0.2s;
}
.upgrade-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.upgrade-btn:not(:disabled):hover {
  background: #e0e0e0;
}
.upgrade-icon {
  font-size: 1.3rem;
}
.upgrade-label {
  flex: 1;
  font-weight: 500;
}
.upgrade-level {
  font-size: 0.9rem;
  color: #888;
}
.upgrade-cost {
  font-size: 0.95rem;
  color: #1976d2;
  font-weight: 600;
}
.panel-top-right {
  top: 32px;
  right: 40px;
}
.panel-bottom-left {
  left: 32px;
  bottom: 32px;
}
.panel-bottom-right {
  right: 32px;
  bottom: 32px;
}
@media (max-width: 900px) {
  .panel {
    min-width: 120px;
    padding: 14px 10px;
  }
  .panel-top-right,
  .panel-bottom-right,
  .panel-bottom-left {
    right: 10px;
    left: auto;
    bottom: 10px;
    top: auto;
  }
  .panel-top-right {
    top: 10px;
    right: 10px;
    bottom: auto;
  }
  .panel-bottom-left {
    left: 10px;
    bottom: 10px;
  }
}
@media (max-width: 600px) {
  .panel {
    min-width: 90px;
    padding: 8px 4px;
  }
  .panel-title {
    font-size: 0.95rem;
  }
  .panel-value {
    font-size: 1.1rem;
  }
}
</style>
