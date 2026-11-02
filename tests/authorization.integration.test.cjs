const request = require("supertest");
const { app } = require("../dist/src/app");

describe("Autorização", () => {
  it("deve exigir autenticação para listar chamados", async () => {
    const response = await request(app).get("/api/tickets");

    expect(response.status).toBe(401);
  });

  it("deve exigir autenticação para consultar departamentos", async () => {
    const response = await request(app).get("/api/catalog/departments");

    expect(response.status).toBe(401);
  });

  it("deve exigir autenticação para atribuir chamados", async () => {
    const response = await request(app)
      .post("/api/tickets/chamado-inexistente/assign")
      .send({ technicianId: "tecnico-inexistente" });

    expect(response.status).toBe(401);
  });
});

describe("Escalação de privilégios", () => {
  const { prisma } = require("../dist/lib/prisma");
  const testPassword = "SenhaTeste123!";

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar solicitantes mesmo se o cliente enviar role ADMIN", async () => {
    const escalationEmail = `escalacao-${Date.now()}@example.com`;

    try {
      const response = await request(app).post("/api/auth/register").send({
        name: "Usuário sem privilégios",
        email: escalationEmail,
        password: testPassword,
        role: "ADMIN",
      });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe("REQUESTER");

      const savedUser = await prisma.user.findUnique({
        where: { email: escalationEmail },
      });

      expect(savedUser.role).toBe("REQUESTER");
    } finally {
      await prisma.user.deleteMany({ where: { email: escalationEmail } });
    }
  });
});
