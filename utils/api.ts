import axios from "@/utils/api.customize";

export const signInAPI = (email: string, password: string) => {
  const url = `/signin`;
  return axios.post<ISigninResponse>(url, { email, password });
};

export const signUpAPI = (name: string, email: string, phone: string, password: string) => {
  const url = `/signup`;
  return axios.post<IBackendRes<IAuthResponse>>(url, { name, email, phone, password });
};

export const sendCodeAPI = (email: string) => {
  const url = `/send-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email });
};

export const verifyCodeAPI = (email: string, code: string) => {
  const url = `/verify-code`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code });
};

export const resetPasswordAPI = (email: string, code: string, newPassword: string) => {
  const url = `/reset-password`;
  return axios.post<IBackendRes<ICodeResponse>>(url, { email, code, newPassword });
};