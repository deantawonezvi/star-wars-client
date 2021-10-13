import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://star-wars-api.deant.work/graphql",
    cache: new InMemoryCache(),
});

export default client;
