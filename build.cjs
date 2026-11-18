const fs = require('node:fs');
const vm = require('node:vm');
const original = fs.readFileSync('source/reception-original.html', 'utf8');
const dataStart = original.indexOf('const GROUP_ORDER =');
const dataEnd = original.indexOf('/* ============================ ICONS');
const data = vm.runInNewContext(original.slice(dataStart, dataEnd) + '\n({GROUP_ORDER, SECTIONS, WEEK, WAIVERS})');
const { SECTIONS, WEEK, WAIVERS } = data;
const doc = id => `https://docs.google.com/document/d/${id}/edit`;
const link = (t, u, k = 'doc') => ({t, u, k});
const refs = {
  role: doc('1rTsqwmy2PChyDpzZaZaKK8g-rWdBVMu-nmXWB9jfckQ'),
  managerRole: doc('112deEx6c4CkduuL3Lenkf83Yr9mOiv3CjB7LrbGKS_Y'),
  handbook: 'https://drive.google.com/file/d/1LqxKJTXwo81FK6NN88Hvcrtn7y6Vm6k8/view',
  daily: doc('1ZorHWLC28qJ3n7Vqdghr7ZOcyUfOuV-DmhMzp1ZZHsY'),
  weekly: doc('1gMLVWxIvI-NTPSV9ft6JYcomZWzDNZxkPwNIREAuuJU'),
  suspension: doc('1x6H2UdQywhkSA7ZM9N8pQ1qHcTn5CUGTXymA3bBgDjY'),
  cancellation: doc('1T_7qnI8a4NulZQPnivvfQ99NqAtYWPysfxmD2IYpYCY'),
  cancelForm: doc('1F-u27_V9SSFCFPNrSYfNg58GJjdqU6RncR8RNQcHzms'),
  change: doc('1s7aN0DD-yq3GO1bsGBT_FzCEtsnajZv7v3Zr2LM9flo'),
  details: doc('1RplZv1I-gtlPOa77M4EZcHOUAmXNgZTipqk21Uemwns'),
  checks: doc('125qa3jhbxQSFZQpbR_kM0w0uMIPRfm8kEAPOce7tvwA'),
  bulk: doc('1X-KEmpsDMUe5Iz2BZTXGom7wlXWdneujFK1_nBspqTc'),
};
const GROUP_ORDER = ['Role & Daily Checklist','Start Here','My Shift','Check-In & Front Desk','Clubworx Reference','Memberships & Waivers','Member Actions','Programs & Sign-Ups','Sales, Stock & Money','Marketing & Events','Reference & Handover'];
const groups = {'Daily Basics':'My Shift','Reception SOP Library':'Reference & Handover'};
SECTIONS.forEach(s => s.group = groups[s.group] || s.group);
const section = id => SECTIONS.find(s => s.id === id);
const originalItems = SECTIONS.flatMap(s => (s.cards || s.tiles || []).flatMap(c => c.links));
const initialMissing = originalItems.filter(l => !l.u).length;
section('tools').cards[0].links.find(l => l.k === 'mail').u = 'https://mail.google.com/mail/?authuser=getfit%40urbanmuaythai.com';
section('tools').cards[0].sub = 'Use the Urban Muaythai account. Ask your trainer to verify access before your first shift.';
section('your-role').cards[0].links.push(link('Reception weekly checklist', refs.weekly));
section('weekly').title = 'Every Shift';
section('weekly').note = 'Daily duties • open the source checklist for full detail';
WEEK.splice(3, 2);
WEEK[0].d = 'Start & during the shift';
WEEK[2].items.splice(3, 0, 'Reconcile the till and record the result in the weekly cash sheet');
WEEK[3].items[0] = 'Review waivers against the correct member; merge only after confirming it is the same person';

SECTIONS.unshift(
 {id:'job-description',group:'Role & Daily Checklist',title:'Job Description',note:'Audited from the current role document and Front of House handbook',cards:[
  {h:'Purpose of the role',sub:'Front of House is the control point for member experience, operational accuracy and community culture.',steps:['Create a welcoming place where members and guests feel that they belong.','Act as the first point of contact and handle enquiries efficiently and professionally.','Support member relationships, sales, administration, gym presentation and community engagement.','Protect accurate member records and follow the approved process for each membership action.'],done:'Members are welcomed, helped and recorded correctly, and the gym is ready for every session.',links:[link('Source: Front of House job role',refs.role),link('Source: revised Front of House handbook',refs.handbook)]},
  {h:'Reporting and working relationships',steps:['Reports to the Operations Manager.','Works with trainers, reception staff and management to deliver the member experience.','Front desk staff complete assigned procedures and record their work.','The Front of House / Gym Manager owns standards, allocation, checking, coaching and escalation.','Policy, pricing, refunds and matters outside delegated authority go to the approved senior owner.'],done:'Each recurring duty has an owner, and staff know who makes the final decision.',links:[link('Manager oversight source',refs.managerRole)]},
  {h:'Role boundaries',steps:['Use approved systems and current procedures; do not invent policy or promise an uncertain outcome.','Do not keep member cases, passwords or payment details on this page.','Record membership conversations, decisions and follow-up in Clubworx or the approved tracker.','Escalate safeguarding, safety, serious complaints, disputed billing and unclear authority promptly.'],done:'The action is within authority, traceable in the correct record and escalated when required.',links:[link('When you need help','#help','link')]},
 ]},
 {id:'responsibilities-outcomes',group:'Role & Daily Checklist',title:'Responsibilities & Outcomes',note:'What the role owns and what good performance looks like',cards:[
  {h:'Member experience',steps:['Greet members, non-members and guests warmly and by name where possible.','Manage check-in and ensure attendance matches the people training.','Guide new starters, introduce them to a trainer and help them settle into the community.','Answer enquiries accurately and resolve routine issues promptly.','Record complaints, lost property, repairs and important member conversations.'],done:'People feel welcomed and supported; attendance and follow-up are accurate.'},
  {h:'Memberships, records and payments',steps:['Enrol new members and maintain accurate member details.','Review and approve waivers using the correct member, dates and payment setup.','Process authorised upgrades, downgrades, suspensions and cancellations using the linked procedure.','Manage emails, SMS, tasks, calls and financial transactions.','Maintain Clubworx notes and approved spreadsheets so the member timeline is complete.'],done:'The request, signed authority, Clubworx action, payment effect, communication and follow-up agree.',links:[link('Common member requests','#quick-actions','link'),link('Clubworx Analysis','#clubworx-analysis','link')]},
  {h:'Gym operations and presentation',steps:['Open and close the gym correctly.','Keep reception, equipment, member areas and facilities clean and presentable.','Reconcile the till and complete required cash records.','Monitor stock, restock shelves and report low stock or damaged equipment.','Maintain safeguarding, health and safety and incident-reporting standards.'],done:'The gym is safe, clean, stocked and ready; cash and incidents are accounted for.'},
  {h:'Sales, community and promotion',steps:['Promote suitable memberships, equipment, events and campaigns accurately.','Support events, gradings and community activities.','Hold meaningful member conversations and celebrate progress.','Capture approved photos and video and send them through the agreed channel.','Help build member connections and retention, not just complete transactions.'],done:'Sales and promotion are accurate, member-centred and recorded where required.'},
  {h:'Manager leadership and quality control',steps:['Allocate daily and weekly front desk duties.','Observe punctuality, presentation, reliability, service and procedure use.','Review Clubworx Analysis, handovers, open tasks and recurring errors.','Correct authorised errors; coach and retrain staff when a procedure is missed.','Document staff meetings, training and recurring performance issues in the approved location.','Escalate unresolved performance or authority matters to the Operations Manager.'],done:'Front desk work is checked, errors have an owner and staff receive timely coaching.',links:[link('Manager oversight source',refs.managerRole),link('Reception / Front Desk handover','#training','link')]},
  {h:'Current outcome measures — confirm owner and reporting source',steps:['Direct-debit member total and quarterly growth goals.','Attrition below 5% and suspension rate below 10%.','Kickstarter / Newbie rollover at 80% or better.','Equipment sales of $1,000 or more per week.','Social-event attendance target of 10% or better.','Two meaningful member conversations per shift.','Content target: revised handbook says 3 photos and 1 video per shift; the daily checklist uses different wording. Confirm one standard before approval.'],done:'Each approved measure has a definition, system of record, reporting frequency and accountable owner.',links:[link('Source: Front of House job role',refs.role),link('Source: revised Front of House handbook',refs.handbook)]},
 ]},
 {id:'daily-checklist',group:'Role & Daily Checklist',title:'Daily Checklist',note:'On-page working checklist • complete in this order each shift',cards:[
  {h:'1. Prepare for the shift',sub:'Before members arrive',steps:['Be on time or early, in uniform, presentable and ready to help.','Check Slack and the agreed handover location for updates.','Read Clubworx notes, flags, dated tasks and outstanding work.','Check the Urban Muaythai Gmail inbox, SMS and tasks assigned to you.','Turn on lights, open the required windows and roller door, and place the bin outside where applicable.','Start computers, iPads, Clubworx Roll Call, music and other reception equipment.','Check reception, shop, fridge, bathrooms, waiting area and training space; clean, restock or report issues.'],done:'The gym, systems and Front of House are ready before the first member arrives.',links:[link('Original daily checklist',refs.daily),link('Front of House handbook',refs.handbook)]},
  {h:'2. Run member check-in and service',sub:'Before and during every class',steps:['Stand at reception, greet members by name and help with questions.','Confirm every person checks into the correct class; compare the floor count with Clubworx attendance.','Address flags and record why anything cannot be completed.','Ensure members have the correct equipment and process authorised sales through POS.','Onboard new members: tour, introduction, photo, app / check-in setup and required member record.','Have at least two meaningful member conversations during the shift.','Promote current approved events or campaigns and give members a positive send-off.'],done:'Attendance matches the class, flags have outcomes and new members are correctly onboarded.'},
  {h:'3. Complete Clubworx and member administration',steps:['Enter notes for every membership-related conversation on the correct member and date.','Approve waivers using the approved procedure; confirm identity before associating or merging any record.','Check membership start date, upfront payment, first debit date and recurring payment setup.','Apply authorised suspensions, cancellations and membership changes using the linked SOP and send confirmation.','Complete due tasks, SMS replies and relevant inbox actions.','Update the New Member Spreadsheet whenever a member signs up and complete other required daily spreadsheet entries.','Review failed-payment flags and assign or complete the required next action.'],done:'Member records, payments, communication and trackers tell the same complete story.',links:[link('Clubworx Analysis','#clubworx-analysis','link'),link('Member actions','#quick-actions','link')]},
  {h:'4. Complete cash, stock and promotion checks',steps:['Reconcile the till at the beginning and end of the shift using the approved cash-sheet process.','Record each POS sale and review the required wallet / transaction report.','Restock equipment, apparel and the drinks fridge; report low stock.','Keep noticeboards and promotional material current and remove expired items.','Capture approved member, group or trainer content and send it through the agreed channel.'],done:'Cash reconciles, sales are recorded, stock is presentable and promotions are current.'},
  {h:'5. Close and hand over',sub:'Before leaving',steps:['Complete Clubworx Analysis and correct or assign every identified issue.','Confirm emails, SMS, tasks, daily spreadsheets and member follow-ups are complete or handed over.','Vacuum and mop; tidy equipment, reception, waiting and training areas; empty rubbish and manage lost property.','Shut down computers and reception devices, and place iPads and phones on charge.','Turn off music, timer and lights; close windows, roller door and entry points using the approved site procedure.','Record every outstanding item with current status, next action, owner, due time and record location.'],done:'The gym is secure and ready for the next shift, with no invisible outstanding work.',links:[link('Shift handover','#shift-handover','link')]},
  {h:'Confirm before this checklist is approved',sub:'Source conflicts or unclear legacy wording found during this audit',steps:['Confirm whether Slack, Miami inbox and GetFit inbox are all daily manager checks.','Confirm the exact wallet / transaction report referred to by “Check Reports — wallet”.','Confirm whether the Online Portal is still used and what action it requires.','Set one content target: daily checklist says 2–5 photos or videos and one per class; revised handbook says 3 photos and 1 video per shift.','Confirm mirror cleaning: daily checklist says daily; weekly checklist also assigns Wednesday.','Confirm the approved till / daily cash-sheet process and handover record location.','Confirm which tasks belong to Front Desk staff and which require manager approval.'],done:'Each item has an approved answer, owner, source link and review date.',links:[link('Original daily checklist',refs.daily),link('Front of House handbook',refs.handbook)]},
 ]},
 {id:'start-here',group:'Start Here',title:'New to reception? Start here.',note:'A clear path through your first shifts',cards:[
  {h:'1. Get ready with your trainer',sub:'Before handling reception on your own',steps:['Confirm the gym location, shift times, assigned trainer and who covers reception during breaks.','Open Clubworx, Urban Muaythai Gmail and the required trackers with your trainer. Confirm access from your own authorised account.','Walk through opening, check-in, till reconciliation and closing together.'],done:'You can open the required tools and name the person who will help during your shift.',links:[link('Role & responsibilities','#your-role','link'),link('Systems & trackers','#tools','link')]},
  {h:'2. Follow the shift in order',sub:'Start → class check-in → end of shift',steps:['Read Clubworx notes, dated tasks and the previous shift’s outstanding work.','Follow Every Shift and the weekly duties for the day. Use the source procedure for each unfamiliar task.','Finish the audit, record what is complete and hand over anything outstanding with an owner and next action.'],done:'The next staff member can see what happened and what needs attention.',links:[link('Every Shift','#weekly','link'),link('Weekly duties','#weekly-duties','link'),link('Shift handover template','#shift-handover','link')]},
  {h:'3. Learn, practise, then demonstrate',sub:'Proposed training sequence',steps:['Observe your trainer completing a task and explaining the checks.','Practise the same task under supervision using the linked procedure.','Demonstrate the task, verify the result and have your trainer record sign-off in the team’s training record.'],done:'Your trainer has checked the result, including the notes and any member confirmation.',links:[link('Training & Jakob handover','#training','link'),link('Common member requests','#quick-actions','link')]},
 ]},
 {id:'help',group:'Start Here',title:'When you need help',note:'Proposed handover standard • confirm the escalation contact',cards:[
  {h:'Check before changing an account',steps:['Confirm the correct member and read their notes, signed waiver, membership and payment schedule.','If the request, dates, price or payment outcome is unclear, ask the assigned trainer or manager to review it before making the change.','When a guide is missing, record the question and who will resolve it.'],done:'The decision and next action are clear in the member’s Clubworx record.',links:[link('Member requests','#quick-actions','link'),link('Source procedures','#reception-sops','link')]},
  {h:'Use the correct record',steps:['Record membership conversations and follow-ups in Clubworx.','Record new members and cash activity in their existing trackers.','Use this page to find instructions. Keep member cases and actual training sign-offs in the team’s approved records.'],done:'The next staff member can find the conversation and follow-up in the expected system.',links:[link('Contact notes & communication','#communication','link'),link('Systems & trackers','#tools','link')]},
 ]}
);

section('quick-actions').tiles = [
 {h:'SUSPENSIONS',sub:'Check the request, signed waiver, dates and payments before applying the hold.',done:'Dates and affected payments checked; confirmation and contact notes recorded.',links:[link('Process a member suspension',refs.suspension),link('Suspension / cancellation check sheet',refs.checks),link('Bulk member suspensions — supervised task',refs.bulk)]},
 {h:'CANCELLATIONS',sub:'Read the signed agreement and previous notes before confirming the final payment or end date. The source procedure contains conflicting notice-period examples; ask the manager to resolve any uncertainty.',done:'Final payment and membership end date verified; confirmation and contact notes recorded.',links:[link('Cancellation application forms & checks',refs.cancelForm),link('Processing member cancellations — review notice wording',refs.cancellation),link('Suspension / cancellation check sheet',refs.checks)]},
 {h:'UPGRADE / DOWNGRADE',sub:'Follow the documented order. Check the upcoming payment date and signed membership-change waiver.',done:'Old and new membership dates checked; only the intended payment schedule remains.',links:[link('Membership changes / upgrade / downgrade',refs.change)]},
 {h:'MEMBER DETAILS',sub:'Open the correct profile, update the requested details and save. Follow the full SOP for family relationships or payment methods.',done:'Saved contact details or scan tag checked against the member’s request.',links:[link('Update member details & scan tags',refs.details)]},
 {h:'PAYMENT QUESTIONS',sub:'Check the member’s payment status and notes. Ask the trainer or manager to review an uncertain payment outcome.',done:'Outcome or next action recorded against the correct member.',links:[link('Ezidebit payments / direct debits',doc('1gaEQ1NaYoebU0YradhZ2-pIVUD7mUx9W8SUZyDjYWbI')),link('Failed-payment video','','video'),link('Pending-payment video','','video')]},
];
section('quick-actions').note = 'Open the procedure • verify the result • record the outcome';
section('waivers').note = 'Reference only • confirm the current form in Clubworx with your trainer';
const weeklyCards = [
 ['Monday',['Put bins out on the road.','Attend the team meeting.','Call Kickstarter members who have not attended.','Cobweb rotation: Kickstarter area (Week 1) / ring (Week 2).']],
 ['Tuesday',['Review yellow flags: no sessions for two weeks.','Mop the strength and conditioning area.','Cobweb rotation: Carnage wall (Week 1) / bags and pads back wall (Week 2).']],
 ['Wednesday',['Review orange flags: no sessions since Monday.','Retry unanswered Kickstarter calls.','Clean all mirrors.','Empty vacuums every second week; confirm the current rotation date.','Cobweb rotation: mats near reception (Week 1) / mats near weights (Week 2).']],
 ['Thursday',['Complete stocktake and stock order.','Complete the cash sheet; follow the daily checklist for end-of-week reconciliation and email to the Operations Manager.','Call members who have not rolled over.','Cobweb rotation: reception (Week 1) / roller-door wall (Week 2).']],
 ['Friday',['Complete lost-property duties using the daily checklist.','Review rollover flags and enter Kickstarter goals.','Empty the bottle bin every two weeks; confirm the current rotation date.','Cobweb rotation: middle mats (Week 1) / weights area (Week 2).']],
];
SECTIONS.push({id:'weekly-duties',group:'My Shift',title:'Weekly Duties',note:'From the weekly checklist • confirm current rotations with your trainer',cards:weeklyCards.map(([h,steps])=>({h,steps,done:'Tasks completed, or the outstanding task and next action handed over.',links:[link('Weekly source checklist',refs.weekly),link('Daily source checklist',refs.daily)]}))});
SECTIONS.push({id:'shift-handover',group:'My Shift',title:'Hand Over the Shift',note:'Proposed template • record in the team’s agreed handover location',cards:[
 {h:'Outstanding work',steps:['Request / task: what is outstanding?','Current status: what has already been checked or completed?','Next action: what exactly needs to happen?','Owner and due time: who will do it, and when?','Record: where are the Clubworx notes or relevant tracker entry?'],done:'The incoming staff member understands and accepts the next action.',links:[link('Contact notes guidance','#communication','link')]},
 {h:'Before you leave',steps:['Complete Clubworx Analysis and the till reconciliation.','Confirm new-member records, membership dates and first debit dates are correct.','Check that confirmations and membership conversations are recorded.','Leave unresolved requests with a named owner and next action. Follow the closing checklist.'],done:'Closing checks are complete and outstanding work is visible to the next shift.',links:[link('Daily source checklist',refs.daily),link('Clubworx Analysis','#clubworx-analysis','link')]},
]});
SECTIONS.push({id:'training',group:'Reference & Handover',title:'Training & Jakob Handover',note:'Proposed checklist • complete with Jakob and the incoming staff member',cards:[
 {h:'Capture Jakob’s knowledge',steps:['List the duties Jakob actually owns, how often they happen and what triggers them.','Walk through current open work and identify the next action, new owner and due date in the existing records.','Demonstrate common exceptions: failed check-in, missing waiver, conflicting dates, payment question and cancellation during suspension.','Confirm weekly rotations, stock suppliers, current offers, escalation contacts and the handover location.'],done:'Each recurring duty and outstanding case has an agreed new owner.',links:[link('Source procedures','#reception-sops','link'),link('Shift handover template','#shift-handover','link')]},
 {h:'Demonstrate the essentials',steps:['Open and close the gym; reconcile the till.','Read notes, handle an enquiry and complete class attendance.','Review a waiver and new-member record with the trainer.','Demonstrate a suspension, cancellation review and membership change under supervision.','Complete Clubworx Analysis, weekly duties and a shift handover.'],done:'Record Observe → Practise → Demonstrate → Trainer / date in the team’s approved training record.',links:[link('Every Shift','#weekly','link'),link('Member requests','#quick-actions','link')]},
 {h:'Confirm before independent shifts',steps:['Named trainer, escalation contact and backup cover.','Access to required systems and trackers using the Urban Muaythai account where applicable.','Current cancellation notice wording and which source takes precedence.','Mirror-cleaning frequency: daily checklist says daily; weekly checklist lists Wednesday.','Current Week 1 / Week 2 and fortnightly cleaning rotation dates.','Current pricing, program dates, waiver forms and any remaining missing guides.'],done:'A manager or trainer has resolved the open questions and recorded the answers.',links:[link('Daily source checklist',refs.daily),link('Weekly source checklist',refs.weekly),link('Cancellation procedure requiring review',refs.cancellation)]},
]});

// Keep every remaining missing resource visible and searchable in one review queue.
const missing = [];
for (const s of SECTIONS) for (const c of s.cards || s.tiles || []) for (const l of c.links || []) if (!l.u) missing.push({section:s.title,task:l.t});
SECTIONS.push({id:'guides-needed',group:'Reference & Handover',title:'Guides Still Needed',note:'Assign a guide owner during handover',cards:missing.map(x=>({h:x.task,sub:x.section,steps:['Ask the trainer for the current approved procedure or demonstration.','Record the source link, owner and review date when this guide is ready.'],links:[]}))});
SECTIONS.sort((a,b)=>GROUP_ORDER.indexOf(a.group)-GROUP_ORDER.indexOf(b.group));

let out = original.slice(0,dataStart) + ['const GROUP_ORDER = '+JSON.stringify(GROUP_ORDER)+';','const SECTIONS = '+JSON.stringify(SECTIONS,null,2)+';','const WEEK = '+JSON.stringify(WEEK,null,2)+';','const WAIVERS = '+JSON.stringify(WAIVERS,null,2)+';'].join('\n') + '\n' + original.slice(dataEnd);
out = out.replaceAll('Training & Jakob handover','Reception / Front Desk handover').replaceAll('Training & Jakob Handover','Reception / Front Desk Handover').replaceAll('Capture Jakob’s knowledge','Capture reception knowledge').replaceAll('complete with Jakob and the incoming staff member','complete with the outgoing and incoming Front Desk staff').replaceAll('duties Jakob actually owns','duties Reception / Front Desk actually owns').replaceAll('name the person who will help during your shift','identify the Reception / Front Desk support for your shift').replaceAll('Named trainer, escalation contact and backup cover.','Reception / Front Desk training support, escalation route and backup cover.');
out = out.replace('<title>Urban Muaythai — Reception</title>','<title>Urban Muaythai — Reception / Front Desk</title>');
out = out.replace('Front Desk Knowledge Base','Front Desk • Onboarding & Daily Work');
out = out.replace('<h1>RECEP<em>TION</em></h1>','<h1>RECEP<em>TION</em> <span class="version">2.0</span></h1>');
out = out.replace('<p class="tagline"><b>An eye for detail is critical for successful member management.</b> Use this page to find the right process fast, then follow the linked SOP as the source of truth.</p>','<p class="tagline"><b>Know what to do, find the steps, check the result.</b> New starters begin with Role & Daily Checklist, then follow the shift and linked procedures.</p>');
out = out.replace('Search suspensions, waivers, cash sheet, grading…','Search waivers, program sign-ups, cancellations, stocktake…');
out = out.replace('<div class="searchmeta" id="searchmeta"></div>','<div class="searchmeta" id="searchmeta" role="status" aria-live="polite"></div>');
out = out.replace('Links open in a new tab. The linked SOP is the source of truth; access remains controlled by Google Drive permissions.','External links open in a new tab. Use the current approved SOP and signed member terms. New training and handover guidance is proposed for team review. This page does not save task completion or member cases.');
out = out.replace('const tag=\'a\';',"const tag=has?'a':'span';");
out = out.replace(`:' role="link" aria-disabled="true"'`, `:' aria-label="Guide needed: '+item.t+'"'`);
out = out.replace("+(has?ARW:'')", "+(has?ARW:'<span class=\"missing-label\">Guide needed</span>')");
out = out.replace('if(c.sub) b+=`<p class="sub">${c.sub}</p>`;', 'if(c.sub) b+=`<p class="sub">${c.sub}</p>`;\n      if(c.steps) b+=`<ol class="steps">${c.steps.map(t=>`<li>${t}</li>`).join(\'\')}</ol>`;\n      if(c.done) b+=`<p class="done"><b>Done when:</b> ${c.done}</p>`;');
out = out.replace("c.links.map(linkRow).join('')", "(c.links||[]).map(linkRow).join('')");
out = out.replace('`<div class="tile"><div class="cap"><h3>${t.h}</h3></div><div class="body"><div class="links">`','`<div class="tile"><div class="cap"><h3>${t.h}</h3></div><div class="body">${t.sub?`<p class="sub">${t.sub}</p>`:\'\'}${t.done?`<p class="done"><b>Done when:</b> ${t.done}</p>`:\'\'}<div class="links">`');
out = out.replace('const use=w.use?`<p class="use">Student fills out: <a href="${w.u||\'#\'}"${w.u?\' target="_blank" rel="noopener"\':\'\'}>${w.use}</a></p>`:\'\';', 'const use=w.use?`<p class="use">Form name: ${w.u?`<a href="${w.u}" target="_blank" rel="noopener">${w.use}</a>`:`<strong>${w.use}</strong>`}. Confirm the current form in Clubworx.</p>`:\'\';');
// A search must match context, instructions and headings, not only link labels.
const filterStart = out.indexOf('function filter(){');
const filterEnd = out.indexOf('\nfilter();', filterStart);
out = out.slice(0,filterStart) + `function filter(){
  const q=search.value.trim().toLowerCase();
  clearBtn.style.display=q?'block':'none';
  document.querySelector('.kbd').style.display=q?'none':'flex';
  const cards=[...document.querySelectorAll('.card,.tile,.wcard,.day')];
  cards.forEach(c=>{
    const sec=c.closest('.section');
    const context=(sec?.querySelector('.section-head')?.textContent||'').toLowerCase();
    const match=!q || c.textContent.toLowerCase().includes(q) || context.includes(q);
    c.classList.toggle('hide',!match);
  });
  sections.forEach(sec=>{
    const match=cards.some(c=>c.closest('.section')===sec&&!c.classList.contains('hide'));
    sec.classList.toggle('hide',q?!match:sec.dataset.group!==activeGroup);
  });
  document.querySelectorAll('.group-head').forEach(g=>g.classList.toggle('hide',!q||!sections.some(s=>s.dataset.group===g.dataset.group&&!s.classList.contains('hide'))));
  jumpTabs.querySelectorAll('.jump-tab').forEach(t=>{
    const selected=!q&&t.dataset.group===activeGroup;
    t.classList.toggle('on',selected);
    t.setAttribute('aria-pressed',String(selected));
  });
  const visibleCards=cards.filter(c=>!c.classList.contains('hide')&&!c.closest('.section').classList.contains('hide')).length;
  empty.style.display=q&&visibleCards===0?'block':'none';
  const ready=allLinks.filter(l=>l.hasAttribute('href')).length;
  meta.textContent=q?visibleCards+' matching task / guide cards for “'+search.value.trim()+'”':ready+' available links • Search across all tasks and guides. Press / to search.';
}` + out.slice(filterEnd);
const css = `
.hero{padding:42px 0 28px}.version{color:var(--gold);font-size:.5em;vertical-align:middle}
.steps{padding-left:21px;color:var(--muted);font-size:13px;margin:14px 0}.steps li{margin:0 0 9px;padding-left:3px}
.done{font-size:12.5px;padding:11px 12px;border-left:3px solid var(--gold);background:rgba(245,185,33,.05);color:var(--muted);margin:14px 0}.done b{color:var(--gold)}
.tile .sub{font-size:13px;color:var(--muted);margin:12px 0}.tile .body{padding:12px 16px 16px}
.lnk.pending{align-items:flex-start}.lnk.pending::after{content:none}.missing-label{font-size:10px;color:var(--gold);border:1px dashed var(--line-hi);padding:2px 5px;border-radius:4px;flex-shrink:0}
.day.hide{display:none}.cards,.tiles,.waivers{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}.cards{align-items:start}
@media(max-width:520px){.wrap{padding-left:16px;padding-right:16px}.section-head{display:block}.section-head .note{display:block;text-align:left;margin-top:8px}.jump-tab{padding:8px 11px}.lnk{flex-wrap:wrap}.hero{padding-top:30px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
`;
out=out.replace('</style>',css+'\n</style>');
fs.writeFileSync('index.html',out);
fs.writeFileSync('REVIEW.txt',[
  'RECEPTION 2.0 — HANDOVER REVIEW',
  '17 November 2026 | Urban Muaythai',
  '',
  'Scope: Reviewed the live Reception 2.0 Google Site in Chrome using Urban Muaythai. source/reception-original.html preserves its complete embed source (123 resource rows across 21 sections). index.html is the proposed revised page. The user requested repository-only editing. No repository has been created remotely and nothing has been published or pushed.',
  '',
  'CHANGES PREPARED',
  '- Added an on-page Job Description audited from the current Front of House role and revised handbook.',
  '- Added on-page Responsibilities & Outcomes, including manager quality-control responsibilities and outcome measures requiring final owner / reporting confirmation.',
  '- Added an ordered on-page Daily Checklist covering preparation, class check-in, Clubworx and member administration, cash / stock / promotion, closing and handover.',
  '- Preserved source-document links for provenance, while the working instructions are now visible directly on the page.',
  '- Flagged unclear or conflicting daily requirements together instead of silently choosing a policy.',
  '- Start Here: access, training sequence, first-shift path and where to record work.',
  '- Eight navigation groups; daily work is separated from reference and handover.',
  '- Shift handover template with current status, next action, owner, due time and record location.',
  '- Added Monday to Friday duties from the source weekly checklist, including the cleaning rotation.',
  '- Replaced the empty member-action panel with located suspension, cancellation, membership-change and member-detail procedures. Moved payment questions into their own card.',
  '- Added Done when criteria and a proposed Reception / Front Desk handover and trainer demonstration checklist.',
  '- Missing resources are labelled Guide needed and listed together for follow-up. Existing unavailable videos remain unavailable; no replacement videos have been invented.',
  '- Search now covers headings, instructions and card text. Search query text is rendered as text. Waiver form names without URLs are no longer dead # links.',
  '- Gmail opens using the Urban Muaythai account identifier rather than a fixed browser account slot.',
  '',
  'OPEN QUESTIONS FOR THE TEAM',
  '1. Use Reception / Front Desk as the role label, as requested. Confirm the training support, escalation route, backup cover and outgoing staff handover date.',
  '2. Resolve cancellation notice wording. The processing SOP mentions 7 days but contains a 30-day worked example. The older application-form document also refers to 30 days for Teens/Cadets. The draft does not choose a universal notice period; staff must check the signed agreement and ask the manager about conflicting instructions.',
  '3. Confirm current handling for cancellations during suspension and minimum Kickstarter commitments. The local Clubworx analysis file has additional guidance which needs reconciling with the source SOP.',
  '4. Confirm mirror cleaning frequency: daily source says daily; weekly source lists Wednesday.',
  '5. Confirm the current Week 1 / Week 2 cleaning rotation and fortnightly vacuum / bottle-bin dates. The weekly source’s note “done on the 22nd” does not establish a reusable current schedule.',
  '6. Confirm current prices, offers, event dates and waiver names. Existing references, including a 2025 program-date link, have been preserved for review rather than treated as current.',
  '7. Identify the approved place for training sign-off and shift handover. This HTML does not save completion, store member cases, or sync a shared checklist.',
  '8. The original Google Sites embed is preserved in source/reception-original.html. The temporary Sites draft edit was undone and exact code restoration verified; the published Site was unchanged. No standalone Reception repository or matching console code was found among the Urban Muaythai repositories inspected. Assistant links to the Google Site and Guides holds related procedures. This package is prepared as a new local repository pending the GitHub destination.',
  '',
  'REMAINING MISSING RESOURCE ROWS ('+missing.length+')',
  ...missing.map((x,i)=>`${i+1}. ${x.section}: ${x.task}`),
  '',
  'READ SOURCE DOCUMENTS',
  'Front of House job role: '+refs.role,
  'Manager oversight of receptionist role: '+refs.managerRole,
  'Revised Front of House handbook: '+refs.handbook,
  'Daily checklist: '+refs.daily,
  'Weekly checklist: '+refs.weekly,
  'Suspension procedure: '+refs.suspension,
  'Cancellation processing: '+refs.cancellation,
  'Cancellation applications: '+refs.cancelForm,
  'Membership changes: '+refs.change,
  'Member details: '+refs.details,
  '',
  'Located through Drive metadata: suspension/cancellation check sheet and bulk suspension procedure. These links were added by document identity; their complete contents and new-starter permissions still need team verification.',
  'Other pre-existing resource links were preserved; this pass is not an exhaustive access or freshness audit of every linked file.',
  '',
  'To regenerate index.html from the preserved source and proposed changes: node build.cjs',
].join('\n'));
const finalItems=SECTIONS.flatMap(s=>(s.cards||s.tiles||[]).flatMap(c=>c.links||[]));
console.log(JSON.stringify({originalLinkRows:originalItems.length,originalMissing:initialMissing,revisedLinkRows:finalItems.length,remainingMissing:missing.length,sections:SECTIONS.length,groups:GROUP_ORDER.length},null,2));
// Check generated JS syntax independently of the browser.
new vm.Script(out.match(/<script>([\s\S]*?)<\/script>/)[1]);
