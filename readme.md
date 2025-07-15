--> Standard Expo Go
Remove-Item -Recurse -Force android, node_modules, package-lock.json
Remove-Item -Recurse -Force node_modules

npm install

npx expo run:android

-- metro server cache clear
expo start -c

-- expo doctor
npx expo-doctor

--- stop all
Stop-Process -Name node, Code, java, javaw -Force

---

---

---

---

--- full new build

eas build --profile development --platform android

eas build --profile production --platform android

--- daily build

eas build:dev --platform android --device [YOUR_DEVICE_ID]
eas build:dev --platform android --device RF8R40J4TDH

---

npx expo start --clear
press a

------ list devices

adb devices

------ list LATEST and download

eas build:list --limit 1

cd android && ./gradlew clean && cd ..

eas build:download -p android --output=app.apk

------ install it to device

Android: adb install app.apk

------ start server

expo start --dev-client -> deprecated

npx expo start --dev-client

--- clear all caches -reinstall npm packages and run android

Stop-Process -Name node -Force; Remove-Item -Recurse -Force $env:TEMP\metro-_, $env:LOCALAPPDATA\Temp\metro-_, android\.gradle, android\app\build, node_modules -ErrorAction SilentlyContinue; npm install; npx expo run:android
