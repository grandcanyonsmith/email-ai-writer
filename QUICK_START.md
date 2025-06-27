# Email AI Writer - Quick Start Guide

## 🚀 Get Started in 30 Minutes

This guide will help you set up the Email AI Writer project and start building immediately.

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] Node.js 18+ installed
- [ ] OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

## 🛠️ Step 1: Project Setup (5 minutes)

### Create Project Structure
```bash
# Create project directory
mkdir email-ai-writer
cd email-ai-writer

# Create backend and frontend directories
mkdir backend frontend
```

### Initialize Backend
```bash
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express openai cors dotenv helmet express-rate-limit

# Install development dependencies
npm install --save-dev nodemon jest supertest

# Create basic directory structure
mkdir src
mkdir src/controllers src/services src/models src/routes src/utils
mkdir generated_sequences
```

### Initialize Frontend
```bash
cd ../frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# Install additional dependencies
npm install axios zustand react-hook-form framer-motion
```

## 🔧 Step 2: Environment Configuration (2 minutes)

### Backend Environment
```bash
cd ../backend

# Create .env file
touch .env
```

Add to `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
PORT=3001
NODE_ENV=development
```

### Frontend Environment
```bash
cd ../frontend

# Create .env.local file
touch .env.local
```

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ⚡ Step 3: Basic Backend Setup (10 minutes)

### Create Basic Express Server
Create `backend/src/app.js`:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Email AI Writer API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### Update package.json Scripts
In `backend/package.json`, add:
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  }
}
```

## 🤖 Step 4: OpenAI Integration (8 minutes)

### Create OpenAI Service
Create `backend/src/services/openaiService.js`:
```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  async generateEmail(prompt, businessData) {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert email copywriter specializing in the LEGO framework (Lead-In, Engage, Guide, Offer). Create compelling, conversion-focused emails that build trust and drive action."
          },
          {
            role: "user",
            content: this.buildPrompt(prompt, businessData)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate email content');
    }
  }

  buildPrompt(emailType, businessData) {
    const basePrompt = `Create a ${emailType} email for the following business:
    
    Business Name: ${businessData.businessName}
    Business Description: ${businessData.businessDescription}
    Target Audience: ${businessData.targetAudience}
    Lead Magnet: ${businessData.leadMagnet}
    Primary CTA: ${businessData.primaryCTA}
    
    Hero's Journey: ${businessData.heroJourney}
    
    Please create a compelling email that follows the ${emailType} principles of the LEGO framework.`;
    
    return basePrompt;
  }
}

module.exports = new OpenAIService();
```

### Create Email Controller
Create `backend/src/controllers/emailController.js`:
```javascript
const openaiService = require('../services/openaiService');
const fs = require('fs').promises;
const path = require('path');

class EmailController {
  async generateSequence(req, res) {
    try {
      const businessData = req.body;
      
      // Validate required fields
      if (!businessData.businessName || !businessData.targetAudience) {
        return res.status(400).json({ error: 'Missing required business information' });
      }

      // Generate emails for each LEGO type
      const emails = [];
      
      // Lead-In email
      const leadInEmail = await openaiService.generateEmail('Lead-In', businessData);
      emails.push({
        type: 'lead_in',
        subject: `Your ${businessData.leadMagnet} is Ready!`,
        content: leadInEmail,
        order: 1
      });

      // Engage emails (2-3 emails)
      for (let i = 2; i <= 4; i++) {
        const engageEmail = await openaiService.generateEmail('Engage', businessData);
        emails.push({
          type: 'engage',
          subject: `Quick Tip: ${this.generateEngageSubject(businessData)}`,
          content: engageEmail,
          order: i
        });
      }

      // Guide email
      const guideEmail = await openaiService.generateEmail('Guide', businessData);
      emails.push({
        type: 'guide',
        subject: `Want to learn more about ${businessData.businessName}?`,
        content: guideEmail,
        order: 5
      });

      // Offer email
      const offerEmail = await openaiService.generateEmail('Offer', businessData);
      emails.push({
        type: 'offer',
        subject: `Special Offer: ${businessData.businessName}`,
        content: offerEmail,
        order: 6
      });

      const sequence = {
        id: `seq_${Date.now()}`,
        businessName: businessData.businessName,
        emails: emails,
        createdAt: new Date().toISOString()
      };

      // Save to JSON file
      await this.saveSequence(sequence);

      res.json({ success: true, sequence });
    } catch (error) {
      console.error('Email generation error:', error);
      res.status(500).json({ error: 'Failed to generate email sequence' });
    }
  }

  async getSequences(req, res) {
    try {
      const sequences = await this.loadAllSequences();
      res.json({ success: true, sequences });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load sequences' });
    }
  }

  async saveSequence(sequence) {
    const filePath = path.join(__dirname, '../../generated_sequences', `${sequence.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(sequence, null, 2));
  }

  async loadAllSequences() {
    const sequencesDir = path.join(__dirname, '../../generated_sequences');
    const files = await fs.readdir(sequencesDir);
    const sequences = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(sequencesDir, file), 'utf8');
        sequences.push(JSON.parse(content));
      }
    }
    
    return sequences;
  }

  generateEngageSubject(businessData) {
    const subjects = [
      `How to improve your ${businessData.targetAudience} results`,
      `The secret to better ${businessData.targetAudience} performance`,
      `3 ways to boost your ${businessData.targetAudience} success`,
      `Why most ${businessData.targetAudience} fail (and how to avoid it)`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }
}

module.exports = new EmailController();
```

## 🌐 Step 5: API Routes (3 minutes)

### Create API Routes
Create `backend/src/routes/api.js`:
```javascript
const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Generate email sequence
router.post('/generate-sequence', emailController.generateSequence.bind(emailController));

// Get all sequences
router.get('/sequences', emailController.getSequences.bind(emailController));

module.exports = router;
```

### Update Main App
Update `backend/src/app.js` to include routes:
```javascript
// ... existing code ...

const apiRoutes = require('./routes/api');

// ... middleware ...

// Routes
app.use('/api', apiRoutes);

// ... rest of code ...
```

## 🎨 Step 6: Basic Frontend (2 minutes)

### Create Simple Form
Create `frontend/src/app/page.tsx`:
```tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    targetAudience: '',
    leadMagnet: '',
    primaryCTA: 'book_call',
    heroJourney: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/generate-sequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email AI Writer
          </h1>
          <p className="text-lg text-gray-600">
            Generate personalized email sequences using AI and the LEGO framework
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Description
              </label>
              <textarea
                required
                value={formData.businessDescription}
                onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <input
                type="text"
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lead Magnet
              </label>
              <input
                type="text"
                required
                value={formData.leadMagnet}
                onChange={(e) => setFormData({...formData, leadMagnet: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Call-to-Action
              </label>
              <select
                value={formData.primaryCTA}
                onChange={(e) => setFormData({...formData, primaryCTA: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="book_call">Book a Call</option>
                <option value="free_trial">Free Trial</option>
                <option value="purchase">Direct Purchase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hero's Journey/Story
              </label>
              <textarea
                value={formData.heroJourney}
                onChange={(e) => setFormData({...formData, heroJourney: e.target.value})}
                rows={4}
                placeholder="Tell us about your founder's story, credibility, and journey..."
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Email Sequence'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Sequence</h2>
            <div className="space-y-4">
              {result.sequence?.emails?.map((email: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Email {email.order}: {email.type.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Subject: {email.subject}</p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {email.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🚀 Step 7: Test Your Setup (5 minutes)

### Start the Backend
```bash
cd backend
npm run dev
```

### Start the Frontend
```bash
cd frontend
npm run dev
```

### Test the Application
1. Open your browser to `http://localhost:3001`
2. Fill out the form with sample data:
   - Business Name: "Course Creator Pro"
   - Business Description: "Online course creation platform"
   - Target Audience: "Course creators and educators"
   - Lead Magnet: "Free website builder"
   - Primary CTA: "Book a Call"
   - Hero's Journey: "Started as a frustrated student who built a $25M course business"
3. Click "Generate Email Sequence"
4. Check the generated emails in the preview

## ✅ What You've Built

In just 30 minutes, you've created:

- ✅ Express.js backend with OpenAI integration
- ✅ Email generation using the LEGO framework
- ✅ JSON file storage for sequences
- ✅ React frontend with form and preview
- ✅ Basic API endpoints
- ✅ Working email sequence generator

## 🎯 Next Steps

Now that you have a working foundation, you can:

1. **Enhance the AI prompts** - Improve email quality and personalization
2. **Add more email types** - Expand beyond the basic 6-email sequence
3. **Improve the UI** - Add better styling and user experience
4. **Add sequence management** - Edit, save, and organize sequences
5. **Implement template system** - Use your existing email templates
6. **Add validation** - Better input validation and error handling

## 🆘 Troubleshooting

### Common Issues

**OpenAI API Error**
- Check your API key is correct
- Ensure you have credits in your OpenAI account
- Verify the API key is in your `.env` file

**CORS Error**
- Make sure the backend is running on port 3001
- Check that CORS is properly configured

**Port Already in Use**
- Change the port in `.env` file
- Kill any existing processes on the port

**Module Not Found**
- Run `npm install` in both backend and frontend directories
- Check that all dependencies are installed

---

**You're now ready to start building your Email AI Writer! The foundation is solid and you can iterate quickly from here.** 