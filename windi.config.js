export default {
  extract: {
    include: ["src/**/*.{vue,html,jsx,tsx}"],
    exclude: ["node_modules", ".git"],
  },
  extend: {
    lineClamp: {
      sm: "3",
      lg: "10",
    },
  },
  plugins: [
    // 多行省略
    require("windicss/plugin/line-clamp"),
  ],
};
