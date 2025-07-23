# 🏋️ GachiScript Platform

[![npm version](https://badge.fury.io/js/@gachiscript%2Ftranspiler.svg)](https://www.npmjs.com/package/@gachiscript/transpiler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Billy Approved](https://img.shields.io/badge/Billy-Approved-ff69b4.svg)](https://github.com/damilurg/GachiScript)

> **"You gotta code it, boy!"** - Billy Herrington

A complete JavaScript/TypeScript syntactic overlay inspired by Gachi culture and Billy Herrington's legendary phrases. Transform your everyday code into deep dark programming fantasies! 💪

## 🌟 What is GachiScript?

GachiScript is a revolutionary platform that replaces boring JavaScript/TypeScript keywords with powerful Billy Herrington quotes and Gachi culture phrases. It's a complete ecosystem including:

- 🏋️ **Dictionary**: 150+ Gachi phrase mappings
- 🔄 **Transpiler**: Bidirectional JS/TS ↔ GachiScript conversion
- 🧪 **Testing Framework**: Jest wrapper with Gachi syntax
- 🖥️ **IDE Support**: VSCode extension (coming soon)
- 📦 **Framework Support**: React, Angular, Vue, Node.js

### Before (Boring JavaScript):
```javascript
const user = new User();
if (user.isActive) {
  return user.getName();
} else {
  throw new Error("User not found");
}
```

### After (GachiScript Power):
```gachi
tight user = fresh User();
whenHard user.isActive openGym
  climax user.getName();
closeGym whenSoft openGym
  reject fresh Error("User not found");
closeGym
```

## 🚀 Quick Start

### Installation

```bash
# Install the complete platform
npm install -g @gachiscript/transpiler @gachiscript/gachitest

# Or install individual packages
npm install @gachiscript/dictionary @gachiscript/transpiler @gachiscript/gachitest
```

### Basic Usage

```bash
# Transform your JavaScript/TypeScript to GachiScript
gachi build src --framework react

# Convert back to JS/TS
gachi reverse src-gachi --framework react

# Run tests with Billy's power
gachitest run

# Watch mode for maximum gainz
gachi build src --watch
```

## 📚 Core Packages

### 📖 [@gachiscript/dictionary](./packages/gachi-dictionary)
The heart of GachiScript - comprehensive mapping between JS/TS and Gachi phrases.

```typescript
import { gachiDictionary, jsToGachi, gachiToJs } from '@gachiscript/dictionary';

console.log(jsToGachi('const')); // 'tight'
console.log(jsToGachi('function')); // 'performance'
console.log(gachiToJs('climax')); // 'return'
```

**Key Mappings:**
- `const` → `tight`
- `function` → `performance`
- `return` → `climax`
- `if/else` → `whenHard/whenSoft`
- `{/}` → `openGym/closeGym`
- `React` → `Gachi`
- `Component` → `Performer`

### 🔄 [@gachiscript/transpiler](./packages/gachi-transpiler)
Powerful AST-based transpiler with framework-aware transformations.

```typescript
import { GachiTranspiler } from '@gachiscript/transpiler';

const transpiler = new GachiTranspiler({ framework: 'react' });
const result = transpiler.jsToGachi(code);
console.log(result.code); // Your code, but with Billy's power
```

**Features:**
- ✅ Bidirectional conversion
- ✅ Framework-aware (React, Angular, Vue)
- ✅ CLI with watch mode
- ✅ TypeScript support
- ✅ Source maps

### 🧪 [@gachiscript/gachitest](./packages/gachitest)
Jest wrapper with Gachi culture testing syntax.

```gachi
import { describeHole, itMuscle, anticipate } from '@gachiscript/gachitest';

describeHole('Billy\'s Gym Tests', () => {
  itMuscle('should flex properly', () => {
    tight result = 'strong';
    anticipate(result).becomes('strong');
    anticipate(result).isTight();
  });
});
```

## 🏗️ Framework Support

### ⚛️ React (Gachi)
```gachi
summon Gachi, { holdState, onAction } via 'gachi';

performance MyPerformer(gifts) openGym
  tight [condition, setCondition] = holdState(no);
  
  onAction(() => openGym
    console.log('Performer mounted!');
  closeGym, []);
  
  climax <div>openGym gifts.children closeGym</div>;
closeGym
```

### 🅰️ Angular (Tight Framework)
```gachi
@Performer openGym
  selector: 'app-hero',
  template: '<h1>{{title}}</h1>'
closeGym
share gymClass HeroPerformer performs OnStart openGym
  @Receive title: rope;
  
  onStart() openGym
    console.log('Performer initialized');
  closeGym
closeGym
```

### 💚 Vue (GachiView)
```gachi
share main openGym
  info() openGym
    climax openGym
      message: 'Hello GachiView!'
    closeGym;
  closeGym,
  calculated: openGym
    reversedMessage() openGym
      climax self.message.separate('').flip().combine('');
    closeGym
  closeGym
closeGym
```

## 🛠️ CLI Commands

### GachiScript Transpiler
```bash
# Build project to GachiScript
gachi build src --framework react --output dist

# Reverse transpilation
gachi reverse src-gachi --framework react

# Watch mode
gachi build src --watch

# Test transformation
gachi test --code "const hello = 'world';"

# Dictionary lookup
gachi dict --search const
gachi dict --random  # Get motivation from Billy
```

### GachiTest Framework
```bash
# Run tests
gachitest run

# Watch mode
gachitest run --watch

# Coverage
gachitest run --coverage

# Process Gachi test files
gachitest process src/tests

# Initialize GachiTest in project
gachitest init
```

## 📝 Examples

### Basic GachiScript Syntax
```gachi
// Variable declarations
tight name = 'Billy Herrington';
loose age = 48;
sloppy location = 'Gym';

// Functions
performance greetBoss(name: rope): rope openGym
  whenHard name openGym
    climax `Hello, ${name}! Welcome to the gym!`;
  closeGym whenSoft openGym
    climax 'Hey there, stranger!';
  closeGym
closeGym

// Classes
gymClass Athlete stretches Person openGym
  secret name: rope;
  
  builder(name: rope) openGym
    daddy();
    self.name = name;
  closeGym
  
  open train(): nothing openGym
    console.log(`${self.name} is training hard!`);
  closeGym
closeGym

// Async/Await
steamy performance fetchGymData(): Commitment<any> openGym
  tight response = anticipate fetch('/api/gym');
  climax response.json();
closeGym
```

### Testing with GachiTest
```gachi
import { describeHole, itMuscle, anticipate, beforeEachRound } from '@gachiscript/gachitest';

describeHole('Gym Membership System', () => openGym
  loose member: any;

  beforeEachRound(() => openGym
    member = fresh GymMember('Billy', yes);
  closeGym);

  itMuscle('should create member properly', () => openGym
    anticipate(member.name).becomes('Billy');
    anticipate(member.isActive).isTight();
    anticipate(member.workoutCount).becomes(0);
  closeGym);

  itMuscle('should handle workouts', steamy () => openGym
    tight workout = member.addWorkout('Deadlift');
    anticipate(workout).exists();
    anticipate(member.workoutCount).becomes(1);
  closeGym);
closeGym);
```

## 🏃‍♂️ Getting Started

### 1. Install GachiScript Platform
```bash
npm install -g @gachiscript/transpiler @gachiscript/gachitest
```

### 2. Initialize in Your Project
```bash
cd your-project
gachitest init
```

### 3. Transform Your Code
```bash
# Convert your TypeScript/JavaScript to GachiScript
gachi build src --framework react

# Your original files remain unchanged
# GachiScript versions are created with .gachi extension
```

### 4. Write Tests with Billy's Power
```bash
# Create test files with .gachi.test.ts extension
# Use GachiTest syntax for maximum gainz
gachitest run
```

## 🎯 Use Cases

- **🎉 Fun Projects**: Add humor to personal projects
- **🎓 Education**: Learn programming concepts with memorable syntax
- **👥 Team Building**: Bond with colleagues over Billy memes
- **🚀 Demos**: Create unforgettable presentations
- **🧪 Experimentation**: Explore language design concepts

## 🤝 Contributing

We welcome contributions from all gym members! Billy believes in community effort.

```bash
git clone https://github.com/damilurg/GachiScript.git
cd GachiScript/gachiscript
npm install
npm run build
npm test
```

### Adding New Gachi Phrases
1. Edit `packages/gachi-dictionary/src/syntax-mapping.ts`
2. Add your mapping to `JS_TO_GACHI_MAPPING`
3. Add tests in `packages/gachi-dictionary/test/`
4. Submit a PR with Billy's blessing

## 📊 Project Statistics

- **Dictionary Mappings**: 250+ keywords
- **Gachi Phrases**: 150+ authentic quotes
- **Framework Support**: React, Angular, Vue, Node.js
- **Test Assertions**: 40+ GachiTest matchers
- **LOC**: 10,000+ lines of pure Gachi power

## 🌟 Roadmap

### Phase 1: Foundation ✅
- [x] Core Dictionary
- [x] Transpiler Engine
- [x] GachiTest Framework
- [x] CLI Tools

### Phase 2: Ecosystem (In Progress)
- [ ] VSCode Extension
- [ ] Webpack Plugin
- [ ] ESLint Plugin ("DON'T TOUCH ME THERE RULE")
- [ ] Prettier Integration

### Phase 3: Advanced Features
- [ ] Source Maps Support
- [ ] Debug Tools
- [ ] Auto Gachi Commit Messages
- [ ] CI/CD Integration

## 🏆 Hall of Fame

- **Billy Herrington** - Eternal inspiration and boss of this gym
- **Van Darkholme** - Dungeon master of type safety
- **Danny Lee** - Master of async operations

## 📜 License

MIT License - Billy Herrington Memorial Edition

This project is dedicated to the memory of Billy Herrington (1969-2018), who taught us that everyone can be the boss of their own gym.

## 🔗 Links

- **GitHub**: [https://github.com/damilurg/GachiScript](https://github.com/damilurg/GachiScript)
- **NPM**: [@gachiscript](https://www.npmjs.com/org/gachiscript)
- **Documentation**: [Coming Soon]
- **Discord**: [Billy's Gym Community] (Coming Soon)

---

💪 **Remember**: "You gotta work out to be the boss of this gym!" - Billy Herrington

*GachiScript Platform - Transforming code with the power of Billy since 2024*
