const openaiService = require('../services/openaiService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

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

      console.log('Generating email sequence for:', businessData.businessName, 'User ID:', req.user.userId);

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

      const distribution = {
        leadIn: 1,
        engage: engageCount,
        guide: guideCount,
        offer: offerCount
      };

      // Save to database
      const sequence = await prisma.sequence.create({
        data: {
          userId: req.user.userId,
          businessName: businessData.businessName,
          businessDescription: businessData.businessDescription,
          targetAudience: businessData.targetAudience,
          leadMagnet: businessData.leadMagnet,
          primaryCTA: businessData.primaryCTA,
          secondaryCTA: businessData.secondaryCTA || '',
          heroJourney: businessData.heroJourney || '',
          resources: businessData.resources ? businessData.resources.join(',') : '',
          emails: emails,
          emailCount: emails.length,
          distribution: distribution
        }
      });

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
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const sequences = await prisma.sequence.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ success: true, sequences, count: sequences.length });
    } catch (error) {
      console.error('Error loading sequences:', error);
      res.status(500).json({ error: 'Failed to load sequences', message: error.message });
    }
  }

  async getSequence(req, res) {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      const sequence = await prisma.sequence.findFirst({
        where: { 
          id: parseInt(id),
          userId: req.user.userId 
        }
      });

      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      res.json({ success: true, sequence });
    } catch (error) {
      console.error('Error loading sequence:', error);
      res.status(500).json({ error: 'Failed to load sequence', message: error.message });
    }
  }

  async updateSequence(req, res) {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      const updates = req.body;
      
      const sequence = await prisma.sequence.findFirst({
        where: { 
          id: parseInt(id),
          userId: req.user.userId 
        }
      });

      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      const updatedSequence = await prisma.sequence.update({
        where: { id: parseInt(id) },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      res.json({ success: true, sequence: updatedSequence });
    } catch (error) {
      console.error('Error updating sequence:', error);
      res.status(500).json({ error: 'Failed to update sequence', message: error.message });
    }
  }

  async deleteSequence(req, res) {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      
      const sequence = await prisma.sequence.findFirst({
        where: { 
          id: parseInt(id),
          userId: req.user.userId 
        }
      });

      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      await prisma.sequence.delete({
        where: { id: parseInt(id) }
      });

      res.json({ success: true, message: 'Sequence deleted successfully' });
    } catch (error) {
      console.error('Error deleting sequence:', error);
      res.status(500).json({ error: 'Failed to delete sequence', message: error.message });
    }
  }

  async editEmail(req, res) {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { error } = editEmailSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: 'Validation error', details: error.details });
      }

      const { sequenceId, emailIndex, aiPrompt } = req.body;

      // Verify sequence belongs to user
      const sequence = await prisma.sequence.findFirst({
        where: { 
          id: parseInt(sequenceId),
          userId: req.user.userId 
        }
      });

      if (!sequence) {
        return res.status(404).json({ error: 'Sequence not found' });
      }

      const emails = sequence.emails;
      if (!emails || !emails[emailIndex]) {
        return res.status(400).json({ error: 'Invalid email index' });
      }

      const emailToEdit = emails[emailIndex];
      
      // Generate new email content using AI
      const newContent = await openaiService.editEmail(
        emailToEdit.content,
        emailToEdit.subject,
        req.body.businessData,
        aiPrompt
      );

      // Update the email in the sequence
      emails[emailIndex] = {
        ...emailToEdit,
        content: newContent
      };

      // Save updated sequence
      const updatedSequence = await prisma.sequence.update({
        where: { id: parseInt(sequenceId) },
        data: { 
          emails: emails,
          updatedAt: new Date()
        }
      });

      res.json({ 
        success: true, 
        sequence: updatedSequence,
        editedEmail: emails[emailIndex]
      });
    } catch (error) {
      console.error('Error editing email:', error);
      res.status(500).json({ error: 'Failed to edit email', message: error.message });
    }
  }
}

module.exports = new EmailController(); 