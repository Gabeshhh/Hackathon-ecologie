import React, { useState, useEffect, useCallback } from 'react';
import { Server, DollarSign, Cloud, Leaf, TreePine, Sun, Wind, Recycle, Cpu, HardDrive, Building, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  type: 'ai' | 'eco';
  effectType?: 'passive' | 'instant';
}

interface GameState {
  dollars: number;
  pollution: number;
  clickPower: number;
  passiveIncome: number;
  pollutionRate: number;
  improvements: Improvement[];
}

// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 1s ease',
    display: 'grid',
    gridTemplateColumns: '200px 1fr 320px',
    gridTemplateRows: 'auto 1fr auto',
    gap: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    justifyContent:'center',
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '20px',
    gridColumn: '1 / -1',
    gridRow: '1',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: '1rem',
  },
  moneyStatsPanel: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  earthPanel: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px 20px',
    textAlign: 'center' as const,
    flex: 1,
  },
  earthEmoji: {
    width: '120px',
    height: '120px',
    objectFit: 'contain' as const,
    marginBottom: '20px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
    transition: 'all 0.5s ease',
  },
  earthStatus: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  statRate: {
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  clickButtonContainer: {
    background: 'transparent',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
    width: '200px',
    height: '200px',
  },
  clickButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    padding: 0,
    borderRadius: '12px',
  },
  clickButtonHover: {
    transform: 'scale(1.05)',
  },
  serverImage: {
    width: '300px',
    height: '300px',
    objectFit: 'contain' as const,
    transition: 'all 0.2s ease',
    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
    borderRadius: '12px',
  },
  serverImageHover: {
    filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.4))',
  },
  serverImageClick: {
    filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.6))',
  },
  improvementsPanel: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    height: 'fit-content',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '16px',
  },
  tab: {
    padding: '8px 16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabActive: {
    background: '#3B82F6',
    color: 'white',
  },
  tabInactive: {
    background: '#E5E7EB',
    color: '#374151',
  },
  tabLeft: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  tabRight: {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  improvementGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  improvementCard: {
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  improvementCardAffordable: {
    borderColor: '#93C5FD',
    background: '#EFF6FF',
  },
  improvementCardNotAffordable: {
    borderColor: '#D1D5DB',
    background: '#F3F4F6',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  improvementCardEco: {
    borderColor: '#86EFAC',
    background: '#F0FDF4',
  },
  improvementHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  improvementTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  improvementName: {
    fontWeight: '600',
    color: '#374151',
  },
  improvementCount: {
    background: '#E5E7EB',
    color: '#374151',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.875rem',
  },
  improvementDescription: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '8px',
  },
  improvementFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  improvementPrice: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#059669',
  },
  buyButton: {
    padding: '4px 12px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buyButtonAI: {
    background: '#3B82F6',
  },
  buyButtonEco: {
    background: '#059669',
  },
  progressBar: {
    width: '128px',
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden' as const,
    margin: '0 auto',
  },
  progressFill: {
    height: '100%',
    transition: 'all 0.5s ease',
  },
  clickEffect: {
    position: 'absolute' as const,
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#059669',
    fontWeight: 'bold',
    pointerEvents: 'none' as const,
    zIndex: 1000,
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '20px',
    fontSize: '0.875rem',
    color: '#6B7280',
    gridColumn: '1 / -1',
    gridRow: '3',
  }
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
      // AI Improvements
      {
        id: 'algo-opt',
        name: 'Optimisation d\'algorithme',
        description: '+0.5$/s, +0.3g CO₂/s',
        basePrice: 50,
        currentPrice: 50,
        count: 0,
        dollarEffect: 0.5,
        pollutionEffect: 0.3,
        icon: Settings,
        type: 'ai'
      },
      {
        id: 'new-gpu',
        name: 'Nouveau GPU',
        description: '+2$/s, +1g CO₂/s',
        basePrice: 150,
        currentPrice: 150,
        count: 0,
        dollarEffect: 2,
        pollutionEffect: 1,
        icon: Cpu,
        type: 'ai'
      },
      {
        id: 'server-cluster',
        name: 'Cluster de serveurs',
        description: '+10$/s, +6g CO₂/s',
        basePrice: 800,
        currentPrice: 800,
        count: 0,
        dollarEffect: 10,
        pollutionEffect: 6,
        icon: HardDrive,
        type: 'ai'
      },
      {
        id: 'data-center',
        name: 'Data center additionnel',
        description: '+30$/s, +15g CO₂/s',
        basePrice: 2000,
        currentPrice: 2000,
        count: 0,
        dollarEffect: 30,
        pollutionEffect: 15,
        icon: Building,
        type: 'ai'
      },
      // Eco Improvements
      {
        id: 'plant-tree',
        name: 'Planter un arbre',
        description: '-0.1g CO₂/s',
        basePrice: 40,
        currentPrice: 40,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.1,
        icon: TreePine,
        type: 'eco',
        effectType: 'passive'
      },
      {
        id: 'solar-panel',
        name: 'Installer panneau solaire',
        description: '-0.3g CO₂/s',
        basePrice: 100,
        currentPrice: 100,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -0.3,
        icon: Sun,
        type: 'eco',
        effectType: 'passive'
      },
      {
        id: 'windmill',
        name: 'Éolienne',
        description: '-1g CO₂/s',
        basePrice: 400,
        currentPrice: 400,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -1,
        icon: Wind,
        type: 'eco',
        effectType: 'passive'
      },
      {
        id: 'thermal-recycling',
        name: 'Recyclage thermique serveur',
        description: '-5g CO₂ instantané',
        basePrice: 200,
        currentPrice: 200,
        count: 0,
        dollarEffect: 0,
        pollutionEffect: -5,
        icon: Recycle,
        type: 'eco',
        effectType: 'instant'
      }
    ]
  });

  const addDollars = useCallback((amount: number) => {
    setGameState(prev => ({ ...prev, dollars: prev.dollars + amount }));
  }, []);

  const addPollution = useCallback((amount: number) => {
    setGameState(prev => ({ 
      ...prev, 
      pollution: Math.max(0, prev.pollution + amount)
    }));
  }, []);

  const buyImprovement = useCallback((improvementId: string) => {
    setGameState(prev => {
      const improvement = prev.improvements.find(imp => imp.id === improvementId);
      if (!improvement || prev.dollars < improvement.currentPrice) return prev;

      const newImprovements = prev.improvements.map(imp => {
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
      
      newImprovements.forEach(imp => {
        if (imp.type === 'ai') {
          newPassiveIncome += imp.dollarEffect * imp.count;
          newPollutionRate += imp.pollutionEffect * imp.count;
        } else if (imp.type === 'eco' && imp.effectType === 'passive') {
          newPollutionRate += imp.pollutionEffect * imp.count;
        }
      });

      // Handle instant effects
      let pollutionChange = 0;
      if (improvement.type === 'eco' && improvement.effectType === 'instant') {
        pollutionChange = improvement.pollutionEffect;
      }

      return {
        ...prev,
        dollars: prev.dollars - improvement.currentPrice,
        pollution: Math.max(0, prev.pollution + pollutionChange),
        improvements: newImprovements,
        passiveIncome: newPassiveIncome,
        pollutionRate: newPollutionRate
      };
    });
  }, []);

  return { gameState, addDollars, addPollution, buyImprovement };
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return Math.floor(num).toString();
};

const formatPollution = (grams: number): string => {
  if (grams >= 1000000) return `${(grams / 1000000).toFixed(1)}T`;
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${Math.floor(grams)}g`;
};

const getPollutionLevel = (pollution: number): { level: number; color: string; image: string; status: string; bgColor: string } => {
  const maxPollution = 1000;
  const percentage = (pollution / maxPollution) * 100;
  
  if (percentage <= 25) return { 
    level: 0, 
    color: '#059669', 
    image: '/planete-saine.png', 
    status: 'Équilibré',
    bgColor: 'linear-gradient(135deg, #DBEAFE, #D1FAE5)'
  };
  if (percentage <= 50) return { 
    level: 1, 
    color: '#D97706', 
    image: '/planete-tension.png', 
    status: 'Sous tension',
    bgColor: 'linear-gradient(135deg, #FEF3C7, #FED7AA)'
  };
  if (percentage <= 75) return { 
    level: 2, 
    color: '#EA580C', 
    image: '/planete-critique.png', 
    status: 'Critique',
    bgColor: 'linear-gradient(135deg, #FECACA, #FEE2E2)'
  };
  return { 
    level: 3, 
    color: '#DC2626', 
    image: '/planete-morte.png', 
    status: 'Catastrophique',
    bgColor: 'linear-gradient(135deg, #FCA5A5, #A1A1AA)'
  };
};

// Components
const MoneyStatsPanel: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  return (
    <div style={styles.moneyStatsPanel}>
      <div style={styles.statItem}>
        <DollarSign size={32} color="#059669" />
        <div>
          <div style={{ ...styles.statValue, color: '#059669' }}>
            ${formatNumber(gameState.dollars)}
          </div>
          <div style={styles.statRate}>
            +${gameState.passiveIncome.toFixed(1)}/s
          </div>
        </div>
      </div>

      <div style={styles.statItem}>
        <Cloud size={32} color="#6B7280" />
        <div>
          <div style={{ ...styles.statValue, color: '#374151' }}>
            {formatPollution(gameState.pollution)}
          </div>
          <div style={styles.statRate}>
            {gameState.pollutionRate >= 0 ? '+' : ''}{gameState.pollutionRate.toFixed(1)}g/s
          </div>
        </div>
      </div>
    </div>
  );
};

const EarthPanel: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const pollutionData = getPollutionLevel(gameState.pollution);
  
  return (
    <div style={styles.earthPanel}>
      <img 
        src={pollutionData.image} 
        alt={`Planète - ${pollutionData.status}`}
        style={styles.earthEmoji}
      />
      <div style={{ ...styles.earthStatus, color: pollutionData.color }}>
        {pollutionData.status}
      </div>
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${Math.min(100, (gameState.pollution / 1000) * 100)}%`,
            background: pollutionData.color
          }}
        />
      </div>
    </div>
  );
};

const ClickButton: React.FC<{ onClick: () => void; clickPower: number }> = ({ onClick, clickPower }) => {
  const [clickEffect, setClickEffect] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    onClick();
    setClickEffect(true);
    setClickCount(prev => prev + 1); // Force re-render with unique key
    setTimeout(() => setClickEffect(false), 100); // Plus rapide
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
          ...(clickEffect ? { transform: 'scale(0.95)' } : {})
        }}
        whileTap={{ scale: 0.9 }}
      >
        <img 
          src="/serveur.png" 
          alt="Serveur IA" 
          style={{
            ...styles.serverImage,
            ...(clickEffect ? styles.serverImageClick : 
                isHovered ? styles.serverImageHover : {})
          }}
        />
        
        {clickEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid #FBBF24',
              borderRadius: '12px',
            }}
          />
        )}
      </motion.button>
      
      <AnimatePresence>
        {clickEffect && (
          <motion.div
            key={`click-${clickCount}`} // Clé unique pour chaque clic
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -40, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              ...styles.clickEffect,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            +${clickPower}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatsPanel: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  return (
    <>
      <MoneyStatsPanel gameState={gameState} />
      <EarthPanel gameState={gameState} />
    </>
  );
};

const ImprovementCard: React.FC<{ 
  improvement: Improvement; 
  canAfford: boolean; 
  onBuy: () => void;
}> = ({ improvement, canAfford, onBuy }) => {
  const Icon = improvement.icon;
  const isAI = improvement.type === 'ai';
  
  return (
    <motion.div
      style={{
        ...styles.improvementCard,
        ...(canAfford 
          ? (isAI ? styles.improvementCardAffordable : styles.improvementCardEco)
          : styles.improvementCardNotAffordable
        )
      }}
      whileHover={canAfford ? { scale: 1.02 } : {}}
      onClick={canAfford ? onBuy : undefined}
    >
      <div style={styles.improvementHeader}>
        <div style={styles.improvementTitle}>
          <Icon size={24} color={isAI ? '#3B82F6' : '#059669'} />
          <span style={styles.improvementName}>{improvement.name}</span>
        </div>
        {improvement.count > 0 && (
          <span style={styles.improvementCount}>
            {improvement.count}
          </span>
        )}
      </div>
      
      <div style={styles.improvementDescription}>
        {improvement.description}
      </div>
      
      <div style={styles.improvementFooter}>
        <span style={styles.improvementPrice}>
          ${formatNumber(improvement.currentPrice)}
        </span>
        {canAfford && (
          <motion.button
            style={{
              ...styles.buyButton,
              ...(isAI ? styles.buyButtonAI : styles.buyButtonEco)
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
  const [activeTab, setActiveTab] = useState<'ai' | 'eco'>('ai');
  
  const aiImprovements = improvements.filter(imp => imp.type === 'ai');
  const ecoImprovements = improvements.filter(imp => imp.type === 'eco');
  
  return (
    <div style={styles.improvementsPanel}>
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...styles.tabLeft,
            ...(activeTab === 'ai' ? styles.tabActive : styles.tabInactive)
          }}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={16} />
          Améliorations IA
        </button>
        <button
          style={{
            ...styles.tab,
            ...styles.tabRight,
            ...(activeTab === 'eco' ? styles.tabActive : styles.tabInactive)
          }}
          onClick={() => setActiveTab('eco')}
        >
          <Leaf size={16} />
          Solutions Vertes
        </button>
      </div>
      
      <div style={styles.improvementGrid}>
        {(activeTab === 'ai' ? aiImprovements : ecoImprovements).map(improvement => (
          <ImprovementCard
            key={improvement.id}
            improvement={improvement}
            canAfford={dollars >= improvement.currentPrice}
            onBuy={() => onBuy(improvement.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Main Game Component
const AIClickerGame: React.FC = () => {
  const { gameState, addDollars, addPollution, buyImprovement } = useGameStore();

  // Passive income effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.passiveIncome > 0) {
        addDollars(gameState.passiveIncome / 10);
      }
      if (gameState.pollutionRate !== 0) {
        addPollution(gameState.pollutionRate / 10);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.passiveIncome, gameState.pollutionRate, addDollars, addPollution]);

  const handleClick = () => {
    addDollars(gameState.clickPower);
    addPollution(0.1);
  };

  const pollutionData = getPollutionLevel(gameState.pollution);

  return (
    <div style={{
      ...styles.container,
      background: pollutionData.bgColor
    }}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          L'IA contre la Planète
        </h1>
        <p style={styles.subtitle}>
          Développez votre empire IA... mais à quel prix écologique ?
        </p>
      </div>

      <div style={{...styles.leftColumn, gridColumn: '1', gridRow: '2'}}>
        <ClickButton onClick={handleClick} clickPower={gameState.clickPower} />
      </div>

      <div style={{...styles.centerColumn, gridColumn: '2', gridRow: '2'}}>
        <StatsPanel gameState={gameState} />
      </div>

      <div style={{...styles.rightColumn, gridColumn: '3', gridRow: '2'}}>
        <ImprovementsPanel
          improvements={gameState.improvements}
          dollars={gameState.dollars}
          onBuy={buyImprovement}
        />
      </div>

      <div style={styles.footer}>
        <p>Une critique ludique de l'impact écologique des intelligences artificielles</p>
      </div>
    </div>
  );
};

export default AIClickerGame;