import { get as blobGet, put as blobPut } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { SEED_ABOUT } from "@/data/about.seed";
import { SEED_CERTIFICATIONS } from "@/data/certifications.seed";
import { SEED_CONTACT } from "@/data/contact.seed";
import { SEED_COURSES } from "@/data/courses.seed";
import { SEED_EXPERIENCE } from "@/data/experience.seed";
import { SEED_PROJECTS } from "@/data/projects.seed";
import { SEED_RESEARCH } from "@/data/research.seed";
import { SEED_RESUME } from "@/data/resume.seed";
import { SEED_SKILL_GROUPS } from "@/data/skillGroups.seed";
import {
  pickAccent,
  slugify,
  type AboutContent,
  type CollectionSection,
  type ContactContent,
  type CredentialItem,
  type ExperienceContent,
  type MergedContent,
  type ProjectDef,
  type ResearchDef,
  type ResumeContent,
  type Section,
  type SingletonSection,
  type SkillGroup,
} from "@/data/types";

// Server-only. This module touches the filesystem and must never be
// imported from client code — the `.server.ts` suffix guarantees that.

const STORE_PATH = path.resolve(process.cwd(), "content-store.json");
const STORE_BLOB_PATHNAME = "content-store.json";

// Two backends for the exact same Store shape: a local JSON file for
// `npm run dev` (unchanged from day one — nothing about local dev changes),
// and Vercel Blob in production, where the filesystem isn't persistent
// across requests. `VERCEL` is Vercel's own system env var, set at build
// and runtime on their platform only — never present in local dev, even
// though BLOB_READ_WRITE_TOKEN now also happens to be in .env.local — so
// this switch can't accidentally point local testing at the live store.
export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}

type SectionStore<T> = { overrides: Record<string, Partial<T>>; additions: T[]; deletedIds: string[] };
type SingletonStore<T> = { override: Partial<T> };

type Store = {
  projects: SectionStore<ProjectDef>;
  research: SectionStore<ResearchDef>;
  certifications: SectionStore<CredentialItem>;
  courses: SectionStore<CredentialItem>;
  skillGroups: SectionStore<SkillGroup>;
  about: SingletonStore<AboutContent>;
  experience: SingletonStore<ExperienceContent>;
  contact: SingletonStore<ContactContent>;
  resume: SingletonStore<ResumeContent>;
};

function emptySectionStore<T>(): SectionStore<T> {
  return { overrides: {}, additions: [], deletedIds: [] };
}

function emptyStore(): Store {
  return {
    projects: emptySectionStore<ProjectDef>(),
    research: emptySectionStore<ResearchDef>(),
    certifications: emptySectionStore<CredentialItem>(),
    courses: emptySectionStore<CredentialItem>(),
    skillGroups: emptySectionStore<SkillGroup>(),
    about: { override: {} },
    experience: { override: {} },
    contact: { override: {} },
    resume: { override: {} },
  };
}

async function readRawFromFile(): Promise<unknown> {
  try {
    return JSON.parse(await readFile(STORE_PATH, "utf-8"));
  } catch {
    return null;
  }
}

async function writeRawToFile(store: Store): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2) + "\n", "utf-8");
}

async function readRawFromBlob(): Promise<unknown> {
  try {
    // useCache: false — always read the latest write, never a CDN-cached
    // version, since we read-modify-write this document on every mutation.
    const result = await blobGet(STORE_BLOB_PATHNAME, { access: "public", useCache: false });
    if (!result) return null;
    return JSON.parse(await new Response(result.stream).text());
  } catch {
    return null;
  }
}

async function writeRawToBlob(store: Store): Promise<void> {
  await blobPut(STORE_BLOB_PATHNAME, JSON.stringify(store, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readStore(): Promise<Store> {
  const parsed = isVercelRuntime() ? await readRawFromBlob() : await readRawFromFile();
  const base = emptyStore();
  if (!parsed || typeof parsed !== "object") return base;
  const p = parsed as Partial<Record<keyof Store, object>>;
  return {
    projects: { ...base.projects, ...p.projects },
    research: { ...base.research, ...p.research },
    certifications: { ...base.certifications, ...p.certifications },
    courses: { ...base.courses, ...p.courses },
    skillGroups: { ...base.skillGroups, ...p.skillGroups },
    about: { ...base.about, ...p.about },
    experience: { ...base.experience, ...p.experience },
    contact: { ...base.contact, ...p.contact },
    resume: { ...base.resume, ...p.resume },
  };
}

async function writeStore(store: Store): Promise<void> {
  if (isVercelRuntime()) await writeRawToBlob(store);
  else await writeRawToFile(store);
}

// One-level-deep merge: a plain-object-valued key (e.g. `links`) is merged
// key-by-key instead of replaced wholesale, so editing just the GitHub link
// doesn't silently drop an untouched demo/report link. Arrays and scalars
// still replace outright, which is what "edit the stack list" (or the whole
// About/Experience/Contact form) should do.
function mergePatch<T extends Record<string, unknown>>(base: T, patch: Partial<T>): T {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    const baseValue = base[key];
    if (isPlainObject(value) && isPlainObject(baseValue)) {
      // Nested object (e.g. `links`): merge key-by-key rather than replacing
      // wholesale, and an explicit "" clears that one key entirely — the GUI
      // form submits every field it manages, so blanking a link field means
      // "remove this link," not "leave it alone."
      const merged: Record<string, unknown> = { ...baseValue };
      for (const [k, v] of Object.entries(value)) {
        if (v === "" || v === undefined) delete merged[k];
        else merged[k] = v;
      }
      result[key] = merged;
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeSection<T extends { id: string }>(seed: T[], s: SectionStore<T>): T[] {
  const kept = seed
    .filter((item) => !s.deletedIds.includes(item.id))
    .map((item) => mergePatch(item, s.overrides[item.id] ?? {}));
  return [...kept, ...s.additions];
}

function mergeAll(store: Store): MergedContent {
  return {
    projects: mergeSection(SEED_PROJECTS, store.projects),
    research: mergeSection(SEED_RESEARCH, store.research),
    certifications: mergeSection(SEED_CERTIFICATIONS, store.certifications),
    courses: mergeSection(SEED_COURSES, store.courses),
    skillGroups: mergeSection(SEED_SKILL_GROUPS, store.skillGroups),
    about: mergePatch(SEED_ABOUT, store.about.override),
    experience: mergePatch(SEED_EXPERIENCE, store.experience.override),
    contact: mergePatch(SEED_CONTACT, store.contact.override),
    resume: mergePatch(SEED_RESUME, store.resume.override),
  };
}

export async function getMergedContent(): Promise<MergedContent> {
  return mergeAll(await readStore());
}

// --- Validation --------------------------------------------------------

// A link field accepts a real URL or "" — "" is how the GUI form says
// "clear this field" (see mergePatch's nested-object handling below).
const urlOrEmpty = z.union([z.string().url(), z.literal("")]);
const linksSchema = z
  .object({
    github: urlOrEmpty.optional(),
    demo: urlOrEmpty.optional(),
    docs: urlOrEmpty.optional(),
    report: z.string().optional(),
  })
  .partial();

const projectCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  problem: z.string().trim().min(1, "Problem is required"),
  solution: z.string().trim().optional(),
  architecture: z.string().trim().min(1, "Architecture is required"),
  stack: z.array(z.string().trim().min(1)).min(1, "At least one stack item is required"),
  featured: z.boolean().optional(),
  accent: z.string().trim().optional(),
  links: linksSchema.optional(),
});
const projectUpdateSchema = projectCreateSchema.partial();

const researchCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  role: z.string().trim().min(1, "Role is required"),
  status: z.string().trim().min(1, "Status is required"),
  problem: z.string().trim().min(1, "Problem is required"),
  work: z.string().trim().min(1, "Work is required"),
  stack: z.array(z.string().trim().min(1)).min(1, "At least one stack item is required"),
  accent: z.string().trim().optional(),
  links: linksSchema.optional(),
});
const researchUpdateSchema = researchCreateSchema.partial();

const credentialCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  issuer: z.string().trim().min(1, "Issuer is required"),
});
const credentialUpdateSchema = credentialCreateSchema.partial();

const skillGroupCreateSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  items: z.array(z.string().trim().min(1)).min(1, "At least one skill is required"),
  accent: z.string().trim().optional(),
});
const skillGroupUpdateSchema = skillGroupCreateSchema.partial();

const statItemSchema = z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) });
const highlightItemSchema = z.object({
  id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),
  detail: z.string().trim().min(1),
  accent: z.string().trim().min(1),
  featured: z.boolean().optional(),
});
const aboutSchema = z
  .object({
    bio: z.string().trim().min(1),
    photo: z.string().trim().min(1),
    stats: z.array(statItemSchema),
    interests: z.array(z.string().trim().min(1)),
    highlights: z.array(highlightItemSchema),
  })
  .partial();

const experienceItemSchema = z.object({
  id: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1),
  org: z.string().trim().min(1),
  period: z.string().trim().min(1),
  accent: z.string().trim().min(1),
  details: z.string().trim().min(1),
});
const achievementItemSchema = z.object({
  id: z.string().trim().min(1).optional(),
  text: z.string().trim().min(1),
  link: z.string().trim().optional(),
});
const experienceSchema = z
  .object({
    roles: z.array(experienceItemSchema),
    achievements: z.array(achievementItemSchema),
  })
  .partial();

const contactSchema = z
  .object({
    email: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    location: z.string().trim().min(1),
    github: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    leetcode: z.string().trim().optional(),
  })
  .partial();

// Not exposed through any form — the resume URL is only ever set by the
// upload route after a successful file upload — but it's still validated
// through the same updateSingleton path for consistency, and so a future
// "paste a resume URL instead of uploading" field would need zero backend
// changes.
const resumeSchema = z.object({ url: z.string().trim().min(1) }).partial();

function withStableIds<T extends { id?: string }>(items: T[], prefix: string): (T & { id: string })[] {
  const used = new Set<string>();
  return items.map((item) => {
    let id = item.id;
    if (!id || used.has(id)) {
      id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
    }
    used.add(id);
    return { ...item, id };
  });
}

export type MutationInput =
  | { action: "create"; section: "projects"; data: unknown }
  | { action: "create"; section: "research"; data: unknown }
  | { action: "create"; section: "certifications" | "courses"; data: unknown }
  | { action: "create"; section: "skillGroups"; data: unknown }
  | { action: "update"; section: Section; id: string; data: unknown }
  | { action: "delete"; section: Section; id: string }
  | { action: "updateSingleton"; section: SingletonSection; data: unknown };

function seedArrayFor(section: CollectionSection): { id: string }[] {
  switch (section) {
    case "projects":
      return SEED_PROJECTS;
    case "research":
      return SEED_RESEARCH;
    case "certifications":
      return SEED_CERTIFICATIONS;
    case "courses":
      return SEED_COURSES;
    case "skillGroups":
      return SEED_SKILL_GROUPS;
  }
}

function isSeedId(section: CollectionSection, id: string): boolean {
  return seedArrayFor(section).some((x) => x.id === id);
}

function uniqueId(prefix: string, base: string, existingIds: Set<string>): string {
  const slug = slugify(base);
  let id = `${prefix}-${slug}`;
  let i = 2;
  while (existingIds.has(id)) {
    id = `${prefix}-${slug}-${i++}`;
  }
  return id;
}

function cleanLinks(links: Record<string, string | undefined> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!links) return out;
  for (const [k, v] of Object.entries(links)) if (v) out[k] = v;
  return out;
}

export class ContentMutationError extends Error {}

export async function applyMutation(input: MutationInput): Promise<MergedContent> {
  const store = await readStore();
  const currentMerged = mergeAll(store);

  if (input.action === "updateSingleton") {
    if (input.section === "about") {
      const parsed = aboutSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid About data");
      const data = { ...parsed.data };
      if (data.highlights) data.highlights = withStableIds(data.highlights, "highlight");
      store.about.override = mergePatch(store.about.override as AboutContent, data as Partial<AboutContent>);
    } else if (input.section === "experience") {
      const parsed = experienceSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid Experience data");
      const data = { ...parsed.data };
      if (data.roles) data.roles = withStableIds(data.roles, "role");
      if (data.achievements) data.achievements = withStableIds(data.achievements, "achievement");
      store.experience.override = mergePatch(store.experience.override as ExperienceContent, data as Partial<ExperienceContent>);
    } else if (input.section === "contact") {
      const parsed = contactSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid Contact data");
      store.contact.override = mergePatch(store.contact.override as ContactContent, parsed.data);
    } else {
      const parsed = resumeSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid Resume data");
      store.resume.override = mergePatch(store.resume.override as ResumeContent, parsed.data);
    }
  } else if (input.action === "create") {
    if (input.section === "projects") {
      const parsed = projectCreateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid project data");
      const ids = new Set(currentMerged.projects.map((p) => p.id));
      const id = uniqueId("project", parsed.data.name, ids);
      const item: ProjectDef = { ...parsed.data, id, accent: parsed.data.accent ?? pickAccent(id), links: cleanLinks(parsed.data.links) };
      store.projects.additions.push(item);
    } else if (input.section === "research") {
      const parsed = researchCreateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid research data");
      const ids = new Set(currentMerged.research.map((r) => r.id));
      const id = uniqueId("research", parsed.data.name, ids);
      const item: ResearchDef = {
        ...parsed.data,
        id,
        accent: parsed.data.accent ?? pickAccent(id),
        architectureFlow: [],
        links: cleanLinks(parsed.data.links),
      };
      store.research.additions.push(item);
    } else if (input.section === "skillGroups") {
      const parsed = skillGroupCreateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid skill group data");
      const ids = new Set(currentMerged.skillGroups.map((g) => g.id));
      const id = uniqueId("skillgroup", parsed.data.category, ids);
      const item: SkillGroup = { id, accent: pickAccent(id), ...parsed.data };
      store.skillGroups.additions.push(item);
    } else {
      const parsed = credentialCreateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid data");
      const ids = new Set(currentMerged[input.section].map((c) => c.id));
      const prefix = input.section === "certifications" ? "cert" : "course";
      const id = uniqueId(prefix, parsed.data.name, ids);
      const item: CredentialItem = { id, ...parsed.data };
      store[input.section].additions.push(item);
    }
  } else if (input.action === "update") {
    if (!sectionHasId(currentMerged, input.section, input.id)) {
      throw new ContentMutationError(`No such ${input.section} item: ${input.id}`);
    }
    let data: Record<string, unknown>;
    if (input.section === "projects") {
      const parsed = projectUpdateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid project data");
      data = parsed.data;
    } else if (input.section === "research") {
      const parsed = researchUpdateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid research data");
      data = parsed.data;
    } else if (input.section === "skillGroups") {
      const parsed = skillGroupUpdateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid skill group data");
      data = parsed.data;
    } else {
      const parsed = credentialUpdateSchema.safeParse(input.data);
      if (!parsed.success) throw new ContentMutationError(parsed.error.issues[0]?.message ?? "Invalid data");
      data = parsed.data;
    }

    if (isSeedId(input.section, input.id)) {
      store[input.section].overrides[input.id] = mergePatch(store[input.section].overrides[input.id] ?? {}, data) as never;
    } else {
      const idx = store[input.section].additions.findIndex((x) => x.id === input.id);
      if (idx === -1) throw new ContentMutationError(`No such ${input.section} item: ${input.id}`);
      store[input.section].additions[idx] = mergePatch(store[input.section].additions[idx], data) as never;
    }
  } else if (input.action === "delete") {
    if (!sectionHasId(currentMerged, input.section, input.id)) {
      throw new ContentMutationError(`No such ${input.section} item: ${input.id}`);
    }
    if (isSeedId(input.section, input.id)) {
      if (!store[input.section].deletedIds.includes(input.id)) {
        store[input.section].deletedIds.push(input.id);
      }
      delete store[input.section].overrides[input.id];
    } else {
      store[input.section].additions = store[input.section].additions.filter((x) => x.id !== input.id) as never;
    }
  }

  await writeStore(store);
  return mergeAll(store);
}

function sectionHasId(content: MergedContent, section: CollectionSection, id: string): boolean {
  return content[section].some((x) => x.id === id);
}

// Called directly by the upload route after a successful file upload — the
// URL comes from our own just-completed blob/file write, so it bypasses the
// public zod-validated mutation surface rather than round-tripping through it.
export async function setUploadedAssetUrl(kind: "resume" | "photo", url: string): Promise<void> {
  const store = await readStore();
  if (kind === "resume") {
    store.resume.override = mergePatch(store.resume.override as ResumeContent, { url });
  } else {
    store.about.override = mergePatch(store.about.override as AboutContent, { photo: url });
  }
  await writeStore(store);
}
