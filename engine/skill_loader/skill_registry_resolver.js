const fs = require('fs');
const path = require('path');

class SkillRegistryResolver {
  constructor(config = {}) {
    this.config = {
      registry_path: config.registry_path || './registries/skill_registry.yaml',
      skills_root: config.skills_root || './skills'
    };
  }

  resolveRegistrySkills() {
    try {
      const registryEntries = this.readRegistryEntries(this.config.registry_path);
      const fileIndex = this.buildSkillFileIndex(this.config.skills_root);
      const missingSkillFiles = [];
      const duplicateSkillIds = [];
      const resolved = {};
      const seen = new Set();

      for (const entry of registryEntries) {
        const skillId = entry.skill_id;
        if (seen.has(skillId)) {
          duplicateSkillIds.push(skillId);
          continue;
        }
        seen.add(skillId);

        const candidatePaths = [];
        if (entry.file_path) {
          candidatePaths.push(path.resolve(entry.file_path));
          candidatePaths.push(path.resolve(process.cwd(), entry.file_path));
        }
        if (fileIndex[skillId]) {
          candidatePaths.push(fileIndex[skillId]);
        }

        const existing = candidatePaths.find((p) => p && fs.existsSync(p));
        if (!existing) {
          missingSkillFiles.push(skillId);
          continue;
        }

        resolved[skillId] = {
          skill_id: skillId,
          file_path: existing
        };
      }

      return {
        skill_ids: Object.keys(resolved).sort(),
        resolved,
        missing_skill_files: missingSkillFiles.sort(),
        duplicate_skill_ids: duplicateSkillIds
      };
    } catch (error) {
      throw this.buildRoutedError(error.message);
    }
  }

  readRegistryEntries(registryPath) {
    if (!fs.existsSync(registryPath)) {
      throw this.buildRoutedError(`Skill registry file not found: ${registryPath}`);
    }

    const content = fs.readFileSync(registryPath, 'utf8').replace(/\r\n/g, '\n');
    const lines = content.split('\n');
    const entries = [];
    let current = null;

    for (const line of lines) {
      const idMatch = line.match(/^\s*-\s*skill_id:\s*(M-\d{3})\s*$/);
      if (idMatch) {
        if (current && current.skill_id) {
          entries.push(current);
        }
        current = { skill_id: idMatch[1], file_path: null };
        continue;
      }

      if (current) {
        const pathMatch = line.match(/^\s*file_path:\s*(.+?)\s*$/);
        if (pathMatch) {
          current.file_path = pathMatch[1].trim();
        }
      }
    }

    if (current && current.skill_id) {
      entries.push(current);
    }

    if (entries.length > 0) {
      return entries;
    }

    // Compatibility fallback: authoritative_for with IDs only.
    const idsOnly = [];
    const rx = /^\s*-\s*(M-\d{3})\s*$/gm;
    let match = rx.exec(content);
    while (match) {
      idsOnly.push({ skill_id: match[1], file_path: null });
      match = rx.exec(content);
    }

    if (idsOnly.length === 0) {
      throw this.buildRoutedError(`No skill IDs found in registry: ${registryPath}`);
    }

    return idsOnly;
  }

  buildSkillFileIndex(skillsRoot) {
    const files = this.walkSkillFiles(skillsRoot);
    const index = {};

    for (const file of files) {
      const idFromName = this.extractSkillIdFromFilename(file);
      if (idFromName && !index[idFromName]) {
        index[idFromName] = file;
      }
    }

    return index;
  }

  walkSkillFiles(rootDir) {
    if (!fs.existsSync(rootDir)) {
      return [];
    }

    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    const out = [];

    for (const entry of entries) {
      const fullPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        out.push(...this.walkSkillFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.skill.md')) {
        out.push(path.resolve(fullPath));
      }
    }

    return out;
  }

  extractSkillIdFromFilename(filePath) {
    const name = path.basename(filePath);
    const match = name.match(/(M-\d{3})/);
    return match ? match[1] : null;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }
}

module.exports = SkillRegistryResolver;
