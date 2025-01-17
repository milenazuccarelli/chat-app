import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";
import schema from "../../schema";
import { users } from "../../db";

describe("Query.chats", () => {
  it("should fetch all chats", async () => {
    const server = new ApolloServer({
      schema,
      context: () => ({
        currentUser: users[0]
      })
    });

    const { query } = createTestClient(server);

    const res = await query({
      query: gql`
        query GetChats {
          chats {
            id
            name
            picture
            messages {
              id
              content
              createdAt
            }
          }
        }
      `
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();
  });
});
