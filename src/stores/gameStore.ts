import { computed, reactive } from "vue";
import type { GameState, PlanetState, Upgrade } from "../types/game";

// État du jeu
export const gameState = reactive<GameState>({
  dollars: 0,
  pollution: 0,
  clickValue: 1,
  autoClickRate: 0,
  lastAutoClick: Date.now(),
});

// Améliorations disponibles
export const upgrades: Upgrade[] = [
  // Améliorations IA
  {
    id: "server-upgrade",
    name: "Serveur IA",
    description: "Augmente la génération de dollars",
    type: "ai",
    cost: 10,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 10,
    clickValueIncrease: 1,
    pollutionIncrease: 2,
    icon: "💻",
  },
  {
    id: "ai-cluster",
    name: "Cluster IA",
    description: "Génération automatique de dollars",
    type: "ai",
    cost: 50,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 8,
    autoClickIncrease: 1,
    pollutionIncrease: 3,
    icon: "🤖",
  },
  {
    id: "quantum-server",
    name: "Serveur Quantique",
    description: "Serveur ultra-performant",
    type: "ai",
    cost: 200,
    costMultiplier: 2,
    level: 0,
    maxLevel: 5,
    clickValueIncrease: 5,
    autoClickIncrease: 2,
    pollutionIncrease: 5,
    icon: "⚛️",
  },
  // Améliorations vertes
  {
    id: "solar-panel",
    name: "Panneau Solaire",
    description: "Réduit la pollution",
    type: "green",
    cost: 30,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 10,
    pollutionDecrease: 2,
    icon: "☀️",
  },
  {
    id: "wind-turbine",
    name: "Éolienne",
    description: "Énergie éolienne propre",
    type: "green",
    cost: 80,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 8,
    pollutionDecrease: 3,
    icon: "🌪️",
  },
  {
    id: "hydro-dam",
    name: "Barrage Hydroélectrique",
    description: "Énergie hydraulique",
    type: "green",
    cost: 150,
    costMultiplier: 2,
    level: 0,
    maxLevel: 5,
    pollutionDecrease: 5,
    icon: "💧",
  },
  {
    id: "forest",
    name: "Forêt",
    description: "Absorbe le CO2",
    type: "green",
    cost: 100,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 10,
    pollutionDecrease: 4,
    icon: "🌲",
  },
];

// Propriétés calculées
export const planetPhase = computed((): PlanetState["phase"] => {
  if (gameState.pollution < 30) return "healthy";
  if (gameState.pollution < 70) return "polluted";
  return "destroyed";
});

export const canAfford = (upgrade: Upgrade): boolean => {
  return gameState.dollars >= getUpgradeCost(upgrade);
};

export const getUpgradeCost = (upgrade: Upgrade): number => {
  return Math.floor(
    upgrade.cost * Math.pow(upgrade.costMultiplier, upgrade.level)
  );
};

// Actions du jeu
export const clickPlanet = (): void => {
  gameState.dollars += gameState.clickValue;
  gameState.pollution += 0.1; // Chaque clic génère un peu de pollution
};

export const purchaseUpgrade = (upgradeId: string): boolean => {
  const upgrade = upgrades.find((u) => u.id === upgradeId);
  if (!upgrade || !canAfford(upgrade) || upgrade.level >= upgrade.maxLevel) {
    return false;
  }

  const cost = getUpgradeCost(upgrade);
  gameState.dollars -= cost;
  upgrade.level++;

  // Appliquer les effets de l'amélioration
  if (upgrade.clickValueIncrease) {
    gameState.clickValue += upgrade.clickValueIncrease;
  }
  if (upgrade.autoClickIncrease) {
    gameState.autoClickRate += upgrade.autoClickIncrease;
  }
  if (upgrade.pollutionIncrease) {
    gameState.pollution += upgrade.pollutionIncrease;
  }
  if (upgrade.pollutionDecrease) {
    gameState.pollution = Math.max(
      0,
      gameState.pollution - upgrade.pollutionDecrease
    );
  }

  return true;
};

// Système de clic automatique
export const processAutoClick = (): void => {
  const now = Date.now();
  const timeDiff = now - gameState.lastAutoClick;

  if (timeDiff >= 1000 && gameState.autoClickRate > 0) {
    gameState.dollars += gameState.autoClickRate;
    gameState.pollution += gameState.autoClickRate * 0.05; // La génération automatique génère aussi de la pollution
    gameState.lastAutoClick = now;
  }
};

// Initialiser la boucle de clic automatique
setInterval(processAutoClick, 100);
