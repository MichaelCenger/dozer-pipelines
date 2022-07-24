//
// Extracts the version number of the project, appends the short version of the current commit sha and stores it in an environment variable
//
import fs from 'fs'
import cp from 'child_process'

const file = process.argv[2]
const projectRoot = process.argv[3]
const revision_pattern = process.argv[4];
const version_pattern = process.argv[5];

const initial_dir = process.cwd();
console.log('Extracting version from:' + file)
if (!fs.existsSync(file)) {
    console.error('The specified file', file, 'does not exist, or is not readable by this process.')
    process.exit(1)
}

process.chdir(projectRoot);
let revision = cp.execSync('git rev-parse --short=10 HEAD').toString().trim();

process.chdir(initial_dir);
let fileContent = fs.readFileSync(file).toString();
console.log('Previous revision: ' + fileContent.match(revision_pattern)[0])
fileContent = fileContent.replace(RegExp(revision_pattern), revision)
console.log('New revision: ' + fileContent.match(revision_pattern)[0])
fs.writeFileSync(file, fileContent)

console.log(`##CI_PROJECT_VERSION=${fileContent.match(version_pattern)[0]}#`);