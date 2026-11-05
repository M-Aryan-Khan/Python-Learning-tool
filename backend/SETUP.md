# Connecting Python Path to Supabase + Brevo (free)

The site runs in **demo mode** (sample data, e-mail code always `123456`) until you connect it. Everything below is on free plans.

You have already done: Supabase project + `schema.sql`. What is left: the **section update**, **Brevo**, the **Supabase e-mail settings**, and **pasting the keys**.

---

## 1. Update the sections (once, if you already ran the first schema)

Your database was created with KDA sections `XB` and `XC`. The correct list is:

| Campus | Sections |
|---|---|
| KDA | 10-B, 10-C, 9-B, 9-C |
| Maymar | 10-A, 10-B, 9-A, 9-C |

Supabase → **SQL Editor → New query** → paste all of `backend/migrate-sections.sql` → **Run**.
It renames XB→10-B and XC→10-C (students already in them stay attached) and adds the rest. At the bottom it lists the sections so you can check.

(A brand-new project can just run the latest `schema.sql`, which already has these.)

## 1b. Re-run `schema.sql` after every update (safe)

`backend/schema.sql` is written to be re-run: it only creates what is missing and replaces functions/policies. **It does not delete accounts, progress or sections.** Paste the whole file in the SQL Editor and Run. (Export Students CSV first if you want a safety copy.)
The latest version adds **section admins** and **adding students from the portal**.

Optional one-time cleanup of progress that admins created before they were excluded:

```sql
delete from public.progress where user_id in (select id from public.profiles where role <> 'student');
```

### Who can do what
| Role | Sees | Can add / edit learners and set passwords |
|---|---|---|
| Super admin | everyone | everyone; also roles, sections, assignments |
| Coordinator / Campus admin | both / one campus | only in sections the super admin assigns them |
| Section admin | only their assigned sections | those sections |

Assign sections in portal → **Admins → Change**. Admin-created accounts need no e-mail code: the learner signs in with the e-mail and password you set.
Note: `admin_create_student` writes straight into Supabase's auth tables. It was syntax-checked but test it once with a dummy student; if Supabase changes its internal auth schema it may need adjusting.

## 2. Brevo: get an SMTP key (10 minutes)

1. Create a free account at <https://www.brevo.com> and finish the sign-up checks. The free plan sends **300 e-mails a day**.
2. **Add a sender** (the address the codes come "from"): Brevo → top-right menu → **Senders, domains & dedicated IPs → Senders → Add a sender**.
   Use a real mailbox you can open (name: `Python Path`). Brevo e-mails you a code to verify it.
   - *Deliverability tip:* codes sent "from" a free Gmail address often land in **spam** because Gmail blocks other servers from sending as it. It works, but tell students to check Spam.
     The reliable fix is to use an address on a domain you own (for example `noreply@yourdomain.com`) and authenticate that domain in Brevo (**Domains** tab: add the two DNS records Brevo shows). Optional, but worth doing before the whole school signs up.
3. Get the SMTP details: **SMTP & API → SMTP tab**.
   - **SMTP server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** shown on that page (looks like `a1b2c3@smtp-brevo.com`)
   - Press **Generate a new SMTP key**, name it `supabase`, and **copy the key now** (it is shown once).

## 3. Supabase: use Brevo to send e-mail

1. Supabase → **Authentication → Emails → SMTP Settings** (in some versions: **Project Settings → Authentication → SMTP**).
2. Turn on **Enable custom SMTP** and fill in:
   - **Sender email:** the sender you verified in step 2
   - **Sender name:** `Python Path`
   - **Host:** `smtp-relay.brevo.com`
   - **Port number:** `587`
   - **Username:** your Brevo SMTP **Login**
   - **Password:** the **SMTP key**
3. **Save**.
4. **Authentication → Rate Limits → "Rate limit for sending emails"**: raise it to about **100 per hour** (default for custom SMTP is 30, which a class signing up together will exceed). Brevo's own daily limit is 300.
5. **Authentication → Providers → Email**: **Confirm email = ON**, **Minimum password length = 8**, save.

## 4. Supabase: make the e-mails contain the 6-digit code

By default Supabase e-mails a *link*. We use a *code*, so edit two templates:
**Authentication → Emails → Templates**.

**Confirm sign up** → Subject: `Your Python Path code` → Message body (replace everything):

```html
<h2>Welcome to Python Path</h2>
<p>Your confirmation code is:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:16px 0">{{ .Token }}</p>
<p>Type it into the website to finish creating your account. The code works for one hour.</p>
<p style="color:#777;font-size:13px">If you did not sign up, you can ignore this email.</p>
```

**Reset password** → Subject: `Your Python Path password code` → Message body:

```html
<h2>Reset your password</h2>
<p>Your reset code is:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:16px 0">{{ .Token }}</p>
<p>Type it into the website with your new password. The code works for one hour.</p>
<p style="color:#777;font-size:13px">If you did not ask for this, you can ignore this email.</p>
```

Save each template.

## 5. Connect the website

1. Supabase → **Project Settings → API**: copy the **Project URL** and the **anon public** key.
2. Open `js/config.js`:

```js
window.PP_CONFIG = {
  supabaseUrl: 'https://xxxxxxxx.supabase.co',
  supabaseKey: 'eyJ...anon key...',
  school: 'Beacon Light Academy',
  emailCodes: true,     // must match "Confirm email" = ON in Supabase
};
```

3. Commit and push. Vercel redeploys. Press **Ctrl+F5** once on the live site.

**Is the URL and anon key enough?** They are the *last* piece, not the only one. For everything to work you need all of these:

- [x] Supabase project + `schema.sql` run (you did this)
- [ ] `migrate-sections.sql` run (step 1)
- [ ] Brevo SMTP connected in Supabase (steps 2–3)
- [ ] **Confirm email = ON** and **min password 8** (step 3.5)
- [ ] The two e-mail templates contain `{{ .Token }}` (step 4)
- [ ] URL + anon key in `js/config.js`, **pushed** to GitHub, `emailCodes: true` (step 5)
- [ ] Your own account made **super admin** (step 6)

Never paste the `service_role` key anywhere in the website.

## 6. Make yourself the super admin

1. On the live site press **Sign in → Create an account**, answer **No** to the school question, and confirm the e-mail code.
2. Supabase **SQL Editor**, run (use your e-mail):

```sql
update public.profiles set role = 'super_admin' where email = 'you@example.com';
```

3. Refresh the site: your avatar menu now shows **Admin portal**.

## 7. Test before real students

1. Sign up a test student (school = Yes, KDA, 10-B). Check the code e-mail arrives (look in Spam) and the code works.
2. Try "Forgot your password?" on that account: a code arrives, you set a new password.
3. In the admin portal the student should appear as **Unconfirmed**. Open them and set **Confirmed**.
4. Make a second test account a *Campus admin (Maymar)* and check it does **not** see the KDA student.
5. Check a student account cannot open `#/admin`.

## Day-to-day

- **Students must use a password of at least 8 characters** (the sign-up form shows this, and Supabase enforces it).
- **Forgot password:** students use *Forgot your password?* and get a code by e-mail. If their e-mail does not work, open them in the portal → **Set a new password** and give them the temporary one.
- **New sections / admins:** portal → **Sections** and **Admins**.

## Free plan: things to know

- **Pausing.** A free Supabase project pauses after about **7 days with no activity** (wakes on the next visit in about a minute).
  Create a free monitor at <https://cron-job.org> or <https://uptimerobot.com> that requests daily
  `https://YOUR-PROJECT.supabase.co/rest/v1/campuses?select=code` with the header `apikey: YOUR-ANON-KEY`.
- **Brevo limit:** 300 e-mails a day. A class of 60 signing up uses about 60. If you ever hit the limit, codes simply wait until tomorrow.
- **Backups:** none on the free plan. Use **Students → Export CSV** now and then.
- **Privacy:** you are storing children's names and GR numbers. Tell the school and keep the super admin password strong.
