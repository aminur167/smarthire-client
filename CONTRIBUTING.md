# Contributing to SmartHire Client

Thank you for your interest in contributing to **SmartHire Client**! We welcome contributions to make our applicant tracking system modern, accessible, and high-performing.

---

## 📋 Code of Conduct

All contributors are expected to uphold the standards described in our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🛠️ Development Workflow

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Fork & Setup
```bash
git clone https://github.com/aminur167/smarthire-client.git
cd smarthire-client
npm install
npm run dev
```

### 3. Guidelines
- Use idiomatic React with functional components and React hooks.
- Follow Tailwind CSS utility patterns; extract common styles via Tailwind components layer if needed.
- Ensure proper accessibility (`aria-labels`, focus rings, keyboard navigability).
- Keep component bundles lean and tree-shake Lucide icon imports.

### 4. Commits & Pull Requests
- Use conventional commits format: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`.
- Create a PR referencing any relevant issues using our [PR Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## 📄 License
By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
