export const blobStringToBlobObject = (blobString: string) => {
	const blobData = Buffer.from(blobString.split(",")[1], "base64");
	return new Blob([blobData], { type: "image/png" });
};
