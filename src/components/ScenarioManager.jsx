import { useState, useEffect } from 'react';
import { getScenarios, saveScenario, deleteScenario } from '../utils/storage';
import { formatCurrency, runFullModel } from '../utils/calculations';

export default function ScenarioManager({ inputs, onLoadScenario, onCompare }) {
  const [scenarios, setScenarios] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    setScenarios(getScenarios());
  }, []);

  const handleSave = () => {
    if (!scenarioName.trim()) return;
    const saved = saveScenario(scenarioName.trim(), inputs);
    setScenarios(getScenarios());
    setScenarioName('');
    setShowSaveModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this scenario?')) {
      deleteScenario(id);
      setScenarios(getScenarios());
      setSelectedForCompare(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleLoad = (scenario) => {
    onLoadScenario(scenario.inputs);
  };

  const toggleCompareSelection = (scenario) => {
    setSelectedForCompare(prev => {
      const exists = prev.find(s => s.id === scenario.id);
      if (exists) {
        return prev.filter(s => s.id !== scenario.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), scenario];
      }
      return [...prev, scenario];
    });
  };

  const handleCompare = () => {
    if (selectedForCompare.length >= 2) {
      onCompare(selectedForCompare);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-brand-800">Scenarios</h2>
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          Save Current
        </button>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No saved scenarios</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
            Save your current assumptions to compare different business models
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {scenarios.map((scenario) => {
              const results = runFullModel(scenario.inputs);
              const isSelected = selectedForCompare.find(s => s.id === scenario.id);

              return (
                <div
                  key={scenario.id}
                  className={`p-3 border rounded-lg transition-all ${isSelected ? 'border-brand-400 bg-brand-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleCompareSelection(scenario)}
                        className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                      />
                      <div>
                        <p className="font-medium text-brand-800">{scenario.name}</p>
                        <p className="text-xs text-gray-500">
                          FY3 Profit: <span className="font-mono">{formatCurrency(results.summaryMetrics.netProfitFY3, true)}</span>
                          {results.summaryMetrics.meetsMSC && (
                            <span className="ml-2 text-success-600 font-medium">✓ Meets MSC</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoad(scenario)}
                        className="px-3 py-1 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-md transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="px-3 py-1 text-sm font-medium text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              onClick={handleCompare}
              className="w-full py-2.5 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
            >
              Compare {selectedForCompare.length} Scenarios
            </button>
          )}
          {selectedForCompare.length === 1 && (
            <p className="text-sm text-gray-500 text-center">
              Select at least 2 scenarios to compare
            </p>
          )}
        </>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-brand-800 mb-4">Save Scenario</h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Scenario name (e.g., Aggressive Growth)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 mb-4 transition-colors"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!scenarioName.trim()}
                className="flex-1 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
