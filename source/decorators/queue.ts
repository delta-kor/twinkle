import PQueue from 'p-queue';

function Queue() {
  const queue = new PQueue.default({ concurrency: 50 });

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return queue.add(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

export default Queue;
