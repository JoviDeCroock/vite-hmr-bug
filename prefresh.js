/** @returns {import('vite').Plugin} */
export default {
  transforms: [
    {
      test: (path) => /\.(t|j)sx$/.test(path),
      transform(code, _, isBuild, path) {
        if (isBuild  || process.env.NODE_ENV === 'production') return code;

        const spec = JSON.stringify(path);

        const result = require('@babel/core').transformSync(code, {
          plugins: [require('react-refresh/babel')],
          ast: false,
          sourceMaps: false,
        });

        return `
          import '@prefresh/core';
          import { compareSignatures, isComponent } from '@prefresh/utils';
          import { hot } from 'vite/hmr';
          import * as __PSELF__ from ${spec};

          const prevRefreshReg = window.$RefreshReg$ || (() => {});
          const prevRefreshSig = window.$RefreshSig$ || (() => {});

          const module = {};

          window.$RefreshReg$ = (type, id) => {
            module[type.name] = type;
          }

          window.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
            };
          };

          ${result.code}

          if (__DEV__) {
            window.$RefreshReg$ = prevRefreshReg
            window.$RefreshSig$ = prevRefreshSig
            hot.accept((m) => {
              console.log('HOT');
              try {
                for (let i in m) {
                  compareSignatures(module[i], m[i]);
                }
              } catch (e) {
                window.location.reload();
              }
            });
          }
        `;
      }
    }
  ]
};