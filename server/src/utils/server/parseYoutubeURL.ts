export const parseYoutubeURL = (url: string): string => {
  const authority = 'https://youtu.be/';
  const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
  const ampersandPosition = videoId.indexOf('&');
  const questionMarkPosition = videoId.indexOf('?');
  switch (true) {
    case ampersandPosition !== -1:
      return authority + videoId.substring(0, ampersandPosition);
    case questionMarkPosition !== -1:
      return authority + videoId.substring(0, questionMarkPosition);
    default:
      return authority + videoId;
  }
};
