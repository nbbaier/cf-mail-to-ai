/// <reference types="@types/node" />

import alchemy from "alchemy";
import { KVNamespace, Worker, WranglerJson } from "alchemy/cloudflare";

const app = await alchemy("mail-to-ai");

export const worker = await Worker("worker", {
	name: "mail-to-ai",
	entrypoint: "src/worker.ts",
	bindings: {
		CACHE: await KVNamespace("cache", { title: "cache-store" }),
		API_HOST: "mail-to-ai.com",
	},
});

await WranglerJson("wrangler", { worker });

console.log(worker.url);

await app.finalize();
