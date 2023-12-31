export default function getFormattedDate(dateString: string): string {
	const parsedDate = new Date(dateString);

	if (isNaN(parsedDate.getTime())) {
		return "Invalid Date"; // or handle the error appropriately
	}

	return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(parsedDate);
}
