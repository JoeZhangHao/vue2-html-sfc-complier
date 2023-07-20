/**
 * 根据字符串获取文件样式格式 scss/less/css
 *
 * @param {string}
 * @return {string}
 */
export const getCssLagTypeByVueStr = (str) => {
  const newStr = str;
  const reg =
    /<style(?:\s+lang=(?:"([^"]+)"|'([^']+)'|([^>]+)))?(?!\s*scoped\s*)\s*>/;
  const matches = newStr.match(reg);
  console.log("matches: ", matches);
  return matches.length ? matches[1] : "";
};
