'use client';

import {
	Graphics, Sprite, useApp,
} from '@pixi/react';
import { Project } from 'types/payload-types';
import { useCallback, useState } from 'react';
import * as PIXI from 'pixi.js';
import type { StageSize } from './PixiWrapper';
import Viewport from './pixi/Viewport';
import Sidebar from './pixi/Sidebar';
import Button from './pixi/Button';
import Modal from './pixi/Modal';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	stageSize: StageSize;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PixiPuzzle({ project, stageSize }: IProps) {
	const app = useApp();

	const [showModal, setShowModal] = useState(false);

	const sidebarWidth = 400;
	const viewportWidth = stageSize.width - sidebarWidth;

	const drawColorForViewport = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0x5599ff);
		g.drawRect(sidebarWidth, 0, viewportWidth, stageSize.height);
		g.endFill();
	}, [sidebarWidth, stageSize, viewportWidth]);
	const drawPuzzleContainer = useCallback((g: PIXI.Graphics) => {
		g.lineStyle(2, 0xffffff);

		const width = viewportWidth / 2;

		g.drawRect(
			sidebarWidth + (width / 2),
			stageSize.height / 2 - (width / 2) / 2,
			width,
			(viewportWidth / 2) / 2,
		);
	}, [sidebarWidth, stageSize, viewportWidth]);
	const drawColorForSidebar = useCallback((g: PIXI.Graphics) => {
		g.beginFill(0xff5599);
		g.drawRect(0, 0, sidebarWidth, stageSize.height);
		g.endFill();
	}, [stageSize]);

	return (
		<>
			{/* @ts-ignore */}
			<Viewport width={viewportWidth} height={stageSize.height} app={app}>
				<Graphics
					width={viewportWidth}
					height={stageSize.height}
					draw={(g) => {
						g.clear();
						drawColorForViewport(g);
						drawPuzzleContainer(g);
					}}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={sidebarWidth + viewportWidth / 2}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Viewport>
			{/* @ts-ignore */}
			<Sidebar width={sidebarWidth} height={stageSize.height} app={app}>
				<Graphics
					width={sidebarWidth}
					height={stageSize.height}
					draw={drawColorForSidebar}
				/>
				<Button
					x={0}
					y={0}
					width={200}
					height={100}
					label="Preview"
					onClick={() => { setShowModal(true); }}
				/>
				<Sprite
					image="https://pixijs.io/pixi-react/img/bunny.png"
					x={200}
					y={270}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Sidebar>

			{showModal && (
				<Modal
					x={0}
					y={0}
					width={stageSize.width}
					height={stageSize.height}
					label="Dismiss"
					onClick={() => { setShowModal(false); }}
				/>
			)}
		</>
	);
}
