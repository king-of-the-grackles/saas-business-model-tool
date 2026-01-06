import { useState, useRef, useEffect } from 'react';
import { generateTierId, getTotalDistribution, calculateARPU } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/calculations';

// Lock icons as SVG components
function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UnlockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  );
}

function TierRow({ tier, onUpdate, onDelete, onToggleLock, canDelete, showLockToggle }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(tier.name);
  const [priceValue, setPriceValue] = useState(tier.monthlyPrice.toString());
  const [distributionValue, setDistributionValue] = useState(((tier.distribution || 0) * 100).toFixed(0));
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    setPriceValue(tier.monthlyPrice.toString());
    setDistributionValue(((tier.distribution || 0) * 100).toFixed(0));
  }, [tier.monthlyPrice, tier.distribution]);

  const handleNameClick = () => {
    setEditName(tier.name);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    const trimmed = editName.trim();
    if (trimmed) {
      onUpdate({ ...tier, name: trimmed });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(tier.name);
      setIsEditingName(false);
    }
  };

  const handlePriceChange = (e) => {
    setPriceValue(e.target.value);
  };

  const handlePriceBlur = () => {
    const value = parseFloat(priceValue) || 0;
    setPriceValue(value.toString());
    onUpdate({ ...tier, monthlyPrice: value });
  };

  const handleDistributionChange = (e) => {
    if (tier.isLocked) return;
    setDistributionValue(e.target.value);
  };

  const handleDistributionBlur = () => {
    if (tier.isLocked) return;
    const value = parseFloat(distributionValue) || 0;
    const clampedValue = Math.min(100, Math.max(0, value));
    setDistributionValue(clampedValue.toFixed(0));
    onUpdate({ ...tier, distribution: clampedValue / 100 });
  };

  const isLocked = tier.isLocked || false;

  return (
    <div className={`p-3 border rounded-lg ${isLocked ? 'bg-gray-50 border-gray-200' : 'bg-brand-50/50 border-brand-100'}`}>
      <div className="flex items-center justify-between mb-2">
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleNameKeyDown}
            className="px-2 py-1 text-sm font-semibold border border-brand-400 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        ) : (
          <button
            onClick={handleNameClick}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-600 group"
          >
            {tier.name}
            <svg className="w-3.5 h-3.5 text-brand-300 group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-1">
          {showLockToggle && (
            <button
              onClick={() => onToggleLock(tier.id)}
              className={`p-1 rounded-md transition-colors ${
                isLocked
                  ? 'text-gray-500 hover:bg-gray-100'
                  : 'text-brand-400 hover:bg-brand-50'
              }`}
              title={isLocked ? 'Unlock distribution' : 'Lock distribution'}
            >
              {isLocked ? (
                <LockIcon className="w-4 h-4" />
              ) : (
                <UnlockIcon className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={!canDelete}
            className={`p-1 rounded-md transition-colors ${
              canDelete
                ? 'text-danger-500 hover:bg-danger-50'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title={canDelete ? 'Remove tier' : 'Cannot remove last tier'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-sm font-medium">$</span>
          <input
            type="number"
            value={priceValue}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            className="w-20 px-2 py-1.5 text-sm font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            min="0"
            step="1"
          />
          <span className="text-gray-400 text-sm">/mo</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={distributionValue}
            onChange={handleDistributionChange}
            onBlur={handleDistributionBlur}
            disabled={isLocked}
            className={`w-16 px-2 py-1.5 text-sm font-mono border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              isLocked
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                : 'border-gray-200 bg-white'
            }`}
            min="0"
            max="100"
            step="1"
          />
          <span className="text-gray-400 text-sm">% of customers</span>
          {isLocked && (
            <span className="text-xs text-gray-400 ml-1">(locked)</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Redistribute distribution among unlocked tiers when one tier changes
function redistributeDistribution(tiers, changedTierId, newValue) {
  // Calculate sum of locked tiers (excluding the changed tier)
  const lockedSum = tiers
    .filter(t => t.isLocked && t.id !== changedTierId)
    .reduce((sum, t) => sum + (t.distribution || 0), 0);

  // Get other unlocked tiers
  const otherUnlocked = tiers.filter(t => !t.isLocked && t.id !== changedTierId);

  // Calculate remaining distribution for other unlocked tiers
  const remaining = Math.max(0, 1 - lockedSum - newValue);

  // Calculate current sum of other unlocked tiers
  const currentUnlockedSum = otherUnlocked.reduce((sum, t) => sum + (t.distribution || 0), 0);

  return tiers.map(t => {
    if (t.id === changedTierId) {
      return { ...t, distribution: newValue };
    }
    if (t.isLocked) {
      return t;
    }
    // Redistribute proportionally among other unlocked tiers
    if (otherUnlocked.length === 0) return t;
    const proportion = currentUnlockedSum > 0
      ? (t.distribution || 0) / currentUnlockedSum
      : 1 / otherUnlocked.length;
    return { ...t, distribution: Math.max(0, remaining * proportion) };
  });
}

export default function TierManager({ tiers, onTiersChange }) {
  const handleAddTier = () => {
    // New tier takes 10% from unlocked tiers proportionally
    const unlockedSum = tiers
      .filter(t => !t.isLocked)
      .reduce((sum, t) => sum + (t.distribution || 0), 0);

    const takeFromUnlocked = Math.min(0.10, unlockedSum);

    // Reduce unlocked tiers proportionally
    const adjustedTiers = tiers.map(t => {
      if (t.isLocked || unlockedSum === 0) return t;
      const proportion = (t.distribution || 0) / unlockedSum;
      return { ...t, distribution: (t.distribution || 0) - (takeFromUnlocked * proportion) };
    });

    const newTier = {
      id: generateTierId(),
      name: `Tier ${tiers.length + 1}`,
      monthlyPrice: 49,
      distribution: takeFromUnlocked,
      isLocked: false,
    };

    onTiersChange([...adjustedTiers, newTier]);
  };

  const handleUpdateTier = (updatedTier) => {
    // If distribution changed on an unlocked tier, redistribute
    const oldTier = tiers.find(t => t.id === updatedTier.id);
    const distributionChanged = oldTier && oldTier.distribution !== updatedTier.distribution;

    if (distributionChanged && !updatedTier.isLocked) {
      const redistributed = redistributeDistribution(tiers, updatedTier.id, updatedTier.distribution);
      // Also update any other fields that changed (name, price)
      const finalTiers = redistributed.map(t =>
        t.id === updatedTier.id ? { ...t, name: updatedTier.name, monthlyPrice: updatedTier.monthlyPrice } : t
      );
      onTiersChange(finalTiers);
    } else {
      onTiersChange(tiers.map(t => t.id === updatedTier.id ? updatedTier : t));
    }
  };

  const handleDeleteTier = (tierId) => {
    const deletedTier = tiers.find(t => t.id === tierId);
    const remainingTiers = tiers.filter(t => t.id !== tierId);

    if (!deletedTier || remainingTiers.length === 0) {
      onTiersChange(remainingTiers);
      return;
    }

    // Redistribute deleted tier's distribution to unlocked tiers
    const unlockedTiers = remainingTiers.filter(t => !t.isLocked);
    const unlockedSum = unlockedTiers.reduce((sum, t) => sum + (t.distribution || 0), 0);
    const toDistribute = deletedTier.distribution || 0;

    const adjustedTiers = remainingTiers.map(t => {
      if (t.isLocked || unlockedSum === 0) {
        // If no unlocked tiers, give to first remaining tier
        if (unlockedSum === 0 && remainingTiers[0]?.id === t.id) {
          return { ...t, distribution: (t.distribution || 0) + toDistribute };
        }
        return t;
      }
      const proportion = (t.distribution || 0) / unlockedSum;
      return { ...t, distribution: (t.distribution || 0) + (toDistribute * proportion) };
    });

    onTiersChange(adjustedTiers);
  };

  const handleToggleLock = (tierId) => {
    onTiersChange(tiers.map(t =>
      t.id === tierId ? { ...t, isLocked: !t.isLocked } : t
    ));
  };

  const totalDistribution = getTotalDistribution(tiers);
  const arpu = calculateARPU(tiers);
  const canDelete = tiers.length > 1;
  const distributionValid = totalDistribution >= 0.99 && totalDistribution <= 1.01;
  const showLockToggle = tiers.length > 1; // Only show lock toggle when multiple tiers

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Pricing Tiers</label>
        <button
          onClick={handleAddTier}
          className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Tier
        </button>
      </div>

      <div className="space-y-2">
        {tiers.map(tier => (
          <TierRow
            key={tier.id}
            tier={tier}
            onUpdate={handleUpdateTier}
            onDelete={() => handleDeleteTier(tier.id)}
            onToggleLock={handleToggleLock}
            canDelete={canDelete}
            showLockToggle={showLockToggle}
          />
        ))}
      </div>

      <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
        <div>
          <span className="text-gray-500">Distribution: </span>
          <span className={`font-mono font-medium ${distributionValid ? 'text-brand-700' : 'text-amber-600'}`}>
            {formatPercent(totalDistribution)}
          </span>
          {!distributionValid && (
            <span className="text-amber-600 text-xs ml-1">≠ 100%</span>
          )}
        </div>
        <div>
          <span className="text-gray-500">ARPU: </span>
          <span className="font-mono font-medium text-brand-700">{formatCurrency(arpu)}</span>
        </div>
      </div>
    </div>
  );
}
