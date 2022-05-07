const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
	reactStrictMode: true,
	images: {
		domains: ["cdn.discordapp.com", "lh3.googleusercontent.com"],
	},
});
