# Email AI Writer

An intelligent email sequence generator that uses OpenAI's GPT-4o model to create personalized email nurture sequences based on the LEGO framework (Lead-In, Engage, Guide, Offer).

## 🎯 Project Overview

This application takes business/course information as input and generates complete email nurture sequences using AI. It follows the proven LEGO email framework to create engaging, conversion-focused email sequences that build trust and drive sales.

## 🧱 LEGO Framework

The LEGO framework consists of four email types that work together to create effective nurture sequences:

### L - Lead-In Emails (5-7% of sequence)
- **Purpose**: Deliver promised assets and set expectations
- **Content**: Instant access links, gratitude, usage instructions
- **Goal**: Pure service, zero pitch, build initial trust

### E - Engage Emails (50-60% of sequence)
- **Purpose**: Pure value delivery, no pitch
- **Content**: Tutorials, case studies, industry insights, free resources
- **Goal**: Build authority and trust through valuable content

### G - Guide Emails (20-30% of sequence)
- **Purpose**: Soft invitations to next steps
- **Content**: Value + gentle nudges toward offers
- **Goal**: Turn passive readers into active prospects

### O - Offer Emails (10-15% of sequence)
- **Purpose**: Direct sales and conversion
- **Content**: Clear calls-to-action, limited-time offers
- **Goal**: Drive purchases and conversions

## 🏗️ Technical Architecture

### Backend (Node.js/Express)
```
src/
├── controllers/
│   ├── emailController.js      # Email generation logic
│   └── businessController.js   # Business data management
├── services/
│   ├── openaiService.js        # OpenAI API integration
│   ├── emailService.js         # Email template processing
│   └── fileService.js          # JSON file operations
├── models/
│   ├── Business.js             # Business data schema
│   ├── EmailSequence.js        # Email sequence schema
│   └── Template.js             # Email template schema
├── routes/
│   ├── api.js                  # Main API routes
│   └── webhooks.js             # Webhook endpoints
└── utils/
    ├── promptBuilder.js        # AI prompt construction
    └── validator.js            # Input validation
```

### Frontend (React/Next.js)
```
frontend/
├── components/
│   ├── BusinessForm.js         # Business input form
│   ├── EmailPreview.js         # Email sequence preview
│   ├── TemplateEditor.js       # Template customization
│   └── Dashboard.js            # Main dashboard
├── pages/
│   ├── index.js                # Landing page
│   ├── generate.js             # Email generation
│   └── sequences.js            # Saved sequences
└── styles/
    └── globals.css             # Global styles
```

## 🚀 Features

### Core Functionality
- **Business Analysis**: Extract key business information and target audience
- **AI-Powered Generation**: Use GPT-4o to create personalized email sequences
- **Template System**: Leverage existing LEGO framework templates
- **JSON Export**: Save generated sequences in structured format
- **Frontend Preview**: Real-time preview of generated emails

### Advanced Features
- **Hero's Journey Integration**: Incorporate founder stories and credibility
- **Lead Magnet Optimization**: Tailor sequences to specific lead magnets
- **Call-to-Action Management**: Multiple CTA options (calls, purchases, trials)
- **Resource Integration**: Include videos, PDFs, templates in engage emails
- **Sequence Customization**: Adjust email distribution and timing

## 📋 Implementation Plan

### Phase 1: Core Backend (Week 1-2)
1. **Setup Project Structure**
   - Initialize Node.js/Express backend
   - Configure OpenAI API integration
   - Set up file system for JSON storage

2. **Email Generation Engine**
   - Create prompt builder for each LEGO email type
   - Implement business data processing
   - Build email sequence generation logic

3. **Template Processing**
   - Parse existing email templates
   - Create template variable system
   - Implement template customization

### Phase 2: API Development (Week 3)
1. **REST API Endpoints**
   - POST `/api/generate-sequence` - Generate email sequence
   - GET `/api/sequences` - Retrieve saved sequences
   - PUT `/api/sequences/:id` - Update sequence
   - DELETE `/api/sequences/:id` - Delete sequence

2. **Input Validation**
   - Business information validation
   - Target audience validation
   - Lead magnet validation

3. **Error Handling**
   - OpenAI API error handling
   - Input validation errors
   - File system error handling

### Phase 3: Frontend Development (Week 4-5)
1. **React Application Setup**
   - Initialize Next.js frontend
   - Set up component structure
   - Configure API integration

2. **Business Input Form**
   - Multi-step form for business information
   - Target audience definition
   - Lead magnet specification
   - Call-to-action preferences

3. **Email Preview System**
   - Real-time email preview
   - Sequence timeline view
   - Email editing capabilities

### Phase 4: Integration & Testing (Week 6)
1. **Full Stack Integration**
   - Connect frontend to backend APIs
   - Implement error handling
   - Add loading states and feedback

2. **Testing & Optimization**
   - Test email generation quality
   - Optimize AI prompts
   - Performance testing

3. **Deployment Preparation**
   - Environment configuration
   - Production build setup
   - Documentation completion

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenAI GPT-4o API
- **File Storage**: Local JSON files (expandable to database)
- **Validation**: Joi or Yup
- **Testing**: Jest

### Frontend
- **Framework**: Next.js
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **HTTP Client**: Axios or Fetch API

### Development Tools
- **Package Manager**: npm or yarn
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Environment**: dotenv

## 📊 Data Flow

1. **Input Collection**
   ```
   Business Info → Target Audience → Lead Magnet → CTA Preferences
   ```

2. **AI Processing**
   ```
   Input Data + Templates → OpenAI API → Generated Emails
   ```

3. **Output Generation**
   ```
   Generated Emails → JSON Structure → Frontend Preview
   ```

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
PORT=3001
NODE_ENV=development
```

### API Configuration
```javascript
// OpenAI Configuration
const openaiConfig = {
  model: 'gpt-4o',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};
```

## 📁 File Structure

```
email-ai-writer/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── package.json
│   └── .env.local
├── email_templates/
│   ├── brick_L_Lead-In.txt
│   ├── brick_E_Engage.txt
│   ├── brick_G_Guide.txt
│   └── brick_O_Offer.txt
├── generated_sequences/
│   └── (JSON files)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-ai-writer
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your OpenAI API key to .env
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Access the application**
   - Backend: http://localhost:3001
   - Frontend: http://localhost:3001

## 📝 API Documentation

### Generate Email Sequence
```http
POST /api/generate-sequence
Content-Type: application/json

{
  "businessName": "Course Creator Pro",
  "businessDescription": "Online course creation platform",
  "targetAudience": "Course creators and educators",
  "leadMagnet": "Free website builder",
  "primaryCTA": "book_call",
  "secondaryCTA": "free_trial",
  "heroJourney": "Founder story and credibility...",
  "resources": ["videos", "templates", "pdfs"]
}
```

### Response Format
```json
{
  "success": true,
  "sequence": {
    "id": "seq_123",
    "businessName": "Course Creator Pro",
    "emails": [
      {
        "type": "lead_in",
        "subject": "Your Free Website is Ready!",
        "content": "Email content...",
        "order": 1
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🎨 Customization

### Template Variables
- `{{businessName}}` - Business name
- `{{targetAudience}}` - Target audience
- `{{leadMagnet}}` - Lead magnet name
- `{{founderName}}` - Founder's name
- `{{heroJourney}}` - Founder's story
- `{{primaryCTA}}` - Primary call-to-action
- `{{resources}}` - Available resources

### Email Distribution
```javascript
const emailDistribution = {
  leadIn: 0.05,    // 5% of sequence
  engage: 0.60,    // 60% of sequence
  guide: 0.25,     // 25% of sequence
  offer: 0.10      // 10% of sequence
};
```

## 🔮 Future Enhancements

### Phase 2 Features
- **Database Integration**: MongoDB/PostgreSQL for sequence storage
- **User Authentication**: Multi-user support
- **Analytics Dashboard**: Email performance tracking
- **A/B Testing**: Email variant testing
- **Email Marketing Integration**: Mailchimp, ConvertKit APIs

### Phase 3 Features
- **Advanced AI**: Fine-tuned models for specific industries
- **Multi-language Support**: International email sequences
- **Template Marketplace**: Community-shared templates
- **Automation Workflows**: Trigger-based email sequences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@emailaiwriter.com
- Documentation: [docs.emailaiwriter.com](https://docs.emailaiwriter.com)

---

**Built with ❤️ for course creators and marketers**