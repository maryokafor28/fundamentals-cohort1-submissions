// Utility functions for button states and interactions

export const getButtonClass = (baseClass, isActive, isLoading, variant = 'primary') => {
  let classes = [baseClass];
  
  if (isActive) classes.push('active');
  if (isLoading) classes.push('loading');
  if (variant) classes.push(variant);
  
  return classes.join(' ');
};

export const handleButtonClick = async (asyncFunction, setLoading) => {
  setLoading(true);
  try {
    await asyncFunction();
  } catch (error) {
    console.error('Button action failed:', error);
  } finally {
    setLoading(false);
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};