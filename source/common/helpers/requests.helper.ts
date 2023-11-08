export default class RequestsHelper {
  static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  static async requestWithRetries(request: Function, retriesCount = 5, timeout = 1000): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiCall = retries => {
        request()
          .then(res => resolve(res))
          .catch(async e => {
            if (retries > 0) {
              await RequestsHelper.wait(timeout);
              apiCall(--retries);
            } else {
              reject(e);
            }
          });
      };

      apiCall(retriesCount);
    });
  }
}
