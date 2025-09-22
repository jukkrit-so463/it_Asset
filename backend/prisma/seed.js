const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting seeding...');
  const sqlPath = path.join(__dirname, '../../asset_nmd_gemini.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  const insertStatements = sql.match(/INSERT INTO [\s\S]*?VALUES[\s\S]*?;/g);

  if (insertStatements) {
    console.log(`Found ${insertStatements.length} INSERT statements.`);
    for (const statement of insertStatements) {
      try {
        console.log(`Executing: ${statement.substring(0, 100)}...`);
        await prisma.$executeRawUnsafe(statement);
      } catch (e) {
        console.error(`Error executing statement: ${e.message}`);
      }
    }
  } else {
    console.log('No INSERT statements found in the SQL file.');
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
