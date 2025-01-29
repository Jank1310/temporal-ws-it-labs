import type { RedisClientType, RedisModules } from "@redis/client";
import type {
	RedisFunctions,
	RedisScripts,
} from "@redis/client/dist/lib/commands";
import type { PatientRepository } from "../db/repository";

export function makeActivities(
	redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>,
	patients: PatientRepository,
) {
	return {
		helloWorld() {
			return "Hello";
		},
	};
}
