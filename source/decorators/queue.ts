import PQueue from 'p-queue';

function Queue(concurrency: number = 50, interval: number = 0) {
  const queue = new PQueue.default({ concurrency, interval });

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return queue.add(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

export default Queue;
