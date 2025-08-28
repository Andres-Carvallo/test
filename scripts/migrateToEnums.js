#!/usr/bin/env node

/**
 * Script de migración de variables de entorno a enums
 * Ayuda a identificar y migrar componentes que usan variables de entorno
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuración
const COMPONENTS_DIR = 'components';
const APP_DIR = 'app';
const EXTENSIONS = ['tsx', 'ts', 'jsx', 'js'];

// Mapeo de variables de entorno a enums (desde componentEnums.ts)
const ENV_TO_ENUM_MAPPING = {
  'NEXT_PUBLIC_NAVBARBANNER_ID': 'PIXELUPComponents.NAVBAR_BANNER',
  'NEXT_PUBLIC_NAVBARBANNER_IMGID': 'PIXELUPComponents.NAVBAR_BANNER',
  'NEXT_PUBLIC_NOSOTROS01_ID': 'PIXELUPComponents.NOSOTROS_01',
  'NEXT_PUBLIC_NOSOTROS01_IMGID': 'PIXELUPComponents.NOSOTROS_01',
  'NEXT_PUBLIC_LISTA_SERVICIOS01_ID': 'PIXELUPComponents.LISTA_SERVICIOS_01',
  'NEXT_PUBLIC_LISTA_SERVICIOS02_ID': 'PIXELUPComponents.LISTA_SERVICIOS_02',
  'NEXT_PUBLIC_LISTA_SERVICIOS03_ID': 'PIXELUPComponents.LISTA_SERVICIOS_03',
  'NEXT_PUBLIC_LISTA_SERVICIOS04_ID': 'PIXELUPComponents.LISTA_SERVICIOS_04',
  'NEXT_PUBLIC_SINFOTO01_ID': 'PIXELUPComponents.SINFOTO_01',
  'NEXT_PUBLIC_SINFOTO01_IMGID': 'PIXELUPComponents.SINFOTO_01',
  'NEXT_PUBLIC_SINFOTO02_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_02',
  'NEXT_PUBLIC_SINFOTO02_BOX1_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_02',
  'NEXT_PUBLIC_SINFOTO02_BOX2_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_02',
  'NEXT_PUBLIC_SINFOTO02_BOX3_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_02',
  'NEXT_PUBLIC_CARD01_CONTENTBLOCK': 'PIXELUPComponents.CARD_01',
  'NEXT_PUBLIC_CARD02_CONTENTBLOCK': 'PIXELUPComponents.CARD_02',
  'NEXT_PUBLIC_CARD03_CONTENTBLOCK': 'PIXELUPComponents.CARD_03',
  'NEXT_PUBLIC_CARD04_CONTENTBLOCK': 'PIXELUPComponents.CARD_04',
  'NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_04',
  'NEXT_PUBLIC_SINFOTO05_CONTENTBLOCK': 'PIXELUPComponents.SINFOTO_05',
  'NEXT_PUBLIC_BANNERPRINCIPAL01_ID': 'PIXELUPComponents.BANNER_PRINCIPAL_01',
  'NEXT_PUBLIC_BANNERPRINCIPAL02_ID': 'PIXELUPComponents.BANNER_PRINCIPAL_02',
  'NEXT_PUBLIC_BANNERPRINCIPAL03_ID': 'PIXELUPComponents.BANNER_PRINCIPAL_03',
  'NEXT_PUBLIC_BANNER_ABOUT_ID': 'PIXELUPComponents.BANNER_ABOUT',
  'NEXT_PUBLIC_BANNER_TIENDA_ID': 'PIXELUPComponents.BANNER_TIENDA',
  'NEXT_PUBLIC_CATEGORIA01_ID': 'PIXELUPComponents.CATEGORIA_01',
  'NEXT_PUBLIC_CATEGORIA02_ID': 'PIXELUPComponents.CATEGORIA_02',
  'NEXT_PUBLIC_CATEGORIA03_ID': 'PIXELUPComponents.CATEGORIA_03',
  'NEXT_PUBLIC_CATEGORIA04_ID': 'PIXELUPComponents.CATEGORIA_04',
  'NEXT_PUBLIC_CATEGORIA05_ID': 'PIXELUPComponents.CATEGORIA_05',
  'NEXT_PUBLIC_CATEGORIA06_ID': 'PIXELUPComponents.CATEGORIA_06',
  'NEXT_PUBLIC_CATEGORIA07_ID': 'PIXELUPComponents.CATEGORIA_07',
  'NEXT_PUBLIC_CATEGORIA08_ID': 'PIXELUPComponents.CATEGORIA_08',
  'NEXT_PUBLIC_CATEGORIA09_ID': 'PIXELUPComponents.CATEGORIA_09',
  'NEXT_PUBLIC_CATEGORIA10_ID': 'PIXELUPComponents.CATEGORIA_10',
  'NEXT_PUBLIC_GALERIA01_ID': 'PIXELUPComponents.GALERIA_01',
  'NEXT_PUBLIC_GALERIA02_ID': 'PIXELUPComponents.GALERIA_02',
  'NEXT_PUBLIC_UBICACION_ID': 'PIXELUPComponents.UBICACION',
  'NEXT_PUBLIC_UBICACION02_ID': 'PIXELUPComponents.UBICACION_02',
  'NEXT_PUBLIC_UBICACION03_ID': 'PIXELUPComponents.UBICACION_03',
  'NEXT_PUBLIC_UBICACION04_ID': 'PIXELUPComponents.UBICACION_04',
  'NEXT_PUBLIC_UBICACION05_ID': 'PIXELUPComponents.UBICACION_05',
  'NEXT_PUBLIC_MODALUBICACION04_ID': 'PIXELUPComponents.MODAL_UBICACION_04',
  'NEXT_PUBLIC_BLOGHOME_ID': 'PIXELUPComponents.BLOG_HOME',
  'NEXT_PUBLIC_BANNER_BLOG_ID': 'PIXELUPComponents.BANNER_BLOG',
  'NEXT_PUBLIC_PARALLAX_ID': 'PIXELUPComponents.PARALLAX',
  'NEXT_PUBLIC_FRASE01_ID': 'PIXELUPComponents.FRASE_01',
  'NEXT_PUBLIC_ABOUTMECONTENT_ID': 'PIXELUPComponents.ABOUT_ME_CONTENT',
  'NEXT_PUBLIC_SEO_BANNER_ID': 'PIXELUPComponents.SEO_BANNER',
  'NEXT_PUBLIC_FOOTER_BANNER_ID': 'PIXELUPComponents.FOOTER_BANNER',
  'NEXT_PUBLIC_LOGOEDIT_ID': 'PIXELUPComponents.LOGO_EDIT',
  'NEXT_PUBLIC_POPUP_BANNER_ID': 'CoreComponents.POPUP_BANNER',
  'NEXT_PUBLIC_POPUP_CONTENTBLOCK': 'CoreComponents.POPUP_CONTENTBLOCK',
};

// Función para buscar archivos
function findFiles(pattern) {
  return glob.sync(pattern, { nodir: true });
}

// Función para extraer variables de entorno de un archivo
function extractEnvVariables(content) {
  const envPattern = /process\.env\.NEXT_PUBLIC_[A-Z_]+/g;
  const matches = content.match(envPattern);
  return matches ? [...new Set(matches)] : [];
}

// Función para generar el reporte
function generateReport() {
  console.log('🔍 Analizando archivos para migración a enums...\n');

  const allFiles = [];
  
  // Buscar archivos en components y app
  [COMPONENTS_DIR, APP_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
      EXTENSIONS.forEach(ext => {
        const pattern = `${dir}/**/*.${ext}`;
        const files = findFiles(pattern);
        allFiles.push(...files);
      });
    }
  });

  const report = {
    totalFiles: allFiles.length,
    filesWithEnvVars: [],
    envVarsFound: new Set(),
    mappedVars: new Set(),
    unmappedVars: new Set(),
    suggestions: []
  };

  allFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const envVars = extractEnvVariables(content);
      
      if (envVars.length > 0) {
        const fileReport = {
          file,
          envVars,
          mappedVars: [],
          unmappedVars: []
        };

        envVars.forEach(envVar => {
          report.envVarsFound.add(envVar);
          
          if (ENV_TO_ENUM_MAPPING[envVar]) {
            report.mappedVars.add(envVar);
            fileReport.mappedVars.push(envVar);
          } else {
            report.unmappedVars.add(envVar);
            fileReport.unmappedVars.push(envVar);
          }
        });

        report.filesWithEnvVars.push(fileReport);
      }
    } catch (error) {
      console.error(`Error leyendo archivo ${file}:`, error.message);
    }
  });

  return report;
}

// Función para mostrar el reporte
function displayReport(report) {
  console.log('📊 REPORTE DE MIGRACIÓN A ENUMS\n');
  console.log(`📁 Archivos analizados: ${report.totalFiles}`);
  console.log(`📄 Archivos con variables de entorno: ${report.filesWithEnvVars.length}`);
  console.log(`🔗 Variables de entorno encontradas: ${report.envVarsFound.size}`);
  console.log(`✅ Variables mapeadas a enums: ${report.mappedVars.size}`);
  console.log(`❌ Variables sin mapear: ${report.unmappedVars.size}\n`);

  if (report.filesWithEnvVars.length > 0) {
    console.log('📋 ARCHIVOS QUE NECESITAN MIGRACIÓN:\n');
    
    report.filesWithEnvVars.forEach(fileReport => {
      console.log(`📄 ${fileReport.file}`);
      
      if (fileReport.mappedVars.length > 0) {
        console.log('  ✅ Variables mapeadas:');
        fileReport.mappedVars.forEach(envVar => {
          const enumValue = ENV_TO_ENUM_MAPPING[envVar];
          console.log(`    ${envVar} → ${enumValue}`);
        });
      }
      
      if (fileReport.unmappedVars.length > 0) {
        console.log('  ❌ Variables sin mapear:');
        fileReport.unmappedVars.forEach(envVar => {
          console.log(`    ${envVar}`);
        });
      }
      
      console.log('');
    });
  }

  if (report.unmappedVars.size > 0) {
    console.log('⚠️  VARIABLES SIN MAPEAR:');
    Array.from(report.unmappedVars).forEach(envVar => {
      console.log(`  ${envVar}`);
    });
    console.log('\n💡 SUGERENCIAS:');
    console.log('  - Agregar estas variables al mapeo en config/componentEnums.ts');
    console.log('  - Crear enums correspondientes si no existen');
    console.log('  - Verificar si son variables obsoletas que se pueden eliminar\n');
  }

  if (report.mappedVars.size > 0) {
    console.log('🚀 PRÓXIMOS PASOS PARA MIGRACIÓN:');
    console.log('  1. Importar los enums necesarios en cada archivo');
    console.log('  2. Reemplazar process.env.VARIABLE por el enum correspondiente');
    console.log('  3. Usar los hooks usePIXELUPComponent o useCoreComponent');
    console.log('  4. Implementar fallbacks con datos por defecto');
    console.log('  5. Probar que todo funcione correctamente\n');
  }
}

// Función para generar código de migración
function generateMigrationCode(fileReport) {
  const imports = [];
  const replacements = [];
  
  fileReport.mappedVars.forEach(envVar => {
    const enumValue = ENV_TO_ENUM_MAPPING[envVar];
    const [enumType, enumName] = enumValue.split('.');
    
    if (!imports.includes(enumType)) {
      imports.push(enumType);
    }
    
    replacements.push({
      from: envVar,
      to: enumValue,
      hook: enumType === 'PIXELUPComponents' ? 'usePIXELUPComponent' : 'useCoreComponent'
    });
  });

  return {
    imports,
    replacements,
    hookImports: [...new Set(replacements.map(r => r.hook))]
  };
}

// Función para mostrar ejemplos de migración
function showMigrationExamples(report) {
  console.log('💻 EJEMPLOS DE MIGRACIÓN:\n');
  
  report.filesWithEnvVars.slice(0, 3).forEach(fileReport => {
    if (fileReport.mappedVars.length > 0) {
      console.log(`📄 ${fileReport.file}:`);
      
      const migration = generateMigrationCode(fileReport);
      
      console.log('  📥 Imports necesarios:');
      console.log(`    import { ${migration.imports.join(', ')} } from "@/config/componentEnums";`);
      console.log(`    import { ${migration.hookImports.join(', ')} } from "@/hooks/useComponentEnums";`);
      
      console.log('\n  🔄 Reemplazos sugeridos:');
      migration.replacements.forEach(replacement => {
        console.log(`    ${replacement.from} → ${replacement.to}`);
      });
      
      console.log('\n  💡 Código de ejemplo:');
      console.log('    // Antes:');
      console.log(`    const bannerId = ${fileReport.mappedVars[0]};`);
      console.log('    const response = await axios.get(`/api/v1/banners/${bannerId}`);');
      
      console.log('\n    // Después:');
      const firstReplacement = migration.replacements[0];
      console.log(`    const componentData = ${firstReplacement.hook}(${firstReplacement.to});`);
      console.log('    const bannerId = componentData.id;');
      console.log('    const response = await axios.get(`/api/v1/banners/${bannerId}`);');
      console.log('    // Usar componentData.defaultData para fallbacks\n');
    }
  });
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔧 Script de Migración a Enums

Uso: node scripts/migrateToEnums.js [opciones]

Opciones:
  --help, -h     Mostrar esta ayuda
  --examples     Mostrar ejemplos de migración
  --report       Generar solo el reporte (por defecto)

Ejemplos:
  node scripts/migrateToEnums.js
  node scripts/migrateToEnums.js --examples
    `);
    return;
  }

  const report = generateReport();
  displayReport(report);
  
  if (args.includes('--examples')) {
    showMigrationExamples(report);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  generateReport,
  displayReport,
  generateMigrationCode,
  showMigrationExamples
};
