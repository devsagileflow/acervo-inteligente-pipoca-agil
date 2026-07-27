import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isValidAdminToken } from "./admin-auth";

describe("isValidAdminToken", () => {
  const originalToken = process.env.ADMIN_ACCESS_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_ACCESS_TOKEN = "6f0d8a8d-de29-4455-b927-440b92da1e30";
  });

  afterEach(() => {
    process.env.ADMIN_ACCESS_TOKEN = originalToken;
  });

  it("returns true when hash matches the configured admin token", () => {
    expect(isValidAdminToken("6f0d8a8d-de29-4455-b927-440b92da1e30")).toBe(true);
  });

  it("returns false when hash does not match", () => {
    expect(isValidAdminToken("invalid-token")).toBe(false);
  });

  it("returns false when hash is missing", () => {
    expect(isValidAdminToken(null)).toBe(false);
    expect(isValidAdminToken(undefined)).toBe(false);
    expect(isValidAdminToken("")).toBe(false);
  });

  it("returns false when ADMIN_ACCESS_TOKEN is not configured", () => {
    delete process.env.ADMIN_ACCESS_TOKEN;
    expect(isValidAdminToken("6f0d8a8d-de29-4455-b927-440b92da1e30")).toBe(false);
  });
});
