import { useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    currentPalette: {
        main2: string;
        main3: string;
        main4: string;
        bgColor: string;
        textColor: string;
    };
    googleVoice: string;
    googleLens: string;
    onVoiceSearch: () => void;
    onImageSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    currentPalette,
    googleVoice,
    googleLens,
    onVoiceSearch,
    onImageSearch,
}) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <form
            action="https://www.google.com/search"
            method="GET"
            style={{
                zIndex: 10,
                width: "100%",
                paddingLeft: "1.75rem",
                paddingRight: "1.75rem",
                boxSizing: "border-box"
            }}
        >
            <div style={{
                width: "100%",
                padding: "5px",
                borderRadius: "20px",
                boxSizing: "border-box",
                background: `linear-gradient(to bottom right, ${currentPalette.main4}, ${currentPalette.main2}, ${currentPalette.main4})`,
                boxShadow: `0px 5px 10px -3px ${currentPalette.main3}`,
                color: currentPalette.textColor,
                position: "relative"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative"
                }}>
                    <div style={{
                        position: "absolute",
                        left: "16px",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <div style={{ color: currentPalette.main4 }}>
                            <Search size={20} />
                        </div>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        name="q"
                        placeholder="Search with Google or enter address"
                        style={{
                            backgroundColor: currentPalette.bgColor,
                            width: "100%",
                            padding: "16px 48px 16px 48px",
                            borderRadius: "16px",
                            border: "none",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            outline: "none",
                            position: "relative"
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        right: "16px",
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                        marginTop: "2px"
                    }}>
                        <div
                            className="cursor-pointer"
                            onClick={onVoiceSearch}
                            title="Search by voice"
                        >
                            <img src={googleVoice} alt="google-voice" style={{ height: "20px", width: "20px" }} />
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={onImageSearch}
                            title="Search by image"
                        >
                            <img src={googleLens} alt="google-image" style={{ height: "20px", width: "20px" }} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
