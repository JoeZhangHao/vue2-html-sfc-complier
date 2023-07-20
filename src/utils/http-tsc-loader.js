/* eslint-disable no-undef */
import Vue from "vue";
import globalMixin from "@/mixins/global-mixin";

import { isNil, assign } from "lodash-es";
import { getCssLagTypeByVueStr } from "./helper";
import { httpRequest } from "./request";

const { loadModule, vueVersion } = window["vue2-sfc-loader"];

console.log("{ loadModule, vueVersion }", { loadModule, vueVersion });

export const createDynamicModule = async (path) => {
  const fileMap = new Map();

  const fileValueMap = {
    path: "",
    content: "",
    style: {
      lang: "",
    },
  };

  if (isNil(path)) {
    throw new Error("path is empty");
  }

  const options = {
    moduleCache: {
      vue: Vue,
      sass: {
        renderSync: ({ data }) => {
          console.log("data:", data);
          return {
            css: data,
            stats: {},
          };
        },
      },
      mixins: {
        globalMixin,
      },
      configData: {
        vueVersion,
      },
    },
    async getFile(url) {
      console.warn("on getFile: ", url);

      const res = await fetch(url);

      if (!res.ok)
        throw Object.assign(new Error(url + " " + res.statusText), { res });

      // const fileContent = await httpRequest(url);
      // const cssType = getCssLagTypeByVueStr(fileContent);

      // // 设置文件内容
      // fileMap.set(
      //   path,
      //   assign({}, fileValueMap, {
      //     content: fileContent,
      //     style: {
      //       lang: cssType,
      //     },
      //   })
      // );

      // console.log("fileMap: ", fileMap);

      return {
        getContentData: (asBinary) => {
          console.warn("on getContentData", asBinary);

          if (asBinary) {
            return res.arrayBuffer();
          } else {
            return res.text();
          }
        },
        type: "." + path.split(".").pop(),
      };
    },
    addStyle(styleStr, scopeId) {
      console.warn("on addStyle", { styleStr, scopeId });

      const style = document.createElement("style");
      style.textContent = styleStr;
      const ref = document.head.getElementsByTagName("style")[0] || null;
      document.head.insertBefore(style, ref);
    },
    handleModule: async function (type, getContentData, path, options) {
      // 配置型或者插件性质的module，放置编译的plugin
      console.warn("on handleModule", { type, getContentData, path, options });

      switch (type) {
        case ".css":
          options.addStyle(await getContentData(false));
          return null;
        case ".png":
          return await getContentData(false);
        case ".scss": // 处理单个scss文件
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (reslove, reject) => {
            Sass.compile(await getContentData(false), function (result) {
              options.addStyle(result.text);
              reslove(result);
            });
          });
      }
    },
    // 当有 getResource 时，执行，否则执行默认的 defaultGetResource
    // 1. 首先执行一次 getResource
    getResource(pathCx, options) {
      console.warn("on getResource", {
        pathCx,
        options,
      });

      // getResource 偏运行时，能支撑适配运行时参数
      const { refPath, relPath } = pathCx;
      console.log("pathCx: ", refPath, relPath, options);

      const { pathResolve, getFile, log } = options;
      const path = pathResolve(pathCx);
      const pathStr = path.toString();

      return {
        id: pathStr,
        path: path,
        // 2. 执行 getContent，拿到 getContentData
        // 如果这时候 没有 handleModule，或者 当 handleModule 返回 null 或者不返回时，执行默认的 defaultHandleModule， 源码位置 tools.ts:294
        getContent: async () => {
          const { getContentData, type } = await getFile(path);

          return {
            getContentData: async (asBinary) => {
              const res = await getContentData(asBinary);
              if (res instanceof ArrayBuffer !== asBinary)
                log?.(
                  "warn",
                  `unexpected data type. ${
                    asBinary ? "binary" : "string"
                  } is expected for "${path}"`
                );

              return res || "default";
            },
            type,
          };
        },
      };
    },

    log(type, ...args) {
      console.log("log: ", type);

      type && console[type](...args);
    },
  };

  return loadModule(path, options);
};
