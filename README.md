# Utah HS MTB Championship Dashboard

A React-based dashboard for analyzing Utah High School Mountain Biking Championship race results. Built with Vite, React, and Tailwind CSS.

## 🚀 Features

- **Interactive Data Tables**: Sortable, filterable race results
- **Visual Analytics**: Charts showing participation and performance metrics
- **Lap Analysis**: Detailed lap-by-lap performance tracking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Multi-Race Ready**: Architecture supports multiple races and cross-race analysis

## 📁 Project Structure

```
mtb-dashboard/
├── src/
│   ├── components/
│   │   └── SingleRaceDashboard.jsx    # Main dashboard component
│   ├── data/
│   │   ├── races/
│   │   │   └── 2025-cedar-city.json   # Race data
│   │   └── metadata.json              # Race metadata
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
├── index.html                         # HTML template
├── package.json                       # Dependencies
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
├── netlify.toml                       # Netlify deployment config
└── README.md                          # This file
```

## 🛠️ Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 Deploying to Netlify

### Method 1: Deploy via Git (Recommended)

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub/GitLab:**
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab)
   - Select your repository
   - Netlify will auto-detect the settings from `netlify.toml`
   - Click "Deploy site"

### Method 2: Drag & Drop Deploy

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist/` folder onto the Netlify dashboard
   - Your site will be live in seconds!

### Method 3: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## 📊 Adding New Races

### Step 1: Prepare Race Data

Convert your race CSV to JSON format using the provided structure:

```json
{
  "NO": 5426,
  "NAME": "RIDER NAME",
  "Team": "Team Name",
  "Division": "D1",
  "CAT": "Category",
  "GENDER": "M",
  "GRD": 9,
  "PTS": 285,
  "LAP1": 1508.0,
  "LAP2": 1719.0,
  "LAP3": null,
  "LAP4": null,
  "TOTAL_TIME": 3227.0,
  "NUM_LAPS": 2,
  "laps": [
    {
      "lap": 1,
      "time": 1508.0,
      "pace": "25:08",
      "delta": null
    },
    {
      "lap": 2,
      "time": 1719.0,
      "pace": "28:39",
      "delta": "+211s"
    }
  ]
}
```

### Step 2: Add Race File

1. Save the JSON file to `src/data/races/[race-id].json`
2. Update `src/data/metadata.json`:

```json
{
  "seasons": [
    {
      "year": 2025,
      "name": "2025 Season",
      "races": [
        {
          "id": "2025-cedar-city",
          "name": "Cedar City State Championship",
          "date": "2025-10-19",
          "location": "Cedar City, UT",
          "file": "2025-cedar-city.json"
        },
        {
          "id": "2025-park-city",
          "name": "Park City Championship",
          "date": "2025-09-15",
          "location": "Park City, UT",
          "file": "2025-park-city.json"
        }
      ]
    }
  ]
}
```

### Step 3: Update App.jsx (Future Enhancement)

When adding multiple races, you'll want to add a race selector. The current structure supports this with minimal changes.

## 🔮 Future Enhancements (Phase 2 & 3)

- **Season Overview**: Compare team performance across all races in a season
- **Rider Profiles**: Track individual rider performance across multiple races
- **Lap Analysis**: Visualize lap time progressions and pacing strategies
- **Cross-Season Comparison**: Compare performance year-over-year
- **Advanced Filtering**: Filter by multiple criteria simultaneously
- **Export Features**: Download filtered results as CSV

## 🧪 Data Structure

### Key Fields

- **NO**: Unique rider ID (race plate number)
- **NAME**: Rider name
- **Team**: School/team name
- **Division**: Race division (D1, D2, D3)
- **CAT**: Race category (Varsity Boys, JV A Girls, etc.)
- **GENDER**: M or F
- **GRD**: Grade level (9-12)
- **PTS**: Points earned
- **LAP1-4**: Individual lap times in seconds
- **TOTAL_TIME**: Total race time in seconds
- **NUM_LAPS**: Number of completed laps
- **laps**: Array of structured lap data with pace and delta

## 📝 Git Workflow

### First Time Setup

```bash
# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Phase 1 - Single race dashboard"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/mtb-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Making Changes

```bash
# Check status
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "Add: [feature description]"

# Push to remote
git push
```

### Branch Strategy (Optional)

```bash
# Create feature branch
git checkout -b feature/rider-profiles

# Make changes, commit

# Push feature branch
git push -u origin feature/rider-profiles

# Merge via pull request on GitHub/GitLab
```

## 🐛 Troubleshooting

### Build Fails

- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules dist && npm install`
- Check Node version: `node --version` (should be v16+)

### Netlify Deploy Fails

- Check `netlify.toml` configuration
- Verify build command runs locally: `npm run build`
- Check Netlify build logs for specific errors

### Styling Issues

- Tailwind not working: Verify `tailwind.config.js` content paths
- Colors not appearing: Check `safelist` in `tailwind.config.js`

## 📄 License

This project is open source and available for use by Utah High School Mountain Biking programs.

## 🤝 Contributing

To add new features or fix bugs:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for Utah HS Mountain Biking** 🚵
