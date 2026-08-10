import type { DoctorDto } from "@/lib/api/types";

export class InvertedIndexEngine {
  private cityIndex: Map<string, Set<string>> = new Map();
  private specIndex: Map<string, Set<string>> = new Map();
  private feeIndex: Map<string, Set<string>> = new Map(); // e.g. "<500", "500-1000", ">1000"

  buildIndexes(doctors: DoctorDto[]): void {
    this.cityIndex.clear();
    this.specIndex.clear();
    this.feeIndex.clear();

    for (const doctor of doctors) {
      // City Index
      if (doctor.city) {
        const cityKey = doctor.city.toLowerCase().trim();
        if (!this.cityIndex.has(cityKey)) {
          this.cityIndex.set(cityKey, new Set());
        }
        this.cityIndex.get(cityKey)!.add(doctor.id);
      }

      // Specialization Index
      if (doctor.specialization) {
        const specKey = doctor.specialization.toLowerCase().trim();
        if (!this.specIndex.has(specKey)) {
          this.specIndex.set(specKey, new Set());
        }
        this.specIndex.get(specKey)!.add(doctor.id);
      }

      // Fee Range Bucket Index
      const fee = doctor.consultationFee || 0;
      const feeBucket = fee <= 500 ? "under500" : fee <= 1000 ? "500to1000" : "above1000";
      if (!this.feeIndex.has(feeBucket)) {
        this.feeIndex.set(feeBucket, new Set());
      }
      this.feeIndex.get(feeBucket)!.add(doctor.id);
    }
  }

  /**
   * Performs instant Set Intersections O(1) across active filter options.
   */
  filterIntersect(city?: string, specialization?: string, feeBucket?: string): Set<string> | null {
    const setsToIntersect: Set<string>[] = [];

    if (city && city !== "ALL") {
      const set = this.cityIndex.get(city.toLowerCase().trim());
      if (set) setsToIntersect.push(set);
      else return new Set(); // City exists in filter but 0 matches
    }

    if (specialization && specialization !== "ALL") {
      const set = this.specIndex.get(specialization.toLowerCase().trim());
      if (set) setsToIntersect.push(set);
      else return new Set();
    }

    if (feeBucket && feeBucket !== "ALL") {
      const set = this.feeIndex.get(feeBucket);
      if (set) setsToIntersect.push(set);
      else return new Set();
    }

    if (setsToIntersect.length === 0) return null; // No filters active

    // Intersect all active sets using Hash Set Lookups O(min(N, M))
    let resultSet = new Set(setsToIntersect[0]);
    for (let i = 1; i < setsToIntersect.length; i++) {
      const currentSet = setsToIntersect[i];
      resultSet = new Set([...resultSet].filter((id) => currentSet.has(id)));
    }

    return resultSet;
  }
}
