import { useState } from "react";
import Button from "@/components/ui/Button";
import { type TextData } from "@/utils/text";
import ExtendsClassExport from "@/components/export/ExtendsClassExport"
import { TypingLogger } from "@/utils/TypingLogger";

interface ShareModalProps {
	textData: TextData;
	logger: TypingLogger;
	onClose: () => void;
};

enum ModalState {
	Opened,
	Closed,
};

const EXPORT_METHODS = {
	ExtendsClass: "ExtendsClass API",
	Base64: "Base64",
};

function ShareModal({textData, logger, onClose}: ShareModalProps) {
	const [modalState, setModalState] = useState(ModalState.Opened);
	const [exportMethod, setExportMethod] = useState("");
	const [exportComponent, setExportComponent] = useState<React.ReactNode | null>(null);

	const handleAnimationEnd = () => {
		if (modalState === ModalState.Closed) {
			onClose();
		}
	};

	const onExportMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newValue = event.target.value;
		setExportMethod(newValue);
		let ExportComponent = null;
		if (newValue === EXPORT_METHODS.ExtendsClass) {
			ExportComponent = ExtendsClassExport;
		}

		if (ExportComponent) {
			setExportComponent(<ExportComponent textData={textData} logger={logger}/>);
		} else {
			setExportComponent(null);
		}
	};

	const currentAnimation = modalState === ModalState.Opened ? "animate-fade-in" : "animate-fade-out";

	return (
		<div className={"fixed inset-0 flex items-center justify-center w-full h-full z-100 " + currentAnimation}
			onAnimationEnd={handleAnimationEnd}>
			<div className="flex flex-col gap-6 bg-gray-800 border border-gray-600 p-6 shadow-xl w-7/10 h-8/10 text-center">
				<h1 className="flex-2 text-3xl font-bold">SHARE</h1>
				<div className="flex-20 bg-gray-700/70 p-4">
					<div className="flex justify-center gap-6 items-center">
						<label className="text-white text-center">Export method</label>
						<select
							value={exportMethod}
							className="bg-gray-600 text-white border border-gray-400 focus:border-white p-1.5 outline-none w-5/10"
							onChange={onExportMethodChange}
						>
							<option value="">Select method</option>
							{Object.values(EXPORT_METHODS).map(
								(method) => <option value={method} key={method}>{method}</option>
							)}
						</select>
					</div>
					{exportComponent && <hr className="m-6"/>}
					<div className="px-6">
						{exportComponent}
					</div>
				</div>
				<div className="flex-3 flex flex-row items-center justify-around text-2xl">
					<Button onClick={() => setModalState(ModalState.Closed)}>Close</Button>
				</div>
			</div>
		</div>
	);
}

export default ShareModal;