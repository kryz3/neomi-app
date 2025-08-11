import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  const token = req.cookies?.get("authToken")?.value;

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    await connectToDatabase();
    const user = await User.findById(payload.userId).select("-password");
    
    if (!user) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    return new Response(JSON.stringify({ 
      authenticated: true,
      user: { id: user._id, username: user.username }
    }), { status: 200 });
    
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
