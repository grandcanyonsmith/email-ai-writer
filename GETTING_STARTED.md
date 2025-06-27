# Email AI Writer - Getting Started

## 🚀 Quick Start Guide

This guide will help you get the Email AI Writer up and running in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed
- ✅ OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## 🛠️ Setup Instructions

### 1. Configure OpenAI API Key

**Backend Configuration:**
```bash
cd backend
# Edit the .env file and add your OpenAI API key
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
```

**Frontend Configuration:**
```bash
cd frontend
# The .env.local file is already created with the API URL
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Email AI Writer API running on port 3001
📝 Health check: http://localhost:3001/health
🔗 API docs: http://localhost:3001/
```

### 3. Start the Frontend Application

```bash
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3001
```

### 4. Access the Application

Open your browser and go to: **http://localhost:3001**

## 🧪 Test the Application

### Sample Data for Testing

Use this sample data to test the email generation:

**Business Information:**
- Business Name: `Course Creator Pro`
- Business Description: `Online course creation platform that helps educators build and sell digital courses`
- Target Audience: `Course creators and educators`
- Lead Magnet: `Free website builder`
- Primary CTA: `Book a Call`
- Hero's Journey: `Started as a frustrated student who built a $25M course business. I was tired of poor education quality and decided to create better learning experiences.`

**Email Distribution:**
- Engage Emails: `3`
- Guide Emails: `2`
- Offer Emails: `1`

### Expected Results

After submitting the form, you should see:
- ✅ 7 total emails generated
- ✅ 1 Lead-In email
- ✅ 3 Engage emails
- ✅ 2 Guide emails
- ✅ 1 Offer email
- ✅ Each email with a subject line and content
- ✅ JSON download option

## 🔧 Troubleshooting

### Common Issues

**1. OpenAI API Error**
```
Error: Failed to generate Lead-In email: Invalid API key
```
**Solution:** Make sure your OpenAI API key is correct and has credits.

**2. CORS Error**
```
Access to fetch at 'http://localhost:3001/api/generate-sequence' from origin 'http://localhost:3001' has been blocked by CORS policy
```
**Solution:** The backend should handle CORS automatically. Make sure both servers are running.

**3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Kill any existing processes or change the port in `.env`:
```env
PORT=3001
```

**4. Module Not Found**
```
Error: Cannot find module 'openai'
```
**Solution:** Run `npm install` in the backend directory.

### API Endpoints

Test these endpoints to verify the backend is working:

```bash
# Health check
curl http://localhost:3001/health

# Main API info
curl http://localhost:3001/

# Get sequences (should return empty array initially)
curl http://localhost:3001/api/sequences
```

## 📁 Project Structure

```
email-ai-writer/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Main Express server
│   │   │   └── emailController.js # Email generation logic
│   │   ├── services/
│   │   │   └── openaiService.js   # OpenAI integration
│   │   └── routes/
│   │       └── api.js             # API endpoints
│   ├── generated_sequences/       # JSON files storage
│   ├── package.json
│   └── .env                       # Environment variables
├── frontend/
│   ├── src/
│   │   └── app/
│   │       └── page.tsx           # Main React component
│   ├── package.json
│   └── .env.local                 # Frontend environment
└── email_templates/               # LEGO framework templates
```

## 🎯 Features Working

✅ **Backend API**
- Express server with security middleware
- OpenAI GPT-4o integration
- Email sequence generation
- JSON file storage
- RESTful API endpoints

✅ **Frontend Application**
- React/Next.js with TypeScript
- Beautiful UI with Tailwind CSS
- Form validation and error handling
- Real-time email preview
- JSON download functionality

✅ **LEGO Framework Implementation**
- Lead-In emails (deliver promised assets)
- Engage emails (pure value, no pitch)
- Guide emails (soft invitations)
- Offer emails (conversion-focused)

## 🔮 Next Steps

Once you have the basic application running, you can:

1. **Enhance AI Prompts** - Improve email quality and personalization
2. **Add Template System** - Integrate your existing email templates
3. **Add Sequence Management** - Edit, save, and organize sequences
4. **Improve UI/UX** - Add more features and better styling
5. **Add Analytics** - Track email performance
6. **Database Integration** - Move from JSON files to a proper database

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify your OpenAI API key is correct
3. Make sure both servers are running
4. Check the network tab in browser dev tools for API errors

## 🎉 Success!

You now have a fully functional Email AI Writer that can:
- Generate personalized email sequences using AI
- Follow the proven LEGO framework
- Save sequences as JSON files
- Provide a beautiful web interface
- Download generated sequences

Happy email writing! 🚀 