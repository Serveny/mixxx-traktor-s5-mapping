import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const fileName = 'Traktor-Kontrol-S5';

export default defineConfig({
  build: {
    // Deaktiviert die Minifizierung, um den Code lesbar zu halten.
    minify: false,

    // Generiert eine einzelne Ausgabedatei.
    lib: {
      entry: 'src/main.ts', // Passe dies an den Einstiegspunkt deines Projekts an.
      name: 'MixxxTraktorKontrolS5Mapping', // Der globale Variablenname, falls das Skript in einem <script>-Tag verwendet wird.
      fileName,
      formats: ['es'], // 'es' für ES-Module, 'umd' für maximale Kompatibilität.
    },

    // Konfiguration für Terser, den JavaScript-Minifier (obwohl Minify deaktiviert ist).
    // Wir nutzen es hier, um das Verhalten der Kommentar-Entfernung explizit zu steuern.
    terserOptions: {
      compress: false,
      // Deaktiviert das "Mangling", also das Umbenennen von Variablen und Funktionsnamen.
      mangle: false,
      // Stellt sicher, dass alle Kommentare erhalten bleiben.
      format: {
        comments: 'all',
        beautify: true, // Formatiert den Output für bessere Lesbarkeit.
      },
    } as any,
  },
  plugins: [
    // Dieses Plugin extrahiert die TypeScript-Typen und wandelt sie in .d.ts-Dateien um.
    // In Kombination mit den tsconfig-Einstellungen werden die Typen als JSDoc in die JS-Datei geschrieben.
    //dts({
    //insertTypesEntry: true,
    //}),
    viteStaticCopy({
      targets: [
        {
          src: `dist/${fileName}.js`,
          dest: `../attic/mappings/controllers/`,
        },
      ],
    }),
  ],
});
