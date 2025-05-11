import { useEffect, useState } from "react"

export default function NewTab() {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
    const [bentoImage, setBentoImage] = useState<string | null>(null)

    useEffect(() => {
        chrome.storage.local.get("newtabWallpaper", (res) => {
            const wallpaperData = res.newtabWallpaper
            if (wallpaperData?.backgroundImage) {
                setBackgroundImage(wallpaperData.backgroundImage)
            }
            if (wallpaperData?.bentoImage) {
                setBentoImage(wallpaperData.bentoImage)
            }
        })

        document.body.style.margin = "0"
        document.body.style.padding = "0"
        document.documentElement.style.margin = "0"
        document.documentElement.style.padding = "0"
    }, [])

    const shortcuts = [
        { label: "YouTube", url: "https://youtube.com", icon: "🎥" },
        { label: "Facebook", url: "https://facebook.com", icon: "📘" },
        { label: "Instagram", url: "https://instagram.com", icon: "📸" },
        { label: "GitHub", url: "https://github.com", icon: "💻" },
        { label: "ChatGPT", url: "https://chat.openai.com", icon: "🧠" }
    ]

    return (
        <div
            style={{
                padding: "0",
                margin: "0",
                overflow: "hidden",
                height: "100vh",
                width: "100vw",
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {bentoImage && (
                <img
                    src={bentoImage}
                    alt="Bento Overlay"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                        objectFit: "contain"
                    }}
                />
            )}

            {/* Google Search */}
            <form
                action="https://www.google.com/search"
                method="GET"
                style={{ zIndex: 10, marginBottom: "30px", width: "80%", maxWidth: "600px" }}
            >
                <input
                    type="text"
                    name="q"
                    placeholder="Search with Google or enter address"
                    style={{
                        width: "100%",
                        padding: "15px",
                        borderRadius: "30px",
                        border: "none",
                        fontSize: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                    }}
                />
            </form>

            {/* Shortcut Tabs */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", zIndex: 10 }}>
                {shortcuts.map((item) => (
                    <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            textAlign: "center",
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderRadius: "16px",
                            padding: "12px",
                            width: "80px",
                            fontSize: "14px"
                        }}
                    >
                        <div style={{ fontSize: "24px" }}>{item.icon}</div>
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    )
}
