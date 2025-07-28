import { app } from "../src/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.url === "/api/auth/login") {
    res.status(200).json({ message: "Login route works!" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
}