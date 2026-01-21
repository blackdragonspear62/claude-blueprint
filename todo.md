# Claude Blueprint Rebranding TODO

## Phase 1: Cleanup & Remove Multi-Agent References

- [x] Remove all non-Claude LLM references (GPT-4, Gemini, Llama, Mistral)
- [x] Remove multi-agent card grid interface (LLMStatusCards)
- [x] Remove inter-agent communication logic display
- [x] Update all "Cognitect" text to "Claude Blueprint"
- [x] Update all "Neuro City" references to "Claude Blueprint"
- [x] Remove "AI Team" language throughout
- [x] Remove role-based agent displays (Architect, Frontend, Backend, etc.)
- [x] Removed unused components: ReasoningPanel, DiscussionMindMap, DebateSummary, etc.

## Phase 2: Branding & Color Scheme

- [x] Apply Claude orange primary color (#CC785C)
- [x] Apply warm cream secondary color (#F4EDE4)
- [x] Apply soft coral accent color (#E89B7E)
- [x] Update background to dark warm
- [x] Update card styling with orange borders and glassmorphism
- [x] Add Claude logo/icon to header
- [x] Update typography (using system fonts)
- [x] Add "Powered by Claude AI" badge in footer

## Phase 3: UI Restructure

- [x] Replace agent grid with large city canvas visualization
- [x] Create building controls panel (Start Building button)
- [x] Add progress bar showing building completion (0-100%)
- [x] Create building phases tracker (Infrastructure, Commercial, Residential, Office, Public)
- [x] Create city stats dashboard (Buildings, Infrastructure, Commercial, Residential, Current Phase)
- [x] Redesign communication logs as "Claude's Thoughts"
- [x] Rename "Generated Code" tab to "Building Blueprint"
- [x] Implemented tabbed interface for Thoughts and Blueprint

## Phase 4: Content & Messaging

- [x] Update header title to "Claude Blueprint"
- [x] Update subtitle to "Autonomous City Designer by Claude AI"
- [x] Update tagline to "Watch Claude Build Your Dream City"
- [x] Rewrite all agent communication as Claude's internal thoughts
- [x] Add Claude commentary narration for building phases
- [x] Update footer with Anthropic attribution
- [x] Remove X and GitHub social icons from header
- [x] Add Settings and Info icons instead
- [x] Add GitHub logo linking to https://github.com/Weezythegods69/claude-blueprint
- [x] Add X (Twitter) logo linking to https://x.com/claudeblueprint69

## Phase 5: Animations & Polish

- [ ] Add smooth transitions (0.3s cubic-bezier)
- [ ] Add fade in/out between building phases
- [ ] Add progress bar smooth fill animation
- [ ] Add building placement pop-in effects
- [ ] Add stats counter increment animations
- [ ] Add auto-scroll to latest Claude thought
- [ ] Add typing effect for new commentary entries
- [ ] Add highlight for active building phase

## Phase 6: Responsive Design

- [ ] Test mobile layout (< 768px) - stacked layout
- [ ] Test desktop layout (> 768px) - side-by-side
- [ ] Ensure touch-friendly controls on mobile
- [ ] Test collapsible tabs on mobile
- [ ] Verify city canvas scales properly
- [ ] Test all animations on different devices

## Phase 7: Final Testing & Deployment

- [ ] Remove all console.log debugging statements
- [ ] Test all interactive elements
- [ ] Verify color contrast for accessibility
- [ ] Test loading states and error handling
- [ ] Optimize asset loading
- [ ] Create checkpoint for deployment
- [ ] Push to GitHub
- [ ] Deploy to production


## Logo Update

- [x] Replace placeholder "C" logo with Claude starburst logo
- [x] Copy logo image to public folder
- [x] Update Home.tsx to use image instead of text

## Browser Tab Branding

- [x] Update browser tab favicon to Claude logo
- [x] Update browser tab title from "Neuro City" to "Claude Blueprint"
- [x] Update all remaining "Neuro City" references in code

## Published Version Title Fix

- [ ] Investigate why published version still shows "Neuro City - AI Team Building Virtual City" in browser tab
- [ ] Check if VITE_APP_TITLE environment variable is overriding index.html title
- [ ] Fix title to show "Claude Blueprint - Autonomous City Designer" on published site

## Social Media Links Update

- [x] Update X (Twitter) link from https://x.com/claudeblueprint69 to https://x.com/claudeblueprint

## GitHub Repository Setup

- [ ] Setup git credentials with new GitHub account (blackdragonspear62)
- [ ] Create new repository: claude-blueprint
- [ ] Push all code with clean commit history
- [ ] Verify repository is accessible
