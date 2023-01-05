const pageScraper = require('./pageScraper');

async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
		const scrapedData = await pageScraper.scraper(browser)
		return scrapedData
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

const scraperController = async (browserInstance) => {
	const scrapedData = await scrapeAll(browserInstance)
	return scrapedData
}

module.exports = {
	scraperController
}
