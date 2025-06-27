const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateSequences() {
  try {
    console.log('Starting sequence migration...');
    
    // Check if we have any users, create a default user if none exist
    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      console.log('No users found, creating default user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('defaultpassword123', 10);
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@example.com',
          password: hashedPassword
        }
      });
      console.log('Created default user:', defaultUser.email);
    }

    const sequencesDir = path.join(__dirname, 'generated_sequences');
    
    try {
      const files = await fs.readdir(sequencesDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        console.log('No JSON sequence files found to migrate.');
        return;
      }

      console.log(`Found ${jsonFiles.length} sequence files to migrate...`);

      for (const file of jsonFiles) {
        try {
          const filePath = path.join(sequencesDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const sequence = JSON.parse(content);

          // Check if sequence already exists in database
          const existingSequence = await prisma.sequence.findFirst({
            where: {
              businessName: sequence.businessName,
              userId: defaultUser.id,
              createdAt: new Date(sequence.createdAt)
            }
          });

          if (existingSequence) {
            console.log(`Sequence for ${sequence.businessName} already exists, skipping...`);
            continue;
          }

          // Create database record
          const dbSequence = await prisma.sequence.create({
            data: {
              userId: defaultUser.id,
              businessName: sequence.businessName,
              businessDescription: sequence.businessDescription,
              targetAudience: sequence.targetAudience,
              leadMagnet: sequence.leadMagnet,
              primaryCTA: sequence.primaryCTA,
              secondaryCTA: sequence.secondaryCTA || '',
              heroJourney: sequence.heroJourney || '',
              resources: Array.isArray(sequence.resources) ? sequence.resources.join(',') : (sequence.resources || ''),
              emails: sequence.emails,
              emailCount: sequence.emailCount,
              distribution: sequence.distribution,
              createdAt: new Date(sequence.createdAt),
              updatedAt: new Date(sequence.updatedAt)
            }
          });

          console.log(`✅ Migrated sequence: ${sequence.businessName} (ID: ${dbSequence.id})`);

        } catch (fileError) {
          console.error(`Error processing file ${file}:`, fileError.message);
        }
      }

      console.log('Migration completed successfully!');
      
      // Optionally, backup and remove the original JSON files
      const backupDir = path.join(__dirname, 'migrated_sequences_backup');
      await fs.mkdir(backupDir, { recursive: true });
      
      for (const file of jsonFiles) {
        const sourcePath = path.join(sequencesDir, file);
        const backupPath = path.join(backupDir, file);
        await fs.copyFile(sourcePath, backupPath);
        await fs.unlink(sourcePath);
      }
      
      console.log(`Original JSON files backed up to ${backupDir} and removed from generated_sequences/`);

    } catch (dirError) {
      if (dirError.code === 'ENOENT') {
        console.log('No generated_sequences directory found, nothing to migrate.');
      } else {
        throw dirError;
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSequences();
}

module.exports = migrateSequences; 