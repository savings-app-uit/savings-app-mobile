import axios from "@/utils/api.customize";

// 1. Signin
export const signInAPI = (email: string, password: string) => {
  const url = `/signin`;
  return axios.post<ISigninResponse>(url, { email, password });
};

// 2. Forgot Password - Send Code
export const forgotPasswordSendCodeAPI = (email: string) => {
  const url = `/forgot-password/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
};

// 3. Forgot Password - Verify Code
export const forgotPasswordVerifyCodeAPI = (email: string, code: string) => {
  const url = `/forgot-password/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 4. Forgot Password - Reset
export const forgotPasswordResetAPI = (email: string, code: string, newPassword: string) => {
  const url = `/forgot-password/reset`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code, newPassword });
};


// 5. Signup - Send Code
export const signUpSendCodeAPI = (email: string) => {  
  const url = `/signup/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
}

// 6. Signup - Verify Code
export const signUpVerifyCodeAPI = (email: string, code: string) => {
  const url = `/signup/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

// 7. Signup - Finalize
export const signUpAPI = (username: string, phone: string, email: string, password: string, code: string) => {
  const url = `/signup`;
  return axios.post<ISignupResponse>(url, { username, phone, email, password, code });
};