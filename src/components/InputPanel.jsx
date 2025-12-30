import { useState, useEffect } from 'react';
import { formatCurrency, formatPercent } from '../utils/calculations';
import TierManager from './TierManager';

function SliderInput({ label, value, onChange, min, max, step, format = 'number', hint }) {
  const displayValue = format === 'percent' ? formatPercent(value) :
                       format === 'currency' ? formatCurrency(value) :
                       value.toLocaleString();

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step, prefix = '', suffix = '', hint }) {
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function PercentInput({ label, value, onChange, min = 0, max = 1, step = 0.001, hint }) {
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min * 100}
          max={max * 100}
          step={step * 100}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function InputPanel({ inputs, onInputChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Model Assumptions</h2>

      {/* Target */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Target</h3>
        <NumberInput
          label="Minimum Success Criteria (Net Profit FY3)"
          value={inputs.minimumSuccessCriteria}
          onChange={(v) => onInputChange('minimumSuccessCriteria', v)}
          min={10000}
          max={100000000}
          step={10000}
          prefix="$"
          hint="Your target net profit by end of Year 3"
        />
      </div>

      {/* Traffic & Growth */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Traffic & Growth</h3>
        <NumberInput
          label="Starting Monthly Paid Traffic"
          value={inputs.startingPaidTraffic}
          onChange={(v) => onInputChange('startingPaidTraffic', v)}
          min={100}
          max={100000}
          step={100}
          hint="Visitors per month at launch"
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
        />
        <NumberInput
          label="Organic Traffic (Monthly)"
          value={inputs.organicTraffic}
          onChange={(v) => onInputChange('organicTraffic', v)}
          min={0}
          max={100000}
          step={100}
          hint="Additional non-paid traffic"
        />
      </div>

      {/* Retention */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Retention</h3>
        <SliderInput
          label="Customer Referral Rate"
          value={inputs.customerReferralRate}
          onChange={(v) => onInputChange('customerReferralRate', v)}
          min={0}
          max={0.3}
          step={0.01}
          format="percent"
          hint="15% to 25% is great"
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
        />
      </div>

      {/* Pricing Tiers */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Pricing & Conversion</h3>
        <TierManager
          tiers={inputs.pricingTiers}
          onTiersChange={(newTiers) => onInputChange('pricingTiers', newTiers)}
        />
      </div>

      {/* Revenue & CAC */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Margins & Acquisition</h3>
        <SliderInput
          label="Gross Margin"
          value={inputs.grossMargin}
          onChange={(v) => onInputChange('grossMargin', v)}
          min={0.6}
          max={0.95}
          step={0.01}
          format="percent"
          hint="SaaS benchmark: 75%+ (Craft Ventures)"
        />
        <NumberInput
          label="Customer Acquisition Cost (CAC)"
          value={inputs.estimatedCAC}
          onChange={(v) => onInputChange('estimatedCAC', v)}
          min={1}
          max={500}
          step={1}
          prefix="$"
          hint="Cost to acquire each paying customer"
        />
      </div>

      {/* Operating Costs */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Operating Costs (% of Revenue)</h3>
        <div className="grid grid-cols-2 gap-4">
          <PercentInput
            label="CC Fees"
            value={inputs.ccProcessingFees}
            onChange={(v) => onInputChange('ccProcessingFees', v)}
            max={0.1}
          />
          <PercentInput
            label="Staffing Costs"
            value={inputs.staffingCosts}
            onChange={(v) => onInputChange('staffingCosts', v)}
            max={0.5}
          />
          <PercentInput
            label="Office/Equipment"
            value={inputs.officeSupplies}
            onChange={(v) => onInputChange('officeSupplies', v)}
            max={0.2}
          />
          <PercentInput
            label="Business Insurance"
            value={inputs.businessInsurance}
            onChange={(v) => onInputChange('businessInsurance', v)}
            max={0.1}
          />
          <PercentInput
            label="Inventory Costs"
            value={inputs.inventoryCosts}
            onChange={(v) => onInputChange('inventoryCosts', v)}
            max={0.5}
          />
          <PercentInput
            label="Delivery Costs"
            value={inputs.deliveryCosts}
            onChange={(v) => onInputChange('deliveryCosts', v)}
            max={0.3}
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
          />
        </div>
      </div>
    </div>
  );
}
