import { format } from "winston";

const templateSymbol = Symbol("template");

type MessageBag = {
  [level: string]: {
    [templateName: string]: (...args: any[]) => string;
  };
};

export function defineMessages<T extends MessageBag>(messages: T): T {
  return Object.getOwnPropertyNames(messages).reduce((acc, level) => {
    return {
      ...acc,
      [level]: Object.getOwnPropertyNames(messages[level]).reduce(
        (acc, templateName) => {
          return {
            ...acc,
            [templateName]: (...args: any[]) => {
              const template = messages[level][templateName];

              return {
                [templateSymbol]: templateName,
                toString() {
                  return template(...args);
                },
              };
            },
          };
        },
        {}
      ),
    };
  }, {}) as T;
}

export const restrictedMessages = format(
  (info, opts: { messages: MessageBag }) => {
    // Allow debug messages to pass through
    if (info.level === "debug") return info;

    if (!info.message[templateSymbol]) {
      return {
        [Symbol.for("level")]: info[Symbol.for("level")],
        level: info.level,
        message: `Unregistered "${info.level}" level message`,
      };
    }

    if (!opts.messages?.[info.level][info.message[templateSymbol]]) {
      return {
        [Symbol.for("level")]: info[Symbol.for("level")],
        level: info.level,
        message: `Unknown "${info.level}" level message "${info.message[templateSymbol]}"`,
      };
    }

    return info;
  }
);
