import { useState, useRef, useEffect } from 'react';
import { generateTierId, getTotalConversionRate, calculateARPU } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/calculations';

function TierRow({ tier, onUpdate, onDelete, canDelete }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(tier.name);
  const [priceValue, setPriceValue] = useState(tier.monthlyPrice.toString());
  const [conversionValue, setConversionValue] = useState((tier.conversionRate * 100).toFixed(2));
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    setPriceValue(tier.monthlyPrice.toString());
    setConversionValue((tier.conversionRate * 100).toFixed(2));
  }, [tier.monthlyPrice, tier.conversionRate]);

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

  const handleConversionChange = (e) => {
    setConversionValue(e.target.value);
  };

  const handleConversionBlur = () => {
    const value = parseFloat(conversionValue) || 0;
    setConversionValue(value.toFixed(2));
    onUpdate({ ...tier, conversionRate: value / 100 });
  };

  return (
    <div className="p-3 bg-brand-50/50 border border-brand-100 rounded-lg">
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
          <span className="text-gray-400 text-sm font-medium">%</span>
          <input
            type="number"
            value={conversionValue}
            onChange={handleConversionChange}
            onBlur={handleConversionBlur}
            className="w-20 px-2 py-1.5 text-sm font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            min="0"
            max="100"
            step="0.01"
          />
          <span className="text-gray-400 text-sm">conversion</span>
        </div>
      </div>
    </div>
  );
}

export default function TierManager({ tiers, onTiersChange }) {
  const handleAddTier = () => {
    const newTier = {
      id: generateTierId(),
      name: `Tier ${tiers.length + 1}`,
      monthlyPrice: 29,
      conversionRate: 0.005,
    };
    onTiersChange([...tiers, newTier]);
  };

  const handleUpdateTier = (updatedTier) => {
    onTiersChange(tiers.map(t => t.id === updatedTier.id ? updatedTier : t));
  };

  const handleDeleteTier = (tierId) => {
    onTiersChange(tiers.filter(t => t.id !== tierId));
  };

  const totalConversionRate = getTotalConversionRate(tiers);
  const arpu = calculateARPU(tiers);
  const canDelete = tiers.length > 1;

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
            canDelete={canDelete}
          />
        ))}
      </div>

      <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
        <div>
          <span className="text-gray-500">Total Conversion: </span>
          <span className="font-mono font-medium text-brand-700">{formatPercent(totalConversionRate)}</span>
        </div>
        <div>
          <span className="text-gray-500">ARPU: </span>
          <span className="font-mono font-medium text-brand-700">{formatCurrency(arpu)}</span>
        </div>
      </div>
    </div>
  );
}
