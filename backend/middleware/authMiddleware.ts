import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { URLSearchParams } from "url";

interface User {
  id?: string;
  username?: string;
  [key: string]: any;
}

interface ValidatedData {
  [key: string]: string;
}

interface ValidationResult {
  validatedData: ValidatedData | null;
  user: User;
  message: string;
}

export function validateTelegramWebAppData(
  telegramInitData: string
): ValidationResult {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  let validatedData: ValidatedData | null = null;
  let user: User = {};
  let message = "";

  if (!BOT_TOKEN) {
    return { message: "BOT_TOKEN is not set", validatedData: null, user: {} };
  }

  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get("hash");

  if (!hash) {
    return {
      message: "Hash is missing from initData",
      validatedData: null,
      user: {},
    };
  }

  initData.delete("hash");

  const authDate = initData.get("auth_date");
  if (!authDate) {
    return {
      message: "auth_date is missing from initData",
      validatedData: null,
      user: {},
    };
  }

  const authTimestamp = parseInt(authDate, 10);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDifference = currentTimestamp - authTimestamp;
  const fiveMinutesInSeconds = 5 * 60;

  if (timeDifference > fiveMinutesInSeconds) {
    return {
      message: "Telegram data is older than 5 minutes",
      validatedData: null,
      user: {},
    };
  }

  const dataCheckString = Array.from(initData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Create HMAC-SHA256 hash using jsonwebtoken
  const secretKey = jwt.sign(dataCheckString, BOT_TOKEN, {
    algorithm: "HS256",
  });

  if (secretKey === hash) {
    validatedData = Object.fromEntries(initData.entries());
    message = "Validation successful";
    const userString = validatedData["user"];
    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (error) {
        console.error("Error parsing user data:", error);
        message = "Error parsing user data";
        validatedData = null;
      }
    } else {
      message = "User data is missing";
      validatedData = null;
    }
  } else {
    message = "Hash validation failed";
  }

  return { validatedData, user, message };
}

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;

    const telegramInitData = req.query.initData as string;

    console.log("Telegram data:", telegramInitData);
    if (!telegramInitData) {
      return res.status(401).json({
        error: "Unauthorized: Missing Telegram data",
      });
    }
    if (!authHeader) {
      return res.status(401).json({
        error: "Unauthorized: Missing authorization header",
      });
    }

    let user: User = {};
    let userId: string | undefined;

    // Check if Telegram data is provided
    if (telegramInitData) {
      const validationResult = validateTelegramWebAppData(telegramInitData);

      if (validationResult.message !== "Validation successful") {
        return res.status(401).json({ error: validationResult.message });
      }

      user = validationResult.user;
      userId = user.id; // Assuming the user ID serves as the address
      (req as any).user = user;
    } else {
      // If Telegram data is not present, proceed with JWT token validation
      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid authorization format" });
      }

      const secretKey = process.env.SECRET_KEY as string;

      let payload;
      try {
        payload = jwt.verify(token, secretKey);
      } catch (error) {
        return res.status(500).json({ error });
      }

      if (!payload) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      userId = (payload as any).address;
      (req as any).user = payload;
    }

    // Attach the address to the request object for downstream use
    if (userId) {
      (req as any).userId = userId;
      console.log("Authorized user:", userId);
    } else {
      return res.status(401).json({ error: "Unauthorized: Address missing" });
    }

    next();
  } catch (error) {
    console.error("Unexpected error in authorization middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
