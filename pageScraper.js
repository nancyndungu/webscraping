const scraperObject = {
    url: 'https://www.viator.com/Iceland/d55-ttd',
    async scraper(browser){
        let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		// Navigate to the selected page
		await page.goto(this.url);
		
		//Wait for the required DOM to be rendered
		await page.waitForSelector('.product-list-with-count-wrapper');
		// Get the link to all the required 
		let urls = await page.$$eval('.product-card-inner-row', links => {
			// Extract the links from the data
			links = links.map(el => el.querySelector('h2>a').href)
			return links;
		});

		// Loop through each of those links, open a new page instance and get the relevant data from them
		let pagePromise = (link) => new Promise(async(resolve, reject) => {
			let dataObj = {};
			let newPage = await browser.newPage();
			await newPage.goto(link);
			dataObj['tourTitle'] = await newPage.$eval('h1.title__1Wwg', text => text.textContent);
			dataObj['tourPrice'] = await newPage.$eval('h2.title__1Wwg', text => text.textContent);
			dataObj['priceGuarantee'] = await newPage.$eval('button.lowestPriceLink__1ime', text => text.textContent);
			// dataObj['imageUrl'] = await newPage.$eval('imageWrapper__2qMg>img', img => img.src);
			// dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
			resolve(dataObj);
			await newPage.close();
		});

		let scrapedData = []
		for(link in urls.slice(0, 10)){
			let currentPageData = await pagePromise(urls[link]);
			scrapedData.push(currentPageData);
		}
		return scrapedData
    }
}

module.exports = scraperObject;