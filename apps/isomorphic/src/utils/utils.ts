export const GetImageSize = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob.size; // size in bytes
  } catch (error) {
    console.error('Failed to get image size:', error);
    return 0;
  }
};

export const omit = (obj: any, key: string) => {
  const { [key]: _, ...rest } = obj;
  return rest;
};
