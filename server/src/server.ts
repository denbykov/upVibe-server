import { App } from '@src/app';

(async () => {
  const app = new App();
  await app.init();
  app.run();
})();
