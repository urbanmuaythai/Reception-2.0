const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const data = vm.runInNewContext(html.slice(html.indexOf('const GROUP_ORDER ='), html.indexOf('/* ============================ ICONS')) + ';({SECTIONS,WAIVERS})');
const rows = data.SECTIONS.flatMap(section => (section.cards || section.tiles || []).flatMap(card => (card.links || []).map(item => ({section:section.title,card:card.h,label:item.t,url:item.u}))));
const byId = {};
for (const row of rows) {
  const match = row.url.match(/(?:document|spreadsheets|drawings|file)\/d\/([^/?#]+)/);
  if (match) (byId[match[1]] ??= []).push(row);
}
fs.mkdirSync('audit', {recursive:true});
fs.writeFileSync('audit/link-inventory.json', JSON.stringify({rows,byId}, null, 2));
console.log(JSON.stringify(Object.entries(byId).map(([id,items])=>({id,label:items[0].label}))));
