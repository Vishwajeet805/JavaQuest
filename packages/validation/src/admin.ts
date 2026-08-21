import { z } from "zod";
import { slugSchema } from "./slug.js";
const difficulty=z.enum(["BEGINNER","INTERMEDIATE","ADVANCED"]);
export const adminCourseSchema=z.object({slug:slugSchema,title:z.string().trim().min(1).max(120),description:z.string().trim().min(1),difficulty:difficulty});
export const adminModuleSchema=z.object({slug:slugSchema,title:z.string().trim().min(1).max(120),description:z.string().trim().nullable().optional(),position:z.number().int().positive()});
export const adminQuestSchema=z.object({slug:slugSchema,title:z.string().trim().min(1).max(120),description:z.string().trim().min(1),difficulty:difficulty,position:z.number().int().positive(),estimatedMinutes:z.number().int().min(1).max(600)});
export const adminLessonSchema=z.object({slug:slugSchema,title:z.string().trim().min(1),kind:z.enum(["THEORY","EXAMPLE","RECAP"]),content:z.string().trim().min(1),position:z.number().int().positive()});
export const adminExerciseSchema=z.object({slug:slugSchema,title:z.string().trim().min(1),prompt:z.string().trim().min(1),kind:z.enum(["MULTIPLE_CHOICE","CODE","OUTPUT_PREDICTION"]),difficulty:difficulty,position:z.number().int().positive(),starterCode:z.string().nullable().optional(),solution:z.string().nullable().optional(),executionTimeoutMs:z.number().int().min(500).max(15000).default(5000),testCases:z.array(z.object({position:z.number().int().positive(),input:z.string().nullable().optional(),expectedOutput:z.string(),isHidden:z.boolean()})).default([])});
export const reorderSchema=z.object({ids:z.array(z.string().cuid()).min(1)});
