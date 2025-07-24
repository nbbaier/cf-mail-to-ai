/// <reference types="@types/node" />

import alchemy from "alchemy";
import { KVNamespace, Worker, WranglerJson } from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";

const app = await alchemy("mail-to-ai", {
	stateStore: (scope) => new CloudflareStateStore(scope, {}),
	password: process.env.SECRET_PASSPHRASE,
});

export const worker = await Worker("worker", {
	name: "mail-to-ai",
	entrypoint: "src/worker.ts",
	bindings: {
		CACHE: await KVNamespace("cache", { title: "cache-store", adopt: true }),
		API_HOST: "mail-to-ai.com",
	},
	adopt: true,
});

await WranglerJson("wrangler", { worker });

console.log(worker.url);
await app.finalize();
