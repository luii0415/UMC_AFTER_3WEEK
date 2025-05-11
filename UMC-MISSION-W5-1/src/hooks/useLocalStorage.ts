function useLocalStorage() {
  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error("Get LocalStorage Error:", err);
      return null;
    }
  };

  const setItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error("Set LocalStorage Error:", err);
    }
  };

  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Remove LocalStorage Error:", err);
    }
  };

  return { getItem, setItem, removeItem };
}

export default useLocalStorage;
