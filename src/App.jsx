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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SaaS Business Model Stress Test</h1>
              <p className="text-sm text-gray-600">3-year revenue and profit projections</p>
            </div>
            <button
              onClick={resetInputs}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
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
            <InputPanel inputs={inputs} onInputChange={updateInput} />
            <ScenarioManager
              inputs={inputs}
              onLoadScenario={loadInputs}
              onCompare={handleCompare}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <nav className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                <SummaryMetrics results={results} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ChartsPanel results={results} />
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <ChartsPanel results={results} />
            )}

            {activeTab === 'data' && (
              <MonthlyTable results={results} />
            )}

            {activeTab === 'benchmarks' && (
              <BenchmarksPanel />
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
