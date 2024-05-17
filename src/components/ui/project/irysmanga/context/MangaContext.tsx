import React, {
	createContext, useState, useContext, useMemo,
} from 'react';
import {
	FitMode,
	Language,
	Manga,
	PageLayout,
	ReaderTheme,
	generateDummyManga,
} from '../utils/types';

// Define the type for the context value
interface MangaContextProps {
	language: Language;
	setLanguage: React.Dispatch<React.SetStateAction<Language>>;

	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	chapter: number;
	setChapter: React.Dispatch<React.SetStateAction<number>>;

	pageLayout: PageLayout;
	setPageLayout: React.Dispatch<React.SetStateAction<PageLayout>>;

	fitMode: FitMode;
	setFitMode: React.Dispatch<React.SetStateAction<FitMode>>;

	leftToRight: boolean;
	setLeftToRight: React.Dispatch<React.SetStateAction<boolean>>;

	headerHidden: boolean;
	setHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;

	readerTheme: ReaderTheme;
	setReaderTheme: React.Dispatch<React.SetStateAction<ReaderTheme>>;
	manga: Manga;
	setManga: React.Dispatch<React.SetStateAction<Manga>>;
}

// Creating a context object
const MangaContext = createContext<MangaContextProps | undefined>(undefined);

/* eslint-disable */
// Creating a provider component
export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>("en");
    const [pageLayout, setPageLayout] = useState<PageLayout>("single");
    const [fitMode, setFitMode] = useState<FitMode>("original");

    const [manga, setManga] = useState(generateDummyManga());
    const [page, setPage] = useState(0);
    const [chapter, setChapter] = useState(0);
    const [leftToRight, setLeftToRight] = useState(true);
    const [headerHidden, setHeaderHidden] = useState(true);

    const [readerTheme, setReaderTheme] = useState<ReaderTheme>("dark");

    const contextValue = useMemo(
        () => ({
            language,
            setLanguage,
            page,
            setPage,
            chapter,
            setChapter,
            pageLayout,
            setPageLayout,
            fitMode,
            setFitMode,
            leftToRight,
            setLeftToRight,
            headerHidden,
            setHeaderHidden,
            readerTheme,
            setReaderTheme,
            manga,
            setManga,
        }),
        [
            language,
            page,
            chapter,
            pageLayout,
            fitMode,
            leftToRight,
            headerHidden,
            readerTheme,
            manga,
        ]
    );

    return (
        <MangaContext.Provider value={contextValue}>
            {children}
        </MangaContext.Provider>
    );
};
// eslint-enable

// Custom hook to use the context
export const useMangaContext = (): MangaContextProps => {
    const context = useContext(MangaContext);
    if (!context) {
        throw new Error("useMangaContext must be used within an MangaProvider");
    }
    return context;
};
