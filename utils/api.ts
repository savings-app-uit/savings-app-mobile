import axios from "@/utils/api.customize";

// ===== AUTH =====

// 1. Signin
export const signInAPI = (email: string, password: string) => {
  const url = `/api/signin`;
  return axios.post<ISigninResponse>(url, { email, password });
};

// 2. Forgot Password - Send Code
export const forgotPasswordSendCodeAPI = (email: string) => {
  const url = `/api/forgot-password/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
};

// 3. Forgot Password - Verify Code
export const forgotPasswordVerifyCodeAPI = (email: string, code: string) => {
  const url = `/api/forgot-password/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 4. Forgot Password - Reset
export const forgotPasswordResetAPI = (email: string, code: string, newPassword: string) => {
  const url = `/api/forgot-password/reset`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code, newPassword });
};


// 5. Signup - Send Code
export const signUpSendCodeAPI = (email: string) => {  
  const url = `/api/signup/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
}

// 6. Signup - Verify Code
export const signUpVerifyCodeAPI = (email: string, code: string) => {
  const url = `/api/signup/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 7. Signup - Finalize
export const signUpAPI = (username: string, phone: string, email: string, password: string, code: string) => {
  const url = `/api/signup`;
  return axios.post<ISignupResponse>(url, { 
    name: username,  
    phone, 
    email, 
    password, 
    code 
  });
};

// ===== TRANSACTION MANAGEMENT =====

// 8. Add Transaction (Expense)
export const addExpenseAPI = (data: IAddTransactionRequest) => {
  const url = `/api/transactions/expense`;
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
  return axios.get<ICategory[]>(url);
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

// 16. Get Icons
export const getIconsAPI = () => {
  const url = `/api/categories/icons`;
  return axios.get<IIcon[]>(url);
};

// ===== PROFILE MANAGEMENT =====

// 17. Get Profile
export const getProfileAPI = () => {
  const url = `/api/profile`;
  return axios.get<IProfileAPIResponse>(url);
};

// 18. Update Profile
export const updateProfileAPI = (data: IUpdateProfileRequest) => {
  const url = `/api/profile/update`;
  return axios.post<IProfileResponse>(url, data);
};

// 19. Delete Profile
export const deleteProfileAPI = () => {
  const url = `/api/profile`;
  return axios.delete<{ message: string }>(url);
};

// 20. Change Password
export const changePasswordAPI = (data: IChangePasswordRequest) => {
  const url = `/api/profile/change-password`;
  return axios.post<{ message: string }>(url, data);
};

// 21. Update Avatar
export const updateAvatarAPI = (avatar: FormData) => {
  const url = `/api/profile/update`;
  return axios.post<IUpdateAvatarResponse>(url, avatar, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 22. Scan Receipt/Invoice
export const scanReceiptAPI = (imageFile: FormData) => {
  const url = `/api/scan`;
  return axios.post<IScanReceiptResponse>(url, imageFile, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 23. Get Rewind Data
export const getRewindAPI = () => {
  const url = `/api/rewind`;
  return axios.get<IRewindResponse>(url);
};

export const createImageFormData = (imageUri: string, fileName?: string) => {
  const formData = new FormData();
  
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', 
    name: fileName || 'receipt.jpg',
  } as any);
  
  return formData;
};

export const createAvatarFormData = (imageUri: string, fileName?: string) => {
  const formData = new FormData();
  
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg', 
    name: fileName || 'avatar.jpg',
  } as any);
  
  return formData;
};

// ===== UTILITY FUNCTIONS =====

export const parseVietnameseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      
      const isoDateString = `${month}/${day}/${year}`;
      
      const parsedDate = new Date(isoDateString);
      
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      } else {
      }
    } else {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Helper function to extract profile data from API response
export const extractProfileData = (response: any): IProfile | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }

  // Check if response has data property (IProfileResponse structure)
  if (response.data && typeof response.data === 'object' && response.data.id) {
    return response.data as IProfile;
  }
  
  // Check if response is directly the profile object (has id property)
  if (response.id && response.name && response.email) {
    return response as IProfile;
  }
  
  return null;
};

// Helper function to check if API response indicates success
export const isSuccessResponse = (response: any): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  // Check for success message
  if (response.message && typeof response.message === 'string') {
    return true;
  }
  
  // Check if response is a profile object (direct success)
  if (response.id && response.name && response.email) {
    return true;
  }
  
  return false;
};

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
    ]);    return {
      message: 'Categories fetched successfully',
      data: {
        expenseCategories: expenseCategoriesResponse || [],
        incomeCategories: incomeCategoriesResponse || [],
        total: (expenseCategoriesResponse?.length || 0) + (incomeCategoriesResponse?.length || 0)
      }
    };
  } catch (error) {
    throw error;
  }
};
