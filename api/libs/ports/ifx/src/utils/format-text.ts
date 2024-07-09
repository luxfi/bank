export const normalizeText = (text: string) => {
  try {
    const spacedText = text.replace(/([a-z])([A-Z])/g, '$1 $2');

    const normalizedText = spacedText
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return normalizedText;
  } catch (error) {
    return text;
  }
};
