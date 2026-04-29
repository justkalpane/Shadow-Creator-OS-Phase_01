const SkillLoader = require('./engine/skill_loader/skill_loader.js');

async function test() {
  const loader = new SkillLoader();
  
  try {
    const initResult = await loader.initialize();
    if (initResult.status !== 'initialized') {
      throw new Error('Failed to initialize');
    }
    
    console.log('\n=== TESTING SCRIPT GENERATION SKILL OUTPUT ===\n');
    
    const context = {
      dossier_id: 'TEST-DOSSIER',
      topic: 'How AI is Changing Content Creation',
      title: 'AI Content Revolution',
      hook: 'Discover how artificial intelligence is transforming digital content production',
      workflow_id: 'CWF-210'
    };
    
    // Test M-045 (script generation skill)
    const result = await loader.executeSkill('M-045', context, {});
    
    console.log('SKILL OUTPUT:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

test();
