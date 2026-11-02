const request = require("supertest");
const { app } = require("../dist/src/app");
const { prisma } = require("../dist/src/lib/prisma");

const testEmail = `teste-${Date.now()}@example.com`;
const testPassword = "SenhaTeste123!";

describe("Autenticação", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    await prisma.$disconnect();
  });

  it("deve cadastrar um solicitante", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Usuário de Teste",
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.role).toBe("REQUESTER");
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("não deve permitir que o cadastro público eleve o próprio papel", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Outro Usuário",
      email: testEmail,
      password: testPassword,
      role: "ADMIN",
    });

    expect(response.status).toBe(409);
  });

  it("deve autenticar o usuário cadastrado", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.role).toBe("REQUESTER");
  });

  it("deve rejeitar uma senha incorreta", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "SenhaErrada123!",
    });

    expect(response.status).toBe(401);
  });
});
