# Urdu screen-recording walkthrough

یہ اسکرپٹ 6–8 منٹ کی HD screen recording کے لیے ہے۔ آواز Roman Urdu یا Urdu میں ریکارڈ کی جا سکتی ہے۔ ہر candidate، recruiter اور CV فرضی رکھیں۔ اصل شخص کا CV استعمال نہ کریں۔

## Opening — 20 seconds

"Assalam-o-alaikum. Yeh Nowshera Digital ka Nowshera Hire OS hai — ek full applicant tracking system. Is mein candidate job apply karta hai, recruiter pipeline manage karta hai, admin jobs aur dashboard dekhta hai, aur AI sirf CV ka summary banati hai. Final decision hamesha insaan karta hai."

## Candidate flow — 90 seconds

"Sab se pehle candidate account create karta hai. Is demo mein pehla workspace account admin hota hai; us ke baad candidate accounts banaye ja sakte hain. Candidate apna PDF CV upload karta hai. Server PDF type aur 2 MB limit dono check karta hai. Candidate ko apply page par clearly bataya jata hai ke AI CV ka summary banayegi, lekin decision human team karegi."

"Open jobs mein title, department, location, job type, closing date aur remaining openings nazar aati hain. Candidate apply karta hai to application Applied stage mein save hoti hai aur application received email event queue hota hai. Same job ke liye dobara active application allowed nahi. Agar candidate withdraw kare to application Withdrawn ho jati hai. Phir naya CV upload karke dobara apply kare to pehli application purane CV ke saath aur nayi application naye CV ke saath rehti hai."

## Recruiter pipeline — 90 seconds

"Recruiter sirf assigned jobs ke applicants dekh sakta hai. Pipeline mein Applied, Shortlisted, Interview, Offer aur final Hired ya Rejected stages hain. Server stage skip aur backwards movement ko block karta hai. Recruiter CV khol sakta hai, private note add kar sakta hai, aur candidate ke liye note ya AI summary expose nahi hoti."

"Shortlisted candidate ke liye recruiter one-hour interview schedule karta hai. Interview past mein nahi ho sakta aur recruiter ke interviews overlap nahi kar sakte. Schedule karte hi application Interview stage mein jati hai aur interview email event queue hota hai. Hired ya Rejected final stages hain aur decision email event sirf ek dafa create hota hai."

## AI summary — 70 seconds

"Application ke waqt exact CV snapshot application ke saath attach hota hai. Agar n8n connected ho to CV text aur job requirements backend se n8n ko jate hain. n8n Gemini se teen parts mangta hai: teen se paanch profile bullets, mentioned aur missing requirements, aur teen interview questions. AI ko score, ranking, hire ya reject advice dene ki ijazat nahi. Age, gender, religion aur marital status summary mein nahi aate. CV ke andar likhi malicious instruction ko bhi instruction nahi maana jata."

"Agar AI fail ho jaye to application aur email phir bhi kaam karte hain. Recruiter ko Summary not available nazar aata hai aur Try again se summary dobara ban sakti hai. Retry par candidate ko duplicate email nahi milti."

## Admin and dashboard — 60 seconds

"Admin jobs ko Draft rakhta hai, requirements aur openings set karta hai, recruiter assign karta hai aur job open ya close karta hai. Last date ke baad ya openings fill hone par job automatically close hoti hai. Dashboard har job ke liye applications aur har stage ke counts dikhata hai, including Withdrawn."

## Security and mobile — 50 seconds

"Security server-side enforce hoti hai. Candidate doosre candidate ka application ya CV nahi khol sakta. Unassigned recruiter summary, notes ya CV access nahi kar sakta. AI key, Resend key aur automation secret browser Network tab mein nahi aate. Frontend sirf protected API calls karta hai. Mobile view mein sidebar compact bottom navigation ban jati hai aur cards responsive rehte hain."

## Closing — 20 seconds

"Is demo mein 14 acceptance checks automated API suite se pass kiye gaye hain: duplicate applications, closed jobs, CV snapshot, stage order, interview clashes, privacy, AI retry, dashboard aur secret-key separation. Nowshera Hire OS ab local D1/R2 persistence aur importable n8n workflow ke saath ready hai."

## On-screen checklist

1. Login screen and privacy disclosure.
2. Candidate upload: valid PDF and rejected Word/large file.
3. Open job and Apply now.
4. My applications with Applied/Withdrawn and CV filename.
5. Recruiter pipeline and one applicant detail.
6. AI summary three parts and disclosure label.
7. Interview schedule and overlap error.
8. Admin jobs, recruiter assignment, dashboard and email log.
9. Network tab showing no AI key.
10. Mobile-width layout and final `All requested ATS API checks passed` terminal output.
