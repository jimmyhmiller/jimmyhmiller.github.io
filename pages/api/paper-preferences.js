// Dev server only — the static export has no API routes. Saves the section explorer's
// "Save choices for review" report into paper-preferences/ in this repo so a
// coding session can read exactly what was chosen. Mirrors
// tools/serve-paper-homepage.py from paper-test.
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const OUTPUT = path.join(process.cwd(), 'paper-preferences');

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

function validate(report) {
  if (!report || typeof report !== 'object' || report.version !== 1) throw new Error('Unsupported preference report');
  if (!Array.isArray(report.sections) || report.sections.length === 0) throw new Error('Expected at least one section');
  for (const section of report.sections) {
    if (typeof section?.id !== 'string' || typeof section.reviewed !== 'boolean' || typeof section.allLocked !== 'boolean') throw new Error('Invalid section');
    if (!Array.isArray(section.properties) || section.properties.length < 1 || section.properties.length > 22) throw new Error('Invalid section properties');
    for (const prop of section.properties) {
      if (typeof prop?.key !== 'string' || typeof prop.label !== 'string' || typeof prop.locked !== 'boolean'
        || !['string', 'number'].includes(typeof prop.value)) throw new Error('Invalid property');
    }
    if (section.allLocked && (!section.reviewed || !section.properties.every((prop) => prop.locked))) throw new Error('Inconsistent locked state');
  }
  if (!report.layout || typeof report.layout !== 'object' || !report.palette || typeof report.palette !== 'object') throw new Error('Missing layout or palette');
  return report;
}

function summary(report) {
  const escape = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
  const complete = report.sections.filter((section) => section.allLocked).length;
  const lines = ['# Paper preferences', '', `Saved: ${escape(report.createdAt ?? '')}`, `Page: ${escape(report.page ?? '')}`, '',
    `${complete} / ${report.sections.length} sections fully locked.`, '',
    'Locked properties are explicit choices. Unlocked or unreviewed values are still exploratory.', ''];
  for (const section of report.sections) {
    lines.push(`## ${escape(section.label ?? section.id)}`, '',
      `Reviewed: ${section.reviewed}. Fully locked: ${section.allLocked}. Variations tried: ${section.rolls ?? 0}.`, '',
      '| Property | Value | Locked |', '|---|---|---|');
    for (const prop of section.properties) lines.push(`| ${escape(prop.label)} | ${escape(prop.value)} | ${prop.locked ? 'yes' : 'no'} |`);
    lines.push('');
  }
  return lines.join('\n');
}

async function atomicWrite(file, text) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.preferences-${randomUUID()}.tmp`);
  await writeFile(temporary, text);
  await rename(temporary, file);
}

export default async function handler(req, res) {
  if (process.env.NODE_ENV !== 'development') { res.status(404).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const origin = req.headers.origin ? new URL(req.headers.origin) : null;
  if (!origin || !['localhost', '127.0.0.1'].includes(origin.hostname)) { res.status(403).send('Use the local dev server to save choices'); return; }
  let report;
  try { report = validate(req.body); } catch (error) { res.status(400).send(error.message); return; }
  const data = `${JSON.stringify(report, null, 2)}\n`;
  await atomicWrite(path.join(OUTPUT, 'history', `${randomUUID()}.json`), data);
  await atomicWrite(path.join(OUTPUT, 'latest.json'), data);
  await atomicWrite(path.join(OUTPUT, 'latest.md'), summary(report));
  res.status(200).json({ saved: true });
}
