const { readYamlSafe } = require('./_shared');

class RouteManager {
  constructor() {
    this.routeRegistry = readYamlSafe('registries/route_registry.yaml', {});
  }

  listRoutes() {
    const routes = this.routeRegistry.routes || this.routeRegistry.route_definitions || [];
    if (Array.isArray(routes)) return routes;
    return Object.entries(routes).map(([route_id, value]) => ({ route_id, ...value }));
  }

  getRoute(routeId) {
    const routes = this.listRoutes();
    return routes.find((r) => r.route_id === routeId || r.id === routeId) || null;
  }
}

module.exports = RouteManager;

