import { Withdrawal } from "@/types";
import { apiRequest } from "./apiClient"; // Adjust path as needed

export const getWithdrawalsByUserId = (
  userId: string
): Promise<Withdrawal[]> => {
  return apiRequest(`/withdrawals/user/${userId}`);
};

export const getAllWithdrawals = (): Promise<Withdrawal[]> => {
  return apiRequest("/withdrawals");
};

export const getPendingWithdrawals = (): Promise<Withdrawal[]> => {
  return apiRequest("/withdrawals?status=pending");
};
type WithdrawalResponse = {
  success: boolean;
  message: string;
};

export const requestWithdrawal = async (
  userId: string,
  amount: number,
  method: "uniqueId" | "crypto",
  address: string
): Promise<WithdrawalResponse> => {
  try {
    const response = await apiRequest<WithdrawalResponse>("/withdrawals", {
      method: "POST",
      body: JSON.stringify({ userId, amount, method, address }),
    });

    return {
      success: response.success,
      message: response.message || "Withdrawal request processed.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during withdrawal.",
    };
  }
};


export const approveWithdrawal = (withdrawalId: string): Promise<boolean> => {
  return apiRequest(`/withdrawals/${withdrawalId}/approve`, {
    method: "PATCH",
  }).then(() => true);
};

export const rejectWithdrawal = (
  withdrawalId: string,
  notes: string
): Promise<boolean> => {
  return apiRequest(`/withdrawals/${withdrawalId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  }).then(() => true);
};
