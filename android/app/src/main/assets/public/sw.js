/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "radio-studio-bg.jpg",
    "revision": "fba4ac2b418bedd32e804db8053d061f"
  }, {
    "url": "radio-logo.png",
    "revision": "d409ce39c2dd443055c2be6086661eae"
  }, {
    "url": "radio-logo.jpg",
    "revision": "45e6e39ce99a717031454e23eb302a7f"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "44cca9aed9a224c24af06aa421f9a1c2"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7e927070c5fe8d8c6bdc9644e6d74e58"
  }, {
    "url": "pwa-192x192.png",
    "revision": "e406a0a22919867fc35963f2dc51346e"
  }, {
    "url": "index.html",
    "revision": "e591af6ddf4bcdbb554ece87b4395e87"
  }, {
    "url": "icon.svg",
    "revision": "8cececb99825b2c54dd2dc42ab8d5352"
  }, {
    "url": "default-cover.jpg",
    "revision": "45e6e39ce99a717031454e23eb302a7f"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "1628fbce714605ff26241e098cd8fb9a"
  }, {
    "url": "assets/index-BerrziXA.css",
    "revision": null
  }, {
    "url": "assets/index-BDxMiXc-.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "1628fbce714605ff26241e098cd8fb9a"
  }, {
    "url": "default-cover.jpg",
    "revision": "45e6e39ce99a717031454e23eb302a7f"
  }, {
    "url": "icon.svg",
    "revision": "8cececb99825b2c54dd2dc42ab8d5352"
  }, {
    "url": "pwa-192x192.png",
    "revision": "e406a0a22919867fc35963f2dc51346e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7e927070c5fe8d8c6bdc9644e6d74e58"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "44cca9aed9a224c24af06aa421f9a1c2"
  }, {
    "url": "manifest.webmanifest",
    "revision": "97a0f0868947ddae75d07f02390e1bca"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
