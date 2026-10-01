export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at: string;
}

export const isRead = (m: ContactMessage) => m.is_read ?? !!m.read_at;