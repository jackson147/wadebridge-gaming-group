import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// NOTE: You would typically import the MinIO client library here:
// import * as Minio from 'minio';

// --- Conditional Implementation Based on Environment ---

/**
 * PRODUCTION Implementation: Actual MinIO Upload Logic.
 * This function will only be executed when NODE_ENV is 'production'.
 */
const uploadFileToMinIO_Prod = async (fileName: string, base64Data: string) => {
	console.log(`[MinIO PROD] Attempting to save file: ${fileName}`);

	// 1. MinIO CLIENT INITIALIZATION (Example configuration)
	/*
	const minioClient = new Minio.Client({
		endPoint: process.env.MINIO_ENDPOINT!, // Must be defined in .env
		port: parseInt(process.env.MINIO_PORT || '9000'),
		useSSL: process.env.MINIO_USE_SSL === 'true',
		accessKey: process.env.MINIO_ACCESS_KEY!,
		secretKey: process.env.MINIO_SECRET_KEY!,
	});
    const bucketName = 'your-photo-bucket';
	*/

	// 2. Decode Base64 string to Buffer
	// const fileBuffer = Buffer.from(base64Data, 'base64');
	// const fileMimeType = // ... extract mime type if needed

	// 3. MinIO Call
	/*
	await minioClient.putObject(bucketName, fileName, fileBuffer, {
		'Content-Type': fileMimeType
	});
	*/

	// -----------------------------------------------------
	// Replace the following mock with your actual MinIO connection and upload:
	throw new Error("MinIO connection is not fully implemented in the production path yet!");
};

/**
 * DEVELOPMENT Implementation: Mock/Placeholder Logic.
 * This function will be executed when NODE_ENV is NOT 'production'.
 */
const uploadFileToMinIO_Dev = async (fileName: string, base64Data: string) => {
	console.log(`[MinIO DEV MOCK] Simulating file save for: ${fileName}`);
	
	// Simulate the decode and upload delay without connecting to MinIO
	// This ensures the client-side logic (Base64 conversion, loading state) is still fully tested.
	const simulatedBufferLength = base64Data.length * 0.75; // Approx byte size
	console.log(`[DEV MOCK] Simulated File Size (Base64): ${simulatedBufferLength.toFixed(2)} bytes`);
	
	// Simulate a successful upload delay (1.5 seconds)
	await new Promise(resolve => setTimeout(resolve, 1500));
	
	console.log(`[MinIO DEV MOCK] Successfully mocked upload for: ${fileName}`);
};


// --- Determine which function to use ---
const isProduction = process.env.NODE_ENV === 'production';
const uploadFileToMinIO = isProduction ? uploadFileToMinIO_Prod : uploadFileToMinIO_Dev;
console.log(`[UPLOAD ROUTER] Running in ${isProduction ? 'PRODUCTION (Real MinIO)' : 'DEVELOPMENT (Mock MinIO)'} mode.`);


export const uploadRouter = createTRPCRouter({
	uploadPhoto: publicProcedure
		.input(z.object({
			fileName: z.string().min(1, "File name is required"),
			// The file content is sent as a Base64 encoded string
			base64Data: z.string().min(1, "File data is required"),
			mimeType: z.string().startsWith("image/", "Must be an image MIME type"),
		}))
		.mutation(async ({ input }) => {
			const { fileName, base64Data } = input;

			// Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
			const base64Content = base64Data.split(',')[1] ?? base64Data;

			try {
				await uploadFileToMinIO(fileName, base64Content);

				return {
					success: true,
					message: `Photo "${fileName}" successfully uploaded!`,
					// Use a mock URL in dev, or a dynamically generated MinIO URL in prod
					url: isProduction 
						? `https://your-minio-cluster/my-bucket/${fileName}` 
						: `mock-dev-url/my-bucket/${fileName}`
				};
			} catch (error) {
				console.error("Upload Error:", error);
				// In a real app, handle specific errors gracefully
				throw new Error("Failed to process and upload file to storage service. Check server logs.");
			}
		}),
});
