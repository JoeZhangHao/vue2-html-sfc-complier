<template>
  <div>
    <el-card>
      <template slot="header">
        <div class="flex flex-row items-start">我是父组件</div>
      </template>

      <el-button @click="handleClickMixinLog">点击调用 mixin 方法</el-button>

      <el-tag> 父 tag </el-tag>

      <el-divider content-position="left">测试 sass</el-divider>
      <!-- 测试 scss -->
      <div class="parent">
        我是父亲
        <div class="children">我是子</div>
      </div>

      <el-card>
        <template slot="header">
          <div class="flex flex-row items-start">我是子组件</div>
        </template>
        <test-comp></test-comp>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import TestComp from "/components/test-comp.vue";

import { globalMixin } from "mixins";
import { vueVersion } from "configData";

console.log("TestComp: ", TestComp);
console.log("globalMixin: ", globalMixin);
console.log("vueVersion: ", vueVersion);

export default {
  name: "TestView",
  mixins: [globalMixin],
  components: {
    TestComp,
  },
  props: {},
  data() {
    return {
      cool: true,
    };
  },
  mounted() {
    console.log("vueVersion: ", vueVersion);
  },
  methods: {
    handleClickMixinLog() {
      this.log("我点击了父组件");
    },
  },
};
</script>

<style lang="scss" scoped>
.parent {
  color: red;
  .children {
    color: blue;
  }
}
</style>
