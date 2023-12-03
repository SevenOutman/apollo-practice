import { defineMessages } from "./restrictedMessages";

export const messages = defineMessages({
  info: {
    serverStarted(url: string) {
      return `🚀  Server ready at: ${url}`;
    },
  },
});
