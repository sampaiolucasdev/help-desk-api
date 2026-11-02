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
