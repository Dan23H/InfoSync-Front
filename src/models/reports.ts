export interface Report {
  _id: string;
  userId: string;
  createdAt: string | number | Date;
  targetType: string;
  targetId: string;
  reason: string | string[];
  state: "Pending" | "Resolved" | "Dismissed" | string;
  course?: string;
  resolvedAt?: string | number | Date;
  reviewedBy?: string;
  reviewDescription?: string;
}

export interface ReportListProps {
  reports: Report[];
  authors: { [userId: string]: string };
  filter: string;
  onView: (report: Report) => void;
  onDelete: (reportId: string) => void;
}

export interface ModerationState {
    deleteContent: boolean;
    banUser: boolean;
    warnUser: boolean;
}

export interface ReportModalProps {
    open: boolean;
    modalReport: Report;
    modalContent: any; // Replace 'any' with a specific type if available
    moderation: ModerationState;
    setModeration: React.Dispatch<React.SetStateAction<ModerationState>>;
    reviewDescription: string;
    setReviewDescription: React.Dispatch<React.SetStateAction<string>>;
    actionLoading: boolean;
    onResolve: () => void;
    onDismiss: () => void;
    onClose: () => void;
}