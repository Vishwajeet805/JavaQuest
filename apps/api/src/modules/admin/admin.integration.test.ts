import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";
const app=createApp(); const adminEmail="f7-admin@javaquets.local"; const learnerEmail="f7-learner@javaquets.local"; const slug="f7-private-draft";
async function signup(email:string){const response=await request(app).post("/auth/signup").send({email,password:"strong-pass-123"});return response.headers["set-cookie"]?.[0]?.split(";")[0] as string;}
beforeAll(async()=>{await prisma.course.deleteMany({where:{slug}});await prisma.user.deleteMany({where:{email:{in:[adminEmail,learnerEmail]}}})});
afterAll(async()=>{await prisma.course.deleteMany({where:{slug}});await prisma.user.deleteMany({where:{email:{in:[adminEmail,learnerEmail]}}});await prisma.$disconnect()});
describe("admin authoring boundary",()=>{
  it("rejects ordinary learners and keeps admin drafts out of learner APIs",async()=>{
    const learnerCookie=await signup(learnerEmail);
    expect((await request(app).get("/admin/courses").set("Cookie",learnerCookie)).status).toBe(403);
    const adminCookie=await signup(adminEmail);await prisma.user.update({where:{email:adminEmail},data:{role:"ADMIN"}});
    const created=await request(app).post("/admin/courses").set("Cookie",adminCookie).send({slug,title:"Private draft",description:"Must remain invisible",difficulty:"BEGINNER"});
    expect(created.status).toBe(201);expect(created.body.status).toBe("DRAFT");
    expect((await request(app).get(`/courses/${slug}`)).status).toBe(404);
    const audit=await request(app).get("/admin/audit").set("Cookie",adminCookie);expect(audit.status).toBe(200);expect(audit.body.items.some((item:{entitySlug:string})=>item.entitySlug===slug)).toBe(true);
  });
});
