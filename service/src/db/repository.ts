export type PatientDbModel = {
	id: string;
};

export class PatientRepository {
	constructor(private readonly patients = new Map<string, PatientDbModel>()) {}

	public getAllPatients(): PatientDbModel[] {
		return Array.from(this.patients.values());
	}

	public getPatientById(id: string): PatientDbModel | undefined {
		return this.patients.get(id);
	}

	public createPatient(patient: PatientDbModel): void {
		this.patients.set(patient.id, patient);
	}
}
