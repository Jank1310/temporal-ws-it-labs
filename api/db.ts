import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export interface Patient {
	id: string;
	name: string;
	birthdate: Date;
	deleted: boolean;
}

export interface Prescription {
	id: string;
	patientId: string;
	name: string;
	description: string;
	date: Date;
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

type PatientId = string;

export class PatientDB {
	private readonly patients: Map<PatientId, Patient> = new Map();
	private readonly prescriptions: Map<PatientId, Prescription[]> = new Map();

	generateData() {
		for (const patient of this.patients.values()) {
			patient.deleted = true;
		}
		console.log("Generating new patients...");
		for (let x = 0; x < 1000; x++) {
			const id = randomUUID();
			this.patients.set(id, {
				id: id,
				name: faker.person.fullName(),
				birthdate: faker.date.birthdate(),
				deleted: false,
			});
			const prescriptions: Prescription[] = [];
			setTimeout(() => {
				for (let y = 0; y < 100; y++) {
					prescriptions.push({
						id: randomUUID(),
						patientId: id,
						name: faker.lorem.words(),
						description: faker.lorem.paragraph(10),
						date: faker.date.recent(),
					});
				}
				this.prescriptions.set(id, prescriptions);
			}, 5000);
		}
	}

	count(): number {
		return this.patients.size;
	}

	all(): Patient[] {
		return Array.from(this.patients.values()).filter((p) => !p.deleted);
	}

	/**
	 * get a patient by id. Throws a NotFoundError if the patient is not found.
	 * @param id
	 * @returns
	 */
	patient(id: string): Patient {
		const patient = this.patients.get(id);
		if (!patient) {
			throw new NotFoundError(`Patient with ID ${id} not found`);
		}
		return patient;
	}

	prescriptionsOf(patientId: string): Prescription[] {
		if (!this.patients.has(patientId)) {
			throw new NotFoundError(`Patient with ID ${patientId} not found`);
		}
		return this.prescriptions.get(patientId) ?? [];
	}
}
