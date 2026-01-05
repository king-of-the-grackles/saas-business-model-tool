import { useState } from 'react';
import { useModelCalculations } from './hooks/useModelCalculations';
import InputPanel from './components/InputPanel';
import SummaryMetrics from './components/SummaryMetrics';
import ChartsPanel from './components/ChartsPanel';
import MonthlyTable from './components/MonthlyTable';
import BenchmarksPanel from './components/BenchmarksPanel';
import ScenarioManager from './components/ScenarioManager';
import ScenarioComparison from './components/ScenarioComparison';

export default function App() {
  const { inputs, updateInput, loadInputs, resetInputs, results } = useModelCalculations();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonScenarios, setComparisonScenarios] = useState([]);

  const handleCompare = (scenarios) => {
    setComparisonScenarios(scenarios);
    setShowComparison(true);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'charts', label: 'Charts' },
    { id: 'data', label: 'Monthly Data' },
    { id: 'benchmarks', label: 'Benchmarks' },
  ];

  return (
    <div className="min-h-screen bg-surface bg-surface-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-brand-800">SaaS Business Model Stress Test</h1>
              <p className="text-sm text-brand-500">3-year revenue and profit projections</p>
            </div>
            <button
              onClick={resetInputs}
              className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Inputs */}
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <InputPanel inputs={inputs} onInputChange={updateInput} />
            </div>
            <div className="animate-fade-in-up opacity-0 stagger-2">
              <ScenarioManager
                inputs={inputs}
                onLoadScenario={loadInputs}
                onCompare={handleCompare}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="card mb-6 animate-fade-in-up opacity-0 stagger-1">
              <nav className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3.5 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-brand-600 text-brand-700 bg-brand-50/50'
                        : 'border-transparent text-gray-500 hover:text-brand-600 hover:border-brand-200 hover:bg-gray-50/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="animate-fade-in-up opacity-0 stagger-2">
                  <SummaryMetrics results={results} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in-up opacity-0 stagger-3">
                  <ChartsPanel results={results} />
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="animate-fade-in-up opacity-0 stagger-2">
                <ChartsPanel results={results} />
              </div>
            )}

            {activeTab === 'data' && (
              <div className="animate-fade-in-up opacity-0 stagger-2">
                <MonthlyTable results={results} />
              </div>
            )}

            {activeTab === 'benchmarks' && (
              <div className="animate-fade-in-up opacity-0 stagger-2">
                <BenchmarksPanel />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Comparison Modal */}
      {showComparison && (
        <ScenarioComparison
          scenarios={comparisonScenarios}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
