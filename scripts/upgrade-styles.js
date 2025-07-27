#!/usr/bin/env node

/**
 * TimeVault Styling System Upgrade Script
 * 
 * Helps migrate components to use the new TimeVault styling system
 */

const fs = require('fs');
const path = require('path');

// ========================================
// MIGRATION MAPPINGS
// ========================================

const cssClassMigrations = {
    // Old classes -> New classes
    'calculator-card': 'tv-card',
    'premium-card': 'tv-card tv-card--premium',
    'submit-button': 'tv-button tv-button--primary',
    'secondary-button': 'tv-button tv-button--secondary',
    'form-input': 'tv-input',
    'select-input': 'tv-input tv-select',
    'loading-spinner': 'tv-loading',
    'error-message': 'tv-status tv-status--error',
    'success-message': 'tv-status tv-status--success',
    'container': 'tv-container',
    'main-content': 'tv-container',
};

const cssVariableMigrations = {
    // Old CSS variables -> New CSS variables
    '--primary-blue': '--tv-primary-navy',
    '--primary-navy': '--tv-primary-navy',
    '--accent-gold': '--tv-accent-gold',
    '--neutral-white': '--tv-white',
    '--neutral-silver': '--tv-silver',
    '--spacing-xs': '--tv-space-1',
    '--spacing-sm': '--tv-space-2',
    '--spacing-md': '--tv-space-4',
    '--spacing-lg': '--tv-space-6',
    '--spacing-xl': '--tv-space-8',
    '--spacing-2xl': '--tv-space-12',
    '--radius-sm': '--tv-radius-sm',
    '--radius-md': '--tv-radius-md',
    '--radius-lg': '--tv-radius-lg',
    '--font-size-xs': '--tv-font-size-xs',
    '--font-size-sm': '--tv-font-size-sm',
    '--font-size-base': '--tv-font-size-base',
    '--font-size-lg': '--tv-font-size-lg',
    '--font-size-xl': '--tv-font-size-xl',
    '--font-size-2xl': '--tv-font-size-2xl',
    '--font-size-3xl': '--tv-font-size-3xl',
    '--transition-fast': '--tv-transition-fast',
    '--transition-normal': '--tv-transition-normal',
    '--transition-slow': '--tv-transition-slow',
};

// ========================================
// UPGRADE FUNCTIONS
// ========================================

/**
 * Migrates CSS classes in a file
 */
function migrateCSSClasses(content) {
    let updated = content;

    Object.entries(cssClassMigrations).forEach(([oldClass, newClass]) => {
        // Match className="old-class" and className={`old-class ${other}`}
        const patterns = [
            new RegExp(`className=["']([^"']*\\s)?${oldClass}(\\s[^"']*)?["']`, 'g'),
            new RegExp(`className=\\{[^}]*["'\`]([^"'\`]*\\s)?${oldClass}(\\s[^"'\`]*)?["'\`][^}]*\\}`, 'g'),
            new RegExp(`\\b${oldClass}\\b`, 'g'),
        ];

        patterns.forEach(pattern => {
            updated = updated.replace(pattern, (match) => {
                return match.replace(oldClass, newClass);
            });
        });
    });

    return updated;
}

/**
 * Migrates CSS variables in a file
 */
function migrateCSSVariables(content) {
    let updated = content;

    Object.entries(cssVariableMigrations).forEach(([oldVar, newVar]) => {
        const pattern = new RegExp(`var\\(\\s*${oldVar.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\)`, 'g');
        updated = updated.replace(pattern, `var(${newVar})`);

        // Also replace in CSS custom property definitions
        const defPattern = new RegExp(`${oldVar.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*:`, 'g');
        updated = updated.replace(defPattern, `${newVar}:`);
    });

    return updated;
}

/**
 * Adds import for TimeVault styling system
 */
function addTimeVaultImports(content, filePath) {
    const isTypeScript = filePath.endsWith('.tsx') || filePath.endsWith('.ts');
    const isComponent = content.includes('React') || content.includes('function') || content.includes('const ') && content.includes('=');

    if (!isComponent) return content;

    // Check if TimeVault imports already exist
    if (content.includes("from './styles'") || content.includes("from '../styles'")) {
        return content;
    }

    // Find the right place to add import
    const importRegex = /^import.*from.*['"][^'"]*['"];?$/gm;
    const imports = content.match(importRegex) || [];

    if (imports.length === 0) return content;

    // Determine relative path to styles
    const depth = (filePath.match(/\\/g) || []).length - 2; // Adjust for src folder
    const stylesPath = '../'.repeat(Math.max(0, depth)) + 'styles';

    // Add TimeVault import after React imports
    const lastImport = imports[imports.length - 1];
    const importToAdd = `import { useTimeVaultStyles } from '${stylesPath}';`;

    return content.replace(lastImport, `${lastImport}\n${importToAdd}`);
}

/**
 * Suggests component upgrades
 */
function suggestComponentUpgrades(content, filePath) {
    const suggestions = [];

    // Check for manual styling that could use components
    if (content.includes('style={{') && content.includes('padding')) {
        suggestions.push('Consider using TimeVaultCard or TimeVaultContainer for consistent spacing');
    }

    if (content.includes('<button') && !content.includes('TimeVaultButton')) {
        suggestions.push('Consider replacing <button> with <TimeVaultButton> for consistent styling');
    }

    if (content.includes('<input') && !content.includes('TimeVaultInput')) {
        suggestions.push('Consider replacing <input> with <TimeVaultInput> for consistent styling');
    }

    if (content.includes('className=') && content.match(/className=["'][^"']*\s+[^"']*["']/)) {
        suggestions.push('Consider using useTimeVaultStyles() hook for cleaner class composition');
    }

    return suggestions;
}

// ========================================
// FILE PROCESSING
// ========================================

/**
 * Processes a single file
 */
function processFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    const changes = [];

    // Apply migrations
    const afterClassMigration = migrateCSSClasses(updated);
    if (afterClassMigration !== updated) {
        changes.push('CSS class migrations');
        updated = afterClassMigration;
    }

    const afterVarMigration = migrateCSSVariables(updated);
    if (afterVarMigration !== updated) {
        changes.push('CSS variable migrations');
        updated = afterVarMigration;
    }

    const afterImports = addTimeVaultImports(updated, filePath);
    if (afterImports !== updated) {
        changes.push('Added TimeVault imports');
        updated = afterImports;
    }

    // Write back if changes were made
    if (changes.length > 0) {
        fs.writeFileSync(filePath, updated);
        console.log(`✅ Updated ${filePath}: ${changes.join(', ')}`);
    }

    // Provide suggestions
    const suggestions = suggestComponentUpgrades(updated, filePath);
    if (suggestions.length > 0) {
        console.log(`💡 Suggestions for ${filePath}:`);
        suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
    }
}

/**
 * Processes all files in a directory
 */
function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`❌ Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dirPath, file.name);

        if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            processDirectory(fullPath);
        } else if (file.isFile() && /\\.(tsx?|jsx?|css)$/.test(file.name)) {
            processFile(fullPath);
        }
    });
}

// ========================================
// CLI INTERFACE
// ========================================

function showHelp() {
    console.log(`
TimeVault Styling System Upgrade Tool

Usage:
  node upgrade-styles.js [command] [path]

Commands:
  migrate <path>     Migrate files to new styling system
  check <path>       Check files for upgrade opportunities (no changes)
  help              Show this help

Examples:
  node upgrade-styles.js migrate src/components
  node upgrade-styles.js check src/components/Calculator
  node upgrade-styles.js migrate src/components/Calculator/Calculator.tsx

The tool will:
  ✅ Migrate CSS class names to TimeVault classes
  ✅ Update CSS variable references
  ✅ Add TimeVault styling imports
  ✅ Suggest component upgrades
  `);
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const targetPath = args[1] || 'src/components';

    if (!command || command === 'help') {
        showHelp();
        return;
    }

    console.log('🚀 TimeVault Styling System Upgrade Tool');
    console.log('========================================\\n');

    if (command === 'migrate') {
        console.log(`📝 Migrating files in: ${targetPath}\\n`);

        if (fs.statSync(targetPath).isDirectory()) {
            processDirectory(targetPath);
        } else {
            processFile(targetPath);
        }

        console.log('\\n✨ Migration complete!');
        console.log('\\n📚 Next steps:');
        console.log('   1. Review the changes made to your files');
        console.log('   2. Test your application to ensure everything works');
        console.log('   3. Consider the suggestions provided');
        console.log('   4. Update imports to use new TimeVault components');

    } else if (command === 'check') {
        console.log(`🔍 Checking files in: ${targetPath} (no changes will be made)\\n`);

        // TODO: Implement check-only mode
        console.log('Check mode not yet implemented. Use "migrate" to see what would change.');

    } else {
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    migrateCSSClasses,
    migrateCSSVariables,
    addTimeVaultImports,
    suggestComponentUpgrades,
    processFile,
    processDirectory,
};
