import * as popsicle from 'popsicle';

const feelServiceUrl = 'https://service.feel.surf';

// eslint-disable-next-line import/prefer-default-export
export const getPriceTicker = () => new Promise(async (resolve, reject) => {
  try {
    const response = await popsicle.get(`${feelServiceUrl}/api/v1/market/prices`)
      .use(popsicle.plugins.parse('json'));

    if (response.body.data.length) {
      resolve(response.body.data);
    } else {
      reject(response.body);
    }
  } catch (error) {
    reject(error);
  }
});
