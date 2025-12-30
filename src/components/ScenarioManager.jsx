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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Scenarios</h2>
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Save Current
        </button>
      </div>

      {scenarios.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No saved scenarios. Save your current assumptions to compare later.
        </p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {scenarios.map((scenario) => {
              const results = runFullModel(scenario.inputs);
              const isSelected = selectedForCompare.find(s => s.id === scenario.id);

              return (
                <div
                  key={scenario.id}
                  className={`p-3 border rounded-lg ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleCompareSelection(scenario)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{scenario.name}</p>
                        <p className="text-xs text-gray-500">
                          FY3 Profit: {formatCurrency(results.summaryMetrics.netProfitFY3, true)}
                          {results.summaryMetrics.meetsMSC && (
                            <span className="ml-2 text-green-600">✓ Meets MSC</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(scenario)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
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
              className="w-full py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Save Scenario</h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Scenario name (e.g., Aggressive Growth)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!scenarioName.trim()}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
