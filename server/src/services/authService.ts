import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import User = require("../models/User");

const refreshTokenCookieName = "refreshToken";

interface AuthTokenPayload {
  userId: string;
}

type JwtExpiresIn = NonNullable<jwt.SignOptions["expiresIn"]>;

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

const createAccessToken = (userId: string) => {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as JwtExpiresIn;

  return jwt.sign(
    { userId },
    getRequiredEnv("JWT_ACCESS_SECRET"),
    { expiresIn },
  );
};

const createRefreshToken = (userId: string) => {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as JwtExpiresIn;

  return jwt.sign(
    { userId },
    getRequiredEnv("JWT_REFRESH_SECRET"),
    { expiresIn },
  );
};

const createAuthTokens = (userId: string) => {
  return {
    accessToken: createAccessToken(userId),
    refreshToken: createRefreshToken(userId),
  };
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    getRequiredEnv("JWT_ACCESS_SECRET"),
  ) as AuthTokenPayload;
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    getRequiredEnv("JWT_REFRESH_SECRET"),
  ) as AuthTokenPayload;
};

const getPublicUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}) => {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
  };
};

const register = async ({ name, email, password }: RegisterInput) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("A user with this email already exists");
    Object.assign(error, { statusCode: 409 });
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    user: getPublicUser(user),
    tokens: createAuthTokens(String(user._id)),
  };
};

const login = async ({ email, password }: LoginInput) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    const error = new Error("Invalid email or password");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("This account is inactive");
    Object.assign(error, { statusCode: 403 });
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: getPublicUser(user),
    tokens: createAuthTokens(String(user._id)),
  };
};

const refresh = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  let payload: AuthTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const error = new Error("Invalid or expired refresh token");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  const user = await User.findById(payload.userId);

  if (!user || !user.isActive) {
    const error = new Error("Invalid refresh token");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  return {
    user: getPublicUser(user),
    tokens: createAuthTokens(String(user._id)),
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    const error = new Error("User not found");
    Object.assign(error, { statusCode: 404 });
    throw error;
  }

  return getPublicUser(user);
};

export = {
  refreshTokenCookieName,
  register,
  login,
  refresh,
  getMe,
  verifyAccessToken,
};
