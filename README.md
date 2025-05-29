# v2Dashboard

A modern, responsive dashboard application built with Next.js and TypeScript for managing sales and expenses.

## Features

- 📊 Real-time sales and expense tracking
- 💰 Monthly revenue calculations
- 🌐 Traffic and duration monitoring
- 📈 Interactive charts and breakdowns
- 🔐 Secure authentication system
- 🌍 Multi-server expense management
- 📱 Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Authentication:** Custom Auth Context
- **Database:** Firebase
- **Form Handling:** React Hook Form + Zod
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/v2Dashboard.git
cd v2Dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
v2Dashboard/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/         # React components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and types
│   └── styles/            # Global styles
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Features in Detail

### Sales Management
- Add new sales with user details
- Track traffic amount and duration
- View sales history and statistics
- Delete sales records

### Expense Management
- Record server expenses
- Support for multiple server locations
- Track monthly expenses
- Delete expense records

### Dashboard Analytics
- Monthly revenue overview
- Sales trend visualization
- Traffic breakdown by tier
- Geographic distribution
- Platform usage statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Firebase](https://firebase.google.com/)
