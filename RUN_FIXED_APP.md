## Run DevScope Locally

1. Open a terminal in this folder.
2. Install dependencies if needed:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

If the app was already running before these fixes, stop it first with `Ctrl+C`, then run `npm run dev` again.

4. Open:

```text
http://localhost:3000
```

Login with `admin / admin123`, or use the bypass button.

To confirm the backend is running, open this in your browser:

```text
http://localhost:3000/api/health
```

It should show a small JSON response with `"status": "ok"`.

The app now works even without Gemini or GitHub tokens. If the live APIs fail, DevScope returns offline recruiter, resume, and candidate analysis instead of getting stuck.
