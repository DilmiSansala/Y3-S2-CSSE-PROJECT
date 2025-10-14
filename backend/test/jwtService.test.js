const jwt = require("jsonwebtoken");
const jwtService = require("../services/jwtService");

jest.mock("jsonwebtoken");

describe("JwtService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate a JWT token", () => {
      const payload = { id: "123", usertype: "collector" };
      const token = "test-token";

      jwt.sign.mockReturnValue(token);

      const result = jwtService.generateToken(payload, "1h");

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      expect(result).toBe(token);
    });
  });

  describe("verifyToken", () => {
    it("should verify the JWT token", () => {
      const token = "test-token";
      const decoded = { id: "123", usertype: "collector" };

      jwt.verify.mockReturnValue(decoded);

      const result = jwtService.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(decoded);
    });

    it("should throw an error if the token is invalid", () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => jwtService.verifyToken("invalid-token")).toThrow("Invalid or expired token");
    });
  });
});
