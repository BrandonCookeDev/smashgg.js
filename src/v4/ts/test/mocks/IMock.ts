export default interface IMock{
	validateSandbox(): void
	mock(): void
	mockQueries(): void
	resetSandbox(): void
}
