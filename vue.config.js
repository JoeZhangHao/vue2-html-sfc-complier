const path = require("path");
const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");

const target = process.env.VUE_APP_TARGET || "";

module.exports = defineConfig({
  // https://github.com/vuejs/vue-cli/issues/2754#issuecomment-493290698
  runtimeCompiler: true,
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData(source, loaderContext) {
          const dataList = [
            '@import "/src/assets/styles/element-variables.scss";',
            '@import "/src/assets/styles/variables.scss";',
            '@import "/src/assets/styles/mixin.scss";',
          ];

          const data = dataList.join("\n");

          const { resourcePath, rootContext } = loaderContext;
          console.log("resourcePath:", resourcePath);
          console.log("rootContext:", rootContext);
          let relativePath = path.relative(rootContext, resourcePath);
          // 兼容 windows
          relativePath = relativePath.split(path.sep).join("/");

          // 排除 element/index 因为用到了 @forward，这个前面不能插入其他代码
          if (relativePath.endsWith("variables.scss")) {
            return source;
            // 所有以 variables.scss 结尾的文件讲不会再重新导入 additionalData
            // 排除两个 variables.scss
          } else {
            // 否则，将默认配置的 scss 文件加入到源文件内容中
            return `${data} ${source}`;
          }
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      // 差异化打包路径替换
      // 目前仅限 router|views 两个目录下的与-EAP_TARGET结尾的文件
      new webpack.NormalModuleReplacementPlugin(
        /(\S*)\/(router|views|layout|url-info)\/(\S+)-EAP_TARGET\.([A-Za-z]+)$/,
        (resource) => {
          const eapTarget = target ? `-${target}` : "";
          resource.request = resource.request.replace(
            /-EAP_TARGET/,
            `${eapTarget}`
          );
        }
      ),
      new WindiCSSWebpackPlugin(),
    ],
  },
});
