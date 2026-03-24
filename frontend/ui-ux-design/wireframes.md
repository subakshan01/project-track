# TechTrack UI/UX Design – Wireframes & Design System

## Design Philosophy
- **Premium dark theme** (Catppuccin Mocha-inspired palette)
- **Glassmorphism** effects on navigation and modals
- **Gradient accents** for interactive elements
- **Micro-animations** on hover and transitions
- **Inter font** from Google Fonts for modern typography

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| bg-base | #0f0f1a | Page background |
| bg-card | #1e1e2e | Card surfaces |
| accent-blue | #89b4fa | Primary accent, links |
| accent-green | #a6e3a1 | Success states |
| accent-red | #f38ba8 | Error states |
| accent-yellow | #f9e2af | Warning/pending |
| accent-purple | #cba6f7 | Secondary accent |
| gradient-primary | blue→purple | Buttons, headers |

## Page Wireframes

### 1. Login Page
```
┌─────────────────────────────────┐
│         [Gradient orbs bg]      │
│    ┌─────────────────────┐      │
│    │   🔺 TechTrack      │      │
│    │   Student/Staff Login│      │
│    │                     │      │
│    │   [Email input    ] │      │
│    │   [Password input ] │      │
│    │                     │      │
│    │   [=== Sign In ===] │      │
│    │                     │      │
│    │   Register link     │      │
│    └─────────────────────┘      │
└─────────────────────────────────┘
```

### 2. Dashboard
```
┌─────────────────────────────────┐
│ [Navbar: Logo | Links | 🔔 | ⏻]│
├─────────────────────────────────┤
│ ┌─ Hero Section ──────────────┐ │
│ │ Welcome, [Name] 👋          │ │
│ │ Platform description        │ │
│ │ [Browse Projects →]         │ │
│ └─────────────────────────────┘ │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │ 12 │ │  4 │ │  3 │ │  2 │    │
│ │Total│ │Ongo│ │Done│ │Reqs│    │
│ └────┘ └────┘ └────┘ └────┘    │
│                                 │
│ ── Platform Features ──         │
│ [Card] [Card] [Card] [Card]     │
│                                 │
│ ── Events & Hackathons ──       │
│ [Event] [Event] [Event]         │
└─────────────────────────────────┘
```

### 3. Project List
```
┌─────────────────────────────────┐
│ [Navbar]                        │
├─────────────────────────────────┤
│ Projects                        │
│ ┌─ Filter Bar ────────────────┐ │
│ │ [🔍 Search] [Dept▼] [Status▼]│ │
│ └─────────────────────────────┘ │
│ ┌─────────┐ ┌─────────┐        │
│ │ [Ongoing]│ │[NotStart]│       │
│ │ Project  │ │ Project  │       │
│ │ Name     │ │ Name     │       │
│ │ Desc...  │ │ Desc...  │       │
│ │ 👥3/5 📂CS│ │ 👥0/4 📂IT│     │
│ └─────────┘ └─────────┘        │
└─────────────────────────────────┘
```

### 4. Project Detail
```
┌─────────────────────────────────┐
│ [Badges: Ongoing | High]        │
│ Project Name                    │
├──────────────────┬──────────────┤
│ Description      │ Project Lead │
│ ──────────       │ [Avatar]Name │
│ Vacancies        │ 🟢 Available │
│ ┌──────────────┐ │              │
│ │Backend Dev   │ │ Team (2/5)   │
│ │[Node][Mongo] │ │ ├─ Member 1  │
│ │[Request Role]│ │ └─ Member 2  │
│ └──────────────┘ │              │
│                  │ Details      │
│ Discussion       │ Dept: CS     │
│ ┌──────────────┐ │ Created: ... │
│ │ Chat messages │ │              │
│ │ [Input] [➤]  │ │              │
│ └──────────────┘ │              │
└──────────────────┴──────────────┘
```

### 5. Student Profile (LinkedIn-Style)
```
┌─────────────────────────────────┐
│ ┌─ Profile Header ─────────────┐│
│ │ [Avatar] Name                 ││
│ │ CS · Year 3                   ││
│ │ ID: CS2024001 · Roll: 21CS101 ││
│ │ Preferred: Full Stack Dev     ││
│ │ Best Fit: Backend Developer   ││
│ └───────────────────────────────┘│
│ ── Languages & Skills ──        │
│ [JS] [Python] [Java] [C++]     │
│                                 │
│ ── Current Projects ──          │
│ [Project card] [Status badge]   │
│                                 │
│ ── Archived Showcase ──         │
│ [Archived project with outcomes]│
│                                 │
│ ── Role Request History ──      │
│ [Request] [approved ✅]         │
│ [Request] [pending ⏳]          │
└─────────────────────────────────┘
```

### 6. Staff Directory
```
┌─────────────────────────────────┐
│ Staff Directory                 │
│ [🔍 Search] [Dept ▼]           │
│ ┌─────────────────┐ ┌──────────┐│
│ │[Avatar] Dr.Name │ │[Avatar]  ││
│ │ CS Department   │ │ Name     ││
│ │ 🟢 Available    │ │ 🟡 Busy  ││
│ │ 12 yrs exp      │ │ 8 yrs   ││
│ │ CS-201, 2nd Fl  │ │ IT-105  ││
│ └─────────────────┘ └──────────┘│
└─────────────────────────────────┘
```

### 7. Notification Bell
```
      🔔 (3)
       │
  ┌────▼────────┐
  │ Notifications│
  │ [Mark all]   │
  │┌────────────┐│
  ││● Role App  ││
  ││ Approved!  ││
  ││ 2h ago     ││
  │├────────────┤│
  ││ New Project││
  ││ E-Waste... ││
  ││ 1d ago     ││
  │└────────────┘│
  └──────────────┘
```

## Responsive Breakpoints
- Desktop: 1400px max-width
- Tablet: Grid collapses to fewer columns
- Mobile (<768px): Single column, compact nav
