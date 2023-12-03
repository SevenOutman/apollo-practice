import type { ApolloServerPlugin } from "@apollo/server";
import { logger } from "./logging";

export const logRequest: ApolloServerPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    logger.debug(`requestDidStart
Query:
${requestContext.request.query}
Variables:
${JSON.stringify(requestContext.request.variables, null, 2)}`);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        logger.debug("Parsing started!");
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        logger.debug("Validation started!");
      },
    };
  },
};
