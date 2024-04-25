const localFont = (options) => {
  return {
    load: () => Promise.resolve(), // Mocking the font loading function
    ...options, // Include any other properties or methods needed by the font loader
  };
};

export default localFont;
