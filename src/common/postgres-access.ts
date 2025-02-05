import { Client } from "pg";

export const setConnection = async () => {
    const client = new Client({
        host: "localhost",
        port: 15432,
        user: "eunchae",
        password: "N1CLMHF4f3zBBzE",
        database: "entertainment",
    });

    await client.connect();
    return client;
}