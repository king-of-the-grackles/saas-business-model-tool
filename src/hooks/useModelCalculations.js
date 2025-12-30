import { useState, useMemo, useCallback } from 'react';
import { DEFAULT_INPUTS, runFullModel } from '../utils/calculations';

export function useModelCalculations(initialInputs = DEFAULT_INPUTS) {
  const [inputs, setInputs] = useState({ ...DEFAULT_INPUTS, ...initialInputs });

  const updateInput = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateInputs = useCallback((newInputs) => {
    setInputs(prev => ({ ...prev, ...newInputs }));
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const loadInputs = useCallback((savedInputs) => {
    setInputs({ ...DEFAULT_INPUTS, ...savedInputs });
  }, []);

  const results = useMemo(() => runFullModel(inputs), [inputs]);

  return {
    inputs,
    updateInput,
    updateInputs,
    resetInputs,
    loadInputs,
    results,
  };
}
