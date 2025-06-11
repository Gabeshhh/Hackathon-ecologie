import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  Cpu,
  Droplet,
  HardDrive,
  Leaf,
  Recycle,
  Server,
  Settings,
  Sun,
  TreePine,
  Wind,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// Types
interface Improvement {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  count: number;
  dollarEffect: number;
  pollutionEffect: number;
  icon: React.ElementType;
  type: "ai" | "eco" | "optimization";
  effectType?: "passive" | "instant";
  waterEffect?: number;
  powerEffect?: number;
  requestEffect?: number;
}

interface GameState {
  dollars: number;
  pollution: number;
  clickPower: number;
  passiveIncome: number;
  pollutionRate: number;
  improvements: Improvement[];
  kilowatts: number;
  waterLiters: number;
  aiRequests: number;
  currentDay: number;
  currentHour: number;
  currentMinute: number;
}

// CSS Styles
const styles = {
  container: {
    minHeight: "100vh",
    padding: "32px 16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "all 1s ease",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: "1rem",
  },
  statsPanel: {
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    marginBottom: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  statRate: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  clickButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
    position: "relative" as const,
  },
  clickButton: {
    width: "128px",
    height: "128px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    border: "4px solid white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    position: "relative" as const,
  },
  clickButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  },
  improvementsPanel: {
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "24px",
  },
  tabContainer: {
    display: "flex",
    marginBottom: "16px",
  },
  tab: {
    padding: "8px 16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tabActive: {
    background: "#3B82F6",
    color: "white",
  },
  tabInactive: {
    background: "#E5E7EB",
    color: "#374151",
  },
  tabLeft: {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
  tabRight: {
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  improvementGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  improvementCard: {
    padding: "16px",
    borderRadius: "8px",
    border: "2px solid",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  improvementCardAffordable: {
    borderColor: "#93C5FD",
    background: "#EFF6FF",
  },
  improvementCardNotAffordable: {
    borderColor: "#D1D5DB",
    background: "#F3F4F6",
    opacity: 0.5,
    cursor: "not-allowed",
  },
  improvementCardEco: {
    borderColor: "#86EFAC",
    background: "#F0FDF4",
  },
  improvementHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  improvementTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  improvementName: {
    fontWeight: "600",
    color: "#374151",
  },
  improvementCount: {
    background: "#E5E7EB",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.875rem",
  },
  improvementDescription: {
    fontSize: "0.875rem",
    color: "#6B7280",
    marginBottom: "8px",
  },
  improvementFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  improvementPrice: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    color: "#059669",
  },
  buyButton: {
    padding: "4px 12px",
    borderRadius: "4px",
    color: "white",
    fontSize: "0.875rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buyButtonAI: {
    background: "#3B82F6",
  },
  buyButtonEco: {
    background: "#059669",
  },
  progressBar: {
    width: "128px",
    height: "8px",
    background: "#E5E7EB",
    borderRadius: "4px",
    overflow: "hidden" as const,
  },
  progressFill: {
    height: "100%",
    transition: "all 0.5s ease",
  },
  clickEffect: {
    position: "absolute" as const,
    top: "0",
    color: "#059669",
    fontWeight: "bold",
    fontSize: "1.25rem",
    pointerEvents: "none" as const,
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "32px",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  timeDisplay: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  realWorldStats: {
    background: "linear-gradient(135deg, #1E293B, #0F172A)",
    color: "white",
    padding: "16px",
    marginBottom: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  realWorldStatsTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center" as const,
    color: "#94A3B8",
  },
  realWorldStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  realWorldStatItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
  },
  realWorldStatValue: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#E2E8F0",
  },
  realWorldStatLabel: {
    fontSize: "0.875rem",
    color: "#94A3B8",
  },
  realWorldStatRate: {
    fontSize: "0.75rem",
    color: "#64748B",
    marginTop: "4px",
  },
  improvementStats: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
    fontSize: "0.75rem",
    color: "#6B7280",
  },
  improvementStat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  mainContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 16px",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  centerSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    display: "flex",
    flexDirection: "column" as const,
  },
  planetContainer: {
    width: "510px",
    height: "510px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: "5px",
    transition: "all 0.3s ease",
  },
  planetImage: {
    width: "500px",
    height: "500px",
    objectFit: "cover" as const,
    transition: "all 0.3s ease",
  },
};

// Store using React state
const useGameStore = () => {
  const [gameState, setGameState] = useState<GameState>({
    dollars: 0,
    pollution: 0,
    clickPower: 1,
    passiveIncome: 0,
    pollutionRate: 0,
    improvements: [
      // Optimisations de base
      {
        id: "request-optimization",
        name: "Optimisation des requêtes",
        description:
          "Réduit la consommation d'eau et d'électricité par requête de 10%",
        basePrice: 1000,
        currentPrice: 1000,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.1,
        icon: Settings,
        type: "optimization",
        waterEffect: -0.1,
        powerEffect: -0.1,
        requestEffect: 0,
      },
      {
        id: "water-cooling",
        name: "Refroidissement à eau",
        description: "Réduit la consommation d'eau de 20%",
        basePrice: 2000,
        currentPrice: 2000,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.2,
        icon: Droplet,
        type: "optimization",
        waterEffect: -0.2,
        powerEffect: 0,
        requestEffect: 0,
      },
      {
        id: "renewable-energy",
        name: "Énergie renouvelable",
        description: "Réduit la consommation d'électricité de 30%",
        basePrice: 5000,
        currentPrice: 5000,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.3,
        icon: Sun,
        type: "optimization",
        waterEffect: 0,
        powerEffect: -0.3,
        requestEffect: 0,
      },
      // Améliorations existantes...
      {
        id: "algo-opt",
        name: "Optimisation d'algorithme",
        description: "+0.5$/s, +0.3g CO₂/s, +100 req/s",
        basePrice: 50,
        currentPrice: 50,
        count: 0,
        dollarEffect: 0.5,
        pollutionEffect: 0.3,
        icon: Settings,
        type: "ai",
        requestEffect: 100,
        waterEffect: 0.001,
        powerEffect: 0.0003,
      },
      {
        id: "new-gpu",
        name: "Nouveau GPU",
        description: "+2$/s, +1g CO₂/s",
        basePrice: 150,
        currentPrice: 150,
        count: 0,
        dollarEffect: 2,
        pollutionEffect: 1,
        icon: Cpu,
        type: "ai",
      },
      {
        id: "server-cluster",
        name: "Cluster de serveurs",
        description: "+10$/s, +6g CO₂/s",
        basePrice: 800,
        currentPrice: 800,
        count: 0,
        dollarEffect: 10,
        pollutionEffect: 6,
        icon: HardDrive,
        type: "ai",
      },
      {
        id: "data-center",
        name: "Data center additionnel",
        description: "+30$/s, +15g CO₂/s",
        basePrice: 2000,
        currentPrice: 2000,
        count: 0,
        dollarEffect: 30,
        pollutionEffect: 15,
        icon: Building,
        type: "ai",
      },
      // Eco Improvements
      {
        id: "plant-tree",
        name: "Planter un arbre",
        description: "-0.1g CO₂/s",
        basePrice: 40,
        currentPrice: 40,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.1,
        icon: TreePine,
        type: "eco",
        effectType: "passive",
      },
      {
        id: "solar-panel",
        name: "Installer panneau solaire",
        description: "-0.3g CO₂/s",
        basePrice: 100,
        currentPrice: 100,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.3,
        icon: Sun,
        type: "eco",
        effectType: "passive",
      },
      {
        id: "windmill",
        name: "Éolienne",
        description: "-1g CO₂/s",
        basePrice: 400,
        currentPrice: 400,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -1,
        icon: Wind,
        type: "eco",
        effectType: "passive",
      },
      {
        id: "thermal-recycling",
        name: "Recyclage thermique serveur",
        description: "-5g CO₂ instantané",
        basePrice: 200,
        currentPrice: 200,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -5,
        icon: Recycle,
        type: "eco",
        effectType: "instant",
      },
    ],
    kilowatts: 0,
    waterLiters: 0,
    aiRequests: 0,
    currentDay: 1,
    currentHour: 0,
    currentMinute: 0,
  });

  const addDollars = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, dollars: prev.dollars + amount }));
  }, []);

  const addPollution = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      pollution: Math.max(0, prev.pollution + amount),
    }));
  }, []);

  const buyImprovement = useCallback((improvementId: string) => {
    setGameState((prev) => {
      const improvement = prev.improvements.find(
        (imp) => imp.id === improvementId
      );
      if (!improvement || prev.dollars < improvement.currentPrice) return prev;

      const newImprovements = prev.improvements.map((imp) => {
        if (imp.id === improvementId) {
          const newCount = imp.count + 1;
          const newPrice = Math.floor(imp.basePrice * Math.pow(1.15, newCount));
          return { ...imp, count: newCount, currentPrice: newPrice };
        }
        return imp;
      });

      // Calculate new passive values
      let newPassiveIncome = 0;
      let newPollutionRate = 0;

      newImprovements.forEach((imp) => {
        if (imp.type === "ai") {
          newPassiveIncome += imp.dollarEffect * imp.count;
          newPollutionRate += imp.pollutionEffect * imp.count;
        } else if (imp.type === "eco" && imp.effectType === "passive") {
          newPollutionRate += imp.pollutionEffect * imp.count;
        }
      });

      // Handle instant effects
      let pollutionChange = 0;
      if (improvement.type === "eco" && improvement.effectType === "instant") {
        pollutionChange = improvement.pollutionEffect;
      }

      return {
        ...prev,
        dollars: prev.dollars - improvement.currentPrice,
        pollution: Math.max(0, prev.pollution + pollutionChange),
        improvements: newImprovements,
        passiveIncome: newPassiveIncome,
        pollutionRate: newPollutionRate,
      };
    });
  }, []);

  const handleClick = () => {
    addDollars(gameState.clickPower);
    addPollution(0.1);

    // Calcul des multiplicateurs
    const waterMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.waterEffect || 0) * imp.count),
      1
    );
    const powerMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.powerEffect || 0) * imp.count),
      1
    );
    const requestMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.requestEffect || 0) * imp.count),
      1
    );

    // Valeurs de base du jeu
    const baseGameWaterPerRequest = 0.001;
    const baseGamePowerPerRequest = 0.0003;

    setGameState((prev) => ({
      ...prev,
      kilowatts: prev.kilowatts + baseGamePowerPerRequest * powerMultiplier,
      waterLiters: prev.waterLiters + baseGameWaterPerRequest * waterMultiplier,
      aiRequests: prev.aiRequests + 1 * requestMultiplier,
    }));
  };

  // Mise à jour de l'effet passif
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.passiveIncome > 0) {
        addDollars(gameState.passiveIncome / 10);
      }
      if (gameState.pollutionRate !== 0) {
        addPollution(gameState.pollutionRate / 10);
      }

      // Mise à jour de la temporalité et des ressources
      setGameState((prev) => {
        let newMinute = prev.currentMinute + 1;
        let newHour = prev.currentHour;
        let newDay = prev.currentDay;

        if (newMinute >= 60) {
          newMinute = 0;
          newHour += 1;
        }
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }

        // Calcul des multiplicateurs
        const waterMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.waterEffect || 0) * imp.count),
          1
        );
        const powerMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.powerEffect || 0) * imp.count),
          1
        );
        const requestMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.requestEffect || 0) * imp.count),
          1
        );

        // Mise à jour des ressources avec les valeurs réelles
        const baseRequestsPerSecond = 10000;
        const requestsThisTick =
          (baseRequestsPerSecond * requestMultiplier) / 10;
        const waterThisTick = requestsThisTick * 1 * waterMultiplier;
        const powerThisTick = requestsThisTick * 0.3 * powerMultiplier;

        return {
          ...prev,
          currentMinute: newMinute,
          currentHour: newHour,
          currentDay: newDay,
          kilowatts: prev.kilowatts + powerThisTick,
          waterLiters: prev.waterLiters + waterThisTick,
          aiRequests: prev.aiRequests + requestsThisTick,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    gameState.passiveIncome,
    gameState.pollutionRate,
    addDollars,
    addPollution,
  ]);

  return { gameState, setGameState, addDollars, addPollution, buyImprovement };
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return Math.floor(num).toString();
};

const formatPollution = (grams: number): string => {
  if (grams >= 1000000) return `${(grams / 1000000).toFixed(1)}T`;
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${Math.floor(grams)}g`;
};

const getPollutionLevel = (
  pollution: number
): {
  level: number;
  color: string;
  emoji: string;
  status: string;
  bgColor: string;
} => {
  const maxPollution = 1000;
  const percentage = (pollution / maxPollution) * 100;

  if (percentage <= 25)
    return {
      level: 0,
      color: "#059669",
      emoji: "🌍",
      status: "Équilibré",
      bgColor: "linear-gradient(135deg, #DBEAFE, #D1FAE5)",
    };
  if (percentage <= 50)
    return {
      level: 1,
      color: "#D97706",
      emoji: "🌤️",
      status: "Sous tension",
      bgColor: "linear-gradient(135deg, #FEF3C7, #FED7AA)",
    };
  if (percentage <= 75)
    return {
      level: 2,
      color: "#EA580C",
      emoji: "🌋",
      status: "Critique",
      bgColor: "linear-gradient(135deg, #FECACA, #FEE2E2)",
    };
  return {
    level: 3,
    color: "#DC2626",
    emoji: "💀",
    status: "Catastrophique",
    bgColor: "linear-gradient(135deg, #FCA5A5, #A1A1AA)",
  };
};

const formatTime = (day: number, hour: number, minute: number): string => {
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");
  return `Jour ${day} - ${formattedHour}:${formattedMinute}`;
};

// Components
const ClickButton: React.FC<{ onClick: () => void; clickPower: number }> = ({
  onClick,
  clickPower,
}) => {
  const [clickEffects, setClickEffects] = useState<{ id: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick();
    setClickEffects((prev) => [...prev, { id: Date.now() }]);
  };

  const removeEffect = (id: number) => {
    setClickEffects((prev) => prev.filter((effect) => effect.id !== id));
  };

  return (
    <div style={styles.clickButtonContainer}>
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.clickButton,
          ...(isHovered ? styles.clickButtonHover : {}),
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Server size={64} color="white" />
      </motion.button>

      <AnimatePresence>
        {clickEffects.map((effect) => (
          <motion.div
            key={effect.id}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -30, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => removeEffect(effect.id)}
            style={{
              ...styles.clickEffect,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            +${clickPower}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const StatsPanel: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const pollutionData = getPollutionLevel(gameState.pollution);

  // Calcul des multiplicateurs basés sur les améliorations
  const waterMultiplier = gameState.improvements.reduce(
    (acc, imp) => acc * (1 + (imp.waterEffect || 0) * imp.count),
    1
  );
  const powerMultiplier = gameState.improvements.reduce(
    (acc, imp) => acc * (1 + (imp.powerEffect || 0) * imp.count),
    1
  );
  const requestMultiplier = gameState.improvements.reduce(
    (acc, imp) => acc * (1 + (imp.requestEffect || 0) * imp.count),
    1
  );

  // Valeurs de base du jeu (beaucoup plus petites que les valeurs réelles)
  const baseGameRequestsPerSecond = 1;
  const baseGameWaterPerRequest = 0.001; // 1mL par requête
  const baseGamePowerPerRequest = 0.0003; // 0.3W par requête

  const gameRequestsPerSecond = baseGameRequestsPerSecond * requestMultiplier;
  const gameWaterPerSecond =
    gameRequestsPerSecond * baseGameWaterPerRequest * waterMultiplier;
  const gamePowerPerSecond =
    gameRequestsPerSecond * baseGamePowerPerRequest * powerMultiplier;

  return (
    <>
      <div style={styles.timeDisplay}>
        {formatTime(
          gameState.currentDay,
          gameState.currentHour,
          gameState.currentMinute
        )}
      </div>
      <div style={styles.statsPanel}>
        <div style={styles.statItem}>
          <img
            src="dollars 1.png"
            alt="Dollars"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div>
            <div style={{ ...styles.statValue, color: "#059669" }}>
              ${formatNumber(gameState.dollars)}
            </div>
            <div style={styles.statRate}>
              +${gameState.passiveIncome.toFixed(1)}/s
            </div>
          </div>
        </div>

        <div style={styles.statItem}>
          <img
            src="nuagesCo2.png"
            alt="Pollution"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div>
            <div style={{ ...styles.statValue, color: "#374151" }}>
              {formatPollution(gameState.pollution)}
            </div>
            <div style={styles.statRate}>
              {gameState.pollutionRate >= 0 ? "+" : ""}
              {gameState.pollutionRate.toFixed(1)}g/s
            </div>
          </div>
        </div>

        <div style={styles.statItem}>
          <div style={{ fontSize: "2rem" }}>{pollutionData.emoji}</div>
          <div>
            <div style={{ ...styles.statValue, color: pollutionData.color }}>
              {pollutionData.status}
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.min(
                    100,
                    (gameState.pollution / 1000) * 100
                  )}%`,
                  background: pollutionData.color,
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.statItem}>
          <img
            src="ChatGPT Image 11 juin 2025, 12_46_45.png"
            alt="IA"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div>
            <div style={{ ...styles.statValue, color: "#3B82F6" }}>
              {formatNumber(gamePowerPerSecond)} kW/s
            </div>
            <div style={styles.statRate}>
              {formatNumber(gameRequestsPerSecond)} req/s
            </div>
          </div>
        </div>

        <div style={styles.statItem}>
          <img
            src="EAU.png"
            alt="Eau"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div>
            <div style={{ ...styles.statValue, color: "#0EA5E9" }}>
              {formatNumber(gameWaterPerSecond)} L/s
            </div>
            <div style={styles.statRate}>
              {formatNumber(gameRequestsPerSecond)} req/s
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ImprovementCard: React.FC<{
  improvement: Improvement;
  canAfford: boolean;
  onBuy: () => void;
}> = ({ improvement, canAfford, onBuy }) => {
  const Icon = improvement.icon;
  const isAI = improvement.type === "ai";
  const isOptimization = improvement.type === "optimization";

  return (
    <motion.div
      style={{
        ...styles.improvementCard,
        ...(canAfford
          ? isAI
            ? styles.improvementCardAffordable
            : styles.improvementCardEco
          : styles.improvementCardNotAffordable),
      }}
      whileHover={canAfford ? { scale: 1.02 } : {}}
      onClick={canAfford ? onBuy : undefined}
    >
      <div style={styles.improvementHeader}>
        <div style={styles.improvementTitle}>
          <Icon size={24} color={isAI ? "#3B82F6" : "#059669"} />
          <span style={styles.improvementName}>{improvement.name}</span>
        </div>
        {improvement.count > 0 && (
          <span style={styles.improvementCount}>{improvement.count}</span>
        )}
      </div>

      <div style={styles.improvementDescription}>{improvement.description}</div>

      <div style={styles.improvementStats}>
        {improvement.waterEffect !== undefined && (
          <div style={styles.improvementStat}>
            <Droplet size={14} color="#0EA5E9" />
            {improvement.waterEffect > 0 ? "+" : ""}
            {improvement.waterEffect * 100}% eau
          </div>
        )}
        {improvement.powerEffect !== undefined && (
          <div style={styles.improvementStat}>
            <Cpu size={14} color="#3B82F6" />
            {improvement.powerEffect > 0 ? "+" : ""}
            {improvement.powerEffect * 100}% élec
          </div>
        )}
        {improvement.requestEffect !== undefined && (
          <div style={styles.improvementStat}>
            <Server size={14} color="#8B5CF6" />
            {improvement.requestEffect > 0 ? "+" : ""}
            {improvement.requestEffect} req/s
          </div>
        )}
      </div>

      <div style={styles.improvementFooter}>
        <span style={styles.improvementPrice}>
          ${formatNumber(improvement.currentPrice)}
        </span>
        {canAfford && (
          <motion.button
            style={{
              ...styles.buyButton,
              ...(isAI ? styles.buyButtonAI : styles.buyButtonEco),
            }}
            whileTap={{ scale: 0.95 }}
          >
            Acheter
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const ImprovementsPanel: React.FC<{
  improvements: Improvement[];
  dollars: number;
  onBuy: (id: string) => void;
}> = ({ improvements, dollars, onBuy }) => {
  const [activeTab, setActiveTab] = useState<"ai" | "eco">("ai");

  const aiImprovements = improvements.filter((imp) => imp.type === "ai");
  const ecoImprovements = improvements.filter((imp) => imp.type === "eco");

  return (
    <div style={styles.improvementsPanel}>
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...styles.tabLeft,
            ...(activeTab === "ai" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setActiveTab("ai")}
        >
          <Cpu size={16} />
          Améliorations IA
        </button>
        <button
          style={{
            ...styles.tab,
            ...styles.tabRight,
            ...(activeTab === "eco" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setActiveTab("eco")}
        >
          <Leaf size={16} />
          Solutions Vertes
        </button>
      </div>

      <div style={styles.improvementGrid}>
        {(activeTab === "ai" ? aiImprovements : ecoImprovements).map(
          (improvement) => (
            <ImprovementCard
              key={improvement.id}
              improvement={improvement}
              canAfford={dollars >= improvement.currentPrice}
              onBuy={() => onBuy(improvement.id)}
            />
          )
        )}
      </div>
    </div>
  );
};

// Nouveau composant pour les statistiques réelles
const RealWorldStats: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const [realStats, setRealStats] = useState({
    requests: 10000,
    water: 10000,
    power: 3000,
    requestsRate: 10000, // Taux fixe
    waterRate: 10000, // Taux fixe
    powerRate: 3000, // Taux fixe
    realTime: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealStats((prev) => {
        // Incrémentation du temps réel
        const newTime = prev.realTime + 0.1;

        // Valeurs de base par seconde
        const baseRequestsPerSecond = 10000;
        const baseWaterPerRequest = 1;
        const basePowerPerRequest = 0.3;

        // Incrémentation exacte par tick (100ms)
        const incrementPerTick = baseRequestsPerSecond / 10; // 1000 requêtes par tick
        const newRequests = prev.requests + incrementPerTick;
        const newWater = newRequests * baseWaterPerRequest;
        const newPower = newRequests * basePowerPerRequest;

        return {
          requests: newRequests,
          water: newWater,
          power: newPower,
          requestsRate: baseRequestsPerSecond, // Taux fixe
          waterRate: baseRequestsPerSecond * baseWaterPerRequest, // Taux fixe
          powerRate: baseRequestsPerSecond * basePowerPerRequest, // Taux fixe
          realTime: newTime,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Formatage du temps réel
  const formatRealTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={styles.realWorldStats}>
      <div style={styles.realWorldStatsTitle}>
        Impact Réel de l'IA dans le Monde ({formatRealTime(realStats.realTime)})
      </div>
      <div style={styles.realWorldStatsGrid}>
        <div style={styles.realWorldStatItem}>
          <img
            src="ChatGPT Image 11 juin 2025, 12_46_45.png"
            alt="IA"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <div>
            <div style={styles.realWorldStatValue}>
              {formatNumber(realStats.requests)}/s
            </div>
            <div style={styles.realWorldStatLabel}>Requêtes IA</div>
            <div style={styles.realWorldStatRate}>
              +{formatNumber(realStats.requestsRate)}/s
            </div>
          </div>
        </div>
        <div style={styles.realWorldStatItem}>
          <img
            src="EAU.png"
            alt="Eau"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <div>
            <div style={styles.realWorldStatValue}>
              {formatNumber(realStats.water)} L/s
            </div>
            <div style={styles.realWorldStatLabel}>Consommation d'eau</div>
            <div style={styles.realWorldStatRate}>
              +{formatNumber(realStats.waterRate)} L/s
            </div>
          </div>
        </div>
        <div style={styles.realWorldStatItem}>
          <img
            src="nuagesCo2.png"
            alt="Électricité"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <div>
            <div style={styles.realWorldStatValue}>
              {formatNumber(realStats.power)} kW/s
            </div>
            <div style={styles.realWorldStatLabel}>Consommation électrique</div>
            <div style={styles.realWorldStatRate}>
              +{formatNumber(realStats.powerRate)} kW/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Game Component
const AIClickerGame: React.FC = () => {
  const { gameState, setGameState, addDollars, addPollution, buyImprovement } =
    useGameStore();

  const handleClick = () => {
    addDollars(gameState.clickPower);
    addPollution(0.1);

    // Calcul des multiplicateurs
    const waterMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.waterEffect || 0) * imp.count),
      1
    );
    const powerMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.powerEffect || 0) * imp.count),
      1
    );
    const requestMultiplier = gameState.improvements.reduce(
      (acc, imp) => acc * (1 + (imp.requestEffect || 0) * imp.count),
      1
    );

    // Valeurs de base du jeu
    const baseGameWaterPerRequest = 0.001;
    const baseGamePowerPerRequest = 0.0003;

    setGameState((prev) => ({
      ...prev,
      kilowatts: prev.kilowatts + baseGamePowerPerRequest * powerMultiplier,
      waterLiters: prev.waterLiters + baseGameWaterPerRequest * waterMultiplier,
      aiRequests: prev.aiRequests + 1 * requestMultiplier,
    }));
  };

  // Mise à jour de l'effet passif
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.passiveIncome > 0) {
        addDollars(gameState.passiveIncome / 10);
      }
      if (gameState.pollutionRate !== 0) {
        addPollution(gameState.pollutionRate / 10);
      }

      // Mise à jour de la temporalité et des ressources
      setGameState((prev) => {
        let newMinute = prev.currentMinute + 1;
        let newHour = prev.currentHour;
        let newDay = prev.currentDay;

        if (newMinute >= 60) {
          newMinute = 0;
          newHour += 1;
        }
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }

        // Calcul des multiplicateurs
        const waterMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.waterEffect || 0) * imp.count),
          1
        );
        const powerMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.powerEffect || 0) * imp.count),
          1
        );
        const requestMultiplier = prev.improvements.reduce(
          (acc, imp) => acc * (1 + (imp.requestEffect || 0) * imp.count),
          1
        );

        // Mise à jour des ressources avec les valeurs réelles
        const baseRequestsPerSecond = 10000;
        const requestsThisTick =
          (baseRequestsPerSecond * requestMultiplier) / 10;
        const waterThisTick = requestsThisTick * 1 * waterMultiplier;
        const powerThisTick = requestsThisTick * 0.3 * powerMultiplier;

        return {
          ...prev,
          currentMinute: newMinute,
          currentHour: newHour,
          currentDay: newDay,
          kilowatts: prev.kilowatts + powerThisTick,
          waterLiters: prev.waterLiters + waterThisTick,
          aiRequests: prev.aiRequests + requestsThisTick,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    gameState.passiveIncome,
    gameState.pollutionRate,
    addDollars,
    addPollution,
  ]);

  const pollutionData = getPollutionLevel(gameState.pollution);

  const getPlanetImage = (pollution: number) => {
    if (pollution >= 1000) return "10.png";
    if (pollution >= 750) return "35.png";
    if (pollution >= 500) return "50.png";
    if (pollution >= 250) return "75.png";
    return "100.png";
  };

  return (
    <div
      style={{
        ...styles.container,
        background: pollutionData.bgColor,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={styles.header}>
          <h1 style={styles.title}>L'IA contre la Planète</h1>
          <p style={styles.subtitle}>
            Développez votre empire IA... mais à quel prix écologique ?
          </p>
        </div>

        <RealWorldStats gameState={gameState} />

        <StatsPanel gameState={gameState} />

        <div style={styles.mainContainer}>
          <div style={styles.leftSection}>
            <ClickButton
              onClick={handleClick}
              clickPower={gameState.clickPower}
            />
          </div>

          <div style={styles.centerSection}>
            <div style={styles.planetContainer}>
              <img
                src={getPlanetImage(gameState.pollution)}
                alt="Planète"
                style={styles.planetImage}
              />
            </div>
          </div>

          <div style={styles.rightSection}>
            <ImprovementsPanel
              improvements={gameState.improvements}
              dollars={gameState.dollars}
              onBuy={buyImprovement}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <p>
            Une critique ludique de l'impact écologique des intelligences
            artificielles
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIClickerGame;
