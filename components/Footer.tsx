import { HeartIcon } from '@heroicons/react/solid';

export default function Footer() {
	return (
		<div className="flex w-full h-24 px-4 sm:px-8 justify-center items-center mt-16 bg-skin-background-2 dark:bg-skin-dark-background-2">
			<p className="text-center flex items-center text-white text-opacity-70">
				Made with&nbsp;
				<HeartIcon className="w-4 h-4 text-white" />
&nbsp;by&nbsp;
				<a href="https://github.com/GoldElysium/hefs-website#contributors-" target="_blank" className="underline" rel="noreferrer">fans</a>
			</p>
			<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "5896757c09e04949bf74e7c34efd419a"}' />
		</div>
	);
}
