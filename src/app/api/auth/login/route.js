import { loginUser } from "@/app/controllers/userController";

export async function POST(req) {
  return await loginUser(req);
}
