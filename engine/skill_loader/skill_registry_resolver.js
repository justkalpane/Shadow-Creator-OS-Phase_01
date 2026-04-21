const fs = require('fs');
const path = require('path');

class SkillRegistryResolver {
  constructor(config = {}) {
    this.config = {
      registry_path: config.registry_path || './registries/skill_registry_wf100.yaml',
      skills_root: config.skills_root || './skills'
    };
  }

  resolveRegistrySkills() {
    const skillIds = this.readSkillIdsFromRegistry(this.config.registry_path);
    const fileIndex = this.buildSkillFileIndex(this.config.skills_root);
    const missingSkillFiles = [];
    const resolved = {};

    for (const skillId of skillIds) {
      if (!fileIndex[skillId]) {
        missingSkillFiles.push(skillId);
        continue;
      }
      resolved[skillId] = {
        skill_id: skillId,
        file_path: fileIndex[skillId]
      };
    }

    return {
      skill_ids: skillIds,
      resolved,
      missing_skill_files: missingSkillFiles
    };
  }

  readSkillIdsFromRegistry(registryPath) {
    if (!fs.existsSync(registryPath)) {
      throw new Error(`Skill registry file not found: ${registryPath}`);
    }

    const content = fs.readFileSync(registryPath, 'utf8');
    const skillIds = [];
    const regex = /^\s*-\s*([A-Z]-\d{3})\b/gm;
    let match = regex.exec(content);
    while (match) {
      skillIds.push(match[1].trim());
      match = regex.exec(content);
    }

    if (skillIds.length === 0) {
      throw new Error(`No skill IDs found in registry: ${registryPath}`);
    }

    return skillIds;
  }

  buildSkillFileIndex(skillsRoot) {
    const files = this.walkSkillFiles(skillsRoot);
    const index = {};

    for (const file of files) {
      const idFromName = this.extractSkillIdFromFilename(file);
      if (idFromName) {
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
        out.push(fullPath);
      }
    }

    return out;
  }

  extractSkillIdFromFilename(filePath) {
    const name = path.basename(filePath);
    const match = name.match(/([A-Z]-\d{3})/);
    return match ? match[1] : null;
  }
}

module.exports = SkillRegistryResolver;
