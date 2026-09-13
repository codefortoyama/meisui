#!/usr/bin/env node
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const inputFile = args[0];

if (!inputFile) {
  console.error('Usage: npm run convert-data -- ./data/meisui.xlsx');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
if (!fs.existsSync(inputPath)) {
  console.error(`入力ファイルが見つかりません: ${inputFile}`);
  process.exit(1);
}

const workbook = XLSX.read(fs.readFileSync(inputPath), {type: 'buffer'});
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const rawData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

if (!rawData || rawData.length < 2) {
  console.warn('ワークシートから有効なデータが見つかりませんでした。');
  process.exit(0);
}

// Toyama Municipalities
const municipalities = [
  '富山市', '高岡市', '魚津市', '氷見市', '滑川市', '黒部市', '砺波市', '小矢部市', '南砺市', '射水市', 
  '舟橋村', '上市町', '立山町', '入善町', '朝日町'
];

// Check if first row is a title
let headerIndex = 0;
if (rawData[0].length === 1 || rawData[0][0]?.includes('一覧')) {
  headerIndex = 1;
}

const headers = rawData[headerIndex];
const rowData = rawData.slice(headerIndex + 1);

const columnNameCandidates = {
  name: ['名称', '名水名', 'スポット名'],
  address: ['所在地', '住所'],
  description: ['説明', '概要', '紹介'],
  notes: ['備考', '注意事項'],
  latitude: ['緯度', 'latitude', 'lat'],
  longitude: ['経度', 'longitude', 'lng', 'lon'],
};

const findColumnIndex = (headers, candidates) => {
  for (let i = 0; i < headers.length; i++) {
    const val = String(headers[i] || '').trim();
    if (candidates.some(c => val.includes(c))) return i;
  }
  return -1;
};

const extractMunicipality = (address) => {
  for (const m of municipalities) {
    if (address.includes(m)) return m;
  }
  return '';
};

const spots = [];
const nameIdx = findColumnIndex(headers, columnNameCandidates.name);
const addressIdx = findColumnIndex(headers, columnNameCandidates.address);
const descIdx = findColumnIndex(headers, columnNameCandidates.description);
const notesIdx = findColumnIndex(headers, columnNameCandidates.notes);
const latIdx = findColumnIndex(headers, columnNameCandidates.latitude);
const lonIdx = findColumnIndex(headers, columnNameCandidates.longitude);

rowData.forEach((row, i) => {
  if (!row || row.length === 0 || !row[nameIdx]) return;

  const name = String(row[nameIdx]).trim();
  const address = String(row[addressIdx] || '').trim();
  const description = String(row[descIdx] || '').trim();
  const notes = String(row[notesIdx] || '').trim();
  const municipality = extractMunicipality(address);
  
  // Try to parse lat/lon if they exist
  let latitude = null;
  let longitude = null;
  if (latIdx !== -1 && row[latIdx]) latitude = Number(row[latIdx]);
  if (lonIdx !== -1 && row[lonIdx]) longitude = Number(row[lonIdx]);

  const id = `spot-${i + 1}`;

  spots.push({
    id,
    name,
    municipality,
    address,
    description,
    latitude: isNaN(latitude) ? null : latitude,
    longitude: isNaN(longitude) ? null : longitude,
    imageUrl: null,
    sourceUrl: null,
    notes: notes || null
  });
});

console.log(`変換件数: ${spots.length}`);
const outputDir = path.resolve('public/data');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive: true});
const outputPath = path.join(outputDir, 'meisui.json');
fs.writeFileSync(outputPath, JSON.stringify(spots, null, 2), 'utf-8');
console.log(`出力先: ${outputPath}`);

const distDir = path.resolve('dist/data');
if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'meisui.json'), JSON.stringify(spots, null, 2), 'utf-8');
    console.log(`出力先(dist): ${path.join(distDir, 'meisui.json')}`);
}
