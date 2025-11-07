import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiSliceActions } from '../store/ui-slice'

const ThemeModal = () => {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state?.ui?.theme)

    const closeThemeModal = (e) => {
        if (e.target.classList.contains("theme")) {
            dispatch(uiSliceActions.closeThemeModal())
        }
    }

    const changeBackgroundColor = (color) => {
        const newTheme = { ...theme, backgroundColor: color }
        dispatch(uiSliceActions.changeTheme(newTheme))
        localStorage.setItem("theme", JSON.stringify(newTheme))
        applyTheme(newTheme)
    }

    const changePrimaryColor = (color) => {
        const newTheme = { ...theme, primaryColor: color }
        dispatch(uiSliceActions.changeTheme(newTheme))
        localStorage.setItem("theme", JSON.stringify(newTheme))
        applyTheme(newTheme)
    }

    // Apply theme to CSS variables
    const applyTheme = (themeData) => {
        const root = document.documentElement
        
        if (themeData?.primaryColor) {
            root.style.setProperty('--primary-color', themeData.primaryColor)
        }
        
        if (themeData?.backgroundColor === 'dark') {
            root.classList.add('dark-theme')
            document.body.classList.add('dark-theme')
        } else {
            root.classList.remove('dark-theme')
            document.body.classList.remove('dark-theme')
        }
    }

    // Apply theme on mount
    useEffect(() => {
        if (theme) {
            applyTheme(theme)
        }
    }, [theme])

    const primaryColors = [
        { name: 'Red', value: 'red' },
        { name: 'Blue', value: 'blue' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Green', value: 'green' },
        { name: 'Purple', value: 'purple' }
    ]

    const backgroundOptions = [
        { name: 'Light', value: '' },
        { name: 'Dark', value: 'dark' }
    ]

    return (
        <section className="theme" onClick={closeThemeModal}>
            <div className="theme__container" onClick={(e) => e.stopPropagation()}>
                <article className="theme__primary">
                    <h3>Primary Colors</h3>
                    <ul>
                        {primaryColors.map(color => (
                            <li 
                                key={color.value}
                                onClick={() => changePrimaryColor(color.value)}
                                className={`theme__color theme__color--${color.value} ${theme?.primaryColor === color.value ? 'active' : ''}`}
                                title={color.name}
                                aria-label={`Select ${color.name} theme`}
                            ></li>
                        ))}
                    </ul>
                </article>
                <article className="theme__background">
                    <h3>Background Colors</h3>
                    <ul>
                        {backgroundOptions.map(option => (
                            <li 
                                key={option.value || 'light'}
                                onClick={() => changeBackgroundColor(option.value)}
                                className={`theme__bg theme__bg--${option.value || 'light'} ${theme?.backgroundColor === option.value ? 'active' : ''}`}
                                title={option.name}
                                aria-label={`Select ${option.name} background`}
                            ></li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    )
}

export default ThemeModal