<template>
  <div class="about">
    <h1>This is an about page q</h1>

    <test-view></test-view>
  </div>
</template>

<script>
import { createDynamicModule } from "../utils/http-tsc-loader";

export default {
  name: "AboutView",
  data() {
    return {};
  },
  components: {
    TestView: () => createDynamicModule("/views/test-view.vue"),
  },
  methods: {},
};
</script>
