interface AuthTokenPayload {
    userId: string;
}
interface RegisterInput {
    name: string;
    email: string;
    password: string;
}
interface LoginInput {
    email: string;
    password: string;
}
interface UpdateMeInput {
    name?: string;
    email?: string;
}
interface UpdatePasswordInput {
    currentPassword: string;
    newPassword: string;
}
declare const _default: {
    refreshTokenCookieName: string;
    register: ({ name, email, password }: RegisterInput) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string | undefined;
            isActive: boolean;
            lastLoginAt: Date | undefined;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login: ({ email, password }: LoginInput) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string | undefined;
            isActive: boolean;
            lastLoginAt: Date | undefined;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh: (refreshToken: string | undefined) => Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string | undefined;
            isActive: boolean;
            lastLoginAt: Date | undefined;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getMe: (userId: string) => Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string | undefined;
        isActive: boolean;
        lastLoginAt: Date | undefined;
    }>;
    updateMe: (userId: string, { name, email }: UpdateMeInput) => Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string | undefined;
        isActive: boolean;
        lastLoginAt: Date | undefined;
    }>;
    updatePassword: (userId: string, { currentPassword, newPassword }: UpdatePasswordInput) => Promise<void>;
    verifyAccessToken: (token: string) => AuthTokenPayload;
};
export = _default;
//# sourceMappingURL=authService.d.ts.map