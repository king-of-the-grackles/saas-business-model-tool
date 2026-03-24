import { useState, useEffect, useRef } from 'react';
import { formatCurrency, formatPercent, formatNumber, calculateCACFromAdSpend, calculateCostPerSession, MODEL_PRESETS, PRICING_MODELS } from '../utils/calculations';
import { inputTooltips } from '../utils/benchmarkComparison';
import Tooltip, { InfoIcon } from './Tooltip';
import TierManager from './TierManager';

function CollapsibleSection({ title, subtitle, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? 'auto' : '0px');
    }
  }, [isOpen]);

  return (
    <div className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group mb-4"
      >
        <div>
          <h3 className="section-header group-hover:text-brand-600 transition-colors text-left">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 text-left">{subtitle}</p>}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{ height, overflow: 'hidden' }}
        className="transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, format = 'number', hint, tooltip }) {
  const displayValue = format === 'percent' ? formatPercent(value) :
                       format === 'currency' ? formatCurrency(value) :
                       value.toLocaleString();

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <Tooltip content={tooltip}>
              <InfoIcon />
            </Tooltip>
          )}
        </label>
        <span className="text-sm font-semibold font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{displayValue}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute left-0 right-0 h-2 bg-brand-100 rounded-full" />
        <div
          className="absolute left-0 h-2 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full appearance-none cursor-pointer bg-transparent z-10 slider-thumb"
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step, prefix = '', suffix = '', hint, tooltip }) {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(localValue) || 0;
    setLocalValue(parsed.toString());
    onChange(parsed);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2.5 font-mono border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

function PercentInput({ label, value, onChange, min = 0, max = 1, step = 0.001, hint, tooltip }) {
  const [localValue, setLocalValue] = useState((value * 100).toFixed(1));

  useEffect(() => {
    setLocalValue((value * 100).toFixed(1));
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(localValue) || 0;
    setLocalValue(parsed.toFixed(1));
    onChange(parsed / 100);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min * 100}
          max={max * 100}
          step={step * 100}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-3 py-2.5 pr-8 font-mono border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function InputPanel({ inputs, onInputChange }) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-brand-800 mb-6">Model Assumptions</h2>

      {/* Target - Always visible */}
      <CollapsibleSection title="Target" defaultOpen={true}>
        <NumberInput
          label="Minimum Success Criteria (Net Profit FY3)"
          value={inputs.minimumSuccessCriteria}
          onChange={(v) => onInputChange('minimumSuccessCriteria', v)}
          min={10000}
          max={100000000}
          step={10000}
          prefix="$"
          hint="Your target net profit by end of Year 3"
          tooltip={inputTooltips.minimumSuccessCriteria}
        />
      </CollapsibleSection>

      {/* Traffic & Acquisition */}
      <CollapsibleSection title="Traffic & Acquisition" defaultOpen={false}>
        <NumberInput
          label="Starting Monthly Paid Traffic"
          value={inputs.startingPaidTraffic}
          onChange={(v) => onInputChange('startingPaidTraffic', v)}
          min={100}
          max={100000}
          step={100}
          hint="Visitors per month at launch"
          tooltip={inputTooltips.startingPaidTraffic}
        />
        <SliderInput
          label="Monthly Traffic Growth Rate"
          value={inputs.monthlyGrowthRate}
          onChange={(v) => onInputChange('monthlyGrowthRate', v)}
          min={0}
          max={0.2}
          step={0.005}
          format="percent"
          hint="How much traffic grows each month"
          tooltip={inputTooltips.monthlyGrowthRate}
        />
        <NumberInput
          label="Organic Traffic (Monthly)"
          value={inputs.organicTraffic}
          onChange={(v) => onInputChange('organicTraffic', v)}
          min={0}
          max={100000}
          step={100}
          hint="Additional non-paid traffic"
          tooltip={inputTooltips.organicTraffic}
        />

        {/* Conversion Rate - moved from Pricing section */}
        <SliderInput
          label="Conversion Rate"
          value={inputs.conversionRate}
          onChange={(v) => onInputChange('conversionRate', v)}
          min={0.001}
          max={0.10}
          step={0.001}
          format="percent"
          hint="% of visitors who become customers"
          tooltip={inputTooltips.conversionRate}
        />

        {/* Monthly Ad Spend with Calculated CAC */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          <NumberInput
            label="Starting Monthly Ad Spend"
            value={inputs.monthlyAdSpend}
            onChange={(v) => onInputChange('monthlyAdSpend', v)}
            min={0}
            max={100000}
            step={100}
            prefix="$"
            hint="Your total monthly marketing budget"
            tooltip={inputTooltips.monthlyAdSpend}
          />

          {/* Calculated CAC Display */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                Customer Acquisition Cost (CAC)
                <Tooltip content="Auto-calculated: Ad Spend ÷ Paid Conversions. This is what it costs you to acquire each paying customer.">
                  <InfoIcon />
                </Tooltip>
              </label>
              <span className="text-lg font-bold font-mono text-brand-600">
                {formatCurrency(calculateCACFromAdSpend(inputs.monthlyAdSpend, inputs.startingPaidTraffic, inputs.conversionRate))}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              = {formatCurrency(inputs.monthlyAdSpend)} ÷ ({formatNumber(inputs.startingPaidTraffic)} × {formatPercent(inputs.conversionRate)})
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatNumber(Math.round(inputs.startingPaidTraffic * inputs.conversionRate))} paid customers/month
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Retention */}
      <CollapsibleSection title="Retention" defaultOpen={false}>
        <SliderInput
          label="Customer Referral Rate"
          value={inputs.customerReferralRate}
          onChange={(v) => onInputChange('customerReferralRate', v)}
          min={0}
          max={0.3}
          step={0.01}
          format="percent"
          hint="15% to 25% is great"
          tooltip={inputTooltips.customerReferralRate}
        />
        <SliderInput
          label="Monthly Churn Rate"
          value={inputs.monthlyChurn}
          onChange={(v) => onInputChange('monthlyChurn', v)}
          min={0.01}
          max={0.25}
          step={0.005}
          format="percent"
          hint="2.5% to 5% is great (use 100% for one-time purchases)"
          tooltip={inputTooltips.monthlyChurn}
        />
      </CollapsibleSection>

      {/* Pricing */}
      <CollapsibleSection title="Pricing & Packaging" defaultOpen={false}>
        {/* Pricing model selector */}
        {inputs.agenticCostEnabled && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pricing Model</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRICING_MODELS.map(model => (
                <button
                  key={model.key}
                  onClick={() => onInputChange('pricingModel', model.key)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    inputs.pricingModel === model.key
                      ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500/30'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-800">{model.name}</div>
                  <div className="text-xs text-gray-400 leading-tight">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        <TierManager
          tiers={inputs.pricingTiers}
          onTiersChange={(newTiers) => onInputChange('pricingTiers', newTiers)}
          costPerSession={inputs.agenticCostEnabled ? calculateCostPerSession(inputs).total : 0}
          agenticEnabled={inputs.agenticCostEnabled}
          pricingModel={inputs.pricingModel || 'flat'}
        />
      </CollapsibleSection>

      {/* Agentic Unit Economics */}
      <CollapsibleSection
        title="Agentic Unit Economics"
        subtitle={inputs.agenticCostEnabled ? `$${(calculateCostPerSession(inputs).total).toFixed(4)}/session` : 'Disabled — using % of revenue'}
        defaultOpen={false}
      >
        {/* Enable toggle */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-sm font-medium text-gray-700">Per-session cost model</span>
            <p className="text-xs text-gray-400">Replaces flat % inference cost with token-level economics</p>
          </div>
          <button
            onClick={() => onInputChange('agenticCostEnabled', !inputs.agenticCostEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inputs.agenticCostEnabled ? 'bg-accent-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inputs.agenticCostEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {inputs.agenticCostEnabled && (
          <>
            {/* Cost Breakdown — FIRST, the payoff. Updates live as levers change below. */}
            {(() => {
              const perSession = calculateCostPerSession(inputs);
              const total = perSession.total;
              const llmPct = total > 0 ? (perSession.llm / total * 100) : 0;
              const infraPct = total > 0 ? (perSession.infra / total * 100) : 0;
              const toolsPct = total > 0 ? (perSession.tools / total * 100) : 0;

              return (
                <div className="p-3 mb-4 bg-brand-50 rounded-lg border border-brand-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-brand-800">Cost per Session</span>
                    <span className="text-lg font-bold font-mono text-brand-700">${total.toFixed(4)}</span>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-2">
                    <div style={{ width: `${llmPct}%` }} className="bg-red-400 transition-all duration-300" title={`LLM: ${llmPct.toFixed(0)}%`} />
                    <div style={{ width: `${infraPct}%` }} className="bg-teal-400 transition-all duration-300" title={`Infra: ${infraPct.toFixed(0)}%`} />
                    <div style={{ width: `${toolsPct}%` }} className="bg-purple-400 transition-all duration-300" title={`Tools: ${toolsPct.toFixed(0)}%`} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />LLM ${perSession.llm.toFixed(4)}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-1" />Infra ${perSession.infra.toFixed(4)}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />Tools ${perSession.tools.toFixed(4)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Model Preset Cards — with $/session estimate */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">LLM Model</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(MODEL_PRESETS).filter(([k]) => k !== 'custom').map(([key, preset]) => {
                  const isActive = inputs.modelPreset === key;
                  // Compute estimated $/session for this preset
                  const estInputs = { ...inputs, inputTokenPrice: preset.inputTokenPrice, outputTokenPrice: preset.outputTokenPrice, cachedInputPrice: preset.cachedInputPrice };
                  const estCost = calculateCostPerSession(estInputs).total;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        const updates = { modelPreset: key };
                        if (preset.inputTokenPrice !== null) {
                          updates.inputTokenPrice = preset.inputTokenPrice;
                          updates.outputTokenPrice = preset.outputTokenPrice;
                          updates.cachedInputPrice = preset.cachedInputPrice;
                        }
                        Object.entries(updates).forEach(([k, v]) => onInputChange(k, v));
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isActive
                          ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500/30'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-800">{preset.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">
                        ${preset.inputTokenPrice} / ${preset.outputTokenPrice}
                      </div>
                      <div className={`text-xs font-mono mt-1 ${isActive ? 'text-accent-700 font-semibold' : 'text-gray-400'}`}>
                        ~${estCost.toFixed(3)}/sess
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Token Economics (Layer 0) */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Token Pricing ($/1M tokens)</label>
              <div className="grid grid-cols-3 gap-3">
                <NumberInput
                  label="Input"
                  value={inputs.inputTokenPrice}
                  onChange={(v) => onInputChange('inputTokenPrice', v)}
                  min={0} max={100} step={0.1}
                  prefix="$"
                />
                <NumberInput
                  label="Output"
                  value={inputs.outputTokenPrice}
                  onChange={(v) => onInputChange('outputTokenPrice', v)}
                  min={0} max={500} step={0.5}
                  prefix="$"
                />
                <NumberInput
                  label="Cached"
                  value={inputs.cachedInputPrice}
                  onChange={(v) => onInputChange('cachedInputPrice', v)}
                  min={0} max={50} step={0.01}
                  prefix="$"
                />
              </div>
            </div>

            {/* Per-Call Metrics (Layer 1) */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Per LLM Call</label>
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Input tokens/call"
                  value={inputs.avgInputTokensPerCall}
                  onChange={(v) => onInputChange('avgInputTokensPerCall', v)}
                  min={100} max={500000} step={500}
                />
                <NumberInput
                  label="Output tokens/call"
                  value={inputs.avgOutputTokensPerCall}
                  onChange={(v) => onInputChange('avgOutputTokensPerCall', v)}
                  min={1} max={50000} step={10}
                />
              </div>
              <SliderInput
                label="Cache Hit Rate"
                value={inputs.cacheHitRate}
                onChange={(v) => onInputChange('cacheHitRate', v)}
                min={0} max={1} step={0.01}
                format="percent"
                hint="% of input tokens served from prompt cache"
              />
            </div>

            {/* Session Metrics (Layer 2) */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Per Session</label>
              <NumberInput
                label="LLM calls per session"
                value={inputs.avgLLMCallsPerSession}
                onChange={(v) => onInputChange('avgLLMCallsPerSession', v)}
                min={1} max={50} step={0.1}
              />
              <NumberInput
                label="Avg session duration (seconds)"
                value={inputs.avgSessionDuration}
                onChange={(v) => onInputChange('avgSessionDuration', v)}
                min={1} max={600} step={1}
                suffix="s"
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Tool calls/session"
                  value={inputs.avgToolCallsPerSession}
                  onChange={(v) => onInputChange('avgToolCallsPerSession', v)}
                  min={0} max={50} step={0.1}
                />
                <NumberInput
                  label="% paid tools"
                  value={inputs.paidToolCallPct * 100}
                  onChange={(v) => onInputChange('paidToolCallPct', v / 100)}
                  min={0} max={100} step={1}
                  suffix="%"
                />
              </div>
              <NumberInput
                label="Cost per paid tool call"
                value={inputs.avgCostPerPaidToolCall}
                onChange={(v) => onInputChange('avgCostPerPaidToolCall', v)}
                min={0} max={1} step={0.001}
                prefix="$"
              />
            </div>
          </>
        )}
      </CollapsibleSection>

      {/* COGS - Cost of Goods Sold */}
      <CollapsibleSection title="COGS (Cost of Goods Sold)" subtitle={inputs.agenticCostEnabled ? 'Per-session costs above + CC fees' : '% of monthly revenue'} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <PercentInput
            label="CC Fees"
            value={inputs.ccProcessingFees}
            onChange={(v) => onInputChange('ccProcessingFees', v)}
            max={0.1}
            tooltip={inputTooltips.ccProcessingFees}
          />
          <PercentInput
            label="Inference Costs"
            value={inputs.inferenceCosts}
            onChange={(v) => onInputChange('inferenceCosts', v)}
            max={0.5}
            tooltip={inputTooltips.inferenceCosts}
          />
          <PercentInput
            label="Delivery Costs"
            value={inputs.deliveryCosts}
            onChange={(v) => onInputChange('deliveryCosts', v)}
            max={0.3}
            tooltip={inputTooltips.deliveryCosts}
          />
          <PercentInput
            label="Inventory Costs"
            value={inputs.inventoryCosts}
            onChange={(v) => onInputChange('inventoryCosts', v)}
            max={0.5}
            tooltip={inputTooltips.inventoryCosts}
          />
        </div>
      </CollapsibleSection>

      {/* Operating Expenses */}
      <CollapsibleSection title="Operating Expenses" subtitle="% of monthly revenue (except rent)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <PercentInput
            label="Staffing Costs"
            value={inputs.staffingCosts}
            onChange={(v) => onInputChange('staffingCosts', v)}
            max={0.5}
            tooltip={inputTooltips.staffingCosts}
          />
          <PercentInput
            label="Office/Equipment"
            value={inputs.officeSupplies}
            onChange={(v) => onInputChange('officeSupplies', v)}
            max={0.2}
            tooltip={inputTooltips.officeSupplies}
          />
          <PercentInput
            label="Business Insurance"
            value={inputs.businessInsurance}
            onChange={(v) => onInputChange('businessInsurance', v)}
            max={0.1}
            tooltip={inputTooltips.businessInsurance}
          />
        </div>
        <div className="mt-4">
          <NumberInput
            label="Monthly Rent (Fixed)"
            value={inputs.rent}
            onChange={(v) => onInputChange('rent', v)}
            min={0}
            max={50000}
            step={100}
            prefix="$"
            tooltip={inputTooltips.rent}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
