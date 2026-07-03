## Project Setup
```
# Install dependencies
$ npm install
```

## Compile and run the project

```
# development
npm run dev

# production
npm run build
```

Before running on production you must create/modify the environment file following this structure:
```env
# .env.template
VITE_API_URL = "https://url-backend-here"
VITE_WSS-API_URL = "wss://url-backend-here"
```

And... that's all! This is just the front-end. If you want to see the back-end documentation visit this one: 
https://github.com/JJSaavedra52/InfoSyncBackend
