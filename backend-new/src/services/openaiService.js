const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  async generateEmail(emailType, businessData) {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(emailType)
          },
          {
            role: "user",
            content: this.buildPrompt(emailType, businessData)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate ${emailType} email: ${error.message}`);
    }
  }

  getSystemPrompt(emailType) {
    const prompts = {
      'Lead-In': `You are an expert email copywriter specializing in the LEGO framework. 
      Create a Lead-In email that:
      - Delivers the promised asset instantly
      - Shows gratitude and congratulations
      - Provides clear usage instructions
      - Sets expectations for future emails
      - Has zero sales pitch
      - Is warm, personal, and welcoming
      
      Keep it concise (150-200 words) and focus on pure service.`,
      
      'Engage': `You are an expert email copywriter specializing in the LEGO framework.
      Create an Engage email that:
      - Provides pure value with no pitch
      - Solves a specific problem for the target audience
      - Demonstrates authority and expertise
      - Includes actionable tips or insights
      - Builds trust through helpful content
      - Keeps the brand top-of-mind
      
      Make it engaging and valuable (200-300 words).`,
      
      'Guide': `You are an expert email copywriter specializing in the LEGO framework.
      Create a Guide email that:
      - Starts with valuable content (80% of email)
      - Ends with a soft invitation to next step
      - Moves readers closer to the offer
      - Uses exploratory, not transactional language
      - Provides clear next steps
      - Maintains trust while guiding action
      
      Balance value with gentle guidance (200-250 words).`,
      
      'Offer': `You are an expert email copywriter specializing in the LEGO framework.
      Create an Offer email that:
      - Presents a clear purchase decision
      - Includes urgency or scarcity (if applicable)
      - Leads with benefits, not features
      - Provides social proof
      - Has a single, clear call-to-action
      - Converts trust into action
      
      Make it compelling and conversion-focused (200-300 words).`
    };

    return prompts[emailType] || prompts['Engage'];
  }

  buildPrompt(emailType, businessData) {
    const basePrompt = `Create a ${emailType} email for the following business:
    
    Business Name: ${businessData.businessName}
    Business Description: ${businessData.businessDescription}
    Target Audience: ${businessData.targetAudience}
    Lead Magnet: ${businessData.leadMagnet}
    Primary CTA: ${businessData.primaryCTA}
    Secondary CTA: ${businessData.secondaryCTA || 'None specified'}
    
    Hero's Journey/Story: ${businessData.heroJourney || 'Not provided'}
    Available Resources: ${businessData.resources ? businessData.resources.join(', ') : 'Not specified'}
    
    Please create a compelling email that follows the ${emailType} principles of the LEGO framework.
    
    Format the response as a complete email with:
    - Subject line
    - Email body (with proper formatting)
    - Call-to-action (if applicable)
    
    Make it personal, engaging, and aligned with the business goals.`;
    
    return basePrompt;
  }

  async generateSubjectLine(emailType, businessData) {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert at writing email subject lines. Create compelling, click-worthy subject lines that are relevant to the email type and business context."
          },
          {
            role: "user",
            content: `Create a subject line for a ${emailType} email for ${businessData.businessName} targeting ${businessData.targetAudience}. Keep it under 60 characters and make it engaging.`
          }
        ],
        temperature: 0.8,
        max_tokens: 100,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Subject line generation error:', error);
      return this.getDefaultSubject(emailType, businessData);
    }
  }

  getDefaultSubject(emailType, businessData) {
    const subjects = {
      'Lead-In': `Your ${businessData.leadMagnet} is Ready! 🎉`,
      'Engage': `Quick Tip: Boost Your ${businessData.targetAudience} Results`,
      'Guide': `Want to learn more about ${businessData.businessName}?`,
      'Offer': `Special Offer: ${businessData.businessName}`
    };

    return subjects[emailType] || `Email from ${businessData.businessName}`;
  }

  async editEmail(emailType, currentContent, currentSubject, businessData, aiPrompt) {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `You are an expert email copywriter specializing in the LEGO framework. 
            You are editing an existing ${emailType} email. 
            Maintain the core message and structure while applying the requested changes.
            Keep the email engaging, personal, and aligned with the business goals.`
          },
          {
            role: "user",
            content: this.buildEditPrompt(emailType, currentContent, currentSubject, businessData, aiPrompt)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to edit ${emailType} email: ${error.message}`);
    }
  }

  buildEditPrompt(emailType, currentContent, currentSubject, businessData, aiPrompt) {
    const basePrompt = `You are editing a ${emailType} email for the following business:
    
    Business Name: ${businessData.businessName}
    Business Description: ${businessData.businessDescription}
    Target Audience: ${businessData.targetAudience}
    Lead Magnet: ${businessData.leadMagnet}
    Primary CTA: ${businessData.primaryCTA}
    Secondary CTA: ${businessData.secondaryCTA || 'None specified'}
    
    Hero's Journey/Story: ${businessData.heroJourney || 'Not provided'}
    Available Resources: ${businessData.resources ? businessData.resources.join(', ') : 'Not specified'}
    
    Current Email Content:
    ${currentContent}
    
    Current Subject Line:
    ${currentSubject}
    
    User's Edit Request:
    ${aiPrompt}
    
    Please edit the email according to the user's request while maintaining:
    - The ${emailType} email principles of the LEGO framework
    - The core message and value proposition
    - Professional tone and structure
    - Engagement and conversion focus
    
    Return only the updated email content without the subject line.`;
    
    return basePrompt;
  }
}

module.exports = new OpenAIService(); 