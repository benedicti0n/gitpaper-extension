import { useEffect, useState } from "react"
import type { IColorPallete } from "~colorPalletes"
import useGetTheme from "~hooks/useGetTheme"

export default function NewTab() {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
    const [bentoImage, setBentoImage] = useState<string | null>(null)
    const [currentPalette, setCurrentPalette] = useState<IColorPallete>()
    const [shortcuts, setShortcuts] = useState<
        { label: string; url: string; icon: string }[]
    >([
        { label: "YouTube", url: "https://youtube.com", icon: "🎥" },
        { label: "Facebook", url: "https://facebook.com", icon: "📘" },
        { label: "Instagram", url: "https://instagram.com", icon: "📸" },
        { label: "GitHub", url: "https://github.com", icon: "💻" },
        { label: "ChatGPT", url: "https://chat.openai.com", icon: "🧠" }
    ])

    const theme = useGetTheme()

    // Load from storage
    useEffect(() => {
        chrome.storage.local.get(["newtabWallpaper", "customShortcuts"], (res) => {
            const wallpaperData = res.newtabWallpaper
            if (wallpaperData?.backgroundImage) {
                setBackgroundImage(wallpaperData.backgroundImage)
            }
            if (wallpaperData?.bentoImage) {
                setBentoImage(wallpaperData.bentoImage)
            }

            if (res.customShortcuts) {
                setShortcuts(res.customShortcuts)
            }
        })

        // Set document title and favicon
        document.title = "New Tab"

        // Remove any existing favicon
        const existingFavicon = document.querySelector("link[rel*='icon']")
        if (existingFavicon) {
            existingFavicon.remove()
        }

        // Add new favicon
        const favicon = document.createElement('link')
        favicon.rel = 'icon'
        favicon.type = 'image/png'
        favicon.href = 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg'
        document.head.appendChild(favicon)

        document.body.style.margin = "0"
        document.body.style.padding = "0"
        document.documentElement.style.margin = "0"
        document.documentElement.style.padding = "0"

        setCurrentPalette(theme)
    }, [theme])

    // Add new shortcut
    const addShortcut = () => {
        const label = prompt("Enter shortcut label (e.g. 'LinkedIn'):")
        if (!label) return
        const url = prompt("Enter URL (e.g. https://linkedin.com):")
        if (!url || !url.startsWith("http")) return
        const icon = prompt("Enter icon emoji (e.g. 🔗):") || "🔗"

        const newShortcuts = [...shortcuts, { label, url, icon }]
        setShortcuts(newShortcuts)
        chrome.storage.local.set({ customShortcuts: newShortcuts })
    }

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
                <div style={{
                    width: "53%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                    <img
                        src={bentoImage}
                        alt="Bento Overlay"
                        style={{
                            width: "100%",
                            objectFit: "contain"
                        }}
                    />

                    {/* // Google Search */}
                    <form
                        action="https://www.google.com/search"
                        method="GET"
                        style={{ zIndex: 10, width: "100%", paddingLeft: "1.75rem", paddingRight: "1.75rem", boxSizing: "border-box" }}
                    >
                        <div style={{
                            width: "100%", padding: "5px", borderRadius: "20px", boxSizing: "border-box",
                            background: `linear-gradient(to bottom right, ${currentPalette.main4}, ${currentPalette.main2}, ${currentPalette.main4})`,
                            boxShadow: `0px 5px 10px -3px ${currentPalette.main3}`,
                            color: `${currentPalette.textColor}`
                        }}>
                            <input
                                type="text"
                                name="q"
                                placeholder="Search with Google or enter address"
                                style={{
                                    backgroundColor: `${currentPalette.bgColor}`,
                                    width: "calc(100%)",
                                    padding: "16px",
                                    borderRadius: "16px",
                                    border: "none",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </form>
                </div>
            )
            }



            {/* Shortcut Tabs
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
                <button
                    onClick={addShortcut}
                    style={{
                        cursor: "pointer",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        border: "2px dashed white",
                        color: "white",
                        borderRadius: "16px",
                        padding: "12px",
                        width: "80px",
                        fontSize: "18px"
                    }}
                >
                    ➕
                </button>
            </div> */}
        </div >
    )
}
