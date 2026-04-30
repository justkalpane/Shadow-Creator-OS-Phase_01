const modeRegistry = {
  founder: { id: 'founder', label: 'Founder Mode' },
  creator: { id: 'creator', label: 'Creator Mode' },
  builder: { id: 'builder', label: 'Builder Mode' },
  operator: { id: 'operator', label: 'Operator Mode' },
};

const screenRegistry = {
  SCR_OVERVIEW: { id: 'SCR_OVERVIEW', name: 'Overview', route: '/overview', target_roles: ['founder', 'operator'] },
  SCR_ROUTES: { id: 'SCR_ROUTES', name: 'Routes', route: '/routes', target_roles: ['founder', 'creator', 'operator'] },
  SCR_DOSSIERS: { id: 'SCR_DOSSIERS', name: 'Dossiers', route: '/dossiers', target_roles: ['founder', 'creator'] },
  SCR_APPROVALS: { id: 'SCR_APPROVALS', name: 'Approvals', route: '/approvals', target_roles: ['founder', 'creator'] },
  SCR_ERRORS: { id: 'SCR_ERRORS', name: 'Errors', route: '/errors', target_roles: ['founder', 'operator'] },
  SCR_WORKFLOWS: { id: 'SCR_WORKFLOWS', name: 'Workflows', route: '/workflows', target_roles: ['founder', 'builder', 'operator'] },
  SCR_ALERTS: { id: 'SCR_ALERTS', name: 'Alerts', route: '/alerts', target_roles: ['founder', 'creator', 'operator'] },
  SCR_TROUBLESHOOT: { id: 'SCR_TROUBLESHOOT', name: 'Troubleshoot', route: '/troubleshoot', target_roles: ['founder', 'builder', 'operator'] },
  SCR_ANALYTICS: { id: 'SCR_ANALYTICS', name: 'Analytics', route: '/analytics/:dossierId', target_roles: ['founder', 'creator', 'operator'] },
  SCR_LIBRARY: { id: 'SCR_LIBRARY', name: 'Library', route: '/library', target_roles: ['founder', 'creator', 'operator'] },
  SCR_GALLERY: { id: 'SCR_GALLERY', name: 'Gallery', route: '/gallery', target_roles: ['founder', 'creator', 'operator'] },
  SCR_LEARNING: { id: 'SCR_LEARNING', name: 'Learning', route: '/learning', target_roles: ['founder'] },
};

const sidebarStructure = {
  founder: [
    { label: 'Overview', screenId: 'SCR_OVERVIEW', icon: 'OV' },
    { label: 'Routes', screenId: 'SCR_ROUTES', icon: 'RT' },
    { label: 'Dossiers', screenId: 'SCR_DOSSIERS', icon: 'DO' },
    { label: 'Approvals', screenId: 'SCR_APPROVALS', icon: 'AP' },
    { label: 'Errors', screenId: 'SCR_ERRORS', icon: 'ER' },
    { label: 'Workflows', screenId: 'SCR_WORKFLOWS', icon: 'WF' },
    { label: 'Library', screenId: 'SCR_LIBRARY', icon: 'LB' },
    { label: 'Gallery', screenId: 'SCR_GALLERY', icon: 'GL' },
    { label: 'Learning', screenId: 'SCR_LEARNING', icon: 'LR' },
  ],
  creator: [
    { label: 'Routes', screenId: 'SCR_ROUTES', icon: 'RT' },
    { label: 'Dossiers', screenId: 'SCR_DOSSIERS', icon: 'DO' },
    { label: 'Approvals', screenId: 'SCR_APPROVALS', icon: 'AP' },
    { label: 'Errors', screenId: 'SCR_ERRORS', icon: 'ER' },
    { label: 'Library', screenId: 'SCR_LIBRARY', icon: 'LB' },
    { label: 'Gallery', screenId: 'SCR_GALLERY', icon: 'GL' },
  ],
  builder: [
    { label: 'Workflows', screenId: 'SCR_WORKFLOWS', icon: 'WF' },
    { label: 'Troubleshoot', screenId: 'SCR_TROUBLESHOOT', icon: 'TS' },
    { label: 'Library', screenId: 'SCR_LIBRARY', icon: 'LB' },
  ],
  operator: [
    { label: 'Overview', screenId: 'SCR_OVERVIEW', icon: 'OV' },
    { label: 'Routes', screenId: 'SCR_ROUTES', icon: 'RT' },
    { label: 'Errors', screenId: 'SCR_ERRORS', icon: 'ER' },
    { label: 'Alerts', screenId: 'SCR_ALERTS', icon: 'AL' },
    { label: 'Library', screenId: 'SCR_LIBRARY', icon: 'LB' },
    { label: 'Gallery', screenId: 'SCR_GALLERY', icon: 'GL' },
  ],
};

export const useModeRouter = () => {
  const canAccessScreen = (screenId, currentMode) => {
    const screen = screenRegistry[screenId];
    if (!screen) return false;
    return screen.target_roles.includes(currentMode);
  };

  const getVisibleSidebarItems = (currentMode) => sidebarStructure[currentMode] || [];

  const getScreenDetails = (screenId) => screenRegistry[screenId] || null;

  const getModeDetails = (currentMode) => modeRegistry[currentMode] || null;

  const getAllScreens = () => Object.values(screenRegistry);

  const getActionRights = (screenId, currentMode) => ({
    can_view: canAccessScreen(screenId, currentMode),
    can_approve: currentMode === 'founder',
    can_edit: ['founder', 'builder'].includes(currentMode),
    can_access_rca: ['founder', 'builder', 'operator'].includes(currentMode),
  });

  return {
    canAccessScreen,
    getVisibleSidebarItems,
    getActionRights,
    getModeDetails,
    getScreenDetails,
    getAllScreens,
  };
};
