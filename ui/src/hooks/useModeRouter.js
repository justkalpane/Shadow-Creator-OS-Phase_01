// Mode registry with operating modes and their permissions
const modeRegistry = {
  founder: {
    id: 'founder',
    label: 'Founder Mode',
    legal_routes: ['SCR-001', 'SCR-002', 'SCR-003', 'SCR-004', 'SCR-005', 'SCR-006', 'SCR-007', 'SCR-008', 'SCR-009', 'SCR-010', 'SCR-011', 'SCR-012', 'SCR-013', 'SCR-014', 'SCR-015', 'SCR-016', 'SCR-017', 'SCR-018'],
    permissions: {
      can_approve_premium: true,
      can_access_rca: true,
      can_edit_registry: true,
      can_access_mission_control: true,
    },
    hard_non_overridables: ['founder_only_screens'],
  },
  creator: {
    id: 'creator',
    label: 'Creator Mode',
    legal_routes: ['SCR-002', 'SCR-003', 'SCR-004', 'SCR-014', 'SCR-017'],
    permissions: {
      can_approve_premium: false,
      can_access_rca: false,
      can_edit_registry: false,
      can_access_mission_control: false,
    },
  },
  builder: {
    id: 'builder',
    label: 'Builder Mode',
    legal_routes: ['SCR-008', 'SCR-015', 'SCR-016', 'SCR-019', 'SCR-020'],
    permissions: {
      can_approve_premium: false,
      can_access_rca: true,
      can_edit_registry: false,
      can_access_mission_control: false,
    },
  },
  operator: {
    id: 'operator',
    label: 'Operator Mode',
    legal_routes: ['SCR-001', 'SCR-002', 'SCR-005', 'SCR-014', 'SCR-015', 'SCR-016', 'SCR-017'],
    permissions: {
      can_approve_premium: false,
      can_access_rca: true,
      can_edit_registry: false,
      can_access_mission_control: false,
    },
  },
};

// Screen definitions with target roles and widgets
const screenRegistry = {
  'SCR-001': {
    id: 'SCR-001',
    name: 'Overview',
    route: '/overview',
    target_roles: ['founder', 'operator'],
    primary_widgets: ['active_dossier_count', 'open_error_count', 'approval_backlog_count', 'route_lane_depth', 'recent_failures_list'],
    primary_data_sources: ['se_dossier_index', 'se_error_events', 'se_approval_queue', 'se_route_runs'],
  },
  'SCR-002': {
    id: 'SCR-002',
    name: 'Routes',
    route: '/routes',
    target_roles: ['founder', 'creator', 'operator'],
    primary_widgets: ['route_run_table', 'stage_duration_table', 'replay_history'],
    primary_data_sources: ['se_route_runs'],
  },
  'SCR-003': {
    id: 'SCR-003',
    name: 'Dossiers',
    route: '/dossiers',
    target_roles: ['founder', 'creator'],
    primary_widgets: ['dossier_table', 'packet_lineage', 'current_stage_panel'],
    primary_data_sources: ['se_dossier_index', 'se_packet_index', 'se_route_runs'],
  },
  'SCR-004': {
    id: 'SCR-004',
    name: 'Approvals',
    route: '/approvals',
    target_roles: ['founder', 'creator'],
    primary_widgets: ['approval_queue_table', 'pending_action_counter', 'approval_history'],
    primary_data_sources: ['se_approval_queue'],
  },
  'SCR-005': {
    id: 'SCR-005',
    name: 'Errors',
    route: '/errors',
    target_roles: ['founder', 'operator'],
    primary_widgets: ['error_event_table', 'replay_eligibility_panel', 'root_cause_notes'],
    primary_data_sources: ['se_error_events', 'se_route_runs'],
  },
  'SCR-006': {
    id: 'SCR-006',
    name: 'Mission Control',
    route: '/mission-control',
    target_roles: ['founder'],
    primary_widgets: ['active_execution_dag', 'weighted_eta_panel', 'bottleneck_list', 'queue_depth_panel'],
    primary_data_sources: ['se_route_runs', 'se_dossier_index', 'se_approval_queue'],
  },
  'SCR-007': {
    id: 'SCR-007',
    name: 'Founder Governance',
    route: '/founder-governance',
    target_roles: ['founder'],
    primary_widgets: ['blocker_matrix_panel', 'decision_packet_panel', 'provider_posture_panel', 'release_status_panel'],
    primary_data_sources: [],
  },
  'SCR-008': {
    id: 'SCR-008',
    name: 'Workflow Monitor',
    route: '/workflow-monitor',
    target_roles: ['founder', 'builder', 'operator'],
    primary_widgets: ['workflow_execution_table', 'dag_visualization', 'status_timeline'],
    primary_data_sources: ['se_route_runs'],
  },
  'SCR-009': {
    id: 'SCR-009',
    name: 'Topic Pipeline',
    route: '/topic-pipeline',
    target_roles: ['creator', 'founder'],
    primary_widgets: ['topic_queue_table', 'pipeline_stage_indicator', 'progress_tracker'],
    primary_data_sources: ['se_packet_index', 'se_route_runs'],
  },
  'SCR-010': {
    id: 'SCR-010',
    name: 'Research Panel',
    route: '/dossiers/:dossierId/research',
    target_roles: ['creator', 'founder'],
    primary_widgets: ['research_sources_table', 'citation_map', 'source_quality_score'],
    primary_data_sources: ['se_packet_index'],
  },
  'SCR-011': {
    id: 'SCR-011',
    name: 'Script Debate Panel',
    route: '/dossiers/:dossierId/debate',
    target_roles: ['creator', 'founder'],
    primary_widgets: ['debate_points_table', 'argument_strength_meter', 'position_timeline'],
    primary_data_sources: ['se_packet_index'],
  },
  'SCR-012': {
    id: 'SCR-012',
    name: 'Context Packet Panel',
    route: '/dossiers/:dossierId/context',
    target_roles: ['builder', 'founder'],
    primary_widgets: ['context_packet_table', 'relationship_graph', 'enrichment_status'],
    primary_data_sources: ['se_packet_index'],
  },
  'SCR-013': {
    id: 'SCR-013',
    name: 'Resource Planner',
    route: '/resource-planner',
    target_roles: ['founder'],
    primary_widgets: ['resource_allocation_table', 'capacity_meter', 'cost_projection'],
    primary_data_sources: ['se_route_runs', 'se_dossier_index'],
  },
  'SCR-014': {
    id: 'SCR-014',
    name: 'Alert Center',
    route: '/alerts',
    target_roles: ['creator', 'operator', 'founder'],
    primary_widgets: ['alert_queue_table', 'severity_distribution', 'alert_timeline'],
    primary_data_sources: ['se_error_events'],
  },
  'SCR-015': {
    id: 'SCR-015',
    name: 'Troubleshoot Console',
    route: '/troubleshoot',
    target_roles: ['builder', 'operator', 'founder'],
    primary_widgets: ['log_viewer', 'debug_trace_table', 'breakpoint_panel'],
    primary_data_sources: ['se_route_runs', 'se_error_events'],
  },
  'SCR-016': {
    id: 'SCR-016',
    name: 'Replay Console',
    route: '/replay',
    target_roles: ['operator', 'founder'],
    primary_widgets: ['replay_history_table', 'execution_comparison', 'result_diff_viewer'],
    primary_data_sources: ['se_route_runs', 'se_error_events'],
  },
  'SCR-017': {
    id: 'SCR-017',
    name: 'Analytics Dashboard',
    route: '/analytics',
    target_roles: ['creator', 'operator', 'founder'],
    primary_widgets: ['metric_cards', 'trend_charts', 'performance_breakdown'],
    primary_data_sources: ['se_route_runs', 'se_dossier_index'],
  },
  'SCR-018': {
    id: 'SCR-018',
    name: 'Self-Learning Dashboard',
    route: '/learning',
    target_roles: ['founder'],
    primary_widgets: ['learning_model_status', 'feedback_queue_table', 'improvement_metrics'],
    primary_data_sources: ['se_approval_queue', 'se_error_events'],
  },
};

// Sidebar navigation structure per mode
const sidebarStructure = {
  founder: [
    { label: 'Overview', screenId: 'SCR-001', icon: '📊' },
    { label: 'Routes', screenId: 'SCR-002', icon: '🛣️' },
    { label: 'Dossiers', screenId: 'SCR-003', icon: '📋' },
    { label: 'Approvals', screenId: 'SCR-004', icon: '✅' },
    { label: 'Errors', screenId: 'SCR-005', icon: '⚠️' },
    { label: 'Mission Control', screenId: 'SCR-006', icon: '🎯' },
    { label: 'Governance', screenId: 'SCR-007', icon: '⚙️' },
    { label: 'Workflows', screenId: 'SCR-008', icon: '⚡' },
    { label: 'Analytics', screenId: 'SCR-017', icon: '📈' },
    { label: 'Learning', screenId: 'SCR-018', icon: '🧠' },
  ],
  creator: [
    { label: 'Routes', screenId: 'SCR-002', icon: '🛣️' },
    { label: 'Dossiers', screenId: 'SCR-003', icon: '📋' },
    { label: 'Approvals', screenId: 'SCR-004', icon: '✅' },
    { label: 'Alerts', screenId: 'SCR-014', icon: '🔔' },
    { label: 'Analytics', screenId: 'SCR-017', icon: '📈' },
  ],
  builder: [
    { label: 'Workflows', screenId: 'SCR-008', icon: '⚡' },
    { label: 'Troubleshoot', screenId: 'SCR-015', icon: '🔧' },
    { label: 'Replay', screenId: 'SCR-016', icon: '🔄' },
    { label: 'Context', screenId: 'SCR-012', icon: '🧩' },
  ],
  operator: [
    { label: 'Overview', screenId: 'SCR-001', icon: '📊' },
    { label: 'Routes', screenId: 'SCR-002', icon: '🛣️' },
    { label: 'Errors', screenId: 'SCR-005', icon: '⚠️' },
    { label: 'Replay', screenId: 'SCR-016', icon: '🔄' },
    { label: 'Alerts', screenId: 'SCR-014', icon: '🔔' },
    { label: 'Analytics', screenId: 'SCR-017', icon: '📈' },
    { label: 'Troubleshoot', screenId: 'SCR-015', icon: '🔧' },
  ],
};

export const useModeRouter = () => {
  const canAccessScreen = (screenId, currentMode) => {
    if (!screenId || !currentMode) return false;
    const screen = screenRegistry[screenId];
    if (!screen) return false;
    return screen.target_roles.includes(currentMode);
  };

  const getVisibleSidebarItems = (currentMode) => {
    return sidebarStructure[currentMode] || [];
  };

  const getActionRights = (screenId, currentMode) => {
    const mode = modeRegistry[currentMode];
    const screen = screenRegistry[screenId];

    if (!mode || !screen) return {};

    return {
      can_view: screen.target_roles.includes(currentMode),
      can_approve: mode.permissions.can_approve_premium,
      can_edit: mode.permissions.can_edit_registry,
      can_access_rca: mode.permissions.can_access_rca,
    };
  };

  const getModeDetails = (currentMode) => {
    return modeRegistry[currentMode] || null;
  };

  const getScreenDetails = (screenId) => {
    return screenRegistry[screenId] || null;
  };

  const getAllScreens = () => {
    return Object.values(screenRegistry);
  };

  return {
    canAccessScreen,
    getVisibleSidebarItems,
    getActionRights,
    getModeDetails,
    getScreenDetails,
    getAllScreens,
  };
};
