# Brightside Dental Clinic — Demo Video Script

Target length: ~3–4 minutes. Screen-record at 1280x800 or larger. Narrate live or record voiceover after — either works with this script.

Login for the demo: `admin@brightsidedental.example` / `brightsideadmin`

---

## 1. Hook (0:00–0:15)

**Show:** The public homepage (`localhost:3000`), scroll slowly from hero to footer.

**Say:**
> "This is a complete booking and clinic management system for dental practices — built from scratch, ready to deploy. Let me show you what it can do."

---

## 2. Public booking flow (0:15–0:45)

**Show:** Click "Book Appointment." Fill the form: pick a branch, pick a dentist, pick a service, pick a date.

**Say:**
> "Patients book directly from the website. Watch this — as soon as I pick a dentist and date, it shows real-time availability."

**Action:** Point out that already-booked slots are grayed out / unselectable. (Try Main Branch + Dr. Ana Reyes on 2026-07-28 at 10:00 — that slot is already taken by the seeded appointment, so it'll show disabled.)

**Say:**
> "That's not just a visual trick — it's enforced at the database level. Two people literally cannot double-book the same slot, even if they submit at the exact same second."

---

## 3. Staff login + dashboard (0:45–1:05)

**Show:** Navigate to `/login`, sign in with the admin credentials. Land on the Dashboard.

**Say:**
> "On the staff side, everything's behind a secure login. The dashboard gives an instant snapshot — patient count, income, expenses, net profit — updated live as the clinic operates."

---

## 4. Patient records (1:05–1:45)

**Show:** Go to Patient's Profile → click into **Santos, Maria**.

**Say:**
> "Every patient has a full record — contact info, allergies, HMO coverage. And here's the treatment history: Maria came in for an Oral Prophylaxis, ₱500, fully paid. That's automatically reflected in the fee, payment, and balance totals up top."

**Show:** Click "View / Print Statement of Account."

**Say:**
> "One click generates a professional, printable Statement of Account — letterhead, treatment breakdown, consent section, even a security watermark against tampering."

---

## 5. The odontogram (1:45–2:15)

**Show:** Go back to Maria's record, scroll to the Odontogram. Click a tooth surface (e.g. tooth 14, buccal).

**Say:**
> "This is the digital dental chart — all 32 permanent teeth plus primary teeth, with per-surface charting just like a real paper chart. Click a surface, pick a condition, done."

**Action:** Pick "Decayed" from the picker, show the segment turn red.

**Say:**
> "Every color-coded, every condition tracked, saved instantly per patient."

---

## 6. Appointments management (2:15–2:40)

**Show:** Go to Client Appointments. Point at Carla Mendoza's PENDING request.

**Say:**
> "Online booking requests land here as pending. Staff can confirm, cancel, or mark a visit completed — the whole lifecycle, in one screen, filterable by branch or dentist."

**Action:** Click "Confirm" — show the status flip to CONFIRMED live.

---

## 7. Reports (2:40–3:00)

**Show:** Go to Reports.

**Say:**
> "Two reports that save real admin time: a recall list — patients who haven't been in for months, so you know exactly who to call back — and an automatic payroll report, calculating each dentist's commission based on their rate and what they've actually collected."

---

## 8. Documents + no-code config (3:00–3:30)

**Show:** Go to Documents → Generate Document (pick a patient, "Medical Certificate," write a line, generate). Click through to view/print it.

**Say:**
> "Medical certificates and prescriptions, generated and printed in seconds — with the same anti-fraud watermark and security code as the billing statements."

**Show:** Go to Configurations.

**Say:**
> "And none of this needs a developer to maintain. Branches, dentists, services, HMO partners — all managed right here by clinic staff."

---

## 9. Closing (3:30–3:45)

**Show:** Back to the homepage or Dashboard, wide shot.

**Say:**
> "Booking, records, billing, charting, reports, documents — one system, ready to run a real clinic today. If you want this for your practice, message me."

---

### Shot list / cuts checklist
- [ ] Homepage scroll
- [ ] Booking form with a disabled/greyed-out slot visible
- [ ] Login screen → Dashboard
- [ ] Maria Santos patient record (fee/paid/balance visible)
- [ ] SOA print preview
- [ ] Odontogram tooth click + condition picker
- [ ] Appointments list with Carla Mendoza PENDING → Confirm click
- [ ] Reports page (both tables visible)
- [ ] Document generation + print preview
- [ ] Configurations page
