<template>
  <div>
    <div>我是组件 1</div>

    <el-button @click="handleClickMixinLog">点击调用 mixin 方法</el-button>

    <el-tag>子 tag</el-tag>
  </div>
</template>

<script>
import { globalMixin } from "mixins";

export default {
  name: "TestComponent1",
  mixins: [globalMixin],
  data() {
    return {};
  },
  components: {},
  methods: {
    handleClickMixinLog() {
      this.log("我点击了子组件");
    },
  },
};
</script>

<style></style>
