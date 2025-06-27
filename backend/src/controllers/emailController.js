const openaiService = require('../services/openaiService');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const unzipper = require('unzipper');
const Joi = require('joi');

const businessDataSchema = Joi.object({
  businessName: Joi.string().min(2).max(100).required(),
  businessDescription: Joi.string().min(5).max(1000).required(),
  targetAudience: Joi.string().min(2).max(100).required(),
  leadMagnet: Joi.string().min(2).max(200).required(),
  primaryCTA: Joi.string().min(2).max(100).required(),
  secondaryCTA: Joi.string().allow('').max(100),
  heroJourney: Joi.string().allow('').max(2000),
  resources: Joi.array().items(Joi.string()),
  engageCount: Joi.number().integer().min(1).max(6),
  guideCount: Joi.number().integer().min(1).max(4),
  offerCount: Joi.number().integer().min(1).max(3)
});

const editEmailSchema = Joi.object({
  emailType: Joi.string().required(),
  currentContent: Joi.string().required(),
  currentSubject: Joi.string().allow(''),
  businessData: businessDataSchema.required(),
  aiPrompt: Joi.string().min(2).required()
});

class EmailController {
  async generateSequence(req, res) {
    try {
      const { error } = businessDataSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: 'Validation error', details: error.details });
      }
      const businessData = req.body;
      
      // Validate required fields
      if (!businessData.businessName || !businessData.targetAudience || !businessData.leadMagnet) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['businessName', 'targetAudience', 'leadMagnet']
        });
      }

      console.log('Generating email sequence for:', businessData.businessName);

      // Generate emails for each LEGO type
      const emails = [];
      
      // Lead-In email (1 email)
      console.log('Generating Lead-In email...');
      const leadInEmail = await openaiService.generateEmail('Lead-In', businessData);
      const leadInSubject = await openaiService.generateSubjectLine('Lead-In', businessData);
      emails.push({
        type: 'lead_in',
        subject: leadInSubject,
        content: leadInEmail,
        order: 1
      });

      // Engage emails (3-4 emails)
      const engageCount = businessData.engageCount || 3;
      for (let i = 2; i <= engageCount + 1; i++) {
        console.log(`Generating Engage email ${i-1}...`);
        const engageEmail = await openaiService.generateEmail('Engage', businessData);
        const engageSubject = await openaiService.generateSubjectLine('Engage', businessData);
        emails.push({
          type: 'engage',
          subject: engageSubject,
          content: engageEmail,
          order: i
        });
      }

      // Guide emails (2-3 emails)
      const guideCount = businessData.guideCount || 2;
      for (let i = engageCount + 2; i <= engageCount + guideCount + 1; i++) {
        console.log(`Generating Guide email ${i - engageCount - 1}...`);
        const guideEmail = await openaiService.generateEmail('Guide', businessData);
        const guideSubject = await openaiService.generateSubjectLine('Guide', businessData);
        emails.push({
          type: 'guide',
          subject: guideSubject,
          content: guideEmail,
          order: i
        });
      }

      // Offer emails (1-2 emails)
      const offerCount = businessData.offerCount || 1;
      for (let i = engageCount + guideCount + 2; i <= engageCount + guideCount + offerCount + 1; i++) {
        console.log(`Generating Offer email ${i - engageCount - guideCount - 1}...`);
        const offerEmail = await openaiService.generateEmail('Offer', businessData);
        const offerSubject = await openaiService.generateSubjectLine('Offer', businessData);
        emails.push({
          type: 'offer',
          subject: offerSubject,
          content: offerEmail,
          order: i
        });
      }

      const sequence = {
        id: `seq_${Date.now()}`,
        businessName: businessData.businessName,
        businessDescription: businessData.businessDescription,
        targetAudience: businessData.targetAudience,
        leadMagnet: businessData.leadMagnet,
        primaryCTA: businessData.primaryCTA,
        secondaryCTA: businessData.secondaryCTA,
        heroJourney: businessData.heroJourney,
        resources: businessData.resources,
        emails: emails,
        emailCount: emails.length,
        distribution: {
          leadIn: 1,
          engage: engageCount,
          guide: guideCount,
          offer: offerCount
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to JSON file
      await this.saveSequence(sequence);

      console.log(`✅ Generated ${emails.length} emails for ${businessData.businessName}`);

      res.json({ 
        success: true, 
        sequence,
        message: `Successfully generated ${emails.length} emails`
      });
    } catch (error) {
      console.error('Email generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate email sequence',
        message: error.message 
      });
    }
  }

  async getSequences(req, res) {
    try {
      const sequences = await this.loadAllSequences();
      res.json({ 
        success: true, 
        sequences,
        count: sequences.length
      });
    } catch (error) {
      console.error('Error loading sequences:', error);
      res.status(500).json({ 
        error: 'Failed to load sequences',
        message: error.message 
      });
    }
  }

  async getSequence(req, res) {
    try {
      const { id } = req.params;
      const sequence = await this.loadSequence(id);
      
      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      res.json({ success: true, sequence });
    } catch (error) {
      console.error('Error loading sequence:', error);
      res.status(500).json({ 
        error: 'Failed to load sequence',
        message: error.message 
      });
    }
  }

  async updateSequence(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const sequence = await this.loadSequence(id);
      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      const updatedSequence = {
        ...sequence,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.saveSequence(updatedSequence);

      res.json({ 
        success: true, 
        sequence: updatedSequence,
        message: 'Sequence updated successfully'
      });
    } catch (error) {
      console.error('Error updating sequence:', error);
      res.status(500).json({ 
        error: 'Failed to update sequence',
        message: error.message 
      });
    }
  }

  async deleteSequence(req, res) {
    try {
      const { id } = req.params;
      const filePath = path.join(__dirname, '../../generated_sequences', `${id}.json`);
      
      try {
        await fs.unlink(filePath);
        res.json({ 
          success: true, 
          message: 'Sequence deleted successfully' 
        });
      } catch (fileError) {
        if (fileError.code === 'ENOENT') {
          return res.status(404).json({ error: 'Sequence not found' });
        }
        throw fileError;
      }
    } catch (error) {
      console.error('Error deleting sequence:', error);
      res.status(500).json({ 
        error: 'Failed to delete sequence',
        message: error.message 
      });
    }
  }

  async saveSequence(sequence) {
    const filePath = path.join(__dirname, '../../generated_sequences', `${sequence.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(sequence, null, 2));
  }

  async loadSequence(id) {
    const filePath = path.join(__dirname, '../../generated_sequences', `${id}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async loadAllSequences() {
    const sequencesDir = path.join(__dirname, '../../generated_sequences');
    
    try {
      const files = await fs.readdir(sequencesDir);
      const sequences = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = await fs.readFile(path.join(sequencesDir, file), 'utf8');
            sequences.push(JSON.parse(content));
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
          }
        }
      }
      
      // Sort by creation date (newest first)
      return sequences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Directory doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  generateEngageSubject(businessData) {
    const subjects = [
      `How to improve your ${businessData.targetAudience} results`,
      `The secret to better ${businessData.targetAudience} performance`,
      `3 ways to boost your ${businessData.targetAudience} success`,
      `Why most ${businessData.targetAudience} fail (and how to avoid it)`,
      `Quick tip: ${businessData.targetAudience} optimization`,
      `The ${businessData.targetAudience} strategy that works`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  async editEmail(req, res) {
    try {
      const { error } = editEmailSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: 'Validation error', details: error.details });
      }
      const { emailType, currentContent, currentSubject, businessData, aiPrompt } = req.body;
      
      // Validate required fields
      if (!emailType || !currentContent || !businessData || !aiPrompt) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['emailType', 'currentContent', 'businessData', 'aiPrompt']
        });
      }

      console.log('Editing email with AI prompt:', aiPrompt);

      // Generate updated email content using AI
      const updatedContent = await openaiService.editEmail(emailType, currentContent, currentSubject, businessData, aiPrompt);
      const updatedSubject = await openaiService.generateSubjectLine(emailType, businessData);

      console.log('✅ Email edited successfully');

      res.json({ 
        success: true, 
        content: updatedContent,
        subject: updatedSubject,
        message: 'Email edited successfully'
      });
    } catch (error) {
      console.error('Email editing error:', error);
      res.status(500).json({ 
        error: 'Failed to edit email',
        message: error.message 
      });
    }
  }

  async backupSequences(req, res) {
    try {
      const sequencesDir = path.join(__dirname, '../../generated_sequences');
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="sequences_backup.zip"');
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.directory(sequencesDir, false);
      archive.finalize();
      archive.pipe(res);
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({ error: 'Failed to create backup', message: error.message });
    }
  }

  async restoreSequences(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const sequencesDir = path.join(__dirname, '../../generated_sequences');
      await fs.mkdir(sequencesDir, { recursive: true });
      const stream = fs.createReadStream(req.file.path)
        .pipe(unzipper.Extract({ path: sequencesDir }));
      stream.on('close', () => {
        res.json({ success: true, message: 'Sequences restored successfully' });
      });
      stream.on('error', (err) => {
        throw err;
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      res.status(500).json({ error: 'Failed to restore backup', message: error.message });
    }
  }
}

module.exports = new EmailController(); 