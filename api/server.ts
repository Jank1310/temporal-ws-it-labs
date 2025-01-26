import fastify, { type FastifyRequest } from "fastify";
import { PatientDB } from "./db";

const server = fastify({
	logger: true,
});

// Inits
const db = new PatientDB();
db.generateData();

setInterval(() => db.generateData(), 2 * 60_000);

function between(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}

// Error handler
server.setErrorHandler((error, request, reply) => {
	server.log.error(error);
	reply.status(500).send({ error: error.message });
});

server.addHook("preHandler", (_req, _reply, done) => {
	setTimeout(
		() => {
			const val = Math.random();
			if (val < 0.5) {
				done(new Error("Some error"));
			}
			done();
		},
		between(100, 1000),
	);
});

// Routes
server.get("/patients", async () => {
	return { total: db.count(), patients: db.all() };
});

server.get(
	"/patients/:id",
	async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
		const patient = db.patient(req.params.id);
		if (patient.deleted) {
			reply.code(410); // GONE
			return reply.send();
		}
		return patient;
	},
);

server.get(
	"/patients/:id/prescriptions",
	async (
		req: FastifyRequest<{
			Params: { id: string };
			Querystring: { page: string };
		}>,
	) => {
		const { id } = req.params;
		const { page } = req.query;
		let paginationPage = Number.parseInt(page);
		if (!Number.isInteger(paginationPage)) {
			paginationPage = 0;
		}
		const prescriptions = db.prescriptionsOf(id);

		return {
			total: prescriptions.length,
			prescriptions: prescriptions.slice(
				paginationPage * 10,
				(paginationPage + 1) * 10,
			),
		};
	},
);

(async function run() {
	await server.listen({ port: 3000 });
})();
