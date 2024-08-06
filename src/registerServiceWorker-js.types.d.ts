// Derived from src/registerServiceWorker.js

export type ServiceWorkerState = 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';

export interface ServiceWorker {
  state: ServiceWorkerState;
  onstatechange: (() => void) | null;
}

export interface ServiceWorkerRegistration {
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  onupdatefound: (() => void) | null;
  unregister(): Promise<void>;
}

export interface NavigatorServiceWorker {
  controller: ServiceWorker | null;
  ready: Promise<ServiceWorkerRegistration>;
  register(url: string): Promise<ServiceWorkerRegistration>;
}

declare global {
  interface Navigator {
    serviceWorker: NavigatorServiceWorker;
  }

  interface Window {
    addEventListener(type: 'load', listener: (this: Window, ev: Event) => any, options?: boolean | AddEventListenerOptions): void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_URL: string;
    }
  }
}
