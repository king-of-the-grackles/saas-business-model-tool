import { useState, useEffect, useRef } from 'react';
import { formatCurrency, formatPercent, formatNumber, calculateCACFromAdSpend } from '../utils/calculations';
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
      <CollapsibleSection title="Pricing" defaultOpen={false}>
        <TierManager
          tiers={inputs.pricingTiers}
          onTiersChange={(newTiers) => onInputChange('pricingTiers', newTiers)}
        />
      </CollapsibleSection>

      {/* COGS - Cost of Goods Sold */}
      <CollapsibleSection title="COGS (Cost of Goods Sold)" subtitle="% of monthly revenue" defaultOpen={false}>
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
