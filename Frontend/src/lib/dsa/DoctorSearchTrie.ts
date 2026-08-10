import type { DoctorDto } from "@/lib/api/types";

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  doctorIds: Set<string> = new Set();
}

export interface TrieSearchResult {
  matchingDoctorIds: string[];
  searchTimeMs: number;
  matchedCount: number;
}

export class DoctorSearchTrie {
  private root: TrieNode = new TrieNode();

  /**
   * Inserts a single string keyword (e.g. "Cardiologist", "Rajesh", "Delhi") associated with a doctor ID.
   * Time Complexity: O(K) where K is the length of the string keyword.
   */
  insert(keyword: string, doctorId: string): void {
    if (!keyword) return;
    let current = this.root;
    const cleaned = keyword.toLowerCase().trim();

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      current.doctorIds.add(doctorId);
    }
    current.isEndOfWord = true;
  }

  /**
   * Builds the entire Trie prefix tree from an array of doctors.
   * Tokenizes doctor names, specializations, qualifications, cities, and clinic names.
   */
  buildTrieFromDoctors(doctors: DoctorDto[]): void {
    this.root = new TrieNode(); // reset tree

    for (const doctor of doctors) {
      const tokensToInsert = [
        doctor.fullName,
        doctor.specialization,
        doctor.city,
        doctor.clinicName || "",
        doctor.qualifications || "",
      ];

      for (const rawToken of tokensToInsert) {
        if (!rawToken) continue;
        // Insert full string
        this.insert(rawToken, doctor.id);
        // Also insert individual word tokens (e.g. "Rajesh" and "Sharma" separately)
        const subTokens = rawToken.split(/\s+/);
        for (const token of subTokens) {
          if (token.length > 1) {
            this.insert(token, doctor.id);
          }
        }
      }
    }
  }

  /**
   * Performs an instant prefix search in O(K) time complexity.
   * Returns matching doctor IDs and performance execution time metrics.
   */
  searchPrefix(prefix: string): TrieSearchResult {
    const startTime = performance.now();
    if (!prefix || prefix.trim().length === 0) {
      return { matchingDoctorIds: [], searchTimeMs: 0, matchedCount: 0 };
    }

    let current = this.root;
    const cleaned = prefix.toLowerCase().trim();

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (!current.children.has(char)) {
        const endTime = performance.now();
        return {
          matchingDoctorIds: [],
          searchTimeMs: parseFloat((endTime - startTime).toFixed(3)),
          matchedCount: 0,
        };
      }
      current = current.children.get(char)!;
    }

    const endTime = performance.now();
    const resultIds = Array.from(current.doctorIds);
    return {
      matchingDoctorIds: resultIds,
      searchTimeMs: parseFloat((endTime - startTime).toFixed(3)),
      matchedCount: resultIds.length,
    };
  }
}
