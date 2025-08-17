-- new build

npx expo run:android

-- clear cahce and start again

npx expo start --clear
press a

------ some commands

adb devices

Android: adb install app.apk

--- clear all caches -reinstall npm packages and run android

Stop-Process -Name node -Force; Remove-Item -Recurse -Force $env:TEMP\metro-_, $env:LOCALAPPDATA\Temp\metro-_, android\.gradle, android\app\build, node_modules -ErrorAction SilentlyContinue; npm install; npx expo run:android
