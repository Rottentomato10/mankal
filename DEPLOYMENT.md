# מדריך העלאה לאוויר - מנכ"לים

## מה זו האפליקציה?

**מנכ"לים** היא **PWA** (Progressive Web App) - אפליקציית ווב שניתן להתקין על הטלפון.
- עובדת בדפדפן כמו אתר רגיל
- ניתן להוסיף לmHomescreen ולהשתמש כמו אפליקציה
- לא צריך חנות אפליקציות (App Store / Play Store)

---

## שלב 1: יצירת חשבון Google Cloud (להתחברות)

1. היכנס ל-[Google Cloud Console](https://console.cloud.google.com)
2. צור פרויקט חדש (או בחר קיים)
3. לך ל-**APIs & Services > Credentials**
4. לחץ **Create Credentials > OAuth 2.0 Client ID**
5. בחר **Web application**
6. הוסף Authorized redirect URIs:
   ```
   https://YOUR-APP-NAME.vercel.app/api/auth/callback/google
   ```
7. העתק את:
   - **Client ID** (נראה כמו: `xxx.apps.googleusercontent.com`)
   - **Client Secret** (נראה כמו: `GOCSPX-xxx`)

---

## שלב 2: יצירת מסד נתונים PostgreSQL

### אפשרות א: Vercel Postgres (מומלץ - חינמי)
1. אחרי שתעלה ל-Vercel, לך ל-**Storage > Create Database > Postgres**
2. ה-DATABASE_URL יתווסף אוטומטית

### אפשרות ב: Neon (חינמי)
1. צור חשבון ב-[neon.tech](https://neon.tech)
2. צור database חדש
3. העתק את ה-connection string

### אפשרות ג: Supabase (חינמי)
1. צור חשבון ב-[supabase.com](https://supabase.com)
2. צור פרויקט חדש
3. לך ל-**Settings > Database** והעתק את ה-connection string

---

## שלב 3: העלאה ל-Vercel

### אפשרות א: דרך GitHub (מומלץ)

1. העלה את הקוד ל-GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/mankal.git
   git push -u origin main
   ```

2. היכנס ל-[vercel.com](https://vercel.com) והתחבר עם GitHub

3. לחץ **Add New > Project**

4. בחר את ה-repository

5. Vercel יזהה אוטומטית שזה Next.js

6. לחץ **Deploy**

### אפשרות ב: דרך CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## שלב 4: הגדרת Environment Variables

ב-Vercel, לך ל-**Settings > Environment Variables** והוסף:

| משתנה | תיאור | דוגמה |
|-------|-------|-------|
| `DATABASE_URL` | כתובת מסד הנתונים | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | מפתח להצפנת sessions | צור עם: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | מ-Google Cloud | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | מ-Google Cloud | `GOCSPX-xxx` |
| `NEXTAUTH_URL` | כתובת האפליקציה | `https://your-app.vercel.app` |

---

## שלב 5: אתחול מסד הנתונים

אחרי ה-deploy הראשון, הרץ:

```bash
# התקן Vercel CLI
npm i -g vercel

# משוך את המשתנים
vercel env pull .env.production

# צור את הטבלאות
npx prisma db push
```

---

## שלב 6: עדכון Google OAuth

חזור ל-Google Cloud Console והוסף את הכתובת הסופית:
```
https://YOUR-FINAL-URL.vercel.app/api/auth/callback/google
```

---

## בדיקה סופית

1. פתח את האפליקציה בדפדפן
2. נסה להתחבר עם Google
3. צור הוצאה חדשה
4. בדוק שהנתונים נשמרים (צא וחזור)

---

## דומיין מותאם (אופציונלי)

1. ב-Vercel, לך ל-**Settings > Domains**
2. הוסף את הדומיין שלך
3. עדכן את `NEXTAUTH_URL`
4. עדכן את Google OAuth redirect URIs

---

## פתרון בעיות

### "Invalid redirect_uri"
- וודא שהכתובת ב-Google Cloud Console מדויקת (כולל https)

### שגיאת database
- בדוק שה-DATABASE_URL כולל `?sslmode=require`
- וודא שהרצת `npx prisma db push`

### Google לא עובד
- וודא ש-GOOGLE_CLIENT_ID ו-GOOGLE_CLIENT_SECRET מוגדרים
- בדוק שה-redirect URI נכון

---

## עלויות

| שירות | חינמי | תשלום |
|-------|-------|-------|
| Vercel Hosting | כן (עד 100GB bandwidth) | $20/חודש |
| Vercel Postgres | כן (256MB) | $20/חודש |
| Neon Postgres | כן (512MB) | $19/חודש |
| Google OAuth | כן | - |

**לסיכום: ניתן להריץ את האפליקציה בחינם לחלוטין.**

---

## קישורים שימושיים

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)
- [Neon Database](https://neon.tech)
- [Prisma Documentation](https://www.prisma.io/docs)
