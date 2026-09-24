const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, 'menu_data.json');
  const items = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const reportData = [];

  for (const item of items) {
    let finalStatus = '';
    let dbRecordId = 'N/A';
    let existedBeforeImport = false;
    let newRecordCreated = false;
    let createdAtStr = 'N/A';

    // Manual Review items have now been inserted, so query them normally.

    // Query DB
    let dbRecord = null;
    if (item.type === 'package') {
      dbRecord = await prisma.package.findFirst({ where: { nameAr: item.nameAr } });
    } else {
      dbRecord = await prisma.product.findFirst({ where: { nameAr: item.nameAr } });
    }

    if (dbRecord) {
      dbRecordId = dbRecord.id;
      createdAtStr = dbRecord.createdAt ? dbRecord.createdAt.toISOString() : 'N/A';
      
      const createdDate = dbRecord.createdAt ? new Date(dbRecord.createdAt) : new Date();
      const startOfToday = new Date('2026-09-24T00:00:00Z');

      if (createdDate < startOfToday) {
        existedBeforeImport = true;
        newRecordCreated = false;
        finalStatus = 'Matched Existing';
      } else {
        existedBeforeImport = false;
        newRecordCreated = true;
        finalStatus = 'Imported';
      }
    } else {
      finalStatus = 'Lost / Skipped';
    }

    reportData.push({
      sourceDoc: item.sourceDoc,
      page: item.page,
      category: item.category,
      name: item.nameAr,
      dbId: dbRecordId,
      finalStatus,
      existedBefore: existedBeforeImport,
      newRecordCreated,
      createdAt: createdAtStr
    });
  }

  // Count exactly how many of each
  const counts = {
    'Imported': 0,
    'Matched Existing': 0,
    'Manual Review': 0,
    'Lost / Skipped': 0
  };

  reportData.forEach(r => counts[r.finalStatus]++);

  let md = "# Final Database Audit for Menu Import\n\n";
  md += `**Total Records**: ${reportData.length}\n`;
  md += `**Imported**: ${counts['Imported']}\n`;
  md += `**Matched Existing**: ${counts['Matched Existing']}\n`;
  md += `**Manual Review**: ${counts['Manual Review']}\n`;
  md += `**Lost / Skipped**: ${counts['Lost / Skipped']}\n\n`;

  md += "## Exact Item Breakdown\n\n";
  md += "| Source PDF | Page | Category | Name | DB ID | Final Status | Existed Before Import? | New Record Created? | Created At |\n";
  md += "|------------|------|----------|------|-------|--------------|-----------------------|---------------------|------------|\n";

  for (const r of reportData) {
    md += `| ${r.sourceDoc} | ${r.page} | ${r.category} | ${r.name} | ${r.dbId} | ${r.finalStatus} | ${r.existedBefore} | ${r.newRecordCreated} | ${r.createdAt} |\n`;
  }

  fs.writeFileSync('C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\7096c40e-79b3-4bfd-bc4f-11cf68651372\\final_db_audit.md', md);
  console.log('Audit complete. Total counts:', counts);
  console.log('Report saved to final_db_audit.md');
}

main().catch(console.error).finally(() => prisma.$disconnect());
