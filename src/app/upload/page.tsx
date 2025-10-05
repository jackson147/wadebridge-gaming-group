"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Geist } from "next/font/google"; // Assuming Geist is defined in layout.tsx

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

/**
 * Converts a File object into a Base64 data URL string.
 * @param file The File object to convert.
 * @returns A Promise that resolves to the Base64 data URL string.
 */
const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = error => reject(error);
	});
};

export default function UploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// tRPC mutation hook
	const uploadMutation = api.upload.uploadPhoto.useMutation({
		onSuccess: (data) => {
			setUploadStatus(`Success! ${data.message}`);
			setFile(null); // Clear the file input
			setPreviewUrl(null); // Clear preview
			// Optionally log the MinIO mock URL
			console.log("Mock MinIO URL:", data.url); 
		},
		onError: (error) => {
			setUploadStatus(`Error: ${error.message}`);
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);
		setUploadStatus(null); // Reset status

		if (selectedFile) {
			setPreviewUrl(URL.createObjectURL(selectedFile));
		} else {
			setPreviewUrl(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file) {
			setUploadStatus("Please select a file to upload.");
			return;
		}

		if (!file.type.startsWith("image/")) {
			setUploadStatus("Error: Only image files are supported.");
			return;
		}

		setUploadStatus("Encoding file...");
		uploadMutation.reset();
		
		try {
			// Convert the file to a Base64 string
			const base64Data = await fileToBase64(file);
			setUploadStatus("Uploading to server...");

			// Call the tRPC mutation
			await uploadMutation.mutateAsync({
				fileName: file.name,
				base64Data: base64Data,
				mimeType: file.type,
			});

		} catch (error) {
			setUploadStatus(`An unexpected error occurred during processing.`);
			console.error("Upload process error:", error);
		}
	};

	const isUploading = uploadMutation.status === "pending";

	return (
		<main className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#15162c] to-[#0a0c16] p-4 ${geist.variable} font-sans text-white`}>
			<div className="w-full max-w-xl rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
				<h1 className="text-4xl font-extrabold mb-8 text-center text-[hsl(280,100%,70%)]">
					Upload New Photo
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<div>
						<label htmlFor="photo-upload" className="block text-sm font-medium text-white/80 mb-2">
							Select Image File
						</label>
						<input
							id="photo-upload"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="block w-full text-sm text-white/90
							file:mr-4 file:py-2 file:px-4
							file:rounded-full file:border-0
							file:text-sm file:font-semibold
							file:bg-violet-50 file:text-violet-700
							hover:file:bg-violet-100 cursor-pointer"
						/>
					</div>

					{previewUrl && (
						<div className="mt-4 p-4 border border-white/20 rounded-xl flex flex-col items-center">
							<h3 className="text-lg font-semibold mb-3">Image Preview:</h3>
							<img 
								src={previewUrl} 
								alt="Preview" 
								className="max-w-full max-h-64 object-contain rounded-lg shadow-lg"
							/>
						</div>
					)}

					<button
						type="submit"
						disabled={!file || isUploading}
						className={`
							mt-4 py-3 px-6 rounded-xl font-bold text-lg transition duration-300
							${!file || isUploading
								? 'bg-gray-600 text-gray-400 cursor-not-allowed'
								: 'bg-[hsl(280,100%,70%)] text-white hover:bg-[hsl(280,100%,60%)] shadow-lg hover:shadow-xl'
							}
						`}
					>
						{isUploading ? (
							<span className="flex items-center justify-center">
								<svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Uploading...
							</span>
						) : (
							"Upload Photo"
						)}
					</button>
				</form>

				{uploadStatus && (
					<p className={`mt-4 p-3 rounded-lg text-center font-medium ${
						uploadStatus.startsWith("Success") ? 'bg-green-600/20 text-green-400' : 
						uploadStatus.startsWith("Error") ? 'bg-red-600/20 text-red-400' : 
						'bg-blue-600/20 text-blue-400'
					}`}>
						{uploadStatus}
					</p>
				)}
			</div>
		</main>
	);
}
