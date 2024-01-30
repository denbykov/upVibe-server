import { parseYoutubeURL } from './parseYoutubeURL';

const getCorrectUrl = (url: string, sourceDescription: string) => {
  if (sourceDescription === 'youtube-native') {
    return parseYoutubeURL(url);
  } else {
    return url;
  }
};

export { getCorrectUrl };
