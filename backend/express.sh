#!/bin/sh
echo "=> Hello from Arghya! Create a new react project"
echo -n "=> This dir(.) or different(folder_name) : "
read folder_name
echo -n "=> Select (js/ts) : "
read file_type

if [ "$folder_name" = "." ]; then
    npm init --yes
else
    mkdir $folder_name
    cd $folder_name
    npm init --yes
fi

echo "=> Installing express, cors, dotenv"
npm install express cors dotenv
mkdir src

tsconfig=$(cat << EOF
{
  "compilerOptions": {
    // "target": "ES6",
    "target": "ES2020",
    // "module": "commonjs",
    "module": "NodeNext",
    "rootDir": "./src",
    // "moduleResolution": "node",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": false,
    "skipLibCheck": true
  },
  "include": ["./src/**/*"]
}
EOF
)

appcode=$(cat << EOF
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Arghya!');
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
EOF
)

tsscripts=$(cat << EOF
"scripts": {
    "build": "npm i && tsc",
    "dev": "nodemon --watch src src/app.ts",
    "start": "node ./dist/app.js"
},
EOF
)

jsscripts=$(cat << EOF
"scripts": {
    "build": "npm i",
    "dev": "nodemon --watch src src/app.js",
    "start": "node ./src/app.js"
},
EOF
)

if [ "$file_type" = "ts" ] || [ "$file_type" = "TS" ]; then
    echo "=> Installing typescript, types"
    npm install -D typescript ts-node-dev @types/express @types/cors
    touch src/app.ts
    echo "$appcode" > src/app.ts
    echo "$tsconfig" > tsconfig.json
else
    touch src/app.js
    echo "$appcode" > src/app.js
fi

# _____________________ Mongoose _____________________
echo -n "=> Do you want to install Mongoose (y/n) : "
read mongo

if [ "$mongo" = "y" ] || [ "$mongo" = "Y" ]; then
    echo "=> Installing Mongoose"
    npm install mongoose
    echo "=> Mongoose installed successfully"
fi

# _____________________ Prisma _____________________
echo -n "=> Do you want to install Prisma (y/n) : "
read prisma

if [ "$prisma" = "y" ] || [ "$prisma" = "Y" ]; then
    echo "=> Installing Prisma"
    npm install prisma
    npx prisma init
    npm install @prisma/client
    echo "=> Prisma installed successfully"
    echo -e "\n\n=> Now add this to your scripts :"
    echo "\"migrate\": \"prisma migrate dev\""
fi

if [ "$file_type" = "ts" ] || [ "$file_type" = "TS" ]; then
    echo -e "Also add this to your scripts :"
    echo "$tsscripts"
else
    echo -e "Also add this to your scripts :"
    echo "$jsscripts"
fi

echo "==> Setup complete <=="