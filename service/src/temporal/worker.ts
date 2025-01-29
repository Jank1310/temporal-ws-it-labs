import { NativeConnection, Worker } from "@temporalio/worker";
import { createClient } from "redis";
import { PatientRepository } from "../db/repository";
import { makeActivities } from "./activities";
import { TASK_QUEUE_NAME } from "./shared";

async function run() {
	const connection = await NativeConnection.connect({
		address: "localhost:7233",
	});

	const redisClient = await createClient()
		.on("error", (err) => console.log("Redis Client Error", err))
		.connect();
	const patientRepository = new PatientRepository();

	const activities = makeActivities(redisClient, patientRepository);

	try {
		// Step 2: Register Workflows and Activities with the Worker.
		const worker = await Worker.create({
			connection,
			namespace: "default",
			taskQueue: TASK_QUEUE_NAME,
			// Workflows are registered using a path as they run in a separate JS context.
			workflowsPath: require.resolve("./workflows"),
			activities,
		});

		await worker.run();
	} finally {
		// Close the connection once the worker has stopped
		await connection.close();
		await redisClient.disconnect();
	}
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
// @@@SNIPEND
