const sources: Record<string, string> = {
  'www.youtube.com': 'youtube-native',
  'youtu.be': 'youtube-native',
};

const getAuthoritySource = (reference: string) => {
  const referenceSource = reference.split('://')[1].split('/')[0];
  return sources[referenceSource] || null;
};

export { getAuthoritySource };
