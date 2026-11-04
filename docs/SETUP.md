# Setup guide

## 1. Firebase project

1. Create a project at https://console.firebase.google.com.
2. Add a **Web app** and copy its config into `js/firebase.js`. The config is not a secret. Security comes from the rules below.
3. Create a **Firestore Database**. Birthdays are stored in the `birthdays` collection with these fields: `name`, `date` (`YYYY-MM-DD`, year `0000` when unknown) and `tag` (`Family`, `Friends` or `Others`).

## 2. Admin login (Google)

1. **Authentication > Sign-in method:** enable **Google**.
2. **Authentication > Settings > Authorized domains:** add your site domain, for example `your-name.github.io`.

## 3. Security rules (important)

Anyone can read the list, but only your Google account can change it. Replace `YOU@gmail.com`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /birthdays/{id} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == 'YOU@gmail.com'
        && request.auth.token.email_verified == true;
    }
  }
}
```

Rules apply to the whole Firebase project. If another app uses the same project, add rules for its collections too, or those apps will stop working.

## 4. GitHub Pages

1. Upload the files to the repository root, keeping the folder structure.
2. **Settings > Pages:** deploy from the `main` branch, root folder.
3. Wait a minute or two, then hard refresh (Ctrl+Shift+R).

## 5. Customize

- Change greeting text in `js/greeting.js`.
- Add or edit tarpaulin designs in `css/tarpaulin.css` and `THEMES` in `js/tarpaulin.js`.
- Bump the `CACHE` name in `sw.js` after big changes to refresh installed copies.
