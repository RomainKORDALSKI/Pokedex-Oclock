import { performance } from 'perf_hooks';

export function controllerWrapper(controller) {
  return async function(req, res, next) {
    const start = performance.now();
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
    const end = performance.now();
    console.log(`${controller.name} execution time: ${end - start} ms`);
  };
}
