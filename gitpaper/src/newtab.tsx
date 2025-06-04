import React, { useEffect, useState, useCallback } from "react"
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { IColorPallete } from "~colorPalletes"
import useGetTheme from "~hooks/useGetTheme"
import googleVoice from "data-base64:~images/google-voice.png"
import googleLens from "data-base64:~images/google-lens-logo.webp"
import { SearchBar } from "~components/SearchBar"
import Shortcut from "~components/Shortcut";
import type { ShortcutItem } from "~components/Shortcut";
import AddShortcutModal from "~components/AddShortcutModal";

type ShortcutSide = 'left' | 'right';

export default function NewTab() {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
    const [bentoImage, setBentoImage] = useState<string | null>(null)
    const [currentPalette, setCurrentPalette] = useState<IColorPallete>()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leftShortcuts, setLeftShortcuts] = useState<ShortcutItem[]>([]);
    const [rightShortcuts, setRightShortcuts] = useState<ShortcutItem[]>([]);
    const [modalSide, setModalSide] = useState<ShortcutSide>('left');

    const theme = useGetTheme()
    const handleVoiceSearch = useCallback(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                const form = document.querySelector('form[action="https://www.google.com/search"]') as HTMLFormElement;
                const input = form?.querySelector('input[name="q"]') as HTMLInputElement;
                if (input) {
                    input.value = transcript;
                    form?.dispatchEvent(new Event('submit', { cancelable: true }));
                }
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    }, []);

    const handleImageSearch = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e: any) => {
            if (e.target.files && e.target.files[0]) {
                // Using Google Lens for image search
                window.open('https://lens.google.com/upload', '_blank');
            }
        };

        input.click();
    }, []);

    // Load shortcuts from storage
    useEffect(() => {
        chrome.storage.local.get(["leftShortcuts", "rightShortcuts"], (res) => {
            if (res.leftShortcuts) setLeftShortcuts(res.leftShortcuts);
            if (res.rightShortcuts) setRightShortcuts(res.rightShortcuts);
        });
    }, []);

    // Save shortcuts to storage when they change
    useEffect(() => {
        chrome.storage.local.set({ leftShortcuts });
    }, [leftShortcuts]);

    useEffect(() => {
        chrome.storage.local.set({ rightShortcuts });
    }, [rightShortcuts]);

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

    return (
        <DndProvider backend={HTML5Backend}>
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
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Shortcut
                        side="left"
                        shortcuts={leftShortcuts}
                        setShortcuts={setLeftShortcuts}
                        onAddClick={() => {
                            setModalSide('left');
                            setIsModalOpen(true);
                        }}
                    />

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

                            {/* Google Search */}
                            <SearchBar
                                currentPalette={{
                                    main2: currentPalette.main2,
                                    main3: currentPalette.main3,
                                    main4: currentPalette.main4,
                                    bgColor: currentPalette.bgColor,
                                    textColor: currentPalette.textColor
                                }}
                                googleVoice={googleVoice}
                                googleLens={googleLens}
                                onVoiceSearch={handleVoiceSearch}
                                onImageSearch={handleImageSearch}
                            />
                        </div>
                    )
                    }

                    <Shortcut
                        side="right"
                        shortcuts={rightShortcuts}
                        setShortcuts={setRightShortcuts}
                        onAddClick={() => {
                            setModalSide('right');
                            setIsModalOpen(true);
                        }}
                    />
                </div>

                <AddShortcutModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={(newShortcut) => {
                        const setter = modalSide === 'left' ? setLeftShortcuts : setRightShortcuts;
                        const shortcutWithId = {
                            ...newShortcut,
                            id: `shortcut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                        };
                        setter(prev => [...prev, shortcutWithId]);
                    }}
                />
            </div>
        </DndProvider>
    );
}
