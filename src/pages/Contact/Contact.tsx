import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import {
	fetchFormBySlug,
	submitForm,
	PayloadForm,
	FormField,
} from "../../payloadClient";
import { Skeleton } from "@/components/ui/skeleton"; 
import { RichText } from "@payloadcms/richtext-lexical/react"; 

const renderField = (
	field: FormField,
	formData: Record<string, any>,
	handleInputChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => void
) => {
	const fieldName = field.name;
	const label = field.label || fieldName;
	const isRequired = field.required ?? false;
	const value = formData[fieldName] || field.defaultValue || "";

	switch (field.blockType) {
		case "text":
		case "email":
		case "number":
			return (
				<div key={fieldName}>
					<Label htmlFor={fieldName} className="text-sm">
						{label} {isRequired && <span className="text-red-500">*</span>}
					</Label>
					<Input
						id={fieldName}
						name={fieldName}
						type={
							field.blockType === "email"
								? "email"
								: field.blockType === "number"
								? "number"
								: "text"
						}
						placeholder={label} 
						required={isRequired}
						value={value}
						onChange={handleInputChange}
						className="mt-1 bg-dark-btn-bg border-dark-card-border"
					/>
				</div>
			);
		case "textarea":
			return (
				<div key={fieldName}>
					<Label htmlFor={fieldName} className="text-sm">
						{label} {isRequired && <span className="text-red-500">*</span>}
					</Label>
					<Textarea
						id={fieldName}
						name={fieldName}
						placeholder={label}
						required={isRequired}
						value={value}
						onChange={handleInputChange}
						className="bg-dark-btn-bg border-dark-card-border mt-1 h-full min-h-[100px]"
					/>
				</div>
			);
		case "message": 
			return field.message ? (
				<div
					key={fieldName}
					className="text-sm prose prose-invert max-w-none text-dark-text-secondary"
				>
					<RichText data={field.message} />
				</div>
			) : null;
		default:
			console.warn("Unsupported field type in form:", field.blockType);
			return (
				<div key={fieldName} className="text-xs text-red-400">
					Unsupported field: {label}
				</div>
			);
	}
};

export default function ContactForm() {
	const [formConfig, setFormConfig] = useState<PayloadForm | null>(null);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState({
		submitting: false,
		submitted: false,
		error: false,
		message: null as string | React.ReactNode | null, 
	});

	const formTitle = "Kontaktieren Sie Uns";

	useEffect(() => {
		const loadForm = async () => {
			setLoading(true);
			setStatus({
				submitting: false,
				submitted: false,
				error: false,
				message: null,
			});
			try {
				const fetchedForm = await fetchFormBySlug(formTitle);
				if (fetchedForm) {
					setFormConfig(fetchedForm);
					const initialData: Record<string, any> = {};
					fetchedForm.fields.forEach((field) => {
						if (field.defaultValue) {
							initialData[field.name] = field.defaultValue;
						}
					});
					setFormData(initialData);
				} else {
					throw new Error(`Form with slug "${formTitle}" not found.`);
				}
			} catch (err) {
				console.error(err);
				setStatus((prev) => ({
					...prev,
					error: true,
					message: `Failed to load form: ${(err as Error).message}`,
				}));
			} finally {
				setLoading(false);
			}
		};
		loadForm();
	}, [formTitle]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		const isCheckbox = type === "checkbox";
		const inputValue = isCheckbox
			? (e.target as HTMLInputElement).checked
			: value;

		setFormData((prev) => ({
			...prev,
			[name]: inputValue,
		}));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!formConfig) return;

		setStatus({
			submitting: true,
			submitted: false,
			error: false,
			message: "Submitting...",
		});

		try {
			await submitForm(formConfig.id, formData);

			setStatus((prev) => ({
				...prev,
				submitting: false,
				submitted: true,
				message: null,
			}));

			if (
				formConfig.confirmationType === "message" &&
				formConfig.confirmationMessage
			) {
				setStatus((prev) => ({
					...prev,
					message: <RichText data={formConfig.confirmationMessage} />,
				}));
			} else if (
				formConfig.confirmationType === "redirect" &&
				formConfig.redirect?.url
			) {
				window.location.href = formConfig.redirect.url;
			} else {
				setStatus((prev) => ({
					...prev,
					message: "Thank you for your message! We will be in touch soon.",
				}));
			}

			setFormData({});
			const formElement = event.target as HTMLFormElement;
			formElement.reset();
		} catch (error) {
			console.error("Submission error:", error);
			setStatus({
				submitting: false,
				submitted: false,
				error: true,
				message: `Submission failed: ${
					(error as Error).message || "Please try again."
				}`,
			});
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center min-h-screen py-16 bg-dark-bg text-dark-text sm:py-16">
				<div className="w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-dark-card-bg rounded-xl shadow-lg border border-dark-card-border p-4 sm:p-6">
					<Skeleton className="w-3/4 h-8 mx-auto mb-6" />
					<Skeleton className="w-1/4 h-6 mb-2" />
					<Skeleton className="w-full h-10 mb-4" />
					<Skeleton className="w-1/4 h-6 mb-2" />
					<Skeleton className="w-full h-10 mb-4" />
					<Skeleton className="w-1/4 h-6 mb-2" />
					<Skeleton className="w-full h-24 mb-6" />
					<Skeleton className="w-full h-10" />
				</div>
				<div className="mt-8 py-4 border-t border-dark-card-border w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
				</div>
			</div>
		);
	}

	if (!formConfig && status.error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-16 bg-dark-bg text-dark-text sm:py-16">
				<p className="p-4 text-red-500 border border-red-700 rounded-md bg-dark-card-bg">
					{status.message ||
						"Could not load the contact form. Please try again later."}
				</p>
				<div className="mt-8 py-4 border-t border-dark-card-border w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
				</div>
			</div>
		);
	}

	// Main Form Render
	return (
		<div className="flex flex-col min-h-screen py-16 bg-dark-bg text-dark-text sm:py-16">
			<div className="mx-auto w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] flex flex-col">
				<h2 className="mb-4 text-3xl font-bold text-center sm:text-3xl sm:mb-6">
					{formConfig?.title || "Kontaktieren Sie Uns"}
				</h2>
				{status.message && !status.submitting && (
					<div
						className={`mb-4 p-4 rounded text-center text-sm ${
							status.error
								? "bg-red-900/20 border border-red-700/50 text-red-300"
								: "bg-green-900/20 border border-green-700/50 text-green-300"
						}`}
					>
						{typeof status.message === "string" ? (
							<p>{status.message}</p>
						) : (
							<div className="text-sm prose prose-invert max-w-none">
								{status.message}
							</div>
						)}
					</div>
				)}
				{(!status.submitted || status.error) && formConfig && (
					<div className="flex flex-col flex-grow w-full p-4 border shadow-lg bg-dark-card-bg rounded-xl border-dark-card-border sm:p-6">
						<form onSubmit={handleSubmit} className="flex-grow space-y-4">
							<div className="flex flex-wrap -mx-2">
								{formConfig.fields.map((field) => {
									if (
										(field.name === "email" || field.name === "phone") &&
										field.width === 50
									) {
										return (
											<div
												key={field.name}
												className="w-full px-2 mb-4 md:w-1/2"
											>
												{renderField(field, formData, handleInputChange)}
											</div>
										);
									}
									const widthClass =
										field.width === 100 || !field.width
											? "w-full"
											: `w-${field.width}/100`;
									return (
										<div key={field.name} className={`${widthClass} px-2 mb-4`}>
											{renderField(field, formData, handleInputChange)}
										</div>
									);
								})}
							</div>

							<Button
								type="submit"
								disabled={status.submitting}
								className="w-full bg-dark-btn-bg hover:bg-[hsl(0_0%_15%)] py-2 mt-4"
							>
								{status.submitting
									? "Sending..."
									: formConfig.submitButtonLabel || "Abschicken"}
							</Button>
						</form>
						<div className="py-4 mt-8 border-t border-dark-card-border">
							<div className="flex justify-center space-x-4">
								<a
									href="https://www.instagram.com/decker.veranstaltungstechnik/"
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors duration-200 text-dark-text-tertiary hover:text-dark-text"
								>
									<FaInstagram style={{ color: "white" }} className="w-6 h-6" />
									<span className="sr-only">Instagram</span>
								</a>
								<a
									href="https://wa.me/+4917695449722"
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors duration-200 text-dark-text-tertiary hover:text-dark-text"
								>
									<FaWhatsapp style={{ color: "white" }} className="w-6 h-6" />
									<span className="sr-only">WhatsApp</span>
								</a>
								<a
									href="mailto:info@decker-eventtechnik.com"
									className="transition-colors duration-200 text-dark-text-tertiary hover:text-dark-text"
								>
									<MdEmail style={{ color: "white" }} className="w-6 h-6" />
									<span className="sr-only">Email</span>
								</a>
								<a
									href="tel:+4917695449722"
									className="transition-colors duration-200 text-dark-text-tertiary hover:text-dark-text"
								>
									<MdPhone style={{ color: "white" }} className="w-6 h-6" />
									<span className="sr-only">Phone</span>
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
