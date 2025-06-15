export { };

declare global {
    interface IBackendRes<T> {
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface ISignupRequest {
        name: string;
        email: string;
        phone: string;
        password: string;
    }

    interface ISigninRequest {
        email: string;
        password: string;
    }

    interface ISendCodeRequest {
        email: string;
    }

    interface IVerifyCodeRequest {
        email: string;
        code: string;
    }

    interface IResetPasswordRequest {
        email: string;
        code: string;
        newPassword: string;
    }    interface IAuthResponse {
        token?: string;
        user?: {
            id: string;
            name: string;
            email: string;
            phone?: string;
        };
    }

    interface ICodeResponse {
        success: boolean;
        message: string;
    }

    // Specific response interfaces for different endpoints
    interface ISigninResponse {
        message: string;
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }
}