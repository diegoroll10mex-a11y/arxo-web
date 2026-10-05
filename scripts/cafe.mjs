// Café del día de ARXO Finance: junta titulares de finanzas y economía de México
// y los guarda en finance/cafe.json. Solo titular, medio, fecha y enlace a la nota original.
import { readFile, writeFile } from 'node:fs/promises';

// Solo medios mexicanos: Google News sin filtro mezcla notas de otros países.
const MEDIOS = ['eleconomista.com.mx', 'elfinanciero.com.mx', 'expansion.mx', 'forbes.com.mx', 'eluniversal.com.mx', 'milenio.com', 'elsoldemexico.com.mx', 'excelsior.com.mx', 'jornada.com.mx', 'bloomberglinea.com'];
const NOMBRES = { 'eleconomista.com.mx': 'El Economista', 'elfinanciero.com.mx': 'El Financiero', 'expansion.mx': 'Expansión', 'forbes.com.mx': 'Forbes México', 'eluniversal.com.mx': 'El Universal', 'milenio.com': 'Milenio', 'elsoldemexico.com.mx': 'El Sol de México', 'excelsior.com.mx': 'Excélsior', 'jornada.com.mx': 'La Jornada', 'bloomberglinea.com': 'Bloomberg Línea' };
const sitios = MEDIOS.map((m) => `site:${m}`).join(' OR ');
const google = (tema) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(`(${tema}) (${sitios}) when:1d`)}&hl=es-419&gl=MX&ceid=MX:es-419`;
const FUENTES = [
  { url: google('finanzas personales OR ahorro OR tarjetas OR crédito OR Afore OR aguinaldo') },
  { url: google('Banxico OR inflación OR "tipo de cambio" OR peso OR Cetes') },
  { url: google('economía México OR SAT OR Profeco OR gasolina') },
];
const SALIDA = 'finance/cafe.json';
const HORAS = 36;
const MAX = 20;
const POR_MEDIO = 4;

const limpiar = (t) =>
  t
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
const campo = (item, tag) => {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? limpiar(m[1]) : '';
};

async function leer({ url, fuente }) {
  const r = await fetch(url, { headers: { 'user-agent': 'ARXO-Finance-cafe/1.0 (+https://diegoroll10mex-a11y.github.io/arxo-web/)' } });
  if (!r.ok) throw new Error(`${r.status}`);
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const medio = fuente || campo(item, 'source');
    let titulo = campo(item, 'title');
    // Google News agrega « - Medio» al final del titular.
    if (medio && titulo.endsWith(` - ${medio}`)) titulo = titulo.slice(0, -(medio.length + 3));
    titulo = titulo.replace(/\s+•\s+[^•]+$/, ''); // «… • Negocios» de algunos medios
    const fecha = new Date(campo(item, 'pubDate'));
    return { titulo, fuente: NOMBRES[medio] ?? medio, url: campo(item, 'link'), fecha: isNaN(fecha) ? null : fecha.toISOString() };
  });
}

const resultados = await Promise.allSettled(FUENTES.map(leer));
resultados.forEach((r, i) => console.log(FUENTES[i].url.slice(0, 70), r.status === 'fulfilled' ? `${r.value.length} notas` : `falló: ${r.reason.message}`));

const limite = Date.now() - HORAS * 3600 * 1000;
const vistos = new Set();
const porMedio = {};
const notas = resultados
  .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
  .filter((n) => n.titulo && /^https:\/\//.test(n.url) && n.fecha && Date.parse(n.fecha) >= limite)
  .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))
  .filter((n) => {
    const clave = n.titulo.toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '').slice(0, 60);
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    porMedio[n.fuente] = (porMedio[n.fuente] ?? 0) + 1;
    return porMedio[n.fuente] <= POR_MEDIO;
  })
  .slice(0, MAX)
  .map((n) => ({ ...n, titulo: n.titulo.slice(0, 200), fuente: n.fuente.slice(0, 60) }));

if (notas.length < 3) {
  console.log(`Solo ${notas.length} notas; se deja el archivo anterior.`);
  process.exit(0);
}
const anterior = await readFile(SALIDA, 'utf8').catch(() => '');
const nuevo = JSON.stringify({ actualizado: new Date().toISOString(), notas }, null, 2) + '\n';
if (anterior && JSON.stringify(JSON.parse(anterior).notas) === JSON.stringify(notas)) {
  console.log('Sin cambios.');
} else {
  await writeFile(SALIDA, nuevo);
  console.log(`Guardadas ${notas.length} notas.`);
}
