import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Liberation Sans is metric-compatible with Arial/Helvetica and includes
// the Unicode arrow (→) and en-dash glyphs that built-in Helvetica lacks.
// Font src is resolved relative to BASE_URL so it works both in dev and
// when deployed to a GitHub Pages subpath.
const FONT_BASE =
  // Set FONT_BASE_OVERRIDE in node preview scripts (file:// URL or absolute path).
  // In the browser, fall back to Vite's BASE_URL.
  (typeof process !== 'undefined' && process.env && process.env.FONT_BASE_OVERRIDE) ||
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.BASE_URL : '/');

Font.register({
  family: 'LiberationSans',
  fonts: [
    { src: `${FONT_BASE}fonts/LiberationSans-Regular.ttf` },
    { src: `${FONT_BASE}fonts/LiberationSans-Bold.ttf`, fontWeight: 'bold' },
  ],
});

// Landscape A4: 842 x 595 pt. Two identical columns 288pt wide, pushed to the
// outer margins with the gap centred so the sheet can be cut down the middle.
// IMPORTANT: lineHeight is set ONLY on the page. @react-pdf inflates the line
// pitch when lineHeight is also applied to a <Text> that wraps nested <Text>
// spans (e.g. a bold label + value), so per-line lineHeight is deliberately
// avoided to keep the tight 14.5pt pitch that matches the reference.
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 51.6,
    paddingBottom: 36,
    paddingHorizontal: 43.7,
    fontFamily: 'LiberationSans',
    fontSize: 10,
    color: '#000',
    lineHeight: 1.45,
  },
  half: {
    width: 288,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4.6,
  },
  line: {},
  bold: {
    fontWeight: 'bold',
  },
  // Section rule: a thin black bottom border. The wrapping margins create the
  // inter-section spacing seen in the reference (~one blank line each side).
  sectionRule: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#000',
    marginTop: 7,
    marginBottom: 7,
  },
  // The reference leaves a larger gap (an extra blank line) after the header
  // block, before the first rule.
  headerRule: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#000',
    marginTop: 13,
    marginBottom: 13.3,
  },
  // Blank spacer between Praise & Worship and Welcome & Announcements — the
  // reference has a gap here but no rule.
  sectionGap: {
    marginTop: 14.5,
  },
});

function songLine({ number, title, key, modulation }) {
  // Join only non-empty parts with " – " so empty pieces don't produce stray dashes.
  const parts = [];
  if (number != null && title) parts.push(`${number} – ${title}`);
  else if (number != null) parts.push(String(number));
  else if (title) parts.push(title);
  if (key) parts.push(key);
  let line = parts.join(' – ');
  if (modulation) line += ` → ${modulation}`;
  return line;
}

function kidsSongLine(kids) {
  // Kids song never shows a number; always "Kids Song – {title} – {key}"
  const titlePart = kids.title || '';
  const keyPart = kids.key ? ` – ${kids.key}` : '';
  return `– ${titlePart}${keyPart}`;
}

function HalfContent({ state }) {
  const { date, people, classes, praiseWorship, kidsSong, hymns } = state;
  return (
    <View>
      <Text style={styles.title}>Order of Service for {date.day} {date.month}</Text>

      <Text style={styles.line}>
        <Text style={styles.bold}>AV: </Text>{people.av}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Pianist: </Text>{people.pianist}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Song Team: </Text>{people.songTeam}
      </Text>

      <View style={styles.headerRule} />

      <Text style={[styles.line, styles.bold]}>Welcome/Mission Spotlight/Offering/Prayer</Text>
      <Text style={[styles.line, styles.bold]}>Divide for classes:</Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Front of the Church Lesson: </Text>{classes.frontOfChurch}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Back of the Church Lesson: </Text>{classes.backOfChurch}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Seeker’s Lesson in the Hall: </Text>{classes.seekersHall}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>3 Angels Class: </Text>{classes.threeAngels}
      </Text>

      <View style={styles.sectionRule} />

      <Text style={[styles.line, styles.bold]}>Praise &amp; Worship:</Text>
      {praiseWorship.map((s) => (
        <Text key={s.id} style={styles.line}>{songLine(s)}</Text>
      ))}
      <Text style={styles.line}>
        <Text style={styles.bold}>Kids Song </Text>{kidsSongLine(kidsSong)}
      </Text>

      <View style={styles.sectionGap} />

      <Text style={[styles.line, styles.bold]}>Welcome &amp; Announcements</Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Invocational: </Text>{songLine(hymns.invocational)}
      </Text>
      <Text style={[styles.line, styles.bold]}>Prayer</Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Hymn: </Text>{songLine(hymns.postOffering)}
      </Text>
      <Text style={[styles.line, styles.bold]}>Main offering</Text>
      <Text style={[styles.line, styles.bold]}>Children’s Story</Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Hymn: </Text>{songLine(hymns.beforeSermon)}
      </Text>
      <Text style={[styles.line, styles.bold]}>Sermon</Text>
      <Text style={styles.line}>
        <Text style={styles.bold}>Hymn: </Text>{songLine(hymns.closing)}
      </Text>
      <Text style={[styles.line, styles.bold]}>Benediction</Text>
    </View>
  );
}

export default function OrderOfServicePDF({ state }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.half}><HalfContent state={state} /></View>
        <View style={styles.half}><HalfContent state={state} /></View>
      </Page>
    </Document>
  );
}
