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
const GROUP_ORDER = ['Start Here','My Shift','Members & Check-In','Clubworx & Waivers','Programs','Sales & Stock','Marketing & Events','Reference & Handover'];
const groups = {'Daily Basics':'My Shift','Reception SOP Library':'Reference & Handover','Check-In & Front Desk':'Members & Check-In','Clubworx Reference':'Clubworx & Waivers','Memberships & Waivers':'Clubworx & Waivers','Member Actions':'Members & Check-In','Programs & Sign-Ups':'Programs','Sales, Stock & Money':'Sales & Stock'};
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
for (const s of SECTIONS) for (const c of s.cards || s.tiles || []) for (const l of c.links) if (!l.u) missing.push({section:s.title,task:l.t});
SECTIONS.push({id:'guides-needed',group:'Reference & Handover',title:'Guides Still Needed',note:'Assign a guide owner during handover',cards:missing.map(x=>({h:x.task,sub:x.section,steps:['Ask the trainer for the current approved procedure or demonstration.','Record the source link, owner and review date when this guide is ready.'],links:[]}))});
SECTIONS.sort((a,b)=>GROUP_ORDER.indexOf(a.group)-GROUP_ORDER.indexOf(b.group));

let out = original.slice(0,dataStart) + ['const GROUP_ORDER = '+JSON.stringify(GROUP_ORDER)+';','const SECTIONS = '+JSON.stringify(SECTIONS,null,2)+';','const WEEK = '+JSON.stringify(WEEK,null,2)+';','const WAIVERS = '+JSON.stringify(WAIVERS,null,2)+';'].join('\n') + '\n' + original.slice(dataEnd);
out = out.replaceAll('Training & Jakob handover','Reception / Front Desk handover').replaceAll('Training & Jakob Handover','Reception / Front Desk Handover').replaceAll('Capture Jakob’s knowledge','Capture reception knowledge').replaceAll('complete with Jakob and the incoming staff member','complete with the outgoing and incoming Front Desk staff').replaceAll('duties Jakob actually owns','duties Reception / Front Desk actually owns').replaceAll('name the person who will help during your shift','identify the Reception / Front Desk support for your shift').replaceAll('Named trainer, escalation contact and backup cover.','Reception / Front Desk training support, escalation route and backup cover.');
out = out.replace('<title>Urban Muaythai — Reception</title>','<title>Urban Muaythai — Reception / Front Desk</title>');
out = out.replace('Front Desk Knowledge Base','Front Desk • Onboarding & Daily Work');
out = out.replace('<h1>RECEP<em>TION</em></h1>','<h1>RECEP<em>TION</em> <span class="version">2.0</span></h1>');
out = out.replace('<p class="tagline"><b>An eye for detail is critical for successful member management.</b> Use this page to find the right process fast, then follow the linked SOP as the source of truth.</p>','<p class="tagline"><b>Know what to do, find the steps, check the result.</b> New starters begin with Start Here. Each shift, use My Shift and open the linked procedure for the task.</p><p class="review-banner">Review draft · 22 October 2026 · Training sequence and handover standards need team review. Member terms, pricing and policy questions must be checked against current approved sources.</p>');
out = out.replace('Search suspensions, waivers, cash sheet, grading…','Search a task: check-in, cancellation, stocktake…');
out = out.replace('<div class="searchmeta" id="searchmeta"></div>','<div class="searchmeta" id="searchmeta" role="status" aria-live="polite"></div>');
out = out.replace('Links open in a new tab. The linked SOP is the source of truth; access remains controlled by Google Drive permissions.','External links open in a new tab. Use the current approved SOP and signed member terms. New training and handover guidance is proposed for team review. This page does not save task completion or member cases.');
out = out.replace('const tag=\'a\';',"const tag=has?'a':'span';");
out = out.replace(`:' role="link" aria-disabled="true"'`, `:' aria-label="Guide needed: '+item.t+'"'`);
out = out.replace("+(has?ARW:'')", "+(has?ARW:'<span class=\"missing-label\">Guide needed</span>')");
out = out.replace('if(c.sub) b+=`<p class="sub">${c.sub}</p>`;', 'if(c.sub) b+=`<p class="sub">${c.sub}</p>`;\n      if(c.steps) b+=`<ol class="steps">${c.steps.map(t=>`<li>${t}</li>`).join(\'\')}</ol>`;\n      if(c.done) b+=`<p class="done"><b>Done when:</b> ${c.done}</p>`;');
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
.review-banner{max-width:820px;margin:20px auto 0;padding:12px 16px;border:1px solid rgba(245,185,33,.3);border-radius:10px;background:rgba(245,185,33,.07);color:#d9c994;font-size:12px;text-align:left}
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
  '22 October 2026 | Urban Muaythai',
  '',
  'Scope: Reviewed the live Reception 2.0 Google Site in Chrome using Urban Muaythai. source/reception-original.html preserves its complete embed source (123 resource rows across 21 sections). index.html is the proposed revised page. The user requested repository-only editing. No repository has been created remotely and nothing has been published or pushed.',
  '',
  'CHANGES PREPARED',
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
const finalItems=SECTIONS.flatMap(s=>(s.cards||s.tiles||[]).flatMap(c=>c.links));
console.log(JSON.stringify({originalLinkRows:originalItems.length,originalMissing:initialMissing,revisedLinkRows:finalItems.length,remainingMissing:missing.length,sections:SECTIONS.length,groups:GROUP_ORDER.length},null,2));
// Check generated JS syntax independently of the browser.
new vm.Script(out.match(/<script>([\s\S]*?)<\/script>/)[1]);
