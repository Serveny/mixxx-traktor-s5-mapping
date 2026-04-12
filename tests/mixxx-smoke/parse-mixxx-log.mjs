export function parseMixxxOutput(output) {
	const lines = output.split(/\r?\n/).filter(Boolean);
	const problems = lines.filter((line) => /warning|error|exception/i.test(line));
	return {
		lines,
		problems,
		status: problems.length ? 'warn' : 'pass',
	};
}
