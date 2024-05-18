import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useMangaContext } from './context/MangaContext';
import { handlePageNavigation } from './utils/helper';
import ProgressBar from './ProgressBar';
import { getMangaDataOrThrow } from './utils/types';

function Reader() {
	const {
		pageLayout,
		fitMode,
		page,
		setPage,
		setChapter,
		chapter,
		manga,
		leftToRight,
		language,
	} = useMangaContext();

	const containerRef = useRef<HTMLDivElement>(null);
	const pageRefs = useRef<HTMLImageElement[]>([]);
	const pageScrolled = useRef(false);
	const scriptedScroll = useRef(false);

	const imgClasses = classNames('page-img m-auto object-cover', {
		'h-full': fitMode === 'height',
		'w-full': fitMode === 'width',
	});
	const containerClasses = classNames(
		'grow h-full hover:cursor-pointer overflow-y-auto flex flex-col gap-[10px] relative',
	);

	// Sets the scrollbar to the correct position on page change
	const handleScrollTop = () => {
		if (pageLayout === 'single' && containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
		if (pageLayout !== 'single' && !pageScrolled.current) {
			if (containerRef.current) {
				scriptedScroll.current = true;
				const targetImg = pageRefs.current[page];
				if (targetImg) {
					containerRef.current.scrollTop = targetImg.offsetTop - containerRef.current.offsetTop;
				}
			}
		}
		pageScrolled.current = false;
	};

	// Update the page counter when the user scrolls
	const handleScroll = () => {
		if (!containerRef.current || scriptedScroll.current) {
			scriptedScroll.current = false;
			return;
		}
		const containerRect = containerRef.current.getBoundingClientRect();
		const imgRect = pageRefs.current[page].getBoundingClientRect();
		const offset = 100;
		if (imgRect.bottom - offset <= containerRect.top) {
			pageScrolled.current = true;
			setPage(page + 1);
		} else if (imgRect.top + offset >= containerRect.bottom) {
			pageScrolled.current = true;
			setPage(page - 1);
		}
	};

	// Handle page turn on click
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, target } = event;
		const { left, width } = (target as HTMLElement).getBoundingClientRect();

		const position = clientX - left;
		const threshold = width / 2;
		scriptedScroll.current = true;
		if (position < threshold) {
			if (leftToRight) {
				handlePageNavigation(
					page - 1,
					pageLayout,
					setPage,
					setChapter,
					chapter,
					language,
					manga,
				);
			} else {
				handlePageNavigation(
					page + 1,
					pageLayout,
					setPage,
					setChapter,
					chapter,
					language,
					manga,
				);
			}
		} else if (leftToRight) {
			handlePageNavigation(
				page + 1,
				pageLayout,
				setPage,
				setChapter,
				chapter,
				language,
				manga,
			);
		} else {
			handlePageNavigation(
				page - 1,
				pageLayout,
				setPage,
				setChapter,
				chapter,
				language,
				manga,
			);
		}
	};

	useEffect(() => {
		handleScrollTop();
	}, [page, chapter, pageLayout, handleScrollTop]);

	let displayedPages: React.JSX.Element[] = [];
	const mangaData = getMangaDataOrThrow(manga, language);
	if (mangaData.chapters[chapter]) {
		const currentChapter = mangaData.chapters[chapter];
		const maxPageCount = currentChapter.pageCount;
		const currentPages = currentChapter.pages;

		/* eslint-disable */
        if (pageLayout === "single") {
            displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
                <img
                    key={i}
                    ref={(el) => (pageRefs.current[i] = el as HTMLImageElement)}
                    src={currentPages[i]}
                    className={imgClasses.concat(
                        i === page ? " block" : " hidden"
                    )}
                    alt={`Page ${i + 1}`}
                />
            ));
        } else {
            displayedPages = Array.from({ length: maxPageCount }, (_, i) => (
                <img
                    key={i}
                    ref={(el) => (pageRefs.current[i] = el as HTMLImageElement)}
                    src={currentPages[i]}
                    className={imgClasses.concat(" block")}
                    alt={`Page ${i + 1}`}
                />
            ));
        }

        // eslint-enable
    }

    /* eslint-disable */
    return (
        <div
            className={containerClasses}
            onClick={handleClick}
            onScroll={handleScroll}
            id="manga-reader-container"
            ref={containerRef}
        >
            {displayedPages}
            <div className="sticky bottom-0 left-0 w-full">
                <ProgressBar></ProgressBar>
            </div>
        </div>
    );
    // eslint-enable
}

export default Reader;
