export { };

declare global {
    interface IBackendRes<T> {
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface ISignupRequest {
        username: string;
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
    }       interface ISigninResponse {
        message: string;
        token?: string; // Optional because error responses won't have token
        user?: {
            id: string;
            email: string;
        };
    }

    interface ISignupResponse {
        message: string;
        token?: string;
        user?: {
            id: string;
            email: string;
            name: string;
        };
    }
}