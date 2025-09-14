import { mapping } from '../src/mapping.ts';
import type { S5Mapping } from '../src/types/mapping.ts';
/**
 * Analysiert ein S5Mapping-Objekt und gibt die Bit-Belegung für jeden Report in Tabellenform aus.
 * @param {object} mapping Das S5Mapping-Objekt, das analysiert werden soll.
 */
export function generateBitAllocationReport(mapping: S5Mapping) {
  const reports = new Map();

  /**
   * Durchläuft rekursiv das Objekt, um alle Steuerelemente zu finden.
   * @param {any} obj Das aktuell zu prüfende Objekt oder Wert.
   * @param {string} path Der Pfad zum aktuellen Objekt (z.B. "mixer.channelA.gain").
   */
  function traverse(obj: any, path: string) {
    // Ignoriere null/undefined Werte
    if (!obj) {
      return;
    }

    // Prüfen, ob dies ein Steuerelement mit den benötigten Input-Daten ist
    // ("Duck Typing": Wenn es aussieht wie eine Ente und quakt wie eine Ente...)
    if (typeof obj.inReportId === 'number' && typeof obj.inByte === 'number') {
      let { inReportId, inByte, inBit, inLengthBit } = obj;

      // Sonderbehandlung für Objekte ohne Bit/Längen-Angabe (Knob, Fader)
      // Annahme: Dies sind immer 16-Bit-Werte.
      if (typeof inBit !== 'number' || typeof inLengthBit !== 'number') {
        inBit = 0;
        inLengthBit = 16;
      }

      const controlInfo = {
        path,
        data: { inReportId, inByte, inBit, inLengthBit },
      };

      // Füge die Info zur entsprechenden Report-ID-Liste hinzu
      if (!reports.has(inReportId)) {
        reports.set(inReportId, []);
      }
      reports.get(inReportId).push(controlInfo);

      // Wenn das Objekt weitere Unter-Eigenschaften hat (wie bei Encoder/TouchKnob),
      // müssen diese ebenfalls durchlaufen werden.
    }

    if (
      typeof obj.outReportId === 'number' &&
      typeof obj.outByte === 'number'
    ) {
      let { outReportId, outByte, outLengthByte } = obj;

      const controlInfo = {
        path,
        data: { outReportId, outByte, outLengthByte },
      };

      // Füge die Info zur entsprechenden Report-ID-Liste hinzu
      if (!reports.has(outReportId)) {
        reports.set(outReportId, []);
      }
      reports.get(outReportId).push(controlInfo);
    }

    // Rekursiver Abstieg für Objekte und Arrays
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newPath = Array.isArray(obj)
            ? `${path}[${key}]`
            : `${path}.${key}`;
          traverse(obj[key], newPath);
        }
      }
    }
  }

  // Starte die Traversierung mit dem Wurzelobjekt
  traverse(mapping, 's5');

  // Ausgabe der formatierten Tabellen
  console.log(
    '=============== MIDI-Controller Bit-Belegungs-Analyse ==============='
  );

  const sortedReportIds = Array.from(reports.keys()).sort((a, b) => a - b);

  function logTableHeader(reportId: number) {
    console.log(`\n--- REPORT ID: ${reportId} ---`);
    console.log('| Byte | Bit | Length (Bit) | Element |');
    console.log('| ---: | ---: | ---: | :--- |');
  }

  function logControl(byte: number, bit: number, lenBit: number, path: string) {
    const byteStr = String(byte).padStart(4, ' ');
    const bitStr = String(bit).padStart(3, ' ');
    const lenStr = String(lenBit).padStart(5, ' ');
    const pathArr = path.split('.').slice(1);
    if (pathArr[pathArr.length - 1].startsWith('[')) {
      pathArr[pathArr.length - 2] = `**${pathArr[pathArr.length - 2]}`;
      pathArr[pathArr.length - 1] = `${pathArr[pathArr.length - 1]}**`;
    } else pathArr[pathArr.length - 1] = `**${pathArr[pathArr.length - 1]}**`;
    console.log(
      `| ${byteStr} | ${bitStr} | ${lenStr} | ${pathArr.join('.')} |`
    );
  }

  for (const reportId of sortedReportIds) {
    const controls = reports.get(reportId);
    if (controls[0].data.inReportId !== undefined) {
      // sort by byte and bit
      controls.sort((a: any, b: any) => {
        if (a.data.inByte !== b.data.inByte) {
          return a.data.inByte - b.data.inByte;
        }
        return a.data.inBit - b.data.inBit;
      });

      logTableHeader(reportId);

      for (const { path, data } of controls) {
        logControl(data.inByte, data.inBit, data.inLengthBit, path);
      }
    } else {
      // sort by byte
      controls.sort((a: any, b: any) => {
        return a.data.outByte - b.data.outByte;
      });

      logTableHeader(reportId);

      for (const { path, data } of controls) {
        logControl(data.outByte, 0, data.outLengthByte * 8, path);
      }
    }
  }
  console.log(
    '\n========================= Analyse abgeschlossen ========================='
  );
}

generateBitAllocationReport(mapping);
