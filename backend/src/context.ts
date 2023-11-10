import JsonPlaceholderAPI from "./jsonplaceholder-api";

export const context = async () => {
  return {
    dataSources: {
      jsonplaceholderAPI: new JsonPlaceholderAPI(),
    },
  };
};

export type ContextValue = Awaited<ReturnType<typeof context>>;
