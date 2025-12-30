// LocalStorage utilities for scenario management

const STORAGE_KEY = 'saas-biz-model-scenarios';

export function saveScenario(name, inputs) {
  const scenarios = getScenarios();
  const scenario = {
    id: Date.now().toString(),
    name,
    inputs,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  scenarios.push(scenario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  return scenario;
}

export function updateScenario(id, name, inputs) {
  const scenarios = getScenarios();
  const index = scenarios.findIndex(s => s.id === id);
  if (index === -1) return null;

  scenarios[index] = {
    ...scenarios[index],
    name,
    inputs,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  return scenarios[index];
}

export function deleteScenario(id) {
  const scenarios = getScenarios();
  const filtered = scenarios.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getScenarios() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getScenario(id) {
  const scenarios = getScenarios();
  return scenarios.find(s => s.id === id) || null;
}

export function clearAllScenarios() {
  localStorage.removeItem(STORAGE_KEY);
}
