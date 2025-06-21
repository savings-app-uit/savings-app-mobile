import axios from "@/utils/api.customize";

// ===== AUTH =====

// 1. Signin
export const signInAPI = (email: string, password: string) => {
  const url = `api/signin`;
  return axios.post<ISigninResponse>(url, { email, password });
};

// 2. Forgot Password - Send Code
export const forgotPasswordSendCodeAPI = (email: string) => {
  const url = `api/forgot-password/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
};

// 3. Forgot Password - Verify Code
export const forgotPasswordVerifyCodeAPI = (email: string, code: string) => {
  const url = `api/forgot-password/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 4. Forgot Password - Reset
export const forgotPasswordResetAPI = (email: string, code: string, newPassword: string) => {
  const url = `api/forgot-password/reset`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code, newPassword });
};


// 5. Signup - Send Code
export const signUpSendCodeAPI = (email: string) => {  
  const url = `api/signup/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
}

// 6. Signup - Verify Code
export const signUpVerifyCodeAPI = (email: string, code: string) => {
  const url = `api/signup/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 7. Signup - Finalize
export const signUpAPI = (username: string, phone: string, email: string, password: string, code: string) => {
  const url = `api/signup`;
  return axios.post<ISignupResponse>(url, { username, phone, email, password, code });
};

// ===== TRANSACTION MANAGEMENT =====

// 8. Add Transaction (Expense)
export const addExpenseAPI = (data: IAddTransactionRequest) => {
  const url = `api/transactions/expense`;
  return axios.post<ITransactionResponse>(url, data);
};

// 9. Add Transaction (Income)
export const addIncomeAPI = (data: IAddTransactionRequest) => {
  const url = `/api/transactions/income`;
  return axios.post<ITransactionResponse>(url, data);
};

// 10. Get Transactions
export const getExpensesAPI = () => {
  const url = `/api/transactions/expense`;
  return axios.get<ITransactionsResponse>(url);
};

export const getIncomesAPI = () => {
  const url = `/api/transactions/income`;
  return axios.get<ITransactionsResponse>(url);
};

// 11. Update Transaction
export const updateTransactionAPI = (transactionId: string, data: IUpdateTransactionRequest) => {
  const url = `/api/transactions/${transactionId}`;
  return axios.put<ITransactionResponse>(url, data);
};

// 12. Delete Transaction
export const deleteTransactionAPI = (transactionId: string) => {
  const url = `/api/transactions/${transactionId}`;
  return axios.delete<{ message: string }>(url);
};

// ===== CATEGORY MANAGEMENT =====

// 13. Get Categories
export const getCategoriesAPI = (type: 'expense' | 'income') => {
  const url = `/api/categories?type=${type}`;
  return axios.get<ICategoriesResponse>(url);
};

// 14. Add Category (User-defined)
export const addCategoryAPI = (data: IAddCategoryRequest) => {
  const url = `/api/categories`;
  return axios.post<ICategoryResponse>(url, data);
};

// 15. Delete User Category
export const deleteCategoryAPI = (categoryId: string) => {
  const url = `/api/categories/${categoryId}`;
  return axios.delete<{ message: string }>(url);
};

// ===== UTILITY FUNCTIONS =====

// Get all transactions (both income and expense)
export const getAllTransactionsAPI = async () => {
  try {
    const [expensesResponse, incomesResponse] = await Promise.all([
      getExpensesAPI(),
      getIncomesAPI()
    ]);
    
    return {
      message: 'Transactions fetched successfully',
      data: {
        expenses: expensesResponse.data || [],
        incomes: incomesResponse.data || [],
        total: (expensesResponse.data?.length || 0) + (incomesResponse.data?.length || 0)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get all categories (both expense and income)
export const getAllCategoriesAPI = async () => {
  try {
    const [expenseCategoriesResponse, incomeCategoriesResponse] = await Promise.all([
      getCategoriesAPI('expense'),
      getCategoriesAPI('income')
    ]);
    
    return {
      message: 'Categories fetched successfully',
      data: {
        expenseCategories: expenseCategoriesResponse.data || [],
        incomeCategories: incomeCategoriesResponse.data || [],
        total: (expenseCategoriesResponse.data?.length || 0) + (incomeCategoriesResponse.data?.length || 0)
      }
    };
  } catch (error) {
    throw error;
  }
};
