import { useState, useCallback, useMemo } from 'react';

// Custom hook for managing array-based inputs with suggestions
export const useArrayInput = (
  fieldName: string,
  suggestions: string[],
  setValue: any,
  getValues: any
) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const getCurrentValues = useCallback(() => getValues(fieldName) || [], [getValues, fieldName]);
  
  const filteredSuggestions = useMemo(() => {
    const currentValues = getCurrentValues();
    return suggestions.filter(item => 
      item.toLowerCase().includes(input.toLowerCase()) && 
      !currentValues.includes(item)
    );
  }, [suggestions, input, getCurrentValues]);
  
  const addItem = useCallback((item?: string) => {
    const itemToAdd = item || input;
    const currentValues = getCurrentValues();
    if (itemToAdd && !currentValues.includes(itemToAdd)) {
      setValue(fieldName, [...currentValues, itemToAdd]);
    }
    setInput('');
    setShowSuggestions(false);
  }, [input, setValue, fieldName, getCurrentValues]);
  
  const removeItem = useCallback((itemToRemove: string) => {
    const currentValues = getCurrentValues();
    setValue(fieldName, currentValues.filter((item: string) => item !== itemToRemove));
  }, [setValue, fieldName, getCurrentValues]);
  
  const selectItem = useCallback((item: string) => {
    addItem(item);
  }, [addItem]);
  
  return {
    input,
    setInput,
    showSuggestions,
    setShowSuggestions,
    filteredSuggestions,
    getCurrentValues,
    addItem,
    removeItem,
    selectItem
  };
};
