import React, { useEffect, useState } from 'react'
import { coolBluePalette, warmSunsetPalette, forestGreenPalette, vividPurplePalette, earthTonesPalette } from '~colorPalletes'
import type { IColorPallete } from '~colorPalletes'

const useGetTheme = () => {
    const [theme, setTheme] = useState<IColorPallete>(coolBluePalette)

    const updateTheme = (themeName: string) => {
        switch (themeName) {
            case 'Cool Blue':
                setTheme(coolBluePalette)
                break
            case 'Warm Sunset':
                setTheme(warmSunsetPalette)
                break
            case 'Forest Green':
                setTheme(forestGreenPalette)
                break
            case 'Ellie\'s Purple':
                setTheme(vividPurplePalette)
                break
            case 'Earth Tone':
                setTheme(earthTonesPalette)
                break
            default:
                setTheme(coolBluePalette)
                break
        }
    }

    useEffect(() => {
        // Initial theme load
        chrome.storage.local.get('newtabWallpaper', (res) => {
            if (res.newtabWallpaper?.theme) {
                updateTheme(res.newtabWallpaper.theme)
            }
        })

        // Listen for theme changes
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.newtabWallpaper?.newValue?.theme) {
                updateTheme(changes.newtabWallpaper.newValue.theme)
            }
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        // Cleanup listener
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }, [])

    return theme
}

export default useGetTheme