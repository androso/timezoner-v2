

export default function LoadingSpinner({}) {
	return (
        <div className="h-screen flex items-center justify-center">
            <div className="lds-ellipsis flex relative w-20 h-20 ml-2">
                <div className="loading-dot bg-lightBlue animate-[lds-ellipsis1_600ms_infinite]"></div>
                <div className="loading-dot bg-lightBlue animate-[lds-ellipsis2_600ms_infinite]"></div>
                <div className="loading-dot bg-lightBlue animate-[lds-ellipsis2_600ms_infinite] left-6"></div>
                <div className="loading-dot bg-lightBlue animate-[lds-ellipsis3_600ms_infinite] left-12"></div>
            </div>
        </div>
	);
}