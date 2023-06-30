const request = require("supertest");

const baseURL = "http://127.0.0.1:8000";

describe("LOGIN TEST", () => {
    it("Test invalid form", async () => {
        let response = await request(baseURL).post("/login");

        expect(JSON.parse(response.text).success).toBe(false);
    });

    it("Test valid form", async () => {
        let response = await request(baseURL).post("/login").send({ email: "joabewick@gmail.com", password: "san" });

        expect(JSON.parse(response.text).success).toBe(true);
    })

    it("Test wrong credentials", async () => {
        let response = await request(baseURL).post("/login").send({ email: "joabewick@gmail.com", password: "sant" });

        expect(JSON.parse(response.text).success).toBe(false);
    })
})