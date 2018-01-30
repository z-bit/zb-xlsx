const mock = () => {
  let storage = {};
  return {
    getItem: key => key in storage ? storage[key] : null,
    setItem: (key, value) => storage[key] = value || '',
    removeItem: key => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-weskit-appearance']
});
Object.defineProperty(window, 'CSS', {value: () => ({})});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({ enumerable: true, configurable: true, }),
});
