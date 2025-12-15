# Ink ✍️

**A simple, offline notes app built for quick thoughts, ideas, and personal writing.**

No accounts. No distractions. Just write and save.

---

## 🌟 What is Ink?

Ink is a minimalist React Native notes app built with Expo. It's designed to get out of your way and let you focus on what matters — capturing your thoughts instantly, offline, with zero friction.

Perfect for:
- Quick thoughts and ideas
- Daily journaling
- Meeting notes
- Writing drafts
- Brain dumps

---

## ✨ Features

- **100% Offline** — All notes stored locally on your device
- **Zero Setup** — No sign-ups, no accounts, no cloud sync
- **Fast & Clean** — Dark-mode UI with minimalist design
- **Auto-Save** — Never lose your work
- **Cross-Platform** — Works on iOS, Android, and Web

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed, then:

```bash
npm install -g expo-cli
```

### Installation

1. Clone the repo:
```bash
git clone https://github.com/Ratul345/ink.git
cd ink
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the app:
```bash
npx expo start
```

You can now open the app in:
- **Expo Go** (for quick testing)
- **iOS Simulator** (Mac only)
- **Android Emulator**
- **Web Browser**

---

## 📂 Project Structure

```
ink/
├── app/
│   ├── _layout.tsx          # Root navigation layout
│   ├── index.tsx             # Home screen (notes list)
│   └── note/[id].tsx         # Note editor screen
├── components/
│   └── NoteListItem.tsx      # Individual note preview component
├── utils/
│   └── storage.ts            # AsyncStorage logic for CRUD operations
├── assets/
│   └── images/               # App icons and splash screen
└── app.json                  # Expo configuration
```

---

## 🛠️ Tech Stack

- **React Native** — Cross-platform mobile framework
- **Expo** — Development toolchain and SDK
- **TypeScript** — Type-safe JavaScript
- **AsyncStorage** — Local device storage
- **Expo Router** — File-based navigation
- **Expo Crypto** — UUID generation for notes

---

## 📝 How It Works

1. **Create a note** — Tap the pen icon on the home screen
2. **Write freely** — Add a title and body, everything auto-saves
3. **View your notes** — All saved notes appear on the home screen
4. **Delete when done** — Tap the trash icon to remove a note

All data is stored securely on your device using AsyncStorage. Nothing leaves your phone.

---

## 🎨 Design Philosophy

Ink follows a **minimalist, distraction-free** approach:
- Black background, white text — easy on the eyes
- No unnecessary buttons or features
- Instant app launch — no loading screens
- Auto-save on blur — you never have to think about saving

---

## 🤝 Contributing

This is a personal project, but if you want to fork it, improve it, or build on top of it — go for it! Just give credit where it's due.

---

## 📄 License

MIT License — feel free to use this however you want.

---

---

**Ink** — Because your thoughts deserve a home.