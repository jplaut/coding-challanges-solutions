const fs = require('fs'),
      path = require('path');

function linesWithNumbers(text, excludeBlankLines) {
  let i = 1;

  return text.trim().split('\n').map(line => (
    (excludeBlankLines && line.length === 0) ? line : `${i++} ${line}`
  )).join('\n')
}

function main() {
  const printLineNumbers = process.argv.some(arg => arg === '-n' || arg === '-b');
  const excludeBlankLines = process.argv.includes('-b');

  fs.fstat(0, (err, stats) => {
    if (err) throw(err);

    if (stats.isFIFO()) {
      // if we're piping text, print piped text
      let stdin = process.openStdin(),
          data = '';
   
      stdin.on('data', chunk => data += chunk)

      stdin.on('end', () => {
        console.log(printLineNumbers ? linesWithNumbers(data, excludeBlankLines) : data);
      });
    } else {
      // if we're given files, read text from each file
      let out = '';

      const filePaths = process.argv.slice(2, process.argv.length).filter(arg => arg !== '-n' && arg !== '-b');
      for (filePath of filePaths) {
        out += fs.readFileSync(path.join(__dirname, filePath)).toString().trim();
      }

      console.log(printLineNumbers ? linesWithNumbers(out, excludeBlankLines) : out);
    }
  });
}

main()
