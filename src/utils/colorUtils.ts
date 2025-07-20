export const getDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Упрощенный алгоритм кластеризации цветов
      const colorMap = new Map<string, number>();
      const sampleStep = 10; // Оптимизация: сэмплируем каждый 10-й пиксель
      
      for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const key = `${r},${g},${b}`;
        
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }
      
      // Находим наиболее частый цвет
      let maxCount = 0;
      let dominantColor = '#ffffff';
      
      colorMap.forEach((count, color) => {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = `rgb(${color})`;
        }
      });
      
      resolve(dominantColor);
    };
    
    img.onerror = () => resolve('#87CEEB'); // Fallback цвет
  });
};