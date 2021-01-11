const supertest = require("supertest"); //import supertest

const host = "http://localhost:3000" //initialise host
const request = supertest(host); //initialise supertest to use our base url 

const mockedUser = [
    {
      id: 1,
      name: "user1",
      email: "user1@gmail.com",
      department: "dpt1"
    },
    {
      id: 2,
      name: "user2",
      email: "user2@gmail.com",
      department: "dpt2"
    }
  ];

  describe("Users API test suite", () => {
    // jest.setTimeout(10000);
    it("should get all users", async () => {
        const response = await request.get("/users")
        // console.log(response.statusCode);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
        // expect(response.body).toEqual(mockedUser);
    });

    it("should get a single user by id", async () => {
        const response = await request.get("/users/2");
        expect(response.statusCode).toBe(200);
        expect(response.body[0].name).toContain("user");
        expect(response.body[0].department).toEqual("dpt2");
    });

    it("should create a new user", async () => {
        const users = await request.get("/users");
        const lengthBefore = users.body.length
        const response = await request.post("/users").send({
            name: "user3",
            email: "user3@gmail.com",
            department: "dpt3"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(lengthBefore + 1);
    });

    it("should update single user by id", async () => {
        const response = await request.put("/users/1").send({
            department: "department1"
        });

        expect(response.statusCode).toBe(200);
        // console.log(response.body);
        expect(response.body.user.department).toEqual("department1");
    });

    it("should delete a single user by id", async () => {
        const response = await request.delete("/users/2");
        expect(response.statusCode).toBe(200);

        response.body.users.forEach(user => {
            if(user.name === "user2") { 
                throw new Error("User was not deleted successfully");
            }
        });
    });

    it("should return 404 when getting user with invalid id", async () => { 
        const response = await request.get("/users/x");
        expect(response.statusCode).toBe(404);
    });

    it("should return 404 when updating user with invalid id", async () => { 
        const response = await request.put("/users/x").send({
            department: "dpt"
        });

        expect(response.statusCode).toBe(404);
    });

    it("should return 400 when creating user with invalid id", async () => {
        const response = await request.post("/users").send({
            abcd : "invalid"
        });

        expect(response.statusCode).toBe(400)
    });
    
    it("should return 404 when deleting user with invalid id", async () => { 
        const response = await request.delete("/users/x");
        expect(response.statusCode).toBe(404);
    });
  });