const request = require("supertest");
const { app } = require("../dist/src/app");

describe("Health check", () => {
  it("deve informar que a API está funcionando", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("helpdesk-api");
  });

  it("deve retornar 404 para uma rota inexistente", async () => {
    const response = await request(app).get("/rota-inexistente");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Rota não encontrada.");
  });
});
