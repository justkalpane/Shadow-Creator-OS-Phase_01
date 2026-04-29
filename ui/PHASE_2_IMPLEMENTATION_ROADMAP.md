# Shadow Creator OS - Phase 2 Implementation Roadmap

## Current Status: UI Scaffolding Complete ✅
- All 18 screens created
- Navigation routing working
- Mode/Model selectors rendering
- Dark theme applied
- Sidebar collapsible
- Top bar responsive

## Missing: Data Binding & Workflow Integration ❌
- No real data fetched from n8n
- No workflow execution
- No dossier data loading
- No metrics/analytics
- No real-time updates
- No user interactions wired

---

## TEST RESULTS

### ✅ What's Working

| Feature | Status | Evidence |
|---------|--------|----------|
| **UI Rendering** | ✅ | All screens load without errors |
| **Routing** | ✅ | Navigation between screens works |
| **Sidebar Navigation** | ✅ | All 16 menu items clickable |
| **Sidebar Toggle** | ✅ | Hamburger menu collapses/expands sidebar |
| **Styling** | ✅ | Dark theme (Shadow palette) applied |
| **Responsive Layout** | ✅ | Multi-column layout displays correctly |
| **Error Boundary** | ✅ | Component error handling in place |
| **State Management** | ✅ | Zustand store initialized |

### ❌ What's Missing

| Feature | Status | Impact | Example |
|---------|--------|--------|---------|
| **Mode Selector** | ❌ | Can't switch modes | Click dropdown → no change |
| **Model Selector** | ❌ | Can't change models | Click dropdown → no change |
| **Dashboard Data** | ❌ | Stats are hardcoded | Shows 25/100/0/$0.00 always |
| **Dossier Loading** | ❌ | Can't see dossiers | Recent Dossiers section empty |
| **Workflow Execution** | ❌ | Can't run workflows | No buttons to execute |
| **Real-time Updates** | ❌ | No live data | All data static |
| **API Integration** | ❌ | Can't reach n8n | n8n client not called |
| **Mission Control** | ❌ | No DAG visualization | Shows placeholder text |
| **Analytics** | ❌ | No charts/graphs | Empty screens |
| **Alerts** | ❌ | No alert system | No notifications |

---

## IMPLEMENTATION ROADMAP

### Phase 2A: Data Integration (Week 1)
Priority: **CRITICAL** - Must have before Phase 3

#### 1. Load Local Dossiers
```javascript
// In Dashboard.jsx
useEffect(() => {
  const loadDossiers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/data/se_dossier_index.json');
      setDossiers(response.data.dossiers);
    } catch (error) {
      console.error('Failed to load dossiers:', error);
    }
  };
  loadDossiers();
}, []);
```

**Files to Update:**
- src/screens/Dashboard.jsx - Fetch and display dossiers
- src/api/n8nClient.js - Add dossier loading functions

**Testing:**
- [ ] Dashboard shows real dossiers from se_dossier_index.json
- [ ] Click dossier → navigates to Dossier Inspector
- [ ] Recent Dossiers section populates

#### 2. Wire Mode Selector
```javascript
// In ModeSelector.jsx
const handleModeChange = (mode) => {
  setSelectedMode(mode);
  console.log(`Mode changed to: ${mode}`);
  // Future: Save to localStorage, trigger re-authorization
};
```

**Files to Update:**
- src/components/ModeSelector.jsx - Add onChange handler
- src/store/useAppStore.js - Persist to localStorage

**Testing:**
- [ ] Click "Founder Mode" → sidebar badge updates
- [ ] Mode persists on page refresh
- [ ] Different modes show different menu items (builder-only items, etc.)

#### 3. Wire Model Selector
```javascript
// In ModelSelector.jsx
const handleModelChange = (model) => {
  setSelectedModel(model);
  localStorage.setItem('selectedModel', model);
  // Future: Validate model availability via Ollama
};
```

**Files to Update:**
- src/components/ModelSelector.jsx - Add onChange handler
- src/store/useAppStore.js - Persist to localStorage

**Testing:**
- [ ] Click "Mistral" → selector updates
- [ ] Model persists on page refresh
- [ ] Cloud models remain disabled (show "Phase 2+" label)

### Phase 2B: Workflow Integration (Week 2)
Priority: **HIGH** - Enables actual content generation

#### 4. Dashboard Data Binding
```javascript
// Fetch real stats from n8n
const loadStats = async () => {
  try {
    const executions = await workflowApi.getExecutions('WF-010', 100);
    setStats({
      totalExecutions: executions.length,
      successRate: (executions.filter(e => e.status === 'success').length / executions.length) * 100,
      errorCount: executions.filter(e => e.status === 'failed').length,
      totalCost: calculateCost(executions),
    });
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};
```

**Files to Update:**
- src/screens/Dashboard.jsx - Data loading
- src/api/n8nClient.js - Add stats calculation

**Testing:**
- [ ] Dashboard shows real execution counts
- [ ] Success rate calculated correctly
- [ ] Error count reflects actual failures

#### 5. Workflow Execution Button
```javascript
// Add to Dashboard.jsx
const handleCreateDossier = async () => {
  try {
    setLoading(true);
    const result = await workflowApi.executeWorkflow(
      'http://localhost:5678/webhook/WF-001-trigger',
      { mode: selectedMode, topic: 'New Topic' }
    );
    console.log('Workflow result:', result);
    // Refresh dossiers list
    loadDossiers();
  } catch (error) {
    setError(error.message);
  }
};
```

**Files to Update:**
- src/screens/Dashboard.jsx - Add button + handler
- src/api/n8nClient.js - Implement workflow execution

**Testing:**
- [ ] Click "Create New Dossier" button
- [ ] Workflow WF-001 triggers on n8n
- [ ] New dossier appears in Recent Dossiers
- [ ] Loading spinner shows during execution

### Phase 2C: Screen Implementation (Week 3+)
Priority: **MEDIUM** - Screen-specific features

#### 6. Mission Control
```javascript
// Visualization of WF-010 orchestration
// Needs: DAG library (Reactflow or similar)
// Shows: Real-time workflow status
// Features: Pause, resume, skip stages
```

**Files to Create:**
- src/components/DAGVisualization.jsx
- src/hooks/useWorkflowStatus.js

**Testing:**
- [ ] DAG shows WF-100 → WF-200 → ... → WF-600
- [ ] Node colors change with status (pending/running/success/failed)
- [ ] Click node → show details

#### 7. Dossier Inspector
```javascript
// Load dossier JSON and display tree view
// Features:
// - Namespace browser
// - Delta log timeline
// - Trace trail viewer
// - Export button
```

**Files to Create:**
- src/components/DossierTreeView.jsx
- src/components/DeltaLogViewer.jsx

**Testing:**
- [ ] Load DOSSIER-xyz
- [ ] Show all namespaces in tree
- [ ] Click namespace → expand/collapse
- [ ] Delta log shows mutations in order

#### 8. Analytics Dashboard
```javascript
// Charts and metrics
// Libraries: Chart.js, Recharts, or D3
// Metrics: 
// - Execution latency
// - Cost per dossier
// - Quality scores
// - Error rates
```

**Files to Create:**
- src/components/MetricsChart.jsx
- src/components/PerformanceGraph.jsx

**Testing:**
- [ ] Load analytics for dossier
- [ ] Show execution latency chart
- [ ] Display cost breakdown
- [ ] Show error rate trends

---

## CRITICAL FILES TO UPDATE

### Core Integration
```
src/api/n8nClient.js              ← Implement all API calls
src/components/ModeSelector.jsx    ← Wire mode changes
src/components/ModelSelector.jsx   ← Wire model changes
src/screens/Dashboard.jsx          ← Data loading + workflows
src/store/useAppStore.js           ← Persist selections
```

### Screen Implementation (Priority Order)
```
1. Dashboard.jsx                   ← Most used, highest impact
2. MissionControl.jsx              ← Workflow orchestration
3. DossierViewer.jsx               ← State inspection
4. ScriptDebatePanel.jsx           ← Core content
5. AnalyticsDashboard.jsx          ← Metrics
6. TroubleshootConsole.jsx         ← Diagnostics
7. Others as needed
```

---

## VALIDATION CHECKLIST

### Phase 2A Complete ✅
- [ ] Dossiers load from JSON
- [ ] Mode selector works
- [ ] Model selector works
- [ ] Data persists to localStorage

### Phase 2B Complete ✅
- [ ] Dashboard shows real stats
- [ ] Create Dossier button works
- [ ] Workflows execute from UI
- [ ] Recent dossiers update

### Phase 2C Complete ✅
- [ ] Mission Control shows DAG
- [ ] Dossier Inspector shows tree
- [ ] Analytics display charts
- [ ] All 15 screens have data

---

## LIBRARIES TO ADD

```bash
npm install --legacy-peer-deps \
  reactflow \           # DAG visualization
  recharts \            # Charts/graphs
  react-json-tree \     # JSON viewer
  dayjs \               # Date formatting
  clsx                  # Conditional CSS
```

---

## ESTIMATED TIMELINE

- **Phase 2A (Data Integration)**: 1-2 days
- **Phase 2B (Workflow Integration)**: 2-3 days
- **Phase 2C (Screen Implementation)**: 1-2 weeks depending on scope
- **Phase 2D (Polish & Testing)**: 1 week
- **Total Phase 2**: 3-4 weeks

---

## CURRENT BLOCKERS

None - UI scaffolding complete, ready for data integration.

---

## SUCCESS CRITERIA

✅ Phase 2 is complete when:
1. Dashboard shows real dossiers and metrics
2. Mode/Model selectors work and persist
3. "Create New Dossier" triggers WF-010
4. All 18 screens display real data
5. Sidebar items for builder/founder modes work correctly
6. No console errors
7. Responsive on mobile (320px+)
8. Performance: <1s page load, <500ms interactions

---

Generated: 2026-04-30  
Status: Ready for Phase 2A implementation  
Next: Data binding and n8n integration
