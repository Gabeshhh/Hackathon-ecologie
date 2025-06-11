// État du jeu
export interface GameState {
  dollars: number; // Dollars générés
  pollution: number; // Niveau de pollution
  clickValue: number; // Valeur de chaque clic
  autoClickRate: number; // Taux de génération automatique
  lastAutoClick: number; // Dernier clic automatique
}

// Type d'amélioration
export type UpgradeType = "green" | "ai";

// Amélioration disponible
export interface Upgrade {
  id: string; // Identifiant unique
  name: string; // Nom de l'amélioration
  description: string; // Description
  type: UpgradeType; // Type d'amélioration (verte ou IA)
  cost: number; // Coût de base
  costMultiplier: number; // Multiplicateur de coût
  level: number; // Niveau actuel
  maxLevel: number; // Niveau maximum
  clickValueIncrease?: number; // Augmentation de la valeur des clics
  autoClickIncrease?: number; // Augmentation du taux automatique
  pollutionIncrease?: number; // Augmentation de la pollution
  pollutionDecrease?: number; // Réduction de la pollution
  icon: string; // Icône
}

// État de la planète
export interface PlanetState {
  phase: "healthy" | "polluted" | "destroyed"; // Phase actuelle
  rotationSpeed: number;
  atmosphereOpacity: number;
  pollutionLevel: number;
}
