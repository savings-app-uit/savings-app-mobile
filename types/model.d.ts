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
        token?: string; 
        user?: {
            id: string;
            email: string;
        };
    }    interface ISignupResponse {
        message: string;
        token?: string;
        user?: {
            id: string;
            email: string;
            name: string;
        };
    }

    interface ITransaction {
        id: string;
        categoryId: string;
        amount: number;
        description: string;
        date: string;
        type: 'expense' | 'income';
        userId: string;
        createdAt: string;
        updatedAt: string;
    }

    interface IAddTransactionRequest {
        categoryId: string;
        amount: number;
        description: string;
        date: string;
    }

    interface IUpdateTransactionRequest {
        categoryId?: string;
        amount?: number;
        description?: string;
        date?: string;
    }

    interface ITransactionResponse {
        message: string;
        data?: ITransaction;
    }

    interface ITransactionsResponse {
        message: string;
        data?: ITransaction[];
    }

    interface ICategory {
        id: string;
        name: string;
        iconId: string;
        type: 'expense' | 'income';
        isDefault: boolean;
        userId?: string;
        createdAt: string;
        updatedAt: string;
    }

    interface IAddCategoryRequest {
        name: string;
        iconId: string;
        type: 'expense' | 'income';
    }

    interface ICategoryResponse {
        message: string;
        data?: ICategory;
    }

    interface ICategoriesResponse {
        message: string;
        data?: ICategory[];
    }
}