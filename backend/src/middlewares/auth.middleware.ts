import { auth } from "../utils/auth";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ error: "Please sign in" });
    }

    req.user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid session" });
  }
};
