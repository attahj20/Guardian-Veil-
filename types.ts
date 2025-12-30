
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isBlocked?: boolean;
}

export interface SecurityScanResult {
  isSafe: boolean;
  reason?: string;
}
