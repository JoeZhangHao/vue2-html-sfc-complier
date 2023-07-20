import { Message } from "element-ui";

export default {
  methods: {
    log(message) {
      Message.success(message);
    },
  },
};
