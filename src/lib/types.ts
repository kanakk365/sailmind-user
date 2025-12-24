// Defect types based on API response

export interface Vessel {
  vessel_id: string;
  name: string;
  imo_number: string;
}

export interface Form {
  form_id: string;
  title: string;
}

export interface Inspector {
  user_id: string;
  name: string;
  email: string;
  user_type: string;
}

export interface TaskActivity {
  performed_by: string;
  action: string;
  timestamp: string;
}

export interface Defect {
  defect_id: string;
  vessel_id: string;
  form_id: string;
  assignment_id?: string;
  title: string;
  description?: string;
  severity: "minor" | "major" | "critical";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "approved" | "resolved" | "closed";
  location_on_ship?: string;
  equipment_name?: string;
  raised_by_inspector_id: string;
  triggered_question_order?: number;
  triggered_question_text?: string;
  photos?: string[];
  admin_comments?: string[];
  task_activities?: TaskActivity[];
  due_date?: string;
  analysis_root_cause?: string;
  analysis_impact_assessment?: string;
  analysis_recurrence_probability?: string;
  analysis_notes?: string;
  analysis_photos?: string[];
  analysis_by_inspector_id?: string;
  analysis_created_at?: string;
  analysis_updated_at?: string;
  closed_at?: string;
  approved_by_admin_id?: string;
  created_at: string;
  updated_at: string;
  vessel?: Vessel;
  form?: Form;
  raised_by_inspector?: Inspector;
}

export interface DefectsResponse {
  success: boolean;
  data: {
    items: Defect[];
    page: number;
    limit: number;
    has_next: boolean;
  };
  message: string;
  error: string | null;
}
