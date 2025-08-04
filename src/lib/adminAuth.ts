// lib/adminAuth.ts - Only Firebase function setup
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Define the expected response type
interface AdminValidationResult {
  isValid: boolean;
  token?: string;
}

// Create a Firebase Function to validate admin access
export const validateAdminAccess = httpsCallable<
  { password: string }, 
  AdminValidationResult
>(functions, 'validateAdminAccess');