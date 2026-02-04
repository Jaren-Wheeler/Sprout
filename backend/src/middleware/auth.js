const prisma = require("../clients/prisma.client");


async function auth(req, res, next) {
  
  // If no session user
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Optionally load full user 
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId }
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach to request
    req.user = {
      id: user.id,
      email: user.email
    };

    next();

  } catch (err) {
    res.status(500).json({ error: "Auth error" });
  }
}

module.exports = auth;
